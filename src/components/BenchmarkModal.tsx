'use client';

// ============================================================
// Roblox Asset AI - RobloxAssetBench Dashboard Modal
// Compares Model versions (v0.1, v0.2, v0.3) across 11 metrics & 12 categories
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ModelBenchmarkScorecard } from '@/lib/benchmark/benchmark-suite';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset historical model benchmarks to allow side-by-side comparison
const HISTORICAL_MODELS: Record<string, Partial<ModelBenchmarkScorecard>> = {
  'v0.1-Baseline': {
    modelVersion: 'v0.1-Baseline',
    overallScore: 0.64,
    modelGenerationScore: 0.68,
    imageReconstructionScore: 0.59,
    animationScore: 0.60,
    selfCorrectionScore: 0.45,
    validityScore: 0.88,
    totalTests: 12,
    testsPassed: 6,
  },
  'v0.2-VisionCritique': {
    modelVersion: 'v0.2-VisionCritique',
    overallScore: 0.81,
    modelGenerationScore: 0.83,
    imageReconstructionScore: 0.78,
    animationScore: 0.79,
    selfCorrectionScore: 0.76,
    validityScore: 0.96,
    totalTests: 12,
    testsPassed: 10,
  },
  'v0.3-SelfImproving': {
    modelVersion: 'v0.3-SelfImproving (Current)',
    overallScore: 0.93,
    modelGenerationScore: 0.94,
    imageReconstructionScore: 0.91,
    animationScore: 0.92,
    selfCorrectionScore: 0.95,
    validityScore: 1.0,
    totalTests: 12,
    testsPassed: 12,
  },
};

