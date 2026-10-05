'use client';

// ============================================================
// Roblox Asset AI - Generation Controls (Left Sidebar)
// ============================================================

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  X,
  SlidersHorizontal,
  Box,
  Film,
  Layers,
  ChevronDown,
  Cpu,
} from 'lucide-react';
import { AssetType } from '@/lib/types/roblox';

interface GenerationControlsProps {
  onGenerate: (params: {
    prompt: string;
    referenceImage?: string;
    assetType: AssetType;
    maxIterations: number;
    qualityThreshold: number;
    stylePreset: 'low-poly' | 'stylized' | 'modular' | 'detailed';
    provider: 'mock' | 'gemini' | 'openai' | 'kaggle';
  }) => void;
  isGenerating: boolean;
}

const INSPIRATION_PRESETS: { label: string; prompt: string; type: AssetType }[] = [
  { label: '💎 Treasure Chest', prompt: 'Stylized low-poly wooden treasure chest with metal bands and gold latch', type: 'model' },
  { label: '🗡️ Knight Sword', prompt: 'Knight broadsword with golden crossguard and steel fuller blade', type: 'model' },
  { label: '🪑 Royal Throne', prompt: 'Medieval throne chair with crimson velvet cushion and armrests', type: 'model' },
  { label: '🚗 Off-Road Buggy', prompt: 'Rugged off-road buggy with chunky wheels, cabin glass, and bullbar', type: 'model' },
  { label: '🌲 Pine Tree', prompt: 'Low-poly pine tree with tiered foliage and cobblestone base', type: 'model' },
  { label: '🏰 Castle Keep', prompt: 'Medieval stone castle keep with corner turrets and portcullis gate', type: 'model' },
  { label: '🚀 Starfighter', prompt: 'Sci-fi starfighter spaceship with twin plasma ion engines and pulse lasers', type: 'model' },
  { label: '🗿 Earth Golem', prompt: 'Stone earth golem creature with moss boulder torso and glowing arcane eyes', type: 'model' },
  { label: '💣 Siege Cannon', prompt: 'Iron siege cannon on wooden wheeled carriage with cannonballs', type: 'model' },
  { label: '⛲ Marble Fountain', prompt: 'Tiered marble water fountain with spouting jets and pool basin', type: 'model' },
  { label: '👋 Character Wave', prompt: 'Make this character wave with a friendly arm motion', type: 'animation' },
  { label: '🚶 Walk Cycle', prompt: 'Smooth humanoid walking cycle animation for Roblox character', type: 'animation' },
  { label: '⚔️ Sword Slash', prompt: 'Dynamic sword slash attack combo keyframe animation', type: 'animation' },
];

