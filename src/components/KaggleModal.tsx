'use client';

// ============================================================
// Roblox Asset AI - Kaggle Dedicated LLM Setup & Bridge Modal
// ============================================================

import React, { useState } from 'react';
import { X, Cpu, Terminal, Copy, Check, ExternalLink, Zap, Radio, Globe } from 'lucide-react';

interface KaggleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KaggleModal({ isOpen, onClose }: KaggleModalProps) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [kaggleUrl, setKaggleUrl] = useState('http://localhost:8000');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const trainingCommand = `python kaggle/train.py --model_name "Qwen/Qwen2.5-Coder-1.5B-Instruct" --data_dir "./dataset" --output_dir "./checkpoints/roblox-asset-ai-t4" --epochs 3 --use_4bit`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trainingCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setStatusMessage('Pinging Kaggle inference endpoint...');
    try {
      const res = await fetch(`${kaggleUrl.replace(/\/$/, '')}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setTestStatus('connected');
        setStatusMessage(`Online! Connected to ${data.model || 'RobloxAssetAI-1.5B'} (${data.backend || 'Kaggle Dedicated'}).`);
      } else {
        setTestStatus('error');
        setStatusMessage(`Endpoint returned HTTP ${res.status}.`);
      }
    } catch (err: any) {
      setTestStatus('error');
      setStatusMessage(`Connection failed: ${err.message || 'Cannot reach endpoint'}. Ensure server is running.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-900 border border-studio-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-studio-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-studio-800 flex items-center justify-between bg-studio-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-roblox-blue/20 flex items-center justify-center text-roblox-blue border border-roblox-blue/40">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Dedicated Kaggle Roblox AI
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  Non-Chat • Pure Roblox Studio
                </span>
              </h2>
              <p className="text-xs text-studio-400">
                Train & host your compact, specialized 1.5B model on Kaggle's free T4 GPU
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-studio-300">
          {/* Key Architecture Highlight */}
          <div className="bg-studio-950 p-4 rounded-xl border border-studio-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Zap className="w-4 h-4 text-roblox-yellow" />
              <span>Dedicated Architecture — Zero Bloat</span>
            </div>
            <p className="text-studio-400 leading-relaxed">
              This model does <strong>NOT</strong> chat, summarize essays, or answer homework. It has only one objective:
              generate <strong>Roblox 3D Models (.rbxmx/.rbxm)</strong> and <strong>Roblox Keyframe Animations</strong>.
              Because it is compact (1.5B parameters), it runs with blazing speed on a free Kaggle T4 GPU or local machine.
            </p>
          </div>

          {/* Quickstart Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white uppercase text-[11px] tracking-wider">
              How to Train on Kaggle (3 Simple Steps)
            </h3>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="bg-studio-850 p-3 rounded-lg border border-studio-800">
                <span className="text-roblox-blue font-bold">1. Upload Notebook:</span>
                <p className="text-studio-300 font-sans mt-0.5 text-xs">
                  Upload <code className="text-roblox-yellow">kaggle/RobloxAssetAI_Kaggle.ipynb</code> to Kaggle Notebooks with GPU accelerator (T4 x 2 or T4).
                </p>
              </div>

              <div className="bg-studio-850 p-3 rounded-lg border border-studio-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-roblox-blue font-bold">2. Run Fine-Tuning:</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] text-studio-400 hover:text-white font-sans transition"
                  >
                    {copiedCmd ? <Check className="w-3 h-3 text-roblox-green" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd ? 'Copied' : 'Copy Command'}</span>
                  </button>
                </div>
                <code className="text-[10px] text-studio-200 block bg-studio-950 p-2 rounded border border-studio-800 overflow-x-auto whitespace-pre">
                  {trainingCommand}
                </code>
              </div>

              <div className="bg-studio-850 p-3 rounded-lg border border-studio-800">
                <span className="text-roblox-blue font-bold">3. Launch Serving Server:</span>
                <p className="text-studio-300 font-sans mt-0.5 text-xs">
                  Run <code className="text-roblox-yellow">python kaggle/serve.py --port 8000</code> in the notebook to expose the live REST API (supports ngrok public URL).
                </p>
              </div>
            </div>
          </div>

          {/* Live Connect Box */}
          <div className="bg-studio-950 p-4 rounded-xl border border-studio-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-roblox-blue" />
                <span>Connect Live Kaggle Endpoint</span>
              </label>
              {testStatus === 'connected' && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Connected
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={kaggleUrl}
                onChange={(e) => setKaggleUrl(e.target.value)}
                placeholder="http://localhost:8000 or https://xxxx.ngrok-free.app"
                className="flex-1 bg-studio-900 border border-studio-750 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-roblox-blue"
              />
              <button
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="px-4 py-2 bg-roblox-blue hover:bg-blue-600 text-white font-semibold text-xs rounded-lg transition shrink-0 flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{testStatus === 'testing' ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {statusMessage && (
              <p className={`text-[11px] font-mono ${testStatus === 'connected' ? 'text-emerald-400' : testStatus === 'error' ? 'text-rose-400' : 'text-studio-400'}`}>
                {statusMessage}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-studio-800 flex items-center justify-between bg-studio-950">
          <span className="text-[11px] text-studio-400">
            Notebook files located in <code className="text-studio-300">kaggle/</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-studio-800 hover:bg-studio-750 text-white rounded-lg text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
