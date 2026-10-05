// ============================================================
// Roblox Asset AI - Self-Improvement Loop Orchestrator
// Executes the iterative generation, visual inspection, critique,
// and modification pipeline until the quality threshold is satisfied.
// ============================================================

import {
  RobloxModelIR,
  RobloxAnimationIR,
  IterationRecord,
  GenerationRequest,
  GenerationResponse,
  AssetType,
} from '../types/roblox';
import { getAIProvider } from '../ai/provider-factory';
import { ServerPreviewRenderer } from '../renderer/server-preview';
import { validateModelIR, validateAnimationIR } from '../schema/validation';
import { RbxmxExporter } from '../roblox/rbxmx-exporter';
import { validateRbxmxXml } from '../roblox/validator';

export class SelfImprovementOrchestrator {
  private renderer: ServerPreviewRenderer;
  private exporter: RbxmxExporter;

  constructor() {
    this.renderer = new ServerPreviewRenderer();
    this.exporter = new RbxmxExporter();
  }

  /**
   * Executes the full iterative generation and self-correction loop
   */
  public async executePipeline(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();
    const maxIterations = Math.min(5, Math.max(1, request.maxIterations || 3));
    const targetThreshold = request.qualityThreshold || 0.88;
    const provider = getAIProvider(request.provider);

    const iterations: IterationRecord[] = [];

    // Step 1: Formulate Asset Plan
    const plan = await provider.planAsset(request.prompt, request.referenceImage, request.assetType);

    // Step 2: Generate Initial Candidate (Iteration 1)
    let currentModel: RobloxModelIR = await provider.generateModelIR(
      plan,
      request.prompt,
      request.referenceImage,
      1
    );

    // Generate animation if requested
    let currentAnimation: RobloxAnimationIR | undefined = undefined;
    if (request.assetType === 'animation' || request.assetType === 'model_with_animation') {
      currentAnimation = await provider.generateAnimationIR(
        request.prompt,
        currentModel,
        request.referenceImage
      );
    }

    // Step 3: Iteration Loop
    let currentQualityScore = 0;

    for (let iter = 1; iter <= maxIterations; iter++) {
      const iterStart = Date.now();

      // Validate schema and hierarchy integrity
      const modelVal = validateModelIR(currentModel);
      if (!modelVal.valid) {
        console.warn(`Model validation issues at iteration ${iter}:`, modelVal.errors);
      }

      // Render 3D visual preview screenshot
      const previewDataUrl = this.renderer.renderToDataUrl(currentModel);

      // Send rendered image + structural scene graph to Vision Evaluator
      const critique = await provider.inspectAndCritique({
        prompt: request.prompt,
        referenceImage: request.referenceImage,
        renderPreviewDataUrl: previewDataUrl,
        currentModelIR: currentModel,
        currentAnimationIR: currentAnimation,
        iterationIndex: iter,
      });

      currentQualityScore = critique.qualityScore;

      const appliedMods: string[] = critique.items.map(
        (item) => `[${item.suggestedAction}] ${item.description}`
      );

      // Record this iteration attempt
      iterations.push({
        iterationNumber: iter,
        modelIR: JSON.parse(JSON.stringify(currentModel)),
        animationIR: currentAnimation ? JSON.parse(JSON.stringify(currentAnimation)) : undefined,
        renderPreviewDataUrl: previewDataUrl,
        critique,
        appliedModifications: appliedMods,
        durationMs: Date.now() - iterStart,
        timestamp: new Date().toISOString(),
      });

      // Stop if quality threshold achieved or reached max iterations
      if (currentQualityScore >= targetThreshold || iter === maxIterations) {
        break;
      }

      // Apply modifications for next iteration
      currentModel = await provider.applyCritiqueToModel(currentModel, critique, request.prompt);

      if (currentAnimation) {
        currentAnimation = await provider.applyCritiqueToAnimation(
          currentAnimation,
          critique,
          request.prompt
        );
      }
    }

    // Step 4: Final Validation of the finished asset
    const finalModelValidation = validateModelIR(currentModel);
    if (!finalModelValidation.valid) {
      console.warn('Final Model IR has validation warnings:', finalModelValidation.errors);
    }

    // Verify rbxmx export XML integrity
    const rbxmxXml = this.exporter.exportModel(currentModel);
    const exportValidation = validateRbxmxXml(rbxmxXml);
    if (!exportValidation.valid) {
      console.error('Final exported .rbxmx validation failed:', exportValidation.errors);
    }

    return {
      success: true,
      assetType: request.assetType,
      finalModelIR: currentModel,
      finalAnimationIR: currentAnimation,
      iterations,
      finalQualityScore: currentQualityScore,
      totalTimeMs: Date.now() - startTime,
    };
  }
}
