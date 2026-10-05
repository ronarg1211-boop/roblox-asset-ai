'use client';

// ============================================================
// Roblox Asset AI - Top Studio Navigation Bar
// ============================================================

import React from 'react';
import {
  Boxes,
  BarChart3,
  Plug,
  Sparkles,
  CheckCircle,
  Cpu,
} from 'lucide-react';

interface NavbarProps {
  onOpenBenchmark: () => void;
  onOpenStudioPlugin: () => void;
  onOpenKaggle: () => void;
}

export default function Navbar({ onOpenBenchmark, onOpenStudioPlugin, onOpenKaggle }: NavbarProps) {
  return (
    <header className="h-14 bg-studio-950 border-b border-studio-800 px-4 flex items-center justify-between select-none">
      {/* Brand & Purpose */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-roblox-red via-roblox-blue to-blue-400 flex items-center justify-center shadow-lg shadow-roblox-red/20">
          <Boxes className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white">
              ROBLOX ASSET AI
            </h1>
            <span className="text-[10px] font-mono uppercase bg-roblox-blue/15 text-roblox-blue px-1.5 py-0.5 rounded font-semibold border border-roblox-blue/30">
              Specialized Studio
            </span>
          </div>
          <p className="text-[10px] text-studio-400 leading-tight">
            Iterative 3D Asset & Animation Synthesis with Closed-Loop Vision Critique
          </p>
        </div>
      </div>

      {/* Action Buttons & Status */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-studio-900 border border-studio-800 rounded-lg text-[11px] text-studio-300">
          <CheckCircle className="w-3.5 h-3.5 text-roblox-green" />
          <span>Self-Correction Loop: Active</span>
        </div>

        <button
          onClick={onOpenBenchmark}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-studio-900 hover:bg-studio-850 text-studio-200 hover:text-white rounded-lg text-xs font-medium border border-studio-800 transition"
        >
          <BarChart3 className="w-3.5 h-3.5 text-roblox-yellow" />
          <span className="hidden sm:inline">Benchmark</span>
        </button>

        <button
          onClick={onOpenKaggle}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-white rounded-lg text-xs font-medium border border-emerald-500/30 transition shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kaggle AI</span>
        </button>

        <button
          onClick={onOpenStudioPlugin}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-studio-900 hover:bg-studio-850 text-studio-200 hover:text-white rounded-lg text-xs font-medium border border-studio-800 transition"
        >
          <Plug className="w-3.5 h-3.5 text-roblox-blue" />
          <span className="hidden sm:inline">Studio Plugin</span>
        </button>
      </div>
    </header>
  );
}
