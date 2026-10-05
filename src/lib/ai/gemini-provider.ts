// ============================================================
// Roblox Asset AI - Google Gemini Multimodal Provider
// Supports Gemini 2.0 / 1.5 Flash with native vision inspection
// ============================================================

import { AIProvider, AssetPlan, VisionInspectionRequest } from './types';
import {
  RobloxModelIR,
  RobloxAnimationIR,
  IterationCritique,
  AssetType,
} from '../types/roblox';
import { ProceduralProvider } from './procedural-provider';

export class GeminiProvider implements AIProvider {
  public readonly providerName = 'Google Gemini 2.0 Flash (Multimodal)';
  private apiKey: string;
  private fallback: ProceduralProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.fallback = new ProceduralProvider();
  }

  public async planAsset(prompt: string, referenceImage?: string, assetType: AssetType = 'model'): Promise<AssetPlan> {
    if (!this.apiKey) {
      return this.fallback.planAsset(prompt, referenceImage, assetType);
    }

    try {
      const systemInstruction = `You are a Roblox 3D Asset Architect. Given a user description and optional reference image, produce a structured design plan JSON for a Roblox model or animation. Return valid JSON only with keys: name, assetType, conceptSummary, suggestedParts, colorPalette, boundingSize.`;

      const parts: any[] = [{ text: `Create an asset plan for: "${prompt}". Asset type: ${assetType}.` }];

      if (referenceImage && referenceImage.startsWith('data:image/')) {
        const [meta, b64] = referenceImage.split(',');
        const mimeType = meta.split(':')[1]?.split(';')[0] || 'image/png';
        parts.push({
          inlineData: {
            mimeType,
            data: b64,
          },
        });
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!res.ok) {
        console.warn(`Gemini API returned ${res.status}, falling back to procedural engine`);
        return this.fallback.planAsset(prompt, referenceImage, assetType);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return JSON.parse(text) as AssetPlan;
      }
    } catch (err) {
      console.warn('Gemini planAsset error, using fallback:', err);
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
      const systemInstruction = `You are the core generator for Roblox Asset AI. Generate a valid Roblox Model Intermediate Representation (IR) JSON strictly following this schema:
{
  "assetType": "model",
  "name": "AssetModelName",
  "instances": [
    {
      "id": "part_1",
      "name": "PartName",
      "className": "Part",
      "shape": "Block" | "Cylinder" | "Ball" | "Wedge",
      "size": [X, Y, Z],
      "position": [X, Y, Z],
      "rotation": [rx, ry, rz],
      "color": [R, G, B] (0-255),
      "material": "Wood" | "Metal" | "SmoothPlastic" | "Neon" | "Grass" | "DiamondPlate" | "Fabric",
      "anchored": true,
      "canCollide": true
    }
  ]
}
Make sure all coordinates and dimensions are positive finite numbers. Return valid JSON only.`;

      const parts: any[] = [{ text: `Generate Roblox Model IR for: "${prompt}". Plan: ${JSON.stringify(plan)}` }];
      if (referenceImage && referenceImage.startsWith('data:image/')) {
        const [meta, b64] = referenceImage.split(',');
        const mimeType = meta.split(':')[1]?.split(';')[0] || 'image/png';
        parts.push({ inlineData: { mimeType, data: b64 } });
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed && Array.isArray(parsed.instances)) {
            parsed.metadata = { prompt, iteration, generator: 'Gemini-1.5-Flash' };
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Gemini generateModelIR error, using fallback:', err);
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

      const systemInstruction = `You are a strict 3D Visual Evaluator for Roblox assets. You receive:
1. The user's intended prompt description.
2. (Optional) The user's reference image.
3. The rendered 3D preview image of the current generation.
4. The structural scene graph of instances/parts.

Identify:
- Missing parts
- Incorrect proportions
- Incorrect shape
- Incorrect colors/materials
- Incorrect orientation
- Missing details

Output a JSON object with:
{
  "summary": "...",
  "qualityScore": 0.0 - 1.0,
  "metrics": { "proportions": 0-1, "geometry": 0-1, "colorMaterial": 0-1, "structure": 0-1, "promptAdherence": 0-1, "overall": 0-1 },
  "items": [
    { "id": "1", "category": "missing_part" | "incorrect_proportions" | "incorrect_shape" | "incorrect_color_material" | "missing_details", "severity": "high" | "medium" | "low", "description": "...", "suggestedAction": "ADD_PART" | "RESCALE" | "RETEXTURE" }
  ]
}`;

      const parts: any[] = [
        {
          text: `Iteration ${iterationIndex}. Prompt: "${prompt}". Structural Parts: ${JSON.stringify(
            currentModelIR.instances.map((i: any) => ({ name: i.name, size: i.size, pos: i.position, mat: i.material }))
          )}`,
        },
      ];

      // Attach Rendered Preview Image
      if (renderPreviewDataUrl && renderPreviewDataUrl.startsWith('data:image/')) {
        const [meta, b64] = renderPreviewDataUrl.split(',');
        const mimeType = meta.split(':')[1]?.split(';')[0] || 'image/png';
        parts.push({
          inlineData: {
            mimeType,
            data: b64,
          },
        });
      }

      // Attach User Reference Image if supplied
      if (referenceImage && referenceImage.startsWith('data:image/')) {
        const [meta, b64] = referenceImage.split(',');
        const mimeType = meta.split(':')[1]?.split(';')[0] || 'image/png';
        parts.push({
          inlineData: {
            mimeType,
            data: b64,
          },
        });
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text) as IterationCritique;
        }
      }
    } catch (err) {
      console.warn('Gemini vision critique error, using fallback:', err);
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
