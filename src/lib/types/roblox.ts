// ============================================================
// Roblox Asset AI - Core Intermediate Representation (IR) Types
// ============================================================

export type RobloxMaterial =
  | 'Plastic'
  | 'SmoothPlastic'
  | 'Neon'
  | 'Wood'
  | 'WoodPlanks'
  | 'Metal'
  | 'CorrodedMetal'
  | 'DiamondPlate'
  | 'Foil'
  | 'Grass'
  | 'Ice'
  | 'Brick'
  | 'Sand'
  | 'Fabric'
  | 'Granite'
  | 'Glass'
  | 'Pebble'
  | 'Cobblestone'
  | 'Slate'
  | 'Marble'
  | 'Concrete'
  | 'ForceField';

export type RobloxShape = 'Block' | 'Cylinder' | 'Ball' | 'Wedge';

export type RobloxClassName =
  | 'Model'
  | 'Folder'
  | 'Part'
  | 'WedgePart'
  | 'MeshPart'
  | 'TrussPart'
  | 'SpawnLocation'
  | 'Attachment'
  | 'WeldConstraint'
  | 'Motor6D'
  | 'Humanoid'
  | 'Seat'
  | 'VehicleSeat'
  | 'SpecialMesh'
  | 'KeyframeSequence'
  | 'Keyframe'
  | 'Pose';

export interface RobloxBaseInstance {
  id: string;
  name: string;
  className: RobloxClassName;
  children?: RobloxInstanceIR[];
}

export interface RobloxPartIR extends RobloxBaseInstance {
  className: 'Part' | 'WedgePart' | 'MeshPart' | 'TrussPart' | 'SpawnLocation';
  shape?: RobloxShape;
  size: [number, number, number]; // [X, Y, Z] in studs
  position: [number, number, number]; // [X, Y, Z] in world/model space
  rotation: [number, number, number]; // [Pitch, Yaw, Roll] in degrees
  color: [number, number, number]; // RGB values [0..255] or [0..1]
  material: RobloxMaterial;
  transparency?: number; // 0.0 (opaque) to 1.0 (invisible)
  reflectance?: number; // 0.0 to 1.0
  anchored?: boolean;
  canCollide?: boolean;
}

export interface RobloxAttachmentIR extends RobloxBaseInstance {
  className: 'Attachment';
  position: [number, number, number];
  rotation?: [number, number, number];
}

export interface RobloxWeldConstraintIR extends RobloxBaseInstance {
  className: 'WeldConstraint';
  part0: string; // Part Name or Part ID
  part1: string; // Part Name or Part ID
}

export interface RobloxMotor6DIR extends RobloxBaseInstance {
  className: 'Motor6D';
  part0: string;
  part1: string;
  c0?: number[]; // CFrame 12-element or [x,y,z, rx,ry,rz]
  c1?: number[];
}

export interface RobloxHumanoidIR extends RobloxBaseInstance {
  className: 'Humanoid';
  health?: number;
  maxHealth?: number;
  rigType?: 0 | 1; // 0 = R6, 1 = R15
}

export interface RobloxSeatIR extends RobloxBaseInstance {
  className: 'Seat' | 'VehicleSeat';
  shape?: RobloxShape;
  size: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  color?: [number, number, number];
  material?: RobloxMaterial;
  anchored?: boolean;
  canCollide?: boolean;
}

export interface RobloxFolderIR extends RobloxBaseInstance {
  className: 'Folder';
}

export type RobloxInstanceIR =
  | RobloxPartIR
  | RobloxAttachmentIR
  | RobloxWeldConstraintIR
  | RobloxMotor6DIR
  | RobloxHumanoidIR
  | RobloxSeatIR
  | RobloxFolderIR
  | RobloxModelChildIR;

export interface RobloxModelChildIR extends RobloxBaseInstance {
  className: 'Model';
  primaryPartId?: string;
}

