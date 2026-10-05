// ============================================================
// POST /api/generate
// Orchestrates the Roblox Asset AI Self-Improvement Loop
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { SelfImprovementOrchestrator } from '@/lib/orchestrator/self-improvement-loop';
import { GenerationRequest } from '@/lib/types/roblox';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerationRequest;

    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Safe limit on prompt length
    if (body.prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt exceeds maximum length of 2000 characters' },
        { status: 400 }
      );
    }

    // Safe limit on base64 image size
    if (body.referenceImage && body.referenceImage.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Reference image size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const orchestrator = new SelfImprovementOrchestrator();
    const result = await orchestrator.executePipeline({
      prompt: body.prompt.trim(),
      referenceImage: body.referenceImage,
      assetType: body.assetType || 'model',
      maxIterations: body.maxIterations || 3,
      qualityThreshold: body.qualityThreshold || 0.88,
      stylePreset: body.stylePreset || 'stylized',
      provider: body.provider,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during asset generation' },
      { status: 500 }
    );
  }
}
