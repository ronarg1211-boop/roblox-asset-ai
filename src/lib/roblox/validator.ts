// ============================================================
// Roblox Asset AI - Export File Validator
// Validates .rbxmx (XML) and .rbxm (Binary) files before download
// ============================================================

import { XMLParser } from 'fast-xml-parser';

export interface FileValidationReport {
  valid: boolean;
  format: 'rbxmx' | 'rbxm' | 'unknown';
  fileSize: number;
  totalInstances: number;
  referentsCount: number;
  errors: string[];
  warnings: string[];
  classesFound: string[];
}

const ALLOWED_ROBLOX_CLASSES = new Set([
  'Model',
  'Folder',
  'Part',
  'WedgePart',
  'MeshPart',
  'TrussPart',
  'SpawnLocation',
  'Attachment',
  'WeldConstraint',
  'Weld',
  'Motor6D',
  'Humanoid',
  'Seat',
  'VehicleSeat',
  'SpecialMesh',
  'KeyframeSequence',
  'Keyframe',
  'Pose',
]);

export function validateRbxmxXml(xmlContent: string): FileValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const classesFound = new Set<string>();
  const referents = new Set<string>();
  let totalInstances = 0;

  // 1. Basic XML Structure & Header
  if (!xmlContent || typeof xmlContent !== 'string') {
    return {
      valid: false,
      format: 'rbxmx',
      fileSize: 0,
      totalInstances: 0,
      referentsCount: 0,
      errors: ['File content is empty or not a string'],
      warnings: [],
      classesFound: [],
    };
  }

  if (!xmlContent.includes('<roblox') || !xmlContent.includes('</roblox>')) {
    errors.push('Missing <roblox> root element or incomplete XML document');
  }

  // 2. Check for NaN or Infinity tokens in raw XML
  const nanMatch = xmlContent.match(/(NaN|-?Infinity)/g);
  if (nanMatch) {
    errors.push(`File contains forbidden NaN or Infinity numeric values: count=${nanMatch.length}`);
  }

  // 3. Parse XML using fast-xml-parser
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      allowBooleanAttributes: true,
      parseTagValue: false,
    });
    const parsed = parser.parse(xmlContent);

    if (!parsed.roblox) {
      errors.push('Root <roblox> tag missing or malformed');
    } else {
      // Traverse all Items
      const inspectItem = (item: any, depth = 0) => {
        if (!item || typeof item !== 'object') return;
        totalInstances++;

        const className = item['@_class'];
        const referent = item['@_referent'];

        if (!className) {
          errors.push(`Instance at depth ${depth} is missing class attribute`);
        } else {
          classesFound.add(className);
          if (!ALLOWED_ROBLOX_CLASSES.has(className)) {
            warnings.push(`Unrecognized or non-standard Roblox class: "${className}"`);
          }
        }

        if (!referent) {
          errors.push(`Instance "${className || 'unknown'}" is missing referent attribute`);
        } else {
          if (referents.has(referent)) {
            errors.push(`Duplicate referent detected: "${referent}" in class "${className}"`);
          }
          referents.add(referent);
        }

        // Validate Properties if present
        if (item.Properties) {
          const props = item.Properties;
          // Check CoordinateFrame(s)
          if (props.CoordinateFrame) {
            const cfList = Array.isArray(props.CoordinateFrame) ? props.CoordinateFrame : [props.CoordinateFrame];
            for (const cf of cfList) {
              const x = parseFloat(cf.X);
              const y = parseFloat(cf.Y);
              const z = parseFloat(cf.Z);
              if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
                errors.push(`Invalid CFrame position in referent ${referent}: [${cf.X}, ${cf.Y}, ${cf.Z}]`);
              }
            }
          }

          // Check Vector3 size
          if (props.Vector3 && props.Vector3['@_name'] === 'size') {
            const sz = props.Vector3;
            const sx = parseFloat(sz.X);
            const sy = parseFloat(sz.Y);
            const szVal = parseFloat(sz.Z);
            if (Number.isNaN(sx) || Number.isNaN(sy) || Number.isNaN(szVal)) {
              errors.push(`Invalid Vector3 size in referent ${referent}: [${sz.X}, ${sz.Y}, ${sz.Z}]`);
            } else if (sx <= 0 || sy <= 0 || szVal <= 0) {
              errors.push(`Vector3 size must be strictly positive in referent ${referent}: [${sx}, ${sy}, ${szVal}]`);
            }
          }
        }

        // Check child items
        if (item.Item) {
          if (Array.isArray(item.Item)) {
            for (const child of item.Item) {
              inspectItem(child, depth + 1);
            }
          } else {
            inspectItem(item.Item, depth + 1);
          }
        }
      }

      if (parsed.roblox.Item) {
        if (Array.isArray(parsed.roblox.Item)) {
          for (const item of parsed.roblox.Item) {
            inspectItem(item, 0);
          }
        } else {
          inspectItem(parsed.roblox.Item, 0);
        }
      } else {
        errors.push('No <Item> elements found inside <roblox>');
      }
    }
  } catch (err: any) {
    errors.push(`XML Parsing exception: ${err.message || String(err)}`);
  }

  return {
    valid: errors.length === 0,
    format: 'rbxmx',
    fileSize: Buffer.byteLength(xmlContent, 'utf-8'),
    totalInstances,
    referentsCount: referents.size,
    errors,
    warnings,
    classesFound: Array.from(classesFound),
  };
}