export default function GenerationControls({
  onGenerate,
  isGenerating,
}: GenerationControlsProps) {
  const [prompt, setPrompt] = useState(
    'Create a stylized low-poly wooden treasure chest with metal bands.'
  );
  const [referenceImage, setReferenceImage] = useState<string | undefined>(undefined);
  const [assetType, setAssetType] = useState<AssetType>('model');
  const [stylePreset, setStylePreset] = useState<'low-poly' | 'stylized' | 'modular' | 'detailed'>('stylized');
  const [maxIterations, setMaxIterations] = useState(3);
  const [qualityThreshold, setQualityThreshold] = useState(88);
  const [provider, setProvider] = useState<'mock' | 'gemini' | 'openai' | 'kaggle'>('mock');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setReferenceImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    onGenerate({
      prompt: prompt.trim(),
      referenceImage,
      assetType,
      maxIterations,
      qualityThreshold: qualityThreshold / 100,
      stylePreset,
      provider,
    });
  };

  return (
    <div className="flex flex-col h-full bg-studio-900 border-r border-studio-800 text-studio-100 p-4 overflow-y-auto space-y-4">
      {/* Header / Mode Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-studio-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-roblox-blue animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-studio-200">
            Asset Generator
          </h2>
        </div>
        <span className="text-[11px] font-mono text-studio-400 bg-studio-850 px-2 py-0.5 rounded border border-studio-800">
          Studio v0.3
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asset Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-studio-400">Asset Mode</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-studio-950 rounded-lg border border-studio-800">
            <button
              type="button"
              onClick={() => setAssetType('model')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition ${
                assetType === 'model'
                  ? 'bg-roblox-blue text-white shadow'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-850'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Model</span>
            </button>
            <button
              type="button"
              onClick={() => setAssetType('animation')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition ${
                assetType === 'animation'
                  ? 'bg-roblox-blue text-white shadow'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-850'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Animation</span>
            </button>
            <button
              type="button"
              onClick={() => setAssetType('model_with_animation')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-md text-xs font-medium transition ${
                assetType === 'model_with_animation'
                  ? 'bg-roblox-blue text-white shadow'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-850'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="truncate">Both</span>
            </button>
          </div>
        </div>

        {/* Text Prompt Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-studio-400">
              Description / Intended Asset
            </label>
            <span className="text-[10px] text-studio-500 font-mono">
              {prompt.length}/2000
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Create a stylized low-poly wooden treasure chest with reinforced metal bands and gold lock..."
            rows={4}
            className="w-full bg-studio-950 border border-studio-750 focus:border-roblox-blue rounded-lg p-3 text-xs text-studio-100 placeholder:text-studio-600 focus:outline-none focus:ring-1 focus:ring-roblox-blue transition resize-none leading-relaxed"
          />

          {/* Quick Inspiration Presets */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] text-studio-500 font-mono uppercase tracking-wider block">Quick Presets:</span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {INSPIRATION_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrompt(preset.prompt);
                    setAssetType(preset.type);
                  }}
                  className="text-[10px] bg-studio-850 hover:bg-studio-750 text-studio-300 hover:text-white px-2 py-0.5 rounded-md transition border border-studio-800 hover:border-roblox-blue/40 whitespace-nowrap"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reference Image Drop Zone */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-studio-400">
            Reference Image (Visual Grounding)
          </label>

          {referenceImage ? (
            <div className="relative rounded-lg overflow-hidden border border-studio-750 group bg-studio-950">
              <img
                src={referenceImage}
                alt="Reference"
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => setReferenceImage(undefined)}
                className="absolute top-2 right-2 p-1 bg-studio-950/80 hover:bg-roblox-red text-white rounded-md transition shadow"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-1 left-2 text-[10px] text-studio-300 font-mono bg-studio-900/80 px-1.5 py-0.5 rounded">
                Reference Image Attached
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-studio-750 hover:border-roblox-blue/60 bg-studio-950/50 hover:bg-studio-950 p-4 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer transition text-center group"
            >
              <Upload className="w-5 h-5 text-studio-500 group-hover:text-roblox-blue transition" />
              <div className="text-xs text-studio-300">
                Drop image here or <span className="text-roblox-blue font-medium">browse</span>
              </div>
              <div className="text-[10px] text-studio-500">
                PNG, JPG, WebP up to 10MB
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Style Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-studio-400">Aesthetic Style</label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {(['stylized', 'low-poly', 'modular', 'detailed'] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setStylePreset(style)}
                className={`py-1.5 px-2.5 rounded-lg border text-left capitalize transition ${
                  stylePreset === style
                    ? 'border-roblox-blue bg-roblox-blue/10 text-roblox-blue font-medium'
                    : 'border-studio-800 bg-studio-950/60 text-studio-400 hover:text-studio-200 hover:border-studio-700'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <div className="pt-2 border-t border-studio-800">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs text-studio-400 hover:text-studio-200 transition py-1"
          >
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Self-Improvement Settings</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-3 bg-studio-950 p-3 rounded-lg border border-studio-800 text-xs">
              {/* Max Iterations Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-studio-400 text-[11px]">
                  <span>Max Self-Critique Loops</span>
                  <span className="font-mono text-studio-200 font-semibold">{maxIterations} iterations</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  className="w-full h-1 bg-studio-800 rounded appearance-none cursor-pointer accent-roblox-blue"
                />
              </div>

              {/* Quality Threshold */}
              <div className="space-y-1">
                <div className="flex justify-between text-studio-400 text-[11px]">
                  <span>Quality Target Threshold</span>
                  <span className="font-mono text-studio-200 font-semibold">{qualityThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={98}
                  value={qualityThreshold}
                  onChange={(e) => setQualityThreshold(parseInt(e.target.value))}
                  className="w-full h-1 bg-studio-800 rounded appearance-none cursor-pointer accent-roblox-blue"
                />
              </div>

              {/* Model Provider */}
              <div className="space-y-1">
                <label className="text-[11px] text-studio-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-studio-500" />
                  <span>AI Engine / Provider</span>
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full bg-studio-900 border border-studio-750 rounded p-1.5 text-xs text-studio-200 focus:outline-none focus:border-roblox-blue"
                >
                  <option value="mock">Procedural AI Engine (Offline Domain-Trained)</option>
                  <option value="kaggle">Kaggle Dedicated LLM (Custom Fine-Tuned 1.5B)</option>
                  <option value="gemini">Google Gemini 2.0 Flash (Multimodal)</option>
                  <option value="openai">OpenAI GPT-4o (Multimodal)</option>
                </select>
                {provider === 'kaggle' && (
                  <p className="text-[10px] text-roblox-blue font-mono mt-1">
                    Connects to your custom Kaggle T4 model runner (via local port 8000 or ngrok URL).
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-xl ${
            isGenerating
              ? 'bg-studio-800 text-studio-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-roblox-blue to-blue-600 hover:from-blue-500 hover:to-roblox-blue text-white shadow-blue-500/20 hover:shadow-blue-500/30'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-roblox-blue border-t-transparent rounded-full animate-spin" />
              <span>Analyzing & Improving...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Roblox Asset</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
