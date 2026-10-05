import test from 'node:test';
import assert from 'node:assert/strict';
import { RbxmxExporter } from '../src/lib/roblox/rbxmx-exporter';
import { validateRbxmxXml } from '../src/lib/roblox/validator';
import { RobloxModelIR, RobloxAnimationIR } from '../src/lib/types/roblox';

test('Roblox XML Export - Produces Valid .rbxmx XML for Model', () => {
  const exporter = new RbxmxExporter();
  const testModel: RobloxModelIR = {
    assetType: 'model',
    name: 'TreasureChest',
    instances: [
      {
        id: 'p_base',
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
      {
        id: 'p_lid',
        name: 'Lid',
        className: 'Part',
        shape: 'Block',
        size: [4.2, 1, 3.2],
        position: [0, 2.5, 0],
        rotation: [0, 0, 0],
        color: [115, 72, 45],
        material: 'Wood',
        anchored: true,
        canCollide: true,
      },
      {
        id: 'p_latch',
        name: 'GoldLatch',
        className: 'Part',
        shape: 'Block',
        size: [0.6, 0.7, 0.25],
        position: [0, 1.95, 1.45],
        rotation: [0, 0, 0],
        color: [239, 184, 56],
        material: 'Metal',
        anchored: true,
        canCollide: true,
      },
    ],
  };

  const xml = exporter.exportModel(testModel);

  // Structural XML assertions
  assert.ok(xml.includes('<roblox'));
  assert.ok(xml.includes('</roblox>'));
  assert.ok(xml.includes('<Item class="Model"'));
  assert.ok(xml.includes('<Item class="Part"'));
  assert.ok(xml.includes('<string name="Name">TreasureChest</string>'));
  assert.ok(xml.includes('<CoordinateFrame name="CFrame">'));
  assert.ok(xml.includes('<Vector3 name="size">'));

  // Run comprehensive validator
  const report = validateRbxmxXml(xml);
  assert.equal(report.valid, true);
  assert.equal(report.format, 'rbxmx');
  assert.equal(report.totalInstances, 4); // 1 Model + 3 Parts
  assert.equal(report.referentsCount, 4);
  assert.equal(report.errors.length, 0);
});

test('Roblox XML Export - Produces Valid .rbxmx KeyframeSequence for Animation', () => {
  const exporter = new RbxmxExporter();
  const testAnim: RobloxAnimationIR = {
    assetType: 'animation',
    name: 'CharacterWave',
    length: 2.0,
    loop: true,
    priority: 'Action',
    keyframes: [
      {
        time: 0.0,
        poses: [{ boneName: 'RightArm', position: [0, 0, 0], rotation: [0, 0, 0] }],
      },
      {
        time: 1.0,
        poses: [{ boneName: 'RightArm', position: [0, 0.4, 0], rotation: [0, 0, 135] }],
      },
    ],
  };

  const xml = exporter.exportAnimation(testAnim);
  assert.ok(xml.includes('<Item class="KeyframeSequence"'));
  assert.ok(xml.includes('<Item class="Keyframe"'));
  assert.ok(xml.includes('<Item class="Pose"'));

  const report = validateRbxmxXml(xml);
  assert.equal(report.valid, true);
  assert.equal(report.errors.length, 0);
});