export function validateRbxmBinary(buffer: Buffer): FileValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!buffer || buffer.length < 32) {
    return {
      valid: false,
      format: 'rbxm',
      fileSize: buffer?.length || 0,
      totalInstances: 0,
      referentsCount: 0,
      errors: ['File is smaller than minimal Roblox binary header size (32 bytes)'],
      warnings: [],
      classesFound: [],
    };
  }

  // Check magic signature: <roblox!\x89\xff\x0d\x0a\x1a\x0a
  const magic = buffer.subarray(0, 14);
  const expectedMagic = Buffer.from([
    0x3c, 0x72, 0x6f, 0x62, 0x6c, 0x6f, 0x78, 0x21,
    0x89, 0xff, 0x0d, 0x0a, 0x1a, 0x0a
  ]);

  if (!magic.equals(expectedMagic)) {
    errors.push('Invalid magic signature for Roblox binary file (.rbxm)');
  }

  // Read header
  const version = buffer.readUInt16LE(14);
  const classCount = buffer.readUInt32LE(16);
  const instanceCount = buffer.readUInt32LE(20);

  if (instanceCount <= 0) {
    errors.push('Roblox binary header reports 0 instances');
  }

  // Scan for required chunks: INST, PROP, PRNT, END
  const content = buffer.subarray(32);
  const chunkNamesFound = new Set<string>();

  let offset = 32;
  while (offset + 16 <= buffer.length) {
    const chunkName = buffer.toString('ascii', offset, offset + 4);
    chunkNamesFound.add(chunkName);
    const compLen = buffer.readUInt32LE(offset + 4);
    offset += 16 + compLen;
    if (chunkName === 'END\0') break;
  }

  if (!chunkNamesFound.has('INST')) {
    errors.push('Missing required INST chunk in binary file');
  }
  if (!chunkNamesFound.has('PROP')) {
    warnings.push('Missing PROP chunk in binary file');
  }
  if (!chunkNamesFound.has('PRNT')) {
    errors.push('Missing required PRNT chunk in binary file');
  }
  if (!chunkNamesFound.has('END\0')) {
    errors.push('Missing END chunk terminator in binary file');
  }

  return {
    valid: errors.length === 0,
    format: 'rbxm',
    fileSize: buffer.length,
    totalInstances: instanceCount,
    referentsCount: instanceCount,
    errors,
    warnings,
    classesFound: Array.from(chunkNamesFound),
  };
}
