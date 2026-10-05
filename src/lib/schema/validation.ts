// ============================================================
// Roblox Asset AI - Schema & Numeric Validation Engine
// ============================================================

import { z } from 'zod';
import { RobloxModelIR, RobloxAnimationIR, RobloxPartIR, RobloxInstanceIR } from '../types/roblox';

export const RobloxMaterialEnum = z.enum([
  'Plastic',
  'SmoothPlastic',
  'Neon',
  'Wood',
  'WoodPlanks',
  'Metal',
  'CorrodedMetal',
  'DiamondPlate',
  'Foil',
  'Grass',
  'Ice',
  'Brick',
  'Sand',
  'Fabric',
  'Granite',
  'Glass',
  'Pebble',
  'Cobblestone',
  'Slate',
  'Marble',
  'Concrete',
  'ForceField',
]);

export const RobloxShapeEnum = z.enum(['Block', 'Cylinder', 'Ball', 'Wedge']);

export const FiniteNumber = z.number().refine((n) => Number.isFinite(n) && !Number.isNaN(n), {
  message: 'Must be a finite number, cannot be NaN or Infinity',
});

export const Vector3Tuple = z.tuple([FiniteNumber, FiniteNumber, FiniteNumber]);

export const PositiveVector3Tuple = z.tuple([
  FiniteNumber.refine((n) => n > 0.001, { message: 'X size must be positive and non-zero' }),
  FiniteNumber.refine((n) => n > 0.001, { message: 'Y size must be positive and non-zero' }),
  FiniteNumber.refine((n) => n > 0.001, { message: 'Z size must be positive and non-zero' }),
]);

export const PartIRSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  className: z.enum(['Part', 'WedgePart', 'MeshPart', 'TrussPart', 'SpawnLocation']),
  shape: RobloxShapeEnum.optional(),
  size: PositiveVector3Tuple,
  position: Vector3Tuple,
  rotation: Vector3Tuple,
  color: Vector3Tuple,
  material: RobloxMaterialEnum,
  transparency: z.number().min(0).max(1).optional(),
  reflectance: z.number().min(0).max(1).optional(),
  anchored: z.boolean().optional(),
  canCollide: z.boolean().optional(),
});

export const AnimationPoseSchema = z.object({
  boneName: z.string().min(1),
  position: Vector3Tuple.optional(),
  rotation: Vector3Tuple.optional(),
  easingStyle: z.enum(['Linear', 'Sine', 'Back', 'Quad', 'Bounce', 'Elastic', 'Cubic']).optional(),
  easingDirection: z.enum(['In', 'Out', 'InOut']).optional(),
});

export const AnimationKeyframeSchema = z.object({
  time: FiniteNumber.refine((t) => t >= 0, { message: 'Keyframe timestamp must be non-negative' }),
  name: z.string().optional(),
  poses: z.array(AnimationPoseSchema),
});

export const RobloxAnimationSchema = z.object({
  assetType: z.literal('animation'),
  name: z.string().min(1),
  length: FiniteNumber.refine((l) => l > 0, { message: 'Animation length must be > 0' }),
  loop: z.boolean(),
  priority: z.enum(['Idle', 'Movement', 'Action', 'Action2', 'Action3', 'Action4']),
  fps: z.number().positive().optional(),
  keyframes: z.array(AnimationKeyframeSchema).min(1),
});

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

/**
 * Validates a Roblox Model IR against strict schema, hierarchy, numeric, and referent rules
 */
