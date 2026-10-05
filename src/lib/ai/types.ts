// ============================================================
// Roblox Asset AI - Model Provider Abstraction Interfaces
// ============================================================

import {
  RobloxModelIR,
  RobloxAnimationIR,
  CritiqueItem,
  QualityMetrics,
  IterationCritique,
  AssetType,
} from '../types/roblox';

export interface AssetPlan {
  name: string;
  assetType: AssetType;
  conceptSummary: string;
  suggestedParts: {
    name: string;
    role: string;
    shape: string;
    material: string;
    colorHint: string;
    relativePosition: string;
  }[];
  colorPalette: { role: string; rgb: [number, number, number] }[];
  boundingSize: [number, number, number];
}

export interface VisionInspectionRequest {
  prompt: string;
  referenceImage?: string; // base64
  renderPreviewDataUrl: string; // rendered 3D preview
  currentModelIR: RobloxModelIR;
  currentAnimationIR?: RobloxAnimationIR;
  iterationIndex: number;
}

export interface AIProvider {
  readonly providerName: string;

  /**
   * Generates a high-level asset structural plan
   */
  planAsset(prompt: string, referenceImage?: string, assetType?: AssetType): Promise<AssetPlan>;

  /**
   * Generates an initial candidate Roblox Model IR
   */
  generateModelIR(
    plan: AssetPlan,
    prompt: string,
    referenceImage?: string,
    iteration?: number
  ): Promise<RobloxModelIR>;

  /**
   * Generates an initial candidate Roblox Animation IR
   */
  generateAnimationIR(
    prompt: string,
    modelIR: RobloxModelIR,
    referenceImage?: string
  ): Promise<RobloxAnimationIR>;

  /**
   * Visually inspects the rendered image + structural scene graph
   * and identifies mistakes, missing details, incorrect proportions, etc.
   */
  inspectAndCritique(request: VisionInspectionRequest): Promise<IterationCritique>;

  /**
   * Applies the critique to modify and improve the Model IR
   */
  applyCritiqueToModel(
    currentModel: RobloxModelIR,
    critique: IterationCritique,
    prompt: string
  ): Promise<RobloxModelIR>;

  /**
   * Applies the critique to modify and improve the Animation IR
   */
  applyCritiqueToAnimation(
    currentAnimation: RobloxAnimationIR,
    critique: IterationCritique,
    prompt: string
  ): Promise<RobloxAnimationIR>;
}
