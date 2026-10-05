import test from 'node:test';
import assert from 'node:assert/strict';
import { SelfImprovementOrchestrator } from '../src/lib/orchestrator/self-improvement-loop';

test('Self-Improvement Loop - Progresses Across Iterations and Improves Score', async () => {
  const orchestrator = new SelfImprovementOrchestrator();

  const response = await orchestrator.executePipeline({
    prompt: 'Create a stylized low-poly wooden treasure chest with metal bands and gold latch',
    assetType: 'model',
    maxIterations: 3,
    qualityThreshold: 0.90,
  });

  assert.equal(response.success, true);
  assert.ok(response.iterations.length >= 2, 'Should execute multiple iterations');

  // Verify score increases across iterations
  const score1 = response.iterations[0].critique.qualityScore;
  const scoreLast = response.iterations[response.iterations.length - 1].critique.qualityScore;
  assert.ok(scoreLast > score1, `Final score (${scoreLast}) should be higher than initial score (${score1})`);

  // Verify part count increases as details/latches are added
  const parts1 = response.iterations[0].modelIR.instances.length;
  const partsLast = response.iterations[response.iterations.length - 1].modelIR.instances.length;
  assert.ok(partsLast >= parts1, 'Refined model should include added detail parts');

  // Verify each iteration has visual render dataURL
  for (const iter of response.iterations) {
    assert.ok(iter.renderPreviewDataUrl.startsWith('data:image/svg+xml;base64,'));
    assert.ok(iter.critique.summary.length > 0);
  }
});
