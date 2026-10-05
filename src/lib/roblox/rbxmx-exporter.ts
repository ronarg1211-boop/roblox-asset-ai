// ============================================================
// Roblox Asset AI - Deterministic .rbxmx (Roblox XML) Exporter
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
 * Computes 3x3 rotation matrix from Euler angles [rx, ry, rz] in degrees
 */
export function eulerToMatrix(rxDeg: number, ryDeg: number, rzDeg: number): number[] {
  const rad = Math.PI / 180;
  const x = rxDeg * rad;
  const y = ryDeg * rad;
  const z = rzDeg * rad;

  const cx = Math.cos(x);
  const sx = Math.sin(x);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  const cz = Math.cos(z);
  const sz = Math.sin(z);

  // Rotation matrix: R = Rz * Ry * Rx
  const r00 = cy * cz;
  const r01 = cz * sx * sy - cx * sz;
  const r02 = cx * cz * sy + sx * sz;

  const r10 = cy * sz;
  const r11 = cx * cz + sx * sy * sz;
  const r12 = -cz * sx + cx * sy * sz;

  const r20 = -sy;
  const r21 = cy * sx;
  const r22 = cy * cx;

  return [r00, r01, r02, r10, r11, r12, r20, r21, r22];
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export class RbxmxExporter {
  private referentCounter = 0;
  private referentMap = new Map<string, string>();

  private getReferent(idOrName: string): string {
    if (!this.referentMap.has(idOrName)) {
      this.referentMap.set(idOrName, `RBX${this.referentCounter++}`);
    }
    return this.referentMap.get(idOrName)!;
  }

  /**
   * Converts a Roblox Model IR into a valid, standard Roblox XML (.rbxmx) string
   */
  public exportModel(model: RobloxModelIR): string {
    this.referentCounter = 0;
    this.referentMap.clear();

    const rootReferent = this.getReferent('root_model');

    const xmlLines: string[] = [];
    xmlLines.push('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">');
    xmlLines.push('\t<Meta name="ExplicitAutoJoints">true</Meta>');
    xmlLines.push(`\t<Item class="Model" referent="${rootReferent}">`);
    xmlLines.push('\t\t<Properties>');
    xmlLines.push(`\t\t\t<string name="Name">${escapeXml(model.name)}</string>`);
    xmlLines.push('\t\t\t<token name="LevelOfDetail">0</token>');
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

    if (inst.className === 'Part' || inst.className === 'WedgePart' || inst.className === 'MeshPart') {
      const part = inst as RobloxPartIR;
      const isWedge = part.shape === 'Wedge' || part.className === 'WedgePart';
      const actualClass = isWedge ? 'WedgePart' : 'Part';
      const shapeToken = isWedge ? 1 : SHAPE_TOKENS[part.shape || 'Block'] ?? 1;
      const materialToken = MATERIAL_TOKENS[part.material] ?? 256;

      const [sx, sy, sz] = part.size;
      const [px, py, pz] = part.position;
      const [rx, ry, rz] = part.rotation;
      const [cr, cg, cb] = normalizeColor(part.color);
      const [r00, r01, r02, r10, r11, r12, r20, r21, r22] = eulerToMatrix(rx, ry, rz);

      lines.push(`${indent}<Item class="${actualClass}" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(part.name)}</string>`);
      lines.push(`${indent}\t\t<bool name="Anchored">${part.anchored ?? true}</bool>`);
      lines.push(`${indent}\t\t<bool name="CanCollide">${part.canCollide ?? true}</bool>`);
      lines.push(`${indent}\t\t<float name="Transparency">${(part.transparency ?? 0).toFixed(4)}</float>`);
      lines.push(`${indent}\t\t<float name="Reflectance">${(part.reflectance ?? 0).toFixed(4)}</float>`);
      lines.push(`${indent}\t\t<token name="Material">${materialToken}</token>`);
      if (!isWedge) {
        lines.push(`${indent}\t\t<token name="shape">${shapeToken}</token>`);
      }
      lines.push(`${indent}\t\t<Color3 name="Color">`);
      lines.push(`${indent}\t\t\t<R>${cr.toFixed(6)}</R>`);
      lines.push(`${indent}\t\t\t<G>${cg.toFixed(6)}</G>`);
      lines.push(`${indent}\t\t\t<B>${cb.toFixed(6)}</B>`);
      lines.push(`${indent}\t\t</Color3>`);
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
    } else if (inst.className === 'WeldConstraint') {
      const weld = inst as any;
      const p0Ref = this.getReferent(weld.part0);
      const p1Ref = this.getReferent(weld.part1);

      lines.push(`${indent}<Item class="WeldConstraint" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(weld.name || 'WeldConstraint')}</string>`);
      lines.push(`${indent}\t\t<Ref name="Part0">${p0Ref}</Ref>`);
      lines.push(`${indent}\t\t<Ref name="Part1">${p1Ref}</Ref>`);
      lines.push(`${indent}\t</Properties>`);
      lines.push(`${indent}</Item>`);
    } else if (inst.className === 'Motor6D') {
      const motor = inst as any;
      const p0Ref = this.getReferent(motor.part0);
      const p1Ref = this.getReferent(motor.part1);

      lines.push(`${indent}<Item class="Motor6D" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(motor.name || 'Motor6D')}</string>`);
      lines.push(`${indent}\t\t<Ref name="Part0">${p0Ref}</Ref>`);
      lines.push(`${indent}\t\t<Ref name="Part1">${p1Ref}</Ref>`);
      lines.push(`${indent}\t</Properties>`);
      lines.push(`${indent}</Item>`);
    } else if (inst.className === 'Attachment') {
      const att = inst as any;
      const [ax, ay, az] = att.position || [0, 0, 0];
      lines.push(`${indent}<Item class="Attachment" referent="${referent}">`);
      lines.push(`${indent}\t<Properties>`);
      lines.push(`${indent}\t\t<string name="Name">${escapeXml(att.name || 'Attachment')}</string>`);
      lines.push(`${indent}\t\t<Vector3 name="Position"><X>${ax}</X><Y>${ay}</Y><Z>${az}</Z></Vector3>`);
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
   * Converts a Roblox Animation IR into a valid .rbxmx KeyframeSequence
   */
  public exportAnimation(anim: RobloxAnimationIR): string {
    this.referentCounter = 0;
    this.referentMap.clear();

    const rootReferent = this.getReferent('root_anim');
    const priorityToken = ANIMATION_PRIORITY_TOKENS[anim.priority] ?? 2;

    const xmlLines: string[] = [];
    xmlLines.push('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">');
    xmlLines.push('\t<Meta name="ExplicitAutoJoints">true</Meta>');
    xmlLines.push(`\t<Item class="KeyframeSequence" referent="${rootReferent}">`);
    xmlLines.push('\t\t<Properties>');
    xmlLines.push(`\t\t\t<string name="Name">${escapeXml(anim.name)}</string>`);
    xmlLines.push(`\t\t\t<bool name="Loop">${anim.loop}</bool>`);
    xmlLines.push(`\t\t\t<token name="Priority">${priorityToken}</token>`);
    xmlLines.push('\t\t</Properties>');

    for (let i = 0; i < anim.keyframes.length; i++) {
      const kf = anim.keyframes[i];
      const kfRef = this.getReferent(`kf_${i}`);
      xmlLines.push(`\t\t<Item class="Keyframe" referent="${kfRef}">`);
      xmlLines.push('\t\t\t<Properties>');
      xmlLines.push(`\t\t\t\t<string name="Name">${escapeXml(kf.name || `Keyframe_${i}`)}</string>`);
      xmlLines.push(`\t\t\t\t<float name="Time">${kf.time.toFixed(4)}</float>`);
      xmlLines.push('\t\t\t</Properties>');

      for (let j = 0; j < kf.poses.length; j++) {
        const pose = kf.poses[j];
        const poseRef = this.getReferent(`pose_${i}_${j}`);
        const [px, py, pz] = pose.position || [0, 0, 0];
        const [rx, ry, rz] = pose.rotation || [0, 0, 0];
        const [r00, r01, r02, r10, r11, r12, r20, r21, r22] = eulerToMatrix(rx, ry, rz);
        const styleToken = EASING_STYLE_TOKENS[pose.easingStyle || 'Linear'] ?? 0;
        const dirToken = EASING_DIRECTION_TOKENS[pose.easingDirection || 'Out'] ?? 1;

        xmlLines.push(`\t\t\t<Item class="Pose" referent="${poseRef}">`);
        xmlLines.push('\t\t\t\t<Properties>');
        xmlLines.push(`\t\t\t\t\t<string name="Name">${escapeXml(pose.boneName)}</string>`);
        xmlLines.push('\t\t\t\t\t<float name="Weight">1</float>');
        xmlLines.push(`\t\t\t\t\t<token name="EasingStyle">${styleToken}</token>`);
        xmlLines.push(`\t\t\t\t\t<token name="EasingDirection">${dirToken}</token>`);
        xmlLines.push('\t\t\t\t\t<CoordinateFrame name="CFrame">');
        xmlLines.push(`\t\t\t\t\t\t<X>${px.toFixed(4)}</X><Y>${py.toFixed(4)}</Y><Z>${pz.toFixed(4)}</Z>`);
        xmlLines.push(`\t\t\t\t\t\t<R00>${r00.toFixed(6)}</R00><R01>${r01.toFixed(6)}</R01><R02>${r02.toFixed(6)}</R02>`);
        xmlLines.push(`\t\t\t\t\t\t<R10>${r10.toFixed(6)}</R10><R11>${r11.toFixed(6)}</R11><R12>${r12.toFixed(6)}</R12>`);
        xmlLines.push(`\t\t\t\t\t\t<R20>${r20.toFixed(6)}</R20><R21>${r21.toFixed(6)}</R21><R22>${r22.toFixed(6)}</R22>`);
        xmlLines.push('\t\t\t\t\t</CoordinateFrame>');
        xmlLines.push('\t\t\t\t</Properties>');
        xmlLines.push('\t\t\t</Item>');
      }

      xmlLines.push('\t\t</Item>');
    }

    xmlLines.push('\t</Item>');
    xmlLines.push('</roblox>');

    return xmlLines.join('\n');
  }
}
