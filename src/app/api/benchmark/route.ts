// ============================================================
// GET & POST /api/benchmark
// Runs RobloxAssetBench and returns comparative model versions
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { runRobloxAssetBench } from '@/lib/benchmark/benchmark-suite';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const version = searchParams.get('version') || 'v0.3-SelfImproving';
    const quick = searchParams.get('quick') === 'true';

    // Quick runs 4 tests for fast UI feedback, full runs all 12
    const scorecard = await runRobloxAssetBench(version, quick ? 4 : undefined);
    return NextResponse.json(scorecard);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error running benchmark' },
      { status: 500 }
    );
  }
}
