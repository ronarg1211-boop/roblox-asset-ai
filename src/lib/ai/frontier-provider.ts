// ============================================================
// Roblox Asset AI - Frontier LLM Thinking Provider
// Dynamic 3D Spatial Reasoning & Synthesis using Frontier 70B Models
// Supports OpenRouter, Groq, Cerebras, DeepInfra, SambaNova, Together, Mistral
// ============================================================

import { AIProvider, AssetPlan, VisionInspectionRequest } from './types';
import {
  RobloxModelIR,
  RobloxAnimationIR,
  IterationCritique,
  AssetType,
  RobloxPartIR,
  RobloxInstanceIR,
} from '../types/roblox';
import { ProceduralProvider } from './procedural-provider';

interface LLMRoute {
  id: string;
  name: string;
  url: string;
  model: string;
  apiKey: string;
  headers?: Record<string, string>;
}

// Global state across requests in the server process
const routeCooldowns = new Map<string, number>();
let globalRouteCursor = 0;

export class FrontierThinkingProvider implements AIProvider {
  public readonly providerName = 'Frontier 70B Thinking Engine';
  private fallback: ProceduralProvider;

  constructor() {
    this.fallback = new ProceduralProvider();
  }

  private getAllKeys(envVarName: string): string[] {
    const raw = process.env[envVarName];
    if (!raw) return [];
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }

  private buildAvailableRoutes(): LLMRoute[] {
    const routes: LLMRoute[] = [];

    // 1. Groq Keys (Multiple keys from GROQ_API_KEYS / GROQ_API_KEY)
    const groqKeys = Array.from(new Set([
      ...this.getAllKeys('GROQ_API_KEYS'),
      ...(process.env.GROQ_API_KEY ? [process.env.GROQ_API_KEY.trim()] : [])
    ]));

    // Distribute Groq keys across Qwen 27B and GPT-OSS 120B
    for (let i = 0; i < groqKeys.length; i++) {
      const k = groqKeys[i];
      routes.push({
        id: `groq_k${i + 1}_qwen`,
        name: `Groq Key #${i + 1} [Qwen-3.8-27B]`,
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'qwen/qwen3.8-27b',
        apiKey: k,
      });
      routes.push({
        id: `groq_k${i + 1}_gpt120b`,
        name: `Groq Key #${i + 1} [GPT-OSS-120B]`,
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'openai/gpt-oss-120b',
        apiKey: k,
      });
    }

    // 2. OpenRouter Keys (Multiple keys from OPENROUTER_API_KEYS)
    const openrouterKeys = Array.from(new Set([
      ...this.getAllKeys('OPENROUTER_API_KEYS'),
      ...(process.env.OPENROUTER_API_KEY ? [process.env.OPENROUTER_API_KEY.trim()] : [])
    ]));

    for (let i = 0; i < openrouterKeys.length; i++) {
      const k = openrouterKeys[i];
      routes.push({
        id: `openrouter_k${i + 1}_llama70b`,
        name: `OpenRouter Key #${i + 1} [Llama-3.3-70B]`,
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'meta-llama/llama-3.3-70b-instruct',
        apiKey: k,
        headers: {
          'HTTP-Referer': 'https://roblox-asset-ai.local',
          'X-Title': 'Roblox Asset AI',
        },
      });
    }

    // 3. Ultra-fast lightweight fallback on Groq
    for (let i = 0; i < groqKeys.length; i++) {
      const k = groqKeys[i];
      routes.push({
        id: `groq_k${i + 1}_gpt20b`,
        name: `Groq Key #${i + 1} [GPT-OSS-20B]`,
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'openai/gpt-oss-20b',
        apiKey: k,
      });
    }

    return routes;
  }

