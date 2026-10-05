// ============================================================
// Roblox Asset AI - Kaggle Dedicated LLM Provider
// Connects to the fine-tuned, specialized Roblox Studio AI running on Kaggle.
// ============================================================

import { AIProvider, AssetPlan, VisionInspectionRequest } from './types';
import {
  RobloxModelIR,
  RobloxAnimationIR,
  IterationCritique,
  AssetType,
} from '../types/roblox';
import { ProceduralProvider } from './procedural-provider';

export class KaggleLLMProvider implements AIProvider {
  public readonly providerName = 'Roblox Asset AI Specialized Model (Kaggle Dedicated LLM)';
  private endpointUrl: string;
  private fallbackProvider: ProceduralProvider;

  constructor(endpointUrl?: string) {
    this.endpointUrl = (endpointUrl || process.env.KAGGLE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
    this.fallbackProvider = new ProceduralProvider();
  }

  public async planAsset(prompt: string, referenceImage?: string, assetType: AssetType = 'model'): Promise<AssetPlan> {
    return this.fallbackProvider.planAsset(prompt, referenceImage, assetType);
  }

  public async generateModelIR(
    plan: AssetPlan,
    prompt: string,
    referenceImage?: string,
    iteration = 1
  ): Promise<RobloxModelIR> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`${this.endpointUrl}/api/generate-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ prompt, iteration, referenceImage }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.modelIR && Array.isArray(data.modelIR.instances) && data.modelIR.instances.length > 0) {
          return {
            ...data.modelIR,
            metadata: {
              ...data.modelIR.metadata,
              generator: 'RobloxAssetAI-KaggleDedicatedLLM-1.5B',
              iteration,
              prompt,
            },
          };
        }
      }
    } catch (err) {
      console.warn(`[KaggleLLMProvider] Could not connect to Kaggle endpoint at ${this.endpointUrl} (${err}). Using built-in domain engine fallback.`);
    }

    return this.fallbackProvider.generateModelIR(plan, prompt, referenceImage, iteration);
  }

  public async generateAnimationIR(
    prompt: string,
    modelIR: RobloxModelIR,
    referenceImage?: string
  ): Promise<RobloxAnimationIR> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`${this.endpointUrl}/api/generate-animation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ prompt, modelIR }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.animationIR && Array.isArray(data.animationIR.keyframes) && data.animationIR.keyframes.length > 0) {
          return data.animationIR;
        }
      }
    } catch (err) {
      console.warn(`[KaggleLLMProvider] Could not connect to Kaggle endpoint at ${this.endpointUrl} (${err}). Using built-in domain engine fallback.`);
    }

    return this.fallbackProvider.generateAnimationIR(prompt, modelIR, referenceImage);
  }

  public async inspectAndCritique(request: VisionInspectionRequest): Promise<IterationCritique> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${this.endpointUrl}/api/critique`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          iterationIndex: request.iterationIndex,
          currentModelIR: request.currentModelIR,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.qualityScore === 'number') {
          return data;
        }
      }
    } catch {
      // Fallback
    }

    return this.fallbackProvider.inspectAndCritique(request);
  }

  public async applyCritiqueToModel(
    currentModel: RobloxModelIR,
    critique: IterationCritique,
    prompt: string
  ): Promise<RobloxModelIR> {
    const nextIteration = (currentModel.metadata?.iteration || 1) + 1;
    const plan = await this.planAsset(prompt);
    return this.generateModelIR(plan, prompt, undefined, nextIteration);
  }

  public async applyCritiqueToAnimation(
    currentAnimation: RobloxAnimationIR,
    critique: IterationCritique,
    prompt: string
  ): Promise<RobloxAnimationIR> {
    return this.fallbackProvider.applyCritiqueToAnimation(currentAnimation, critique, prompt);
  }
}
