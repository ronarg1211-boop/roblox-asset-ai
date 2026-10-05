// ============================================================
// Roblox Asset AI - Roblox Binary (.rbxm) Exporter
// ============================================================

import { RobloxModelIR, RobloxPartIR, RobloxInstanceIR } from '../types/roblox';
import { normalizeColor } from './materials';
import { eulerToMatrix, MATERIAL_TOKENS, SHAPE_TOKENS } from './rbxmx-exporter';

/**
 * Encodes Roblox Model IR into a structured Roblox binary format (.rbxm)
 * Roblox binary files start with the magic header:
 * <roblox!\x89\xff\x0d\x0a\x1a\x0a
 * followed by version, class count, instance count, and chunk headers (INST, PROP, PRNT, END\0).
 */
export class RbxmExporter {
  public exportModel(model: RobloxModelIR): Buffer {
    // Magic header bytes: "<roblox!\x89\xff\x0d\x0a\x1a\x0a"
    const magic = Buffer.from([
      0x3c, 0x72, 0x6f, 0x62, 0x6c, 0x6f, 0x78, 0x21, // <roblox!
      0x89, 0xff, 0x0d, 0x0a, 0x1a, 0x0a              // binary signature
    ]);

    const version = Buffer.alloc(2);
    version.writeUInt16LE(0, 0); // version 0

    // Collect all instances flat
    const allInstances: { id: number; ref: string; name: string; className: string; parentId: number; partData?: RobloxPartIR }[] = [];
    
    // Root model is index 0
    allInstances.push({
      id: 0,
      ref: 'root',
      name: model.name,
      className: 'Model',
      parentId: -1,
    });

    let currentId = 1;
    function collect(inst: RobloxInstanceIR, parentId: number) {
      const myId = currentId++;
      allInstances.push({
        id: myId,
        ref: inst.id || inst.name,
        name: inst.name,
        className: inst.className,
        parentId,
        partData: (inst.className === 'Part' || inst.className === 'WedgePart') ? (inst as RobloxPartIR) : undefined,
      });

      if (inst.children) {
        for (const child of inst.children) {
          collect(child, myId);
        }
      }
    }

    for (const inst of model.instances) {
      collect(inst, 0);
    }

    // Prepare chunks
    const chunks: Buffer[] = [];

    // META chunk
    const metaData = Buffer.from('ExplicitAutoJoints\0true\0');
    chunks.push(this.createChunk('META', metaData));

    // INST chunks: Group instances by class
    const classes = new Map<string, number[]>();
    for (const inst of allInstances) {
      if (!classes.has(inst.className)) {
        classes.set(inst.className, []);
      }
      classes.get(inst.className)!.push(inst.id);
    }

    let classIndex = 0;
    const classIdMap = new Map<string, number>();
    for (const [className, ids] of classes.entries()) {
      classIdMap.set(className, classIndex);
      const instPayload = this.buildInstChunkPayload(classIndex++, className, ids);
      chunks.push(this.createChunk('INST', instPayload));
    }

    // PROP chunks for Parts and Models
    for (const [className, ids] of classes.entries()) {
      const cId = classIdMap.get(className)!;
      // Name property
      const namePayload = this.buildPropChunkPayload(cId, 'Name', 0x01, ids.map((id: number) => allInstances[id].name));
      chunks.push(this.createChunk('PROP', namePayload));
    }

    // PRNT chunk: Parent-child relationships
    const prntPayload = this.buildPrntChunkPayload(allInstances);
    chunks.push(this.createChunk('PRNT', prntPayload));

    // END\0 chunk
    chunks.push(this.createChunk('END\0', Buffer.alloc(0)));

    // Header header: magic (14) + version (2) + classCount (4) + instanceCount (4) + reserved (8)
    const header = Buffer.alloc(18);
    header.writeUInt16LE(0, 0); // version
    header.writeUInt32LE(classes.size, 2); // num classes
    header.writeUInt32LE(allInstances.length, 6); // num instances
    header.fill(0, 10, 18); // reserved 8 bytes

    return Buffer.concat([magic, header, ...chunks]);
  }

  private createChunk(name: string, payload: Buffer): Buffer {
    const chunkHeader = Buffer.alloc(16);
    chunkHeader.write(name, 0, 4, 'ascii');
    chunkHeader.writeUInt32LE(payload.length, 4); // compressed size (uncompressed = payload.length when flag=0)
    chunkHeader.writeUInt32LE(payload.length, 8); // uncompressed size
    chunkHeader.writeUInt32LE(0, 12); // reserved / flags (0 = uncompressed raw)
    return Buffer.concat([chunkHeader, payload]);
  }

  private buildInstChunkPayload(classId: number, className: string, instanceIds: number[]): Buffer {
    const classNameBuf = Buffer.from(className, 'utf-8');
    const headerBuf = Buffer.alloc(4 + 1 + 4 + classNameBuf.length);
    let offset = 0;
    headerBuf.writeUInt32LE(classId, offset);
    offset += 4;
    headerBuf.writeUInt8(0, offset); // isService = false
    offset += 1;
    headerBuf.writeUInt32LE(classNameBuf.length, offset);
    offset += 4;
    classNameBuf.copy(headerBuf, offset);

    // Delta-encoded IDs
    const idCount = instanceIds.length;
    const countBuf = Buffer.alloc(4);
    countBuf.writeUInt32LE(idCount, 0);

    const idsBuf = Buffer.alloc(idCount * 4);
    let prev = 0;
    for (let i = 0; i < idCount; i++) {
      const delta = instanceIds[i] - prev;
      idsBuf.writeInt32LE(delta, i * 4);
      prev = instanceIds[i];
    }

    return Buffer.concat([headerBuf, countBuf, idsBuf]);
  }

  private buildPropChunkPayload(classId: number, propName: string, propType: number, values: string[]): Buffer {
    const propNameBuf = Buffer.from(propName, 'utf-8');
    const header = Buffer.alloc(4 + 4 + propNameBuf.length + 1);
    let offset = 0;
    header.writeUInt32LE(classId, offset);
    offset += 4;
    header.writeUInt32LE(propNameBuf.length, offset);
    offset += 4;
    propNameBuf.copy(header, offset);
    offset += propNameBuf.length;
    header.writeUInt8(propType, offset); // 0x01 = String

    const valBuffers: Buffer[] = [];
    for (const val of values) {
      const strBuf = Buffer.from(val, 'utf-8');
      const lenBuf = Buffer.alloc(4);
      lenBuf.writeUInt32LE(strBuf.length, 0);
      valBuffers.push(lenBuf, strBuf);
    }

    return Buffer.concat([header, ...valBuffers]);
  }

  private buildPrntChunkPayload(instances: { id: number; parentId: number }[]): Buffer {
    const count = instances.length;
    const buf = Buffer.alloc(1 + 4 + count * 4 + count * 4);
    let offset = 0;
    buf.writeUInt8(0, offset++); // version 0
    buf.writeUInt32LE(count, offset);
    offset += 4;

    // Child IDs (delta encoded)
    let prev = 0;
    for (let i = 0; i < count; i++) {
      const delta = instances[i].id - prev;
      buf.writeInt32LE(delta, offset);
      offset += 4;
      prev = instances[i].id;
    }

    // Parent IDs (delta encoded)
    prev = 0;
    for (let i = 0; i < count; i++) {
      const p = instances[i].parentId;
      const delta = p - prev;
      buf.writeInt32LE(delta, offset);
      offset += 4;
      prev = p;
    }

    return buf;
  }
}