  /**
   * Resiliently executes an LLM call across provider cascade with auto-rotation on 429
   */
  private async executeLLMCascade(
    systemPrompt: string,
    userPrompt: string,
    temperature = 0.3,
    maxTokens = 2500
  ): Promise<any | null> {
    const allRoutes = this.buildAvailableRoutes();
    if (allRoutes.length === 0) return null;

    const now = Date.now();
    // Filter out routes currently in cooldown
    const activeRoutes = allRoutes.filter((r) => {
      const cd = routeCooldowns.get(r.id) || 0;
      return cd <= now;
    });

    const candidateRoutes = activeRoutes.length > 0 ? activeRoutes : allRoutes;

    // Round-robin rotate starting route to distribute token load across keys
    const startIndex = globalRouteCursor % candidateRoutes.length;
    globalRouteCursor = (globalRouteCursor + 1) % candidateRoutes.length;

    const orderedRoutes = [
      ...candidateRoutes.slice(startIndex),
      ...candidateRoutes.slice(0, startIndex),
    ];

    for (const route of orderedRoutes) {
      try {
        console.log(`[FrontierAI] 🔄 Trying route: ${route.name}...`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 35000); // 35s timeout

        const response = await fetch(route.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${route.apiKey}`,
            ...(route.headers || {}),
          },
          body: JSON.stringify({
            model: route.model,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 429) {
            console.warn(`[FrontierAI] ⚠️ Route ${route.name} rate-limited (429). Setting 45s cooldown & rotating to next key...`);
            routeCooldowns.set(route.id, Date.now() + 45000);
          } else if (response.status === 402 || response.status === 401) {
            console.warn(`[FrontierAI] ⚠️ Route ${route.name} quota/auth error (${response.status}). Setting 30m cooldown & rotating...`);
            routeCooldowns.set(route.id, Date.now() + 1800000);
          } else {
            console.warn(`[FrontierAI] Route ${route.name} returned ${response.status}: ${errText.slice(0, 120)}. Rotating...`);
          }
          continue; // Automatically rotate to next route!
        }

        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content;
        if (!rawContent) {
          console.warn(`[FrontierAI] Route ${route.name} returned empty content. Rotating...`);
          continue;
        }

        let clean = rawContent.trim();
        if (clean.includes('```json')) {
          clean = clean.split('```json')[1].split('```')[0].trim();
        } else if (clean.includes('```')) {
          clean = clean.split('```')[1].split('```')[0].trim();
        } else {
          const s = clean.indexOf('{');
          const e = clean.lastIndexOf('}');
          if (s !== -1 && e !== -1 && e > s) {
            clean = clean.slice(s, e + 1);
          }
        }

        const parsed = JSON.parse(clean);
        console.log(`[FrontierAI] ✅ Successfully generated using ${route.name}`);
        // Clear any cooldown on this successful route
        routeCooldowns.delete(route.id);
        return parsed;
      } catch (err: any) {
        console.warn(`[FrontierAI] Route ${route.name} error (${err.message || err}). Rotating to next route...`);
        routeCooldowns.set(route.id, Date.now() + 20000);
      }
    }

    console.warn('[FrontierAI] All available LLM routes exhausted. Falling back to domain synthesis.');
    return null;
  }

  public async planAsset(
    prompt: string,
    referenceImage?: string,
    assetType: AssetType = 'model'
  ): Promise<AssetPlan> {
    const systemPrompt = `You are an expert Roblox 3D Architect.
Analyze the user's prompt and formulate an architectural plan for a 3D Roblox Studio asset.
Output valid JSON only with keys:
- name: string (concise PascalCase model name matching the prompt)
- assetType: "${assetType}"
- conceptSummary: string (visual description of what will be built)
- suggestedParts: array of { name: string, role: string, shape: "Block"|"Ball"|"Cylinder"|"Wedge", material: string, colorHint: string, relativePosition: string }
- colorPalette: array of { role: string, rgb: [number, number, number] }
- boundingSize: [number, number, number] (overall dimensions in studs)`;

    const userPrompt = `Asset Request: "${prompt}"\nAsset Type: ${assetType}`;

    const plan = await this.executeLLMCascade(systemPrompt, userPrompt, 0.2, 1000);
    if (plan && plan.name && Array.isArray(plan.suggestedParts)) {
      return plan as AssetPlan;
    }

    return this.fallback.planAsset(prompt, referenceImage, assetType);
  }

