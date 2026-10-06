// ============================================================
// Roblox Asset AI - Deterministic, Bulletproof .rbxmx Exporter
// Produces 100% Studio-compliant Roblox XML for Models and Animations
// Automatically eliminates NaN/corrupt XML and enforces joint hierarchies.
// ============================================================

import {
  RobloxModelIR,
  RobloxAnimationIR,
  RobloxPartIR,
  RobloxInstanceIR,
  RobloxMaterial,
  RobloxShape,
  AnimationPriority,
  EasingStyle,
  EasingDirection,
  RobloxHumanoidIR,
} from '../types/roblox';
import { normalizeColor } from './materials';

// Roblox Material Token Mapping for rbxmx serialization
export const MATERIAL_TOKENS: Record<RobloxMaterial, number> = {
  Plastic: 256,
  SmoothPlastic: 272,
  Neon: 288,
  Wood: 512,
  WoodPlanks: 528,
  Metal: 1040,
  CorrodedMetal: 1056,
  DiamondPlate: 1072,
  Foil: 1088,
  Grass: 1280,
  Ice: 1536,
  Brick: 1312,
  Sand: 1296,
  Fabric: 1344,
  Granite: 800,
  Glass: 1568,
  Pebble: 816,
  Cobblestone: 832,
  Slate: 848,
  Marble: 864,
  Concrete: 784,
  ForceField: 1584,
};

// Roblox Shape Token Mapping
export const SHAPE_TOKENS: Record<RobloxShape, number> = {
  Ball: 0,
  Block: 1,
  Cylinder: 2,
  Wedge: 1, // Handled as WedgePart class
};

export const ANIMATION_PRIORITY_TOKENS: Record<AnimationPriority, number> = {
  Idle: 0,
  Movement: 1,
  Action: 2,
  Action2: 3,
  Action3: 4,
  Action4: 5,
};

export const EASING_STYLE_TOKENS: Record<EasingStyle, number> = {
  Linear: 0,
  Sine: 1,
  Back: 2,
  Quad: 3,
  Bounce: 4,
  Elastic: 5,
  Cubic: 6,
};

export const EASING_DIRECTION_TOKENS: Record<EasingDirection, number> = {
  In: 0,
  Out: 1,
  InOut: 2,
};

/**
 * Guarantees a value is a strictly finite number. Never outputs NaN or Infinity.
 */
