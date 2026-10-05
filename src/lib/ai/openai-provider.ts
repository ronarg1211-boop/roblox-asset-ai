// ============================================================
// Roblox Asset AI - OpenAI Provider
// Supports GPT-4o / GPT-4o-mini with multimodal vision inspection
// ============================================================

import { AIProvider, AssetPlan, VisionInspectionRequest } from './types';
import {
  RobloxModelIR,
  RobloxAnimationIR,
  IterationCritique,
  AssetType,
} from '../types/roblox';
import { ProceduralProvider } from './procedural-provider';

export class OpenAIProvider implements AIProvider {
  public readonly providerName = 'OpenAI GPT-4o (Multimodal)';
  private apiKey: string;
  private fallback: ProceduralProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.fallback = new ProceduralProvider();
  }

  public async planAsset(prompt: string, referenceImage?: string, assetType: AssetType = 'model'): Promise<AssetPlan> {
    if (!this.apiKey) {
      return this.fallback.planAsset(prompt, referenceImage, assetType);
    }

    try {
      const messages: any[] = [
        {
          role: 'system',
          content: 'You are a Roblox 3D Asset Architect. Return valid JSON only with keys: name, assetType, conceptSummary, suggestedParts, colorPalette, boundingSize.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Create an asset plan for: "${prompt}". Asset type: ${assetType}.` },
          ],
        },
      ];

      if (referenceImage) {
        messages[1].content.push({
          type: 'image_url',
          image_url: { url: referenceImage },
        });
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return JSON.parse(content) as AssetPlan;
      }
    } catch (err) {
      console.warn('OpenAI planAsset error, falling back:', err);
    }

    return this.fallback.planAsset(prompt, referenceImage, assetType);
  }

  public async generateModelIR(
    plan: AssetPlan,
    prompt: string,
    referenceImage?: string,
    iteration = 1
  ): Promise<RobloxModelIR> {
    if (!this.apiKey) {
      return this.fallback.generateModelIR(plan, prompt, referenceImage, iteration);
    }

    try {
      const messages: any[] = [
        {
          role: 'system',
          content: `You are the core generator for Roblox Asset AI. Generate a valid Roblox Model Intermediate Representation (IR) JSON strictly following schema: { assetType: "model", name: string, instances: [ { id, name, className: "Part" | "WedgePart", shape, size: [X,Y,Z], position: [X,Y,Z], rotation: [rx,ry,rz], color: [R,G,B], material: "Wood" | "Metal" | "SmoothPlastic" | "Neon" } ] }. Return JSON only.`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Generate Roblox Model IR for: "${prompt}". Plan: ${JSON.stringify(plan)}` },
          ],
        },
      ];

      if (referenceImage) {
        messages[1].content.push({
          type: 'image_url',
          image_url: { url: referenceImage },
        });
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed && Array.isArray(parsed.instances)) {
            parsed.metadata = { prompt, iteration, generator: 'GPT-4o' };
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('OpenAI generateModelIR error, falling back:', err);
    }

    return this.fallback.generateModelIR(plan, prompt, referenceImage, iteration);
  }

  public async generateAnimationIR(
    prompt: string,
    modelIR: RobloxModelIR,
    referenceImage?: string
  ): Promise<RobloxAnimationIR> {
    return this.fallback.generateAnimationIR(prompt, modelIR, referenceImage);
  }

  public async inspectAndCritique(request: VisionInspectionRequest): Promise<IterationCritique> {
    if (!this.apiKey) {
      return this.fallback.inspectAndCritique(request);
    }

    try {
      const { prompt, referenceImage, renderPreviewDataUrl, currentModelIR, iterationIndex } = request;

      const userContent: any[] = [
        {
          type: 'text',
          text: `Iteration ${iterationIndex}. Intended prompt: "${prompt}". Structural Parts: ${JSON.stringify(
            currentModelIR.instances.map((i: any) => ({ name: i.name, size: i.size, pos: i.position, mat: i.material }))
          )}. Inspect the rendered image. Output JSON with summary, qualityScore (0-1), metrics, and items with suggestedAction.`,
        },
        {
          type: 'image_url',
          image_url: { url: renderPreviewDataUrl },
        },
      ];

      if (referenceImage) {
        userContent.push({
          type: 'image_url',
          image_url: { url: referenceImage },
        });
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are a strict 3D Visual Evaluator for Roblox assets. Identify missing parts, wrong proportions, and details. Return JSON.',
            },
            {
              role: 'user',
              content: userContent,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return JSON.parse(content) as IterationCritique;
      }
    } catch (err) {
      console.warn('OpenAI inspectAndCritique error, falling back:', err);
    }

    return this.fallback.inspectAndCritique(request);
  }

  public async applyCritiqueToModel(
    currentModel: RobloxModelIR,
    critique: IterationCritique,
    prompt: string
  ): Promise<RobloxModelIR> {
    return this.fallback.applyCritiqueToModel(currentModel, critique, prompt);
  }

  public async applyCritiqueToAnimation(
    currentAnimation: RobloxAnimationIR,
    critique: IterationCritique,
    prompt: string
  ): Promise<RobloxAnimationIR> {
    return this.fallback.applyCritiqueToAnimation(currentAnimation, critique, prompt);
  }
}
