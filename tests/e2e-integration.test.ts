import test from 'node:test';
import assert from 'node:assert/strict';
import { SelfImprovementOrchestrator } from '../src/lib/orchestrator/self-improvement-loop';
import { RbxmxExporter } from '../src/lib/roblox/rbxmx-exporter';
import { RbxmExporter } from '../src/lib/roblox/rbxm-exporter';
import { validateRbxmxXml, validateRbxmBinary } from '../src/lib/roblox/validator';
import { validateModelIR, validateAnimationIR } from '../src/lib/schema/validation';

test('E2E Integration - Text Prompt Generation & Self-Improvement Loop', async () => {
  const orchestrator = new SelfImprovementOrchestrator();

  const response = await orchestrator.executePipeline({
    prompt: 'Create a stylized low-poly wooden treasure chest with metal bands.',
    assetType: 'model',
    maxIterations: 3,
    qualityThreshold: 0.88,
    provider: 'mock',
  });

  assert.equal(response.success, true);
  assert.ok(response.iterations.length >= 2, 'Should perform at least 2 iterations');

  const initialIter = response.iterations[0];
  const finalIter = response.iterations[response.iterations.length - 1];

  // Visual critique verification
  assert.ok(initialIter.critique.summary.length > 0);
  assert.ok(initialIter.critique.items.length > 0);
  assert.ok(initialIter.renderPreviewDataUrl.startsWith('data:image/svg+xml;base64,'));

  // Quality score improvement verification
  assert.ok(finalIter.critique.qualityScore > initialIter.critique.qualityScore);

  // Model IR validation
  const modelVal = validateModelIR(response.finalModelIR);
  assert.equal(modelVal.valid, true);
  assert.equal(modelVal.errors.length, 0);

  // .rbxmx Export verification
  const xmlExporter = new RbxmxExporter();
  const xml = xmlExporter.exportModel(response.finalModelIR);
  const xmlReport = validateRbxmxXml(xml);
  assert.equal(xmlReport.valid, true);
  assert.equal(xmlReport.errors.length, 0);

  // .rbxm Binary Export verification
  const binaryExporter = new RbxmExporter();
  const binary = binaryExporter.exportModel(response.finalModelIR);
  const binReport = validateRbxmBinary(binary);
  assert.equal(binReport.valid, true);
  assert.equal(binReport.errors.length, 0);
});

test('E2E Integration - Reference Image + Text Multimodal Generation', async () => {
  const orchestrator = new SelfImprovementOrchestrator();
  const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const response = await orchestrator.executePipeline({
    prompt: 'Create a stylized wooden armchair with crimson fabric cushion',
    referenceImage: mockImage,
    assetType: 'model',
    maxIterations: 2,
    qualityThreshold: 0.85,
    provider: 'mock',
  });

  assert.equal(response.success, true);
  assert.ok(response.finalModelIR.instances.length >= 4);

  const xml = new RbxmxExporter().exportModel(response.finalModelIR);
  const report = validateRbxmxXml(xml);
  assert.equal(report.valid, true);
});

test('E2E Integration - Animation Generation & Verification', async () => {
  const orchestrator = new SelfImprovementOrchestrator();

  const response = await orchestrator.executePipeline({
    prompt: 'Make this character wave with a friendly arm motion',
    assetType: 'animation',
    maxIterations: 2,
    provider: 'mock',
  });

  assert.equal(response.success, true);
  assert.ok(response.finalAnimationIR !== undefined);
  assert.equal(response.finalAnimationIR?.assetType, 'animation');
  assert.ok(response.finalAnimationIR?.keyframes.length! >= 2);

  const animVal = validateAnimationIR(response.finalAnimationIR!);
  assert.equal(animVal.valid, true);

  const xml = new RbxmxExporter().exportAnimation(response.finalAnimationIR!);
  const report = validateRbxmxXml(xml);
  assert.equal(report.valid, true);
});

test('E2E Integration - Malformed & Boundary Input Rejection', async () => {
  // Model with zero size
  const invalidModel: any = {
    assetType: 'model',
    name: 'InvalidModel',
    instances: [
      {
        id: 'bad1',
        name: 'BadPart',
        className: 'Part',
        size: [0, 0, 0],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        color: [100, 100, 100],
        material: 'Plastic',
      },
    ],
  };

  const valRes = validateModelIR(invalidModel);
  assert.equal(valRes.valid, false);

  // Model with broken joint
  const brokenJointModel: any = {
    assetType: 'model',
    name: 'BrokenJoint',
    instances: [
      {
        id: 'weld1',
        name: 'Weld1',
        className: 'WeldConstraint',
        part0: 'PartA',
        // missing part1
      },
    ],
  };

  const jointRes = validateModelIR(brokenJointModel);
  assert.equal(jointRes.valid, false);
});