export function validateModelIR(model: RobloxModelIR): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!model || typeof model !== 'object') {
    return {
      valid: false,
      errors: [{ path: 'root', code: 'INVALID_OBJECT', message: 'Model IR must be an object', severity: 'error' }],
      warnings: [],
    };
  }

  if (!model.name || typeof model.name !== 'string' || model.name.trim().length === 0) {
    errors.push({ path: 'name', code: 'MISSING_NAME', message: 'Model must have a non-empty name', severity: 'error' });
  }

  if (!Array.isArray(model.instances) || model.instances.length === 0) {
    errors.push({
      path: 'instances',
      code: 'EMPTY_INSTANCES',
      message: 'Model must contain at least one instance (Part/MeshPart/etc.)',
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  const seenIds = new Set<string>();
  const seenNames = new Map<string, number>();

  function inspectInstance(inst: RobloxInstanceIR, path: string) {
    if (!inst.id) {
      errors.push({ path: `${path}.id`, code: 'MISSING_ID', message: 'Instance missing id', severity: 'error' });
    } else if (seenIds.has(inst.id)) {
      errors.push({
        path: `${path}.id`,
        code: 'DUPLICATE_ID',
        message: `Duplicate referent ID found: ${inst.id}`,
        severity: 'error',
      });
    } else {
      seenIds.add(inst.id);
    }

    const currentCount = seenNames.get(inst.name) || 0;
    seenNames.set(inst.name, currentCount + 1);

    if (inst.className === 'Part' || inst.className === 'WedgePart' || inst.className === 'MeshPart') {
      const part = inst as RobloxPartIR;

      // Validate size
      if (!part.size || !Array.isArray(part.size) || part.size.length !== 3) {
        errors.push({
          path: `${path}.size`,
          code: 'INVALID_SIZE',
          message: 'Part size must be a 3-element vector [X, Y, Z]',
          severity: 'error',
        });
      } else {
        const [x, y, z] = part.size;
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
          errors.push({
            path: `${path}.size`,
            code: 'NAN_SIZE',
            message: `Size contains NaN or Infinite value: [${x}, ${y}, ${z}]`,
            severity: 'error',
          });
        } else if (x <= 0 || y <= 0 || z <= 0) {
          errors.push({
            path: `${path}.size`,
            code: 'NON_POSITIVE_SIZE',
            message: `Part size must be strictly positive: [${x}, ${y}, ${z}]`,
            severity: 'error',
          });
        } else if (x > 2048 || y > 2048 || z > 2048) {
          warnings.push({
            path: `${path}.size`,
            code: 'LARGE_SIZE',
            message: `Part size exceeds typical Roblox maximum of 2048 studs: [${x}, ${y}, ${z}]`,
            severity: 'warning',
          });
        }
      }

      // Validate position
      if (!part.position || !Array.isArray(part.position) || part.position.length !== 3) {
        errors.push({
          path: `${path}.position`,
          code: 'INVALID_POSITION',
          message: 'Position must be a 3-element vector [X, Y, Z]',
          severity: 'error',
        });
      } else {
        const [x, y, z] = part.position;
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
          errors.push({
            path: `${path}.position`,
            code: 'NAN_POSITION',
            message: `Position contains NaN or Infinite value: [${x}, ${y}, ${z}]`,
            severity: 'error',
          });
        }
      }

      // Validate rotation
      if (!part.rotation || !Array.isArray(part.rotation) || part.rotation.length !== 3) {
        errors.push({
          path: `${path}.rotation`,
          code: 'INVALID_ROTATION',
          message: 'Rotation must be a 3-element vector [rx, ry, rz]',
          severity: 'error',
        });
      } else {
        const [rx, ry, rz] = part.rotation;
        if (!Number.isFinite(rx) || !Number.isFinite(ry) || !Number.isFinite(rz)) {
          errors.push({
            path: `${path}.rotation`,
            code: 'NAN_ROTATION',
            message: `Rotation contains NaN or Infinite value: [${rx}, ${ry}, ${rz}]`,
            severity: 'error',
          });
        }
      }

      // Validate color
      if (!part.color || !Array.isArray(part.color) || part.color.length !== 3) {
        errors.push({
          path: `${path}.color`,
          code: 'INVALID_COLOR',
          message: 'Color must be a 3-element RGB vector',
          severity: 'error',
        });
      }

      // Validate material
      const matResult = RobloxMaterialEnum.safeParse(part.material);
      if (!matResult.success) {
        errors.push({
          path: `${path}.material`,
          code: 'INVALID_MATERIAL',
          message: `Unknown or invalid Roblox material: "${part.material}"`,
          severity: 'error',
        });
      }
    }

    if (inst.className === 'WeldConstraint' || inst.className === 'Motor6D') {
      const joint = inst as any;
      if (!joint.part0 || !joint.part1) {
        errors.push({
          path: `${path}`,
          code: 'BROKEN_JOINT',
          message: `${inst.className} must specify both part0 and part1`,
          severity: 'error',
        });
      }
    }

    // Inspect nested children
    if (inst.children && Array.isArray(inst.children)) {
      inst.children.forEach((child, idx) => {
        inspectInstance(child, `${path}.children[${idx}]`);
      });
    }
  }

  model.instances.forEach((inst, index) => {
    inspectInstance(inst, `instances[${index}]`);
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a Roblox Animation IR
 */
export function validateAnimationIR(anim: RobloxAnimationIR): ValidationResult {
  const parsed = RobloxAnimationSchema.safeParse(anim);
  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        code: i.code,
        message: i.message,
        severity: 'error',
      })),
      warnings: [],
    };
  }

  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // Check keyframe ordering
  let lastTime = -1;
  for (let i = 0; i < anim.keyframes.length; i++) {
    const kf = anim.keyframes[i];
    if (kf.time < lastTime) {
      errors.push({
        path: `keyframes[${i}].time`,
        code: 'OUT_OF_ORDER_KEYFRAME',
        message: `Keyframe timestamp ${kf.time} is earlier than preceding timestamp ${lastTime}`,
        severity: 'error',
      });
    }
    lastTime = kf.time;
    if (kf.time > anim.length) {
      warnings.push({
        path: `keyframes[${i}].time`,
        code: 'TIMESTAMP_EXCEEDS_LENGTH',
        message: `Keyframe timestamp ${kf.time} exceeds animation length ${anim.length}`,
        severity: 'warning',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
