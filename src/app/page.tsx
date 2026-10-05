'use client';

// ============================================================
// Roblox Asset AI - Main Creative Studio Application
// ============================================================

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GenerationControls from '@/components/GenerationControls';
import Viewport3D from '@/components/Viewport3D';
import InspectorPanel from '@/components/InspectorPanel';
import BenchmarkModal from '@/components/BenchmarkModal';
import StudioPluginModal from '@/components/StudioPluginModal';
import KaggleModal from '@/components/KaggleModal';
import {
  RobloxModelIR,
  RobloxAnimationIR,
  IterationRecord,
  AssetType,
  GenerationResponse,
} from '@/lib/types/roblox';

export default function RobloxAssetAIStudio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [iterations, setIterations] = useState<IterationRecord[]>([]);
  const [activeIterationIndex, setActiveIterationIndex] = useState(0);

  // Active Displayed Asset in 3D Viewport
  const [currentModelIR, setCurrentModelIR] = useState<RobloxModelIR | null>(null);
  const [currentAnimationIR, setCurrentAnimationIR] = useState<RobloxAnimationIR | null>(null);

  // Modals
  const [benchmarkOpen, setBenchmarkOpen] = useState(false);
  const [pluginOpen, setPluginOpen] = useState(false);
  const [kaggleOpen, setKaggleOpen] = useState(false);

  // Load Initial Demo Asset (Treasure Chest with 3 Iterations ready)
  useEffect(() => {
    handleGenerate({
      prompt: 'Create a stylized low-poly wooden treasure chest with metal bands and gold lock.',
      assetType: 'model',
      maxIterations: 3,
      qualityThreshold: 0.90,
      stylePreset: 'stylized',
      provider: 'mock',
    });
  }, []);

  const handleGenerate = async (params: {
    prompt: string;
    referenceImage?: string;
    assetType: AssetType;
    maxIterations: number;
    qualityThreshold: number;
    stylePreset: 'low-poly' | 'stylized' | 'modular' | 'detailed';
    provider: 'mock' | 'gemini' | 'openai' | 'kaggle';
  }) => {
    setIsGenerating(true);
    setActiveProvider(params.provider);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Generation error: ${err.error || 'Unknown error'}`);
        setIsGenerating(false);
        return;
      }

      const data = (await res.json()) as GenerationResponse;
      if (data.success && data.iterations && data.iterations.length > 0) {
        setIterations(data.iterations);
        const lastIndex = data.iterations.length - 1;
        setActiveIterationIndex(lastIndex);
        setCurrentModelIR(data.iterations[lastIndex].modelIR);
        setCurrentAnimationIR(data.iterations[lastIndex].animationIR || data.finalAnimationIR || null);
      }
    } catch (err: any) {
      console.error('Failed to generate:', err);
      alert(`Network error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Switch 3D Viewport to specific historical attempt
  const handleSelectIteration = (index: number) => {
    if (index >= 0 && index < iterations.length) {
      setActiveIterationIndex(index);
      setCurrentModelIR(iterations[index].modelIR);
      setCurrentAnimationIR(iterations[index].animationIR || null);
    }
  };

  const [activeProvider, setActiveProvider] = useState<'mock' | 'gemini' | 'openai' | 'kaggle'>('kaggle');

  // Trigger next single-step improvement
  const handleImproveFurther = () => {
    if (iterations.length === 0 || isGenerating) return;
    const last = iterations[iterations.length - 1];
    handleGenerate({
      prompt: last.modelIR.metadata?.prompt || 'Refine and improve asset geometry and detail',
      assetType: last.animationIR ? 'model_with_animation' : 'model',
      maxIterations: 1,
      qualityThreshold: 0.96,
      stylePreset: 'stylized',
      provider: activeProvider,
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-studio-950 text-studio-100 overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        onOpenBenchmark={() => setBenchmarkOpen(true)}
        onOpenStudioPlugin={() => setPluginOpen(true)}
        onOpenKaggle={() => setKaggleOpen(true)}
      />

      {/* Main 3-Column Creative Tool Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Input & Controls (360px) */}
        <aside className="w-[360px] shrink-0 h-full">
          <GenerationControls
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </aside>

        {/* Center Column: 3D Viewport (Flexible) */}
        <main className="flex-1 h-full p-3 flex flex-col bg-studio-950">
          <Viewport3D
            modelIR={currentModelIR}
            animationIR={currentAnimationIR}
            className="flex-1"
          />
        </main>

        {/* Right Column: Inspector & History (380px) */}
        <aside className="w-[380px] shrink-0 h-full">
          <InspectorPanel
            iterations={iterations}
            activeIterationIndex={activeIterationIndex}
            onSelectIteration={handleSelectIteration}
            onImproveFurther={handleImproveFurther}
            isGenerating={isGenerating}
            modelIR={currentModelIR}
            animationIR={currentAnimationIR}
          />
        </aside>
      </div>

      {/* Modals */}
      <BenchmarkModal
        isOpen={benchmarkOpen}
        onClose={() => setBenchmarkOpen(false)}
      />
      <StudioPluginModal
        isOpen={pluginOpen}
        onClose={() => setPluginOpen(false)}
      />
      <KaggleModal
        isOpen={kaggleOpen}
        onClose={() => setKaggleOpen(false)}
      />
    </div>
  );
}
