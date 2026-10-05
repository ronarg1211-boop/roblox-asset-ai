import test from 'node:test';
import assert from 'node:assert/strict';
import { validateModelIR, validateAnimationIR } from '../src/lib/schema/validation';
import { RobloxModelIR, RobloxAnimationIR } from '../src/lib/types/roblox';

test('IR Validation - Valid Model passes validation', () => {
  const validModel: RobloxModelIR = {
    assetType: 'model',
    name: 'TestChest',
    instances: [
      {
        id: 'part_1',
        name: 'Base',
        className: 'Part',
        shape: 'Block',
        size: [4, 2, 3],
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        color: [105, 64, 40],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      },
    ],
  };

  const res = validateModelIR(validModel);
  assert.equal(res.valid, true);
  assert.equal(res.errors.length, 0);
});

test('IR Validation - Rejects NaN or Infinity values', () => {
  const invalidModel: RobloxModelIR = {
    assetType: 'model',
    name: 'BadModel',
    instances: [
      {
        id: 'part_1',
        name: 'BadPart',
        className: 'Part',
        size: [NaN as any, 2, 3],
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        color: [100, 100, 100],
        material: 'Metal',
      },
    ],
  };

  const res = validateModelIR(invalidModel);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some((e) => e.code === 'NAN_SIZE'));
});

test('IR Validation - Rejects Non-Positive Sizes', () => {
  const invalidModel: RobloxModelIR = {
    assetType: 'model',
    name: 'ZeroSizeModel',
    instances: [
      {
        id: 'part_1',
        name: 'ZeroPart',
        className: 'Part',
        size: [0, 2, 3],
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        color: [100, 100, 100],
        material: 'Plastic',
      },
    ],
  };

  const res = validateModelIR(invalidModel);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some((e) => e.code === 'NON_POSITIVE_SIZE'));
});

test('IR Validation - Rejects Duplicate Referent IDs', () => {
  const duplicateIdModel: RobloxModelIR = {
    assetType: 'model',
    name: 'DupModel',
    instances: [
      {
        id: 'duplicate_id',
        name: 'PartA',
        className: 'Part',
        size: [1, 1, 1],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        color: [50, 50, 50],
        material: 'Wood',
      },
      {
        id: 'duplicate_id',
        name: 'PartB',
        className: 'Part',
        size: [1, 1, 1],
        position: [2, 0, 0],
        rotation: [0, 0, 0],
        color: [50, 50, 50],
        material: 'Wood',
      },
    ],
  };

  const res = validateModelIR(duplicateIdModel);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some((e) => e.code === 'DUPLICATE_ID'));
});

test('IR Validation - Validates Animation Keyframes and Ordering', () => {
  const validAnim: RobloxAnimationIR = {
    assetType: 'animation',
    name: 'Wave',
    length: 1.0,
    loop: true,
    priority: 'Action',
    keyframes: [
      {
        time: 0.0,
        poses: [{ boneName: 'RightArm', position: [0, 0, 0], rotation: [0, 0, 0] }],
      },
      {
        time: 0.5,
        poses: [{ boneName: 'RightArm', position: [0, 0.2, 0], rotation: [0, 0, 90] }],
      },
      {
        time: 1.0,
        poses: [{ boneName: 'RightArm', position: [0, 0, 0], rotation: [0, 0, 0] }],
      },
    ],
  };

  const res = validateAnimationIR(validAnim);
  assert.equal(res.valid, true);
});
