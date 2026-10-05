import test from 'node:test';
import assert from 'node:assert/strict';
import { RbxmExporter } from '../src/lib/roblox/rbxm-exporter';
import { validateRbxmBinary } from '../src/lib/roblox/validator';
import { RobloxModelIR } from '../src/lib/types/roblox';

test('Roblox Binary Export - Produces Valid .rbxm Binary Structure', () => {
  const exporter = new RbxmExporter();
  const testModel: RobloxModelIR = {
    assetType: 'model',
    name: 'BinaryChest',
    instances: [
      {
        id: 'p1',
        name: 'Base',
        className: 'Part',
        size: [4, 2, 3],
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        color: [100, 50, 20],
        material: 'Wood',
      },
    ],
  };

  const buffer = exporter.exportModel(testModel);
  assert.ok(buffer.length > 32);

  // Validate magic header
  const expectedMagic = Buffer.from([
    0x3c, 0x72, 0x6f, 0x62, 0x6c, 0x6f, 0x78, 0x21,
    0x89, 0xff, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  assert.deepEqual(buffer.subarray(0, 14), expectedMagic);

  // Validate with binary validator
  const report = validateRbxmBinary(buffer);
  assert.equal(report.valid, true);
  assert.equal(report.format, 'rbxm');
  assert.ok(report.totalInstances >= 2); // Root model + 1 part
  assert.equal(report.errors.length, 0);
});