export interface RobloxModelIR {
  assetType: 'model' | 'model_with_animation';
  name: string;
  primaryPartId?: string;
  instances: RobloxInstanceIR[];
  metadata?: {
    prompt?: string;
    referenceImageHash?: string;
    author?: string;
    createdAt?: string;
    iteration?: number;
    generator?: string;
    qualityScore?: number;
  };
}

export type AnimationPriority = 'Idle' | 'Movement' | 'Action' | 'Action2' | 'Action3' | 'Action4';
export type EasingStyle = 'Linear' | 'Sine' | 'Back' | 'Quad' | 'Bounce' | 'Elastic' | 'Cubic';
export type EasingDirection = 'In' | 'Out' | 'InOut';

export interface PoseIR {
  boneName: string; // Target Part/Bone Name
  position?: [number, number, number]; // Relative translation offset
  rotation?: [number, number, number]; // Rotation angles [rx, ry, rz] in degrees
  easingStyle?: EasingStyle;
  easingDirection?: EasingDirection;
}

export interface KeyframeIR {
  time: number; // In seconds (e.g. 0.0, 0.25, 0.5)
  name?: string;
  poses: PoseIR[];
}

export type RobloxKeyframeIR = KeyframeIR;
export type RobloxPoseIR = PoseIR;

export interface RobloxAnimationIR {
  assetType: 'animation';
  name: string;
  length: number; // Duration in seconds
  loop: boolean;
  priority: AnimationPriority;
  fps?: number; // Default 30 or 60
  keyframes: KeyframeIR[];
  metadata?: {
    prompt?: string;
    createdAt?: string;
    iteration?: number;
    generator?: string;
    author?: string;
    qualityScore?: number;
  };
}

export type AssetType = 'model' | 'animation' | 'model_with_animation';

// ============================================================
// Critique & Self-Improvement Types
// ============================================================

export type CritiqueCategory =
  | 'missing_part'
  | 'incorrect_proportions'
  | 'incorrect_shape'
  | 'incorrect_color_material'
  | 'incorrect_orientation'
  | 'missing_details'
  | 'poor_composition'
  | 'animation_timing'
  | 'structural_integrity';

export type ModificationAction =
  | 'ADD_PART'
  | 'MODIFY_PART'
  | 'DELETE_PART'
  | 'RETEXTURE'
  | 'RESCALE'
  | 'REPOSITION'
  | 'ADD_WELD'
  | 'ADJUST_KEYFRAME'
  | 'SUBDIVIDE_DETAIL';

export interface CritiqueItem {
  id: string;
  category: CritiqueCategory;
  severity: 'high' | 'medium' | 'low';
  description: string;
  targetPartName?: string;
  suggestedAction: ModificationAction;
  suggestedParams?: Record<string, any>;
}

export interface QualityMetrics {
  proportions: number; // 0.0 - 1.0
  geometry: number;
  colorMaterial: number;
  structure: number;
  promptAdherence: number;
  overall: number;
}

export interface IterationCritique {
  summary: string;
  items: CritiqueItem[];
  qualityScore: number; // 0.0 - 1.0
  metrics: QualityMetrics;
}

export interface IterationRecord {
  iterationNumber: number;
  modelIR: RobloxModelIR;
  animationIR?: RobloxAnimationIR;
  renderPreviewDataUrl: string;
  critique: IterationCritique;
  appliedModifications: string[];
  durationMs: number;
  timestamp: string;
}

export interface GenerationRequest {
  prompt: string;
  referenceImage?: string; // base64 data URL
  assetType: AssetType;
  maxIterations?: number;
  qualityThreshold?: number;
  stylePreset?: 'low-poly' | 'stylized' | 'modular' | 'detailed';
  provider?: 'mock' | 'gemini' | 'openai' | 'anthropic' | 'kaggle' | 'frontier' | string;
}

export interface GenerationResponse {
  success: boolean;
  assetType: AssetType;
  finalModelIR: RobloxModelIR;
  finalAnimationIR?: RobloxAnimationIR;
  iterations: IterationRecord[];
  finalQualityScore: number;
  rbxmxExportUrl?: string;
  rbxmExportUrl?: string;
  totalTimeMs: number;
  error?: string;
}
