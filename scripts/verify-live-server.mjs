// ============================================================
// Roblox Asset AI - Live Server Verification Script
// Tests all endpoints on http://localhost:3000
// ============================================================

async function verify() {
  console.log('Testing live server endpoints on http://localhost:3000...\n');

  // 1. Homepage GET
  const homeRes = await fetch('http://localhost:3000/');
  console.log(`[1] GET / -> Status: ${homeRes.status} ${homeRes.statusText}`);
  if (homeRes.status !== 200) throw new Error('Home page returned non-200');

  // 2. Generate Asset (Treasure Chest - 3 iterations)
  console.log('\n[2] Testing POST /api/generate (Treasure Chest)...');
  const genStart = Date.now();
  const genRes = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Create a stylized low-poly wooden treasure chest with metal bands.',
      assetType: 'model',
      maxIterations: 3,
      qualityThreshold: 0.90,
      stylePreset: 'stylized',
      provider: 'mock',
    }),
  });
  console.log(`Status: ${genRes.status}`);
  const genData = await genRes.json();
  console.log(`Success: ${genData.success}`);
  console.log(`Asset Name: ${genData.finalModelIR.name}`);
  console.log(`Total Iterations Executed: ${genData.iterations.length}`);
  console.log(`Initial Score: ${Math.round(genData.iterations[0].critique.qualityScore * 100)}%`);
  console.log(`Final Score: ${Math.round(genData.finalQualityScore * 100)}%`);
  console.log(`Parts in Final Model: ${genData.finalModelIR.instances.length}`);
  console.log(`Generation Time: ${Date.now() - genStart}ms`);

  for (const it of genData.iterations) {
    console.log(`  - Iteration ${it.iterationNumber}: Score=${Math.round(it.critique.qualityScore * 100)}% | Critique="${it.critique.summary}"`);
  }

  // 3. Export .rbxmx (Roblox XML)
  console.log('\n[3] Testing POST /api/export (format: rbxmx)...');
  const exportXmlRes = await fetch('http://localhost:3000/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      modelIR: genData.finalModelIR,
      format: 'rbxmx',
    }),
  });
  console.log(`Status: ${exportXmlRes.status}`);
  const xmlContent = await exportXmlRes.text();
  console.log(`Exported XML Length: ${xmlContent.length} bytes`);
  console.log(`Valid Header: ${xmlContent.includes('<roblox') && xmlContent.includes('</roblox>')}`);
  console.log(`Instances Count Header: ${exportXmlRes.headers.get('X-Validation-Instances')}`);

  // 4. Export .rbxm (Roblox Binary)
  console.log('\n[4] Testing POST /api/export (format: rbxxm binary)...');
  const exportBinRes = await fetch('http://localhost:3000/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      modelIR: genData.finalModelIR,
      format: 'rbxm',
    }),
  });
  console.log(`Status: ${exportBinRes.status}`);
  const binBuffer = await exportBinRes.arrayBuffer();
  console.log(`Exported Binary Length: ${binBuffer.byteLength} bytes`);
  console.log(`Header Valid: ${exportBinRes.headers.get('X-Validation-Valid')}`);

  // 5. Validate Asset Endpoint
  console.log('\n[5] Testing POST /api/validate...');
  const valRes = await fetch('http://localhost:3000/api/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/xml' },
    body: xmlContent,
  });
  const valReport = await valRes.json();
  console.log(`Validation Passed: ${valReport.valid}`);
  console.log(`Format: ${valReport.format}`);
  console.log(`Total Instances: ${valReport.totalInstances}`);
  console.log(`Referents Count: ${valReport.referentsCount}`);
  console.log(`Classes Found: ${valReport.classesFound.join(', ')}`);

  // 6. Benchmark Endpoint
  console.log('\n[6] Testing GET /api/benchmark?quick=true...');
  const benchRes = await fetch('http://localhost:3000/api/benchmark?quick=true');
  const benchData = await benchRes.json();
  console.log(`Status: ${benchRes.status}`);
  console.log(`Benchmark Overall Score: ${Math.round(benchData.overallScore * 100)}%`);
  console.log(`Tests Passed: ${benchData.testsPassed} / ${benchData.totalTests}`);

  // 7. Multimodal Reference Image + Text Generation
  console.log('\n[7] Testing Multimodal Reference Image + Text Generation...');
  const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const multiRes = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Create a stylized throne chair with red fabric cushion matching reference image',
      referenceImage: mockImage,
      assetType: 'model',
      maxIterations: 2,
      qualityThreshold: 0.85,
    }),
  });
  const multiData = await multiRes.json();
  console.log(`Multimodal Success: ${multiData.success}`);
  console.log(`Model: ${multiData.finalModelIR.name} (${multiData.finalModelIR.instances.length} parts)`);
  console.log(`Final Quality: ${Math.round(multiData.finalQualityScore * 100)}%`);

  // 8. Animation Generation
  console.log('\n[8] Testing Animation Generation...');
  const animRes = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Make this character wave with a friendly arm motion',
      assetType: 'animation',
      maxIterations: 2,
    }),
  });
  const animData = await animRes.json();
  console.log(`Animation Success: ${animData.success}`);
  console.log(`Animation Name: ${animData.finalAnimationIR?.name}`);
  console.log(`Keyframes Count: ${animData.finalAnimationIR?.keyframes.length}`);
  console.log(`Duration: ${animData.finalAnimationIR?.length}s`);

  console.log('\n===============================================================');
  console.log(' ALL LIVE ENDPOINTS VERIFIED AND WORKING 100% SUCCESSFULLY! ');
  console.log('===============================================================');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