  public async generateModelIR(
    plan: AssetPlan,
    prompt: string,
    referenceImage?: string,
    iteration = 1
  ): Promise<RobloxModelIR> {
    const systemPrompt = `You are Roblox Asset AI, the premier neural 3D modeling engine for Roblox Studio.
You do NOT use pre-baked templates. You deeply reason about the user's instructions and construct a genuine 3D model composed of Roblox primitive parts.

COORDINATE RULES & PROPORTIONS:
- Units are in Roblox studs.
- Y is UP (Y=0 is floor/base).
- X is horizontal lateral (-X left, +X right).
- Z is depth (-Z backward, +Z forward).
- Humanoid / Character proportions (R6 standard):
  * Torso: [2, 2, 1] studs at Y=3.0
  * Head: [1.2, 1.2, 1.2] studs at Y=4.6
  * Arms: [1, 2, 1] studs at X=±1.5, Y=3.0. For zombies: pitch forward 90 deg!
  * Legs: [1, 2, 1] studs at X=±0.5, Y=1.0
  * Add custom clothing, handheld items, accessories, hair, facial features, or decor matching the user prompt.
- For props, weapons, vehicles, architecture: construct detailed compound structures with 8 to 25 distinct parts.

PART SCHEMA:
Each item in "instances" MUST be an object with:
- "id": string (unique, e.g. "head", "torso", "acc_1")
- "name": string (PascalCase, e.g. "Head", "LeftArm", "Briefcase")
- "className": "Part" or "WedgePart"
- "shape": "Block", "Ball", "Cylinder", or "Wedge"
- "size": [width, height, depth] (all numbers > 0)
- "position": [x, y, z] (stud coordinates)
- "rotation": [pitch, yaw, roll] (degrees)
- "color": [r, g, b] (integers 0-255)
- "material": valid Roblox material string ("SmoothPlastic", "Neon", "Fabric", "Metal", "WoodPlanks", "Wood", "Cobblestone", "Glass", "Brick", "DiamondPlate", "Granite", "Slate")
- "anchored": true
- "canCollide": true

OUTPUT SCHEMA:
{
  "assetType": "model",
  "name": "DescriptiveModelName",
  "primaryPartId": "id_of_root_or_torso_part",
  "instances": [ ...parts... ]
}
Return JSON ONLY. No markdown explanations.`;

    let userPrompt = `User Prompt: "${prompt}"\nIteration: ${iteration}\nConstruct a complete, highly detailed 3D Roblox model matching this exact request.`;

    if (iteration > 1 && plan) {
      userPrompt += `\nCritique and Refinement: Add supplementary accent parts, enhance micro-details, improve material contrast, and fix any misalignment from earlier passes.`;
    }

    const result = await this.executeLLMCascade(systemPrompt, userPrompt, 0.35, 3500);

    if (result && Array.isArray(result.instances) && result.instances.length > 0) {
      const sanitized = this.sanitizeModel(result, prompt, iteration);
      return sanitized;
    }

    // Fallback to domain knowledge if cascade was unreachable
    return this.fallback.generateModelIR(plan, prompt, referenceImage, iteration);
  }

