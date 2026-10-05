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
  Dices,
  Wand2,
  Trash2,
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
    provider: 'mock' | 'gemini' | 'openai' | 'kaggle' | 'frontier';
  }) => void;
  isGenerating: boolean;
}

interface PresetItem {
  label: string;
  category: 'props' | 'architecture' | 'vehicles' | 'animations';
  prompt: string;
  type: AssetType;
}

const INSPIRATION_PRESETS: PresetItem[] = [
  // Props
  { label: '💎 Treasure Chest', category: 'props', prompt: 'Stylized low-poly wooden treasure chest with reinforced metal bands and gold latch', type: 'model' },
  { label: '📦 Shipping Crate', category: 'props', prompt: 'Industrial wooden shipping crate with cross-bracing and metal corner brackets', type: 'model' },
  { label: '🛢️ Storage Barrel', category: 'props', prompt: 'Oak storage barrel with iron bands and tap spigot', type: 'model' },
  { label: '🔥 Campsite Fire', category: 'props', prompt: 'Cozy campsite fire with cobblestone ring, star-arranged logs, and glowing embers', type: 'model' },
  { label: '🔮 Magic Crystal', category: 'props', prompt: 'Floating magical crystal formation with glowing neon shards and stone pedestal', type: 'model' },
  { label: '👑 Golden Crown', category: 'props', prompt: 'Royal golden crown with arched prongs and colorful neon gemstones', type: 'model' },
  { label: '⚔️ Anvil', category: 'props', prompt: 'Heavy blacksmith anvil on wooden stump with working horn', type: 'model' },
  { label: '🧪 Potion Bottle', category: 'props', prompt: 'Glass potion bottle with cork stopper and luminous swirling liquid', type: 'model' },

  // Architecture & Furniture
  { label: '🪑 Armchair', category: 'architecture', prompt: 'Medieval wooden armchair with crimson velvet seat cushion and carved legs', type: 'model' },
  { label: '🍷 Banquet Table', category: 'architecture', prompt: 'Rustic wooden banquet tavern table with support stretchers and plates', type: 'model' },
  { label: '🏰 Watchtower', category: 'architecture', prompt: 'Medieval stone watchtower with crenellations and observation deck', type: 'model' },
  { label: '🏠 Forest Cottage', category: 'architecture', prompt: 'Cozy stone cottage with peaked slate roof and chimney', type: 'model' },
  { label: '🌉 Arch Bridge', category: 'architecture', prompt: 'Stone arch bridge with ramp approaches and baluster railings', type: 'model' },
  { label: '⛲ Marble Fountain', category: 'architecture', prompt: 'Tiered marble water fountain with decorative spouts and water pool', type: 'model' },
  { label: '🚪 Fortified Door', category: 'architecture', prompt: 'Heavy dungeon fortress door with iron bands and stone archway frame', type: 'model' },

  // Vehicles & Nature
  { label: '🚗 Off-Road Buggy', category: 'vehicles', prompt: 'Rugged off-road buggy with chunky wheels, roll cage, and front bumper', type: 'model' },
  { label: '🚚 Heavy Truck', category: 'vehicles', prompt: 'Heavy duty cargo truck with cabin windshield and open cargo bed', type: 'model' },
  { label: '🌲 Pine Tree', category: 'vehicles', prompt: 'Low-poly stylized pine tree with tiered foliage and cobblestone base', type: 'model' },
  { label: '🌴 Palm Tree', category: 'vehicles', prompt: 'Tropical palm tree with curved trunk and wide frond canopy', type: 'model' },
  { label: '🏴‍☠️ Pirate Ship', category: 'vehicles', prompt: 'Wooden pirate galleon ship with tall mast, bowsprit, and cannon ports', type: 'model' },
  { label: '🚁 Helicopter', category: 'vehicles', prompt: 'Tactical helicopter with rotor blades, cockpit canopy, and landing skids', type: 'model' },
  { label: '🏍️ Motorcycle', category: 'vehicles', prompt: 'Chopper style motorcycle with chrome handlebars and engine block', type: 'model' },
  { label: '🗿 Earth Golem', category: 'vehicles', prompt: 'Stone earth golem creature with moss boulder torso and glowing neon eyes', type: 'model' },

  // Animations
  { label: '👋 Friendly Wave', category: 'animations', prompt: 'Make this character wave with a friendly right arm motion', type: 'animation' },
  { label: '🚶 Walk Cycle', category: 'animations', prompt: 'Smooth natural humanoid walk cycle keyframe animation for R15 avatar', type: 'animation' },
  { label: '⚔️ Sword Slash', category: 'animations', prompt: 'Dynamic combat sword slash attack combo keyframe animation', type: 'animation' },
  { label: '🏃 Sprint Run', category: 'animations', prompt: 'Fast-paced athletic sprint run animation with arm swinging', type: 'animation' },
  { label: '🧘 Idle Breathing', category: 'animations', prompt: 'Relaxed idle breathing animation with gentle torso and head sway', type: 'animation' },
];