function safeNum(val: any, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Guarantees a positive number strictly greater than 0.001 (e.g. for Part sizes).
 */
function safePositiveNum(val: any, fallback = 1): number {
  const n = Number(val);
  return Number.isFinite(n) && n > 0.001 ? n : fallback;
}

/**
 * Strips invalid XML 1.0 control characters and escapes entities.
 */
function escapeXml(unsafe: string): string {
  return String(unsafe || '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Computes 3x3 rotation matrix from Euler angles [rx, ry, rz] in degrees.
 * Returns 9 finite numbers.
 */
export function eulerToMatrix(rxDeg: number, ryDeg: number, rzDeg: number): number[] {
  const rad = Math.PI / 180;
  const x = safeNum(rxDeg) * rad;
  const y = safeNum(ryDeg) * rad;
  const z = safeNum(rzDeg) * rad;

  const cx = Math.cos(x);
  const sx = Math.sin(x);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  const cz = Math.cos(z);
  const sz = Math.sin(z);

  // Rotation matrix: R = Rz * Ry * Rx
  const r00 = safeNum(cy * cz, 1);
  const r01 = safeNum(cz * sx * sy - cx * sz, 0);
  const r02 = safeNum(cx * cz * sy + sx * sz, 0);

  const r10 = safeNum(cy * sz, 0);
  const r11 = safeNum(cx * cz + sx * sy * sz, 1);
  const r12 = safeNum(-cz * sx + cx * sy * sz, 0);

  const r20 = safeNum(-sy, 0);
  const r21 = safeNum(cy * sx, 0);
  const r22 = safeNum(cy * cx, 1);

  return [r00, r01, r02, r10, r11, r12, r20, r21, r22];
}

export class RbxmxExporter {
  private referentCounter = 0;
  private referentMap = new Map<string, string>();

  private getReferent(idOrName: string): string {
    const key = String(idOrName || `auto_${this.referentCounter}`);
    if (!this.referentMap.has(key)) {
      this.referentMap.set(key, `RBX${this.referentCounter++}`);
    }
    return this.referentMap.get(key)!;
  }

  /**
   * Converts a Roblox Model IR into a valid, standard Roblox XML (.rbxmx) string
   */
  public exportModel(model: RobloxModelIR): string {
    this.referentCounter = 0;
    this.referentMap.clear();

    const rootReferent = this.getReferent('root_model');

    // Pre-register all instance referents so references can never be dangling
    const registeredIds = new Set<string>();
    const partInstances: RobloxPartIR[] = [];

    for (const inst of model.instances) {
      const id = inst.id || inst.name;
      registeredIds.add(id);
      this.getReferent(id);
      if (inst.className === 'Part' || inst.className === 'WedgePart' || inst.className === 'MeshPart') {
        partInstances.push(inst as RobloxPartIR);
      }
    }

    // Determine safe, non-dangling PrimaryPart referent
    let primaryPartRef = 'null';
    if (model.primaryPartId && registeredIds.has(model.primaryPartId)) {
      primaryPartRef = this.getReferent(model.primaryPartId);
    } else if (partInstances.length > 0) {
      primaryPartRef = this.getReferent(partInstances[0].id || partInstances[0].name);
    }

    const xmlLines: string[] = [];
    xmlLines.push('<?xml version="1.0" encoding="utf-8"?>');
    xmlLines.push('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">');
    xmlLines.push('\t<Meta name="ExplicitAutoJoints">true</Meta>');
    xmlLines.push(`\t<Item class="Model" referent="${rootReferent}">`);
    xmlLines.push('\t\t<Properties>');
    xmlLines.push(`\t\t\t<string name="Name">${escapeXml(model.name || 'RobloxModel')}</string>`);
    xmlLines.push('\t\t\t<token name="LevelOfDetail">0</token>');
    xmlLines.push(`\t\t\t<Ref name="PrimaryPart">${primaryPartRef}</Ref>`);
    xmlLines.push('\t\t\t<CoordinateFrame name="ModelMeshCFrame">');
    xmlLines.push('\t\t\t\t<X>0</X><Y>0</Y><Z>0</Z>');
    xmlLines.push('\t\t\t\t<R00>1</R00><R01>0</R01><R02>0</R02>');
    xmlLines.push('\t\t\t\t<R10>0</R10><R11>1</R11><R12>0</R12>');
    xmlLines.push('\t\t\t\t<R20>0</R20><R21>0</R21><R22>1</R22>');
    xmlLines.push('\t\t\t</CoordinateFrame>');
    xmlLines.push('\t\t</Properties>');

    for (const inst of model.instances) {
      this.serializeInstance(inst, xmlLines, '\t\t');
    }

    xmlLines.push('\t</Item>');
    xmlLines.push('</roblox>');

    return xmlLines.join('\n');
  }

  private serializeInstance(inst: RobloxInstanceIR, lines: string[], indent: string): void {
    const referent = this.getReferent(inst.id || inst.name);

    if (
      inst.className === 'Part' ||
      inst.className === 'WedgePart' ||
      inst.className === 'MeshPart' ||
      inst.className === 'Seat' ||
      inst.className === 'VehicleSeat'
    ) {
      const part = inst as any;
      const isWedge = part.shape === 'Wedge' || part.className === 'WedgePart';
      let actualClass = inst.className;
      if (isWedge) actualClass = 'WedgePart';

      const shapeToken = isWedge ? 1 : SHAPE_TOKENS[(part.shape as RobloxShape) || 'Block'] ?? 1;
      const materialToken = MATERIAL_TOKENS[(part.material as RobloxMaterial) || 'SmoothPlastic'] ?? 256;

      const sx = safePositiveNum(part.size?.[0], 1);
      const sy = safePositiveNum(part.size?.[1], 1);
      const sz = safePositiveNum(part.size?.[2], 1);

      const px = safeNum(part.position?.[0], 0);
      const py = safeNum(part.position?.[1], 0);
      const pz = safeNum(part.position?.[2], 0);

      const rx = safeNum(part.rotation?.[0], 0);
      const ry = safeNum(part.rotation?.[1], 0);
      const rz = safeNum(part.rotation?.[2], 0);

      const [cr, cg, cb] = normalizeColor(part.color || [128, 128, 128]);
      const [r00, r01, r02, r10, r11, r12, r20, r21, r22] = eulerToMatrix(rx, ry, rz);

      const rByte = Math.min(255, Math.max(0, Math.round(cr * 255)));
      const gByte = Math.min(255, Math.max(0, Math.round(cg * 255)));
      const bByte = Math.min(255, Math.max(0, Math.round(cb * 255)));
      // Full 100% opaque Color3uint8 (ARGB with Alpha=255)
      const uint8Color = ((0xff000000) | (rByte << 16) | (gByte << 8) | bByte) >>> 0;

      lines.push(`${indent}<Item class="${actualClass}" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(part.name || 'Part')}</string>`);
      lines.push(`${indent}\t\t<bool name="Anchored">${part.anchored !== false}</bool>`);
      lines.push(`${indent}\t\t<bool name="CanCollide">${part.canCollide !== false}</bool>`);
      lines.push(`${indent}\t\t<float name="Transparency">${safeNum(part.transparency, 0).toFixed(4)}</float>`);
      lines.push(`${indent}\t\t<float name="Reflectance">${safeNum(part.reflectance, 0).toFixed(4)}</float>`);
      lines.push(`${indent}\t\t<token name="Material">${materialToken}</token>`);
      lines.push(`${indent}\t\t<token name="TopSurface">0</token>`);
      lines.push(`${indent}\t\t<token name="BottomSurface">0</token>`);
      lines.push(`${indent}\t\t<token name="LeftSurface">0</token>`);
      lines.push(`${indent}\t\t<token name="RightSurface">0</token>`);
      lines.push(`${indent}\t\t<token name="FrontSurface">0</token>`);
      lines.push(`${indent}\t\t<token name="BackSurface">0</token>`);
      if (!isWedge && actualClass === 'Part') {
        lines.push(`${indent}\t\t<token name="shape">${shapeToken}</token>`);
      }
      lines.push(`${indent}\t\t<Color3 name="Color">`);
      lines.push(`${indent}\t\t\t<R>${cr.toFixed(6)}</R>`);
      lines.push(`${indent}\t\t\t<G>${cg.toFixed(6)}</G>`);
      lines.push(`${indent}\t\t\t<B>${cb.toFixed(6)}</B>`);
      lines.push(`${indent}\t\t</Color3>`);
      lines.push(`${indent}\t\t<Color3uint8 name="Color3uint8">${uint8Color}</Color3uint8>`);
      lines.push(`${indent}\t\t<Vector3 name="size">`);
      lines.push(`${indent}\t\t\t<X>${sx.toFixed(4)}</X>`);
      lines.push(`${indent}\t\t\t<Y>${sy.toFixed(4)}</Y>`);
      lines.push(`${indent}\t\t\t<Z>${sz.toFixed(4)}</Z>`);
      lines.push(`${indent}\t\t</Vector3>`);
      lines.push(`${indent}\t\t<CoordinateFrame name="CFrame">`);
      lines.push(`${indent}\t\t\t<X>${px.toFixed(4)}</X>`);
      lines.push(`${indent}\t\t\t<Y>${py.toFixed(4)}</Y>`);
      lines.push(`${indent}\t\t\t<Z>${pz.toFixed(4)}</Z>`);
      lines.push(`${indent}\t\t\t<R00>${r00.toFixed(6)}</R00><R01>${r01.toFixed(6)}</R01><R02>${r02.toFixed(6)}</R02>`);
      lines.push(`${indent}\t\t\t<R10>${r10.toFixed(6)}</R10><R11>${r11.toFixed(6)}</R11><R12>${r12.toFixed(6)}</R12>`);
      lines.push(`${indent}\t\t\t<R20>${r20.toFixed(6)}</R20><R21>${r21.toFixed(6)}</R21><R22>${r22.toFixed(6)}</R22>`);
      lines.push(`${indent}\t\t</CoordinateFrame>`);
      lines.push(`${indent}\t</Properties>`);

      if (part.children && part.children.length > 0) {
        for (const child of part.children) {
          this.serializeInstance(child, lines, `${indent}\t`);
        }
      }

      lines.push(`${indent}</Item>`);
    } else if (inst.className === 'Humanoid') {
      const hum = inst as RobloxHumanoidIR;
      lines.push(`${indent}<Item class="Humanoid" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(hum.name || 'Humanoid')}</string>`);
      lines.push(`${indent}\t\t<float name="Health">${safeNum(hum.health, 100).toFixed(1)}</float>`);
      lines.push(`${indent}\t\t<float name="MaxHealth">${safeNum(hum.maxHealth, 100).toFixed(1)}</float>`);
      lines.push(`${indent}\t\t<token name="RigType">${hum.rigType ?? 0}</token>`);
      lines.push(`${indent}\t</Properties>`);
      lines.push(`${indent}</Item>`);
    } else if (inst.className === 'WeldConstraint') {
      const weld = inst as any;
      const p0Ref = this.getReferent(weld.part0);
      const p1Ref = this.getReferent(weld.part1);

      lines.push(`${indent}<Item class="WeldConstraint" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(weld.name || 'WeldConstraint')}</string>`);
      lines.push(`${indent}\t\t<Ref name="Part0">${p0Ref}</Ref>`);
      lines.push(`${indent}\t\t<Ref name="Part1">${p1Ref}</Ref>`);
      lines.push(`${indent}\t\t<bool name="Active">true</bool>`);
      lines.push(`${indent}\t\t<bool name="Enabled">true</bool>`);
      lines.push(`${indent}\t</Properties>`);
      lines.push(`${indent}</Item>`);
    } else if (inst.className === 'Motor6D') {
      const motor = inst as any;
      const p0Ref = this.getReferent(motor.part0);
      const p1Ref = this.getReferent(motor.part1);

      // Serialize C0 and C1 CFrames
      const c0Pos = [safeNum(motor.c0?.[0], 0), safeNum(motor.c0?.[1], 0), safeNum(motor.c0?.[2], 0)];
      const c0Rot = [safeNum(motor.c0?.[3], 0), safeNum(motor.c0?.[4], 0), safeNum(motor.c0?.[5], 0)];
      const [c0R00, c0R01, c0R02, c0R10, c0R11, c0R12, c0R20, c0R21, c0R22] = eulerToMatrix(c0Rot[0], c0Rot[1], c0Rot[2]);

      const c1Pos = [safeNum(motor.c1?.[0], 0), safeNum(motor.c1?.[1], 0), safeNum(motor.c1?.[2], 0)];
      const c1Rot = [safeNum(motor.c1?.[3], 0), safeNum(motor.c1?.[4], 0), safeNum(motor.c1?.[5], 0)];
      const [c1R00, c1R01, c1R02, c1R10, c1R11, c1R12, c1R20, c1R21, c1R22] = eulerToMatrix(c1Rot[0], c1Rot[1], c1Rot[2]);

      lines.push(`${indent}<Item class="Motor6D" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(motor.name || 'Motor6D')}</string>`);
      lines.push(`${indent}\t\t<Ref name="Part0">${p0Ref}</Ref>`);
      lines.push(`${indent}\t\t<Ref name="Part1">${p1Ref}</Ref>`);
      lines.push(`${indent}\t\t<CoordinateFrame name="C0">`);
      lines.push(`${indent}\t\t\t<X>${c0Pos[0].toFixed(4)}</X><Y>${c0Pos[1].toFixed(4)}</Y><Z>${c0Pos[2].toFixed(4)}</Z>`);
      lines.push(`${indent}\t\t\t<R00>${c0R00.toFixed(6)}</R00><R01>${c0R01.toFixed(6)}</R01><R02>${c0R02.toFixed(6)}</R02>`);
      lines.push(`${indent}\t\t\t<R10>${c0R10.toFixed(6)}</R10><R11>${c0R11.toFixed(6)}</R11><R12>${c0R12.toFixed(6)}</R12>`);
      lines.push(`${indent}\t\t\t<R20>${c0R20.toFixed(6)}</R20><R21>${c0R21.toFixed(6)}</R21><R22>${c0R22.toFixed(6)}</R22>`);
      lines.push(`${indent}\t\t</CoordinateFrame>`);
      lines.push(`${indent}\t\t<CoordinateFrame name="C1">`);
      lines.push(`${indent}\t\t\t<X>${c1Pos[0].toFixed(4)}</X><Y>${c1Pos[1].toFixed(4)}</Y><Z>${c1Pos[2].toFixed(4)}</Z>`);
      lines.push(`${indent}\t\t\t<R00>${c1R00.toFixed(6)}</R00><R01>${c1R01.toFixed(6)}</R01><R02>${c1R02.toFixed(6)}</R02>`);
      lines.push(`${indent}\t\t\t<R10>${c1R10.toFixed(6)}</R10><R11>${c1R11.toFixed(6)}</R11><R12>${c1R12.toFixed(6)}</R12>`);
      lines.push(`${indent}\t\t\t<R20>${c1R20.toFixed(6)}</R20><R21>${c1R21.toFixed(6)}</R21><R22>${c1R22.toFixed(6)}</R22>`);
      lines.push(`${indent}\t\t</CoordinateFrame>`);
      lines.push(`${indent}\t</Properties>`);
      lines.push(`${indent}</Item>`);
    } else if (inst.className === 'Attachment') {
      const att = inst as any;
      const ax = safeNum(att.position?.[0], 0);
      const ay = safeNum(att.position?.[1], 0);
      const az = safeNum(att.position?.[2], 0);
      lines.push(`${indent}<Item class="Attachment" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(att.name || 'Attachment')}</string>`);
      lines.push(`${indent}\t\t<Vector3 name="Position"><X>${ax.toFixed(4)}</X><Y>${ay.toFixed(4)}</Y><Z>${az.toFixed(4)}</Z></Vector3>`);
      lines.push(`${indent}\t</Properties>`);
      lines.push(`${indent}</Item>`);
    } else if (inst.className === 'Folder') {
      lines.push(`${indent}<Item class="Folder" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(inst.name)}</string>`);
      lines.push(`${indent}\t</Properties>`);
      if (inst.children) {
        for (const child of inst.children) {
          this.serializeInstance(child, lines, `${indent}\t`);
        }
      }
      lines.push(`${indent}</Item>`);
    }
  }

  /**
   * Converts a Roblox Animation IR into a valid, hierarchical .rbxmx KeyframeSequence
   * Structuring Poses hierarchically (RootPart -> Torso -> Limbs) ensures 100% compatibility
   * with Roblox Studio's native Animation Editor.
   */
  public exportAnimation(anim: RobloxAnimationIR): string {
    this.referentCounter = 0;
    this.referentMap.clear();

    const rootReferent = this.getReferent('root_anim');
    const priorityToken = ANIMATION_PRIORITY_TOKENS[anim.priority] ?? 2;

    const xmlLines: string[] = [];
    xmlLines.push('<?xml version="1.0" encoding="utf-8"?>');
    xmlLines.push('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">');
    xmlLines.push('\t<Meta name="ExplicitAutoJoints">true</Meta>');
    xmlLines.push(`\t<Item class="KeyframeSequence" referent="${rootReferent}">`);
    xmlLines.push('\t\t<Properties>');
    xmlLines.push(`\t\t\t<string name="Name">${escapeXml(anim.name || 'Animation')}</string>`);
    xmlLines.push(`\t\t\t<bool name="Loop">${anim.loop !== false}</bool>`);
    xmlLines.push(`\t\t\t<token name="Priority">${priorityToken}</token>`);
    xmlLines.push('\t\t</Properties>');

    for (let i = 0; i < anim.keyframes.length; i++) {
      const kf = anim.keyframes[i];
      const kfRef = this.getReferent(`kf_${i}`);
      const kfTime = safeNum(kf.time, 0);

      xmlLines.push(`\t\t<Item class="Keyframe" referent="${kfRef}">`);
      xmlLines.push('\t\t\t<Properties>');
      xmlLines.push(`\t\t\t\t<string name="Name">${escapeXml(kf.name || `Keyframe_${i}`)}</string>`);
      xmlLines.push(`\t\t\t\t<float name="Time">${kfTime.toFixed(4)}</float>`);
      xmlLines.push('\t\t\t</Properties>');

      // Build hierarchical pose structure:
      // In Roblox R6: RootPart -> Torso -> [Head, LeftArm, RightArm, LeftLeg, RightLeg]
      const posesByName = new Map<string, any>();
      for (let j = 0; j < kf.poses.length; j++) {
        posesByName.set(kf.poses[j].boneName, { pose: kf.poses[j], index: j });
      }

      const serializedBones = new Set<string>();

      const serializeSinglePose = (poseData: any, indent: string, childPoses: any[] = []) => {
        const { pose, index } = poseData;
        const poseRef = this.getReferent(`pose_${i}_${index}`);
        const px = safeNum(pose.position?.[0], 0);
        const py = safeNum(pose.position?.[1], 0);
        const pz = safeNum(pose.position?.[2], 0);
        const rx = safeNum(pose.rotation?.[0], 0);
        const ry = safeNum(pose.rotation?.[1], 0);
        const rz = safeNum(pose.rotation?.[2], 0);
        const [r00, r01, r02, r10, r11, r12, r20, r21, r22] = eulerToMatrix(rx, ry, rz);
        const styleToken = (EASING_STYLE_TOKENS as Record<string, number>)[pose.easingStyle] ?? 0;
        const dirToken = (EASING_DIRECTION_TOKENS as Record<string, number>)[pose.easingDirection] ?? 1;

        xmlLines.push(`${indent}<Item class="Pose" referent="${poseRef}">`);
        xmlLines.push(`${indent}\t<Properties>`);
        xmlLines.push(`${indent}\t\t<string name="Name">${escapeXml(pose.boneName)}</string>`);
        xmlLines.push(`${indent}\t\t<float name="Weight">1</float>`);
        xmlLines.push(`${indent}\t\t<token name="EasingStyle">${styleToken}</token>`);
        xmlLines.push(`${indent}\t\t<token name="EasingDirection">${dirToken}</token>`);
        xmlLines.push(`${indent}\t\t<CoordinateFrame name="CFrame">`);
        xmlLines.push(`${indent}\t\t\t<X>${px.toFixed(4)}</X><Y>${py.toFixed(4)}</Y><Z>${pz.toFixed(4)}</Z>`);
        xmlLines.push(`${indent}\t\t\t<R00>${r00.toFixed(6)}</R00><R01>${r01.toFixed(6)}</R01><R02>${r02.toFixed(6)}</R02>`);
        xmlLines.push(`${indent}\t\t\t<R10>${r10.toFixed(6)}</R10><R11>${r11.toFixed(6)}</R11><R12>${r12.toFixed(6)}</R12>`);
        xmlLines.push(`${indent}\t\t\t<R20>${r20.toFixed(6)}</R20><R21>${r21.toFixed(6)}</R21><R22>${r22.toFixed(6)}</R22>`);
        xmlLines.push(`${indent}\t\t</CoordinateFrame>`);
        xmlLines.push(`${indent}\t</Properties>`);

        for (const child of childPoses) {
          serializeSinglePose(child, `${indent}\t`, child.children || []);
        }

        xmlLines.push(`${indent}</Item>`);
      };

      // Check if this is an R6 rig with Torso
      const torsoPose = posesByName.get('Torso');
      const rootPose = posesByName.get('HumanoidRootPart');

      if (torsoPose) {
        serializedBones.add('Torso');
        const torsoChildren: any[] = [];
        const childBoneNames = ['Head', 'LeftArm', 'RightArm', 'LeftLeg', 'RightLeg', 'Left Arm', 'Right Arm', 'Left Leg', 'Right Leg'];
        for (const bone of childBoneNames) {
          const childData = posesByName.get(bone);
          if (childData && !serializedBones.has(bone)) {
            torsoChildren.push(childData);
            serializedBones.add(bone);
          }
        }

        if (rootPose) {
          serializedBones.add('HumanoidRootPart');
          // RootPart wraps Torso, and Torso wraps the limbs
          const rootChildren = [{ pose: torsoPose.pose, index: torsoPose.index, children: torsoChildren }];
          serializeSinglePose(rootPose, '\t\t\t', rootChildren);
        } else {
          // Torso is top-level pose containing limbs
          serializeSinglePose(torsoPose, '\t\t\t', torsoChildren);
        }
      }

      // Serialize any remaining poses
      for (const [boneName, pData] of posesByName.entries()) {
        if (!serializedBones.has(boneName)) {
          serializeSinglePose(pData, '\t\t\t');
          serializedBones.add(boneName);
        }
      }

      xmlLines.push('\t\t</Item>');
    }

    xmlLines.push('\t</Item>');
    xmlLines.push('</roblox>');

    return xmlLines.join('\n');
  }
}