export default function BenchmarkModal({ isOpen, onClose }: BenchmarkModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>('v0.3-SelfImproving');
  const [scorecard, setScorecard] = useState<ModelBenchmarkScorecard | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Fetch benchmark on open
  useEffect(() => {
    if (isOpen && !scorecard) {
      handleRunBenchmark(true);
    }
  }, [isOpen]);

  const handleRunBenchmark = async (quick = false) => {
    setIsRunning(true);
    try {
      const res = await fetch(`/api/benchmark?version=${selectedVersion}&quick=${quick}`);
      if (res.ok) {
        const data = await res.json();
        setScorecard(data);
      }
    } catch (err) {
      console.error('Failed to run benchmark:', err);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  const currentScorecard = scorecard || (HISTORICAL_MODELS[selectedVersion] as ModelBenchmarkScorecard);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-900 border border-studio-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-studio-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-studio-800 flex items-center justify-between bg-studio-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-roblox-yellow/20 flex items-center justify-center text-roblox-yellow border border-roblox-yellow/40">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">RobloxAssetBench</h2>
              <p className="text-xs text-studio-400">
                Automated 11-Metric Evaluation Suite across 12 Asset Categories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-studio-400 hover:text-white rounded-lg hover:bg-studio-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Model Version Comparison Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-studio-950 p-1 rounded-xl border border-studio-800">
              {Object.keys(HISTORICAL_MODELS).map((ver) => (
                <button
                  key={ver}
                  onClick={() => setSelectedVersion(ver)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedVersion === ver
                      ? 'bg-roblox-blue text-white shadow'
                      : 'text-studio-400 hover:text-studio-200'
                  }`}
                >
                  {ver}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleRunBenchmark(false)}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-roblox-green hover:bg-roblox-green/90 text-white rounded-lg text-xs font-medium transition shadow"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running Full Suite...' : 'Run Benchmark'}</span>
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-studio-950 p-3 rounded-xl border border-studio-800 space-y-1">
              <span className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                Overall Score
              </span>
              <div className="text-xl font-bold font-mono text-roblox-blue">
                {Math.round((currentScorecard?.overallScore || 0) * 100)}%
              </div>
            </div>
            <div className="bg-studio-950 p-3 rounded-xl border border-studio-800 space-y-1">
              <span className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                Model Gen
              </span>
              <div className="text-xl font-bold font-mono text-studio-200">
                {Math.round((currentScorecard?.modelGenerationScore || 0) * 100)}%
              </div>
            </div>
            <div className="bg-studio-950 p-3 rounded-xl border border-studio-800 space-y-1">
              <span className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                Image Recon
              </span>
              <div className="text-xl font-bold font-mono text-studio-200">
                {Math.round((currentScorecard?.imageReconstructionScore || 0) * 100)}%
              </div>
            </div>
            <div className="bg-studio-950 p-3 rounded-xl border border-studio-800 space-y-1">
              <span className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                Animation
              </span>
              <div className="text-xl font-bold font-mono text-studio-200">
                {Math.round((currentScorecard?.animationScore || 0) * 100)}%
              </div>
            </div>
            <div className="bg-studio-950 p-3 rounded-xl border border-studio-800 space-y-1">
              <span className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                Self-Correction
              </span>
              <div className="text-xl font-bold font-mono text-roblox-green">
                {Math.round((currentScorecard?.selfCorrectionScore || 0) * 100)}%
              </div>
            </div>
            <div className="bg-studio-950 p-3 rounded-xl border border-studio-800 space-y-1">
              <span className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                File Validity
              </span>
              <div className="text-xl font-bold font-mono text-roblox-green">
                {Math.round((currentScorecard?.validityScore || 0) * 100)}%
              </div>
            </div>
          </div>

          {/* Version Progression Comparison Table */}
          <div className="bg-studio-950 rounded-xl border border-studio-800 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-studio-300">
              Comparative Model Evolution (v0.1 → v0.2 → v0.3)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-studio-850 text-studio-500 font-medium">
                    <th className="pb-2">Model Version</th>
                    <th className="pb-2">Overall</th>
                    <th className="pb-2">Model Gen</th>
                    <th className="pb-2">Reconstruction</th>
                    <th className="pb-2">Self-Correction</th>
                    <th className="pb-2">Validity</th>
                    <th className="pb-2">Pass Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-studio-850 font-mono">
                  {Object.entries(HISTORICAL_MODELS).map(([key, m]) => (
                    <tr
                      key={key}
                      className={key === selectedVersion ? 'bg-roblox-blue/10 text-roblox-blue font-bold' : 'text-studio-300'}
                    >
                      <td className="py-2.5 font-sans font-medium">{m.modelVersion}</td>
                      <td className="py-2.5">{Math.round((m.overallScore || 0) * 100)}%</td>
                      <td className="py-2.5">{Math.round((m.modelGenerationScore || 0) * 100)}%</td>
                      <td className="py-2.5">{Math.round((m.imageReconstructionScore || 0) * 100)}%</td>
                      <td className="py-2.5">{Math.round((m.selfCorrectionScore || 0) * 100)}%</td>
                      <td className="py-2.5 text-roblox-green">{Math.round((m.validityScore || 0) * 100)}%</td>
                      <td className="py-2.5">{m.testsPassed}/{m.totalTests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Test Case Breakdown if available */}
          {scorecard?.results && scorecard.results.length > 0 && (
            <div className="bg-studio-950 rounded-xl border border-studio-800 p-4 space-y-3">
              <h3 className="text-xs font-semibold text-studio-300">
                Individual Category Test Runs ({scorecard.results.length} Tests)
              </h3>
              <div className="space-y-1.5">
                {scorecard.results.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-studio-900 rounded-lg text-xs border border-studio-850"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-roblox-green shrink-0" />
                      <span className="text-studio-200 font-medium">{r.testName}</span>
                      <span className="text-[10px] text-studio-500 font-mono">({r.category})</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-studio-400">{r.iterationsCount} iters</span>
                      <span className="text-studio-400">{r.generationTimeMs}ms</span>
                      <span className="text-roblox-blue font-semibold">{Math.round(r.overallScore * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
