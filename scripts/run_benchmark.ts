#!/usr/bin/env node
/**
 * Roblox Asset AI - CLI Benchmark Runner
 * Runs RobloxAssetBench across test categories and outputs formatted scorecard
 */

import { runRobloxAssetBench } from '../src/lib/benchmark/benchmark-suite';

async function main() {
  console.log('===============================================================');
  console.log('            ROBLOX ASSET AI - ROBLOXASSETBENCH v0.3             ');
  console.log('===============================================================');
  console.log('Running automated benchmark across 12 categories...');

  const startTime = Date.now();
  const scorecard = await runRobloxAssetBench('v0.3-SelfImproving');
  const elapsed = Date.now() - startTime;

  console.log('\n--- BENCHMARK RESULTS ---');
  console.log(`Model Version:             ${scorecard.modelVersion}`);
  console.log(`Overall Benchmark Score:   ${Math.round(scorecard.overallScore * 100)}%`);
  console.log(`Model Generation Score:    ${Math.round(scorecard.modelGenerationScore * 100)}%`);
  console.log(`Image Reconstruction Score:${Math.round(scorecard.imageReconstructionScore * 100)}%`);
  console.log(`Animation Accuracy Score:  ${Math.round(scorecard.animationScore * 100)}%`);
  console.log(`Self-Correction Success:   ${Math.round(scorecard.selfCorrectionScore * 100)}%`);
  console.log(`Roblox File Validity:      ${Math.round(scorecard.validityScore * 100)}%`);
  console.log(`Tests Passed:              ${scorecard.testsPassed} / ${scorecard.totalTests}`);
  console.log(`Benchmark Run Time:        ${elapsed}ms`);

  console.log('\n--- DETAILED TEST BREAKDOWN ---');
  for (const r of scorecard.results) {
    const status = r.passed ? 'PASS' : 'FAIL';
    console.log(`[${status}] ${r.testName.padEnd(32)} Category: ${r.category.padEnd(28)} Score: ${Math.round(r.overallScore * 100)}%`);
  }
  console.log('===============================================================');
}

main().catch(console.error);