  public async generateAnimationIR(
    prompt: string,
    modelIR: RobloxModelIR,
    referenceImage?: string
  ): Promise<RobloxAnimationIR> {
    const systemPrompt = `You are Roblox Asset AI Animation Engine.
Synthesize a fluid, stylized keyframe animation sequence for Roblox Studio matching the user's prompt.
Target rig bones: "Head", "Torso", "LeftArm", "RightArm", "LeftLeg", "RightLeg".

OUTPUT JSON SCHEMA:
{
  "assetType": "animation",
  "name": "AnimationName",
  "length": 1.6,
  "loop": true,
  "priority": "Movement" or "Action",
  "fps": 30,
  "keyframes": [
    {
      "time": 0.0,
      "name": "Pose0",
      "poses": [
        { "boneName": "LeftArm", "position": [0,0,0], "rotation": [rx,ry,rz], "easingStyle": "Sine", "easingDirection": "InOut" }
      ]
    }
  ]
}
Return valid JSON only.`;

    const userPrompt = `Generate a Roblox animation sequence for: "${prompt}".`;
    const anim = await this.executeLLMCascade(systemPrompt, userPrompt, 0.3, 2000);

    if (anim && Array.isArray(anim.keyframes) && anim.keyframes.length >= 2) {
      return {
        assetType: 'animation',
        name: anim.name || 'CustomMotion',
        length: typeof anim.length === 'number' ? anim.length : 1.6,
        loop: anim.loop ?? true,
        priority: anim.priority || 'Action',
        fps: anim.fps || 30,
        keyframes: anim.keyframes,
        metadata: {
          prompt,
          generator: this.providerName,
        },
      };
    }

    return this.fallback.generateAnimationIR(prompt, modelIR, referenceImage);
  }

  public async inspectAndCritique(request: VisionInspectionRequest): Promise<IterationCritique> {
    const { prompt, currentModelIR, iterationIndex } = request;

    const systemPrompt = `You are Roblox Asset AI's Vision Critic and Quality Evaluator.
Evaluate the current Roblox 3D Model candidate against the user's prompt.
Calculate realistic quality metrics (0 to 1) and identify actionable flaws or opportunities for refinement.

OUTPUT JSON SCHEMA:
{
  "summary": "Brief 1-sentence evaluation critique",
  "qualityScore": 0.89,
  "metrics": {
    "proportions": 0.90,
    "geometry": 0.88,
    "materialsAndColors": 0.92,
    "structuralIntegrity": 0.89
  },
  "items": [
    {
      "category": "detail",
      "severity": "minor",
      "description": "Concrete critique description",
      "suggestedAction": "ADD_PART" or "ADJUST_TRANSFORM" or "TWEAK_COLOR" or "CHANGE_MATERIAL",
      "targetPartId": "optional_part_id"
    }
  ]
}
Return JSON only.`;

    const userPrompt = `Prompt: "${prompt}"\nIteration: ${iterationIndex}\nCurrent Model Parts: ${JSON.stringify(
      currentModelIR.instances.map((i: any) => ({ name: i.name, shape: i.shape, size: i.size, pos: i.position, mat: i.material }))
    )}`;

    const critique = await this.executeLLMCascade(systemPrompt, userPrompt, 0.2, 1200);

    if (critique && typeof critique.qualityScore === 'number' && critique.metrics) {
      return {
        summary: critique.summary || 'Vision evaluation completed.',
        qualityScore: Math.min(0.98, Math.max(0.65, critique.qualityScore)),
        metrics: {
          proportions: Number(critique.metrics.proportions) || 0.88,
          geometry: Number(critique.metrics.geometry) || 0.88,
          colorMaterial: Number(critique.metrics.colorMaterial || critique.metrics.materialsAndColors) || 0.9,
          structure: Number(critique.metrics.structure || critique.metrics.structuralIntegrity) || 0.9,
          promptAdherence: Number(critique.metrics.promptAdherence) || 0.92,
          overall: Math.min(0.98, Math.max(0.65, Number(critique.qualityScore) || 0.89)),
        },
        items: Array.isArray(critique.items) ? critique.items : [],
      };
    }

    return this.fallback.inspectAndCritique(request);
  }

