import test from 'node:test';
import assert from 'node:assert/strict';
import { runRobloxAssetBench } from '../src/lib/benchmark/benchmark-suite';

test('RobloxAssetBench - Evaluates Categories and Computes Metrics', async () => {
  // Run quick benchmark with 2 tests
  const scorecard = await runRobloxAssetBench('v0.3-Test', 2);

  assert.equal(scorecard.modelVersion, 'v0.3-Test');
  assert.ok(scorecard.overallScore > 0.8);
  assert.equal(scorecard.totalTests, 2);
  assert.equal(scorecard.testsPassed, 2);
  assert.equal(scorecard.validityScore, 1.0);
  assert.equal(scorecard.results.length, 2);
});