export default function GenerationControls({
  onGenerate,
  isGenerating,
}: GenerationControlsProps) {
  const [prompt, setPrompt] = useState(
    'A zombie in a shredded business suit holding a torn briefcase'
  );
  const [referenceImage, setReferenceImage] = useState<string | undefined>(undefined);
  const [assetType, setAssetType] = useState<AssetType>('model');
  const [stylePreset, setStylePreset] = useState<'low-poly' | 'stylized' | 'modular' | 'detailed'>('stylized');
  const [maxIterations, setMaxIterations] = useState(3);
  const [qualityThreshold, setQualityThreshold] = useState(88);
  const [provider, setProvider] = useState<'mock' | 'gemini' | 'openai' | 'kaggle' | 'frontier'>('frontier');
  const [presetCategory, setPresetCategory] = useState<'all' | 'props' | 'architecture' | 'vehicles' | 'animations'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRandomPreset = () => {
    const pool = presetCategory === 'all'
      ? INSPIRATION_PRESETS
      : INSPIRATION_PRESETS.filter((p) => p.category === presetCategory);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (chosen) {
      setPrompt(chosen.prompt);
      setAssetType(chosen.type);
    }
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    const additions = ', stylized low-poly aesthetic, clean Roblox Part bevels, grid-aligned proportions, vivid material contrasts';
    if (!prompt.includes('stylized') && !prompt.includes('Roblox')) {
      setPrompt(prompt.trim() + additions);
    }
  };

  const filteredPresets = presetCategory === 'all'
    ? INSPIRATION_PRESETS
    : INSPIRATION_PRESETS.filter((p) => p.category === presetCategory);

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
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Studio v0.3
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prominent Engine Switcher */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-studio-400">AI Engine</label>
            <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {provider === 'frontier'
                ? 'Frontier 70B Thinking (Active)'
                : provider === 'kaggle'
                ? 'Kaggle Dedicated AI'
                : 'Native Offline Engine'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-studio-950 rounded-lg border border-studio-800 text-xs">
            <button
              type="button"
              onClick={() => setProvider('frontier')}
              className={`py-1.5 px-1.5 rounded-md font-medium flex items-center justify-center gap-1 transition ${
                provider === 'frontier'
                  ? 'bg-purple-600 text-white shadow shadow-purple-600/30'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-850'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Frontier 70B</span>
            </button>
            <button
              type="button"
              onClick={() => setProvider('kaggle')}
              className={`py-1.5 px-1.5 rounded-md font-medium flex items-center justify-center gap-1 transition ${
                provider === 'kaggle'
                  ? 'bg-emerald-600 text-white shadow shadow-emerald-600/30'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-850'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Kaggle 1.5B</span>
            </button>
            <button
              type="button"
              onClick={() => setProvider('mock')}
              className={`py-1.5 px-1.5 rounded-md font-medium flex items-center justify-center gap-1 transition ${
                provider === 'mock'
                  ? 'bg-roblox-blue text-white shadow'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-850'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Native</span>
            </button>
          </div>
        </div>

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
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="text-[10px] text-roblox-blue hover:text-blue-300 font-mono flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-roblox-blue/10 border border-roblox-blue/30 transition"
                title="Enhance prompt with Roblox Studio styling cues"
              >
                <Wand2 className="w-3 h-3" />
                <span>Enhance</span>
              </button>
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="text-[10px] text-studio-500 hover:text-studio-300 p-0.5 rounded transition"
                title="Clear prompt"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <span className="text-[10px] text-studio-500 font-mono ml-1">
                {prompt.length}/2000
              </span>
            </div>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Create a stylized low-poly wooden treasure chest with reinforced metal bands and gold lock..."
            rows={4}
            className="w-full bg-studio-950 border border-studio-750 focus:border-roblox-blue rounded-lg p-3 text-xs text-studio-100 placeholder:text-studio-600 focus:outline-none focus:ring-1 focus:ring-roblox-blue transition resize-none leading-relaxed"
          />

          {/* Categorized Inspiration Presets & Randomizer */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-studio-400 font-mono uppercase tracking-wider">
                Inspiration Presets:
              </span>
              <button
                type="button"
                onClick={handleRandomPreset}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono transition"
                title="Pick a random surprise preset"
              >
                <Dices className="w-3 h-3" />
                <span>Surprise Me</span>
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] no-scrollbar">
              {(['all', 'props', 'architecture', 'vehicles', 'animations'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPresetCategory(cat)}
                  className={`px-2 py-0.5 rounded-full capitalize shrink-0 transition ${
                    presetCategory === cat
                      ? 'bg-roblox-blue text-white font-medium shadow-sm'
                      : 'bg-studio-950 text-studio-400 hover:text-studio-200 hover:bg-studio-850'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Preset pills list */}
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {filteredPresets.map((preset, i) => (
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
