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

test('Roblox XML Export - Auto-rigged Character Model Exports Cleanly', () => {
  const { autoRigModel } = require('../src/lib/roblox/auto-rigger');
  const exporter = new RbxmxExporter();

  const zombieModel: RobloxModelIR = {
    assetType: 'model',
    name: 'BusinessZombie',
    instances: [
      { id: 'p_torso', name: 'Torso', className: 'Part', shape: 'Block', size: [2, 2, 1], position: [0, 3, 0], rotation: [0, 0, 0], color: [85, 125, 75], material: 'Fabric', anchored: true, canCollide: true },
      { id: 'p_head', name: 'Head', className: 'Part', shape: 'Block', size: [1.2, 1.2, 1.2], position: [0, 4.6, 0], rotation: [0, 0, 0], color: [85, 125, 75], material: 'SmoothPlastic', anchored: true, canCollide: true },
      { id: 'p_la', name: 'LeftArm', className: 'Part', shape: 'Block', size: [1, 2, 1], position: [-1.5, 3, 0], rotation: [80, 0, 0], color: [85, 125, 75], material: 'Fabric', anchored: true, canCollide: true },
      { id: 'p_ra', name: 'RightArm', className: 'Part', shape: 'Block', size: [1, 2, 1], position: [1.5, 3, 0], rotation: [80, 0, 0], color: [85, 125, 75], material: 'Fabric', anchored: true, canCollide: true },
      { id: 'p_ll', name: 'LeftLeg', className: 'Part', shape: 'Block', size: [1, 2, 1], position: [-0.5, 1, 0], rotation: [0, 0, 0], color: [40, 40, 45], material: 'Fabric', anchored: true, canCollide: true },
      { id: 'p_rl', name: 'RightLeg', className: 'Part', shape: 'Block', size: [1, 2, 1], position: [0.5, 1, 0], rotation: [0, 0, 0], color: [40, 40, 45], material: 'Fabric', anchored: true, canCollide: true },
      { id: 'p_briefcase', name: 'Briefcase', className: 'Part', shape: 'Block', size: [1.5, 1, 0.4], position: [1.5, 2, 0.8], rotation: [0, 0, 0], color: [90, 50, 25], material: 'WoodPlanks', anchored: true, canCollide: false },
    ],
  };

  const rigged = autoRigModel(zombieModel, 'A zombie in a shredded business suit holding a briefcase');
  assert.equal(rigged.hasHumanoid, true);
  assert.equal(rigged.jointCount, 6); // 6 Motor6D joints
  assert.ok(rigged.weldCount >= 1); // Briefcase welded to RightArm

  const xml = exporter.exportModel(rigged.model);
  assert.ok(xml.includes('<Item class="Humanoid"'));
  assert.ok(xml.includes('<Item class="Motor6D"'));
  assert.ok(xml.includes('<Item class="WeldConstraint"'));

  const report = validateRbxmxXml(xml);
  assert.equal(report.valid, true);
  assert.equal(report.errors.length, 0);
  assert.ok(report.classesFound.includes('Humanoid'));
  assert.ok(report.classesFound.includes('Motor6D'));
  assert.ok(report.classesFound.includes('WeldConstraint'));
});

test('Roblox XML Export - Prevents Referent Corruption on Non-Existent PrimaryPartId', () => {
  const exporter = new RbxmxExporter();
  const testModel: RobloxModelIR = {
    assetType: 'model',
    name: 'SafeModel',
    primaryPartId: 'completely_nonexistent_id',
    instances: [
      { id: 'real_part', name: 'RealPart', className: 'Part', shape: 'Block', size: [1, 1, 1], position: [0, 0, 0], rotation: [0, 0, 0], color: [100, 100, 100], material: 'SmoothPlastic' },
    ],
  };

  const xml = exporter.exportModel(testModel);
  // Must point to real_part referent, NOT an unresolved phantom referent
  assert.ok(!xml.includes('<Ref name="PrimaryPart">null</Ref>'));
  assert.ok(xml.includes('<Ref name="PrimaryPart">RBX1</Ref>') || xml.includes('<Ref name="PrimaryPart">RBX0</Ref>'));

  const report = validateRbxmxXml(xml);
  assert.equal(report.valid, true);
  assert.equal(report.errors.length, 0);
});

test('Roblox XML Export - Exports R6 Hierarchical Animation Keyframes', () => {
  const exporter = new RbxmxExporter();
  const r6Anim: RobloxAnimationIR = {
    assetType: 'animation',
    name: 'R6ZombieSlash',
    length: 1.0,
    loop: true,
    priority: 'Action',
    keyframes: [
      {
        time: 0.0,
        poses: [
          { boneName: 'HumanoidRootPart', position: [0, 0, 0], rotation: [0, 0, 0] },
          { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0] },
          { boneName: 'RightArm', position: [0, 0, 0], rotation: [30, 0, 0] },
          { boneName: 'LeftArm', position: [0, 0, 0], rotation: [20, 0, 0] },
        ],
      },
    ],
  };

  const xml = exporter.exportAnimation(r6Anim);
  assert.ok(xml.includes('<string name="Name">HumanoidRootPart</string>'));
  assert.ok(xml.includes('<string name="Name">Torso</string>'));
  assert.ok(xml.includes('<string name="Name">RightArm</string>'));

  // Ensure Torso is nested inside HumanoidRootPart pose
  const rootIndex = xml.indexOf('<string name="Name">HumanoidRootPart</string>');
  const torsoIndex = xml.indexOf('<string name="Name">Torso</string>');
  const rightArmIndex = xml.indexOf('<string name="Name">RightArm</string>');

  assert.ok(rootIndex < torsoIndex);
  assert.ok(torsoIndex < rightArmIndex);

  const report = validateRbxmxXml(xml);
  assert.equal(report.valid, true);
  assert.equal(report.errors.length, 0);
});


