import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ReferenceRetriever } from '../src/lib/ai/knowledge/reference-retriever';

test('ReferenceRetriever - Retrieves Zombie Businessman Blueprint for Zombie Prompt', () => {
  const refs = ReferenceRetriever.getRelevantReferences('A zombie in a shredded business suit holding a torn briefcase');
  assert.ok(refs.length > 0);
  const top = refs[0];
  assert.equal(top.id, 'ref_zombie_businessman');
  assert.equal(top.category, 'characters');
  assert.ok(top.model.instances.some((i: any) => i.name === 'Torso'));
  assert.ok(top.model.instances.some((i: any) => i.name === 'Briefcase'));
  assert.ok(top.model.instances.some((i: any) => i.name === 'TornNecktie'));
});

test('ReferenceRetriever - Formats prompt reference block with valid JSON', () => {
  const promptBlock = ReferenceRetriever.formatReferenceForPrompt('Knight in armor with sword and shield');
  assert.ok(promptBlock.includes('HIGH-FIDELITY ARCHITECTURAL REFERENCE BLUEPRINT'));
  assert.ok(promptBlock.includes('ArmoredPaladinKnight'));
  assert.ok(promptBlock.includes('"primaryPartId"'));
});

test('ReferenceRetriever - Fallback for generic prompt provides structured blueprint', () => {
  const refs = ReferenceRetriever.getRelevantReferences('something completely unknown');
  assert.ok(refs.length > 0);
  assert.ok(refs[0].model.instances.length >= 10);
});