  /**
   * Sanitizes, repairs, and enforces constraints on LLM-generated Model IR
   */
  private sanitizeModel(raw: any, prompt: string, iteration: number): RobloxModelIR {
    const validShapes = ['Block', 'Ball', 'Cylinder', 'Wedge'];
    const validMaterials = [
      'SmoothPlastic',
      'Neon',
      'Fabric',
      'Metal',
      'WoodPlanks',
      'Wood',
      'Cobblestone',
      'Glass',
      'Brick',
      'DiamondPlate',
      'Granite',
      'Slate',
      'CorrodedMetal',
    ];

    const instances: RobloxInstanceIR[] = [];
    const usedIds = new Set<string>();

    for (let idx = 0; idx < (raw.instances || []).length; idx++) {
      const p = raw.instances[idx];
      let id = p.id ? String(p.id) : `p_${idx}`;
      while (usedIds.has(id)) {
        id = `${id}_${Math.floor(Math.random() * 100)}`;
      }
      usedIds.add(id);

      const shape = validShapes.includes(p.shape) ? p.shape : 'Block';
      const className = shape === 'Wedge' || p.className === 'WedgePart' ? 'WedgePart' : 'Part';
      const material = validMaterials.includes(p.material) ? p.material : 'SmoothPlastic';

      const size: [number, number, number] = Array.isArray(p.size) && p.size.length >= 3
        ? [Math.max(0.1, Number(p.size[0]) || 1), Math.max(0.1, Number(p.size[1]) || 1), Math.max(0.1, Number(p.size[2]) || 1)]
        : [1, 1, 1];

      const position: [number, number, number] = Array.isArray(p.position) && p.position.length >= 3
        ? [Number(p.position[0]) || 0, Number(p.position[1]) || 0, Number(p.position[2]) || 0]
        : [0, idx * 1.5, 0];

      const rotation: [number, number, number] = Array.isArray(p.rotation) && p.rotation.length >= 3
        ? [Number(p.rotation[0]) || 0, Number(p.rotation[1]) || 0, Number(p.rotation[2]) || 0]
        : [0, 0, 0];

      const color: [number, number, number] = Array.isArray(p.color) && p.color.length >= 3
        ? [
            Math.min(255, Math.max(0, Math.round(Number(p.color[0]) || 120))),
            Math.min(255, Math.max(0, Math.round(Number(p.color[1]) || 120))),
            Math.min(255, Math.max(0, Math.round(Number(p.color[2]) || 120))),
          ]
        : [120, 130, 140];

      const part: RobloxPartIR = {
        id,
        name: p.name ? String(p.name).replace(/[^a-zA-Z0-9_]/g, '') : `Part_${idx}`,
        className,
        shape,
        size,
        position,
        rotation,
        color,
        material: material as any,
        anchored: true,
        canCollide: p.canCollide ?? true,
      };

      instances.push(part);
    }

    const primaryPartId = raw.primaryPartId && usedIds.has(raw.primaryPartId)
      ? raw.primaryPartId
      : instances[0]?.id || 'root_part';

    return {
      assetType: 'model',
      name: raw.name ? String(raw.name).replace(/[^a-zA-Z0-9_]/g, '') : 'GeneratedRobloxAsset',
      primaryPartId,
      instances,
      metadata: {
        prompt,
        iteration,
        generator: this.providerName,
      },
    };
  }

  public async applyCritiqueToModel(
    currentModel: RobloxModelIR,
    critique: IterationCritique,
    prompt: string
  ): Promise<RobloxModelIR> {
    const systemPrompt = `You are Roblox Asset AI's 3D Refiner.
Enhance and modify the given Roblox Model IR based on the visual critique.
Add detailed accent parts, improve alignment, enhance color contrast, or fix flaws mentioned in the critique.
Output valid JSON only matching schema:
{
  "assetType": "model",
  "name": "ModelName",
  "primaryPartId": "id",
  "instances": [ ...updated parts... ]
}`;

    const userPrompt = `User Prompt: "${prompt}"\nCurrent Model IR: ${JSON.stringify(currentModel)}\nCritique Summary: "${critique.summary}"\nCritique Items: ${JSON.stringify(critique.items)}\nProduce the improved Roblox Model IR.`;

    const refined = await this.executeLLMCascade(systemPrompt, userPrompt, 0.35, 3500);
    if (refined && Array.isArray(refined.instances) && refined.instances.length > 0) {
      return this.sanitizeModel(refined, prompt, 2);
    }

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
