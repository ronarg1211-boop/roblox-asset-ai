'use client';

// ============================================================
// Roblox Asset AI - Roblox Studio Plugin Modal
// ============================================================

import React, { useState } from 'react';
import { X, Plug, Copy, Check, ExternalLink, Download } from 'lucide-react';

interface StudioPluginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudioPluginModal({ isOpen, onClose }: StudioPluginModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const luaCode = `-- Roblox Asset AI - Studio Bridge Plugin
-- Save this file to %localappdata%/Roblox/Plugins/RobloxAssetAI.lua

local HttpService = game:GetService("HttpService")
local Selection = game:GetService("Selection")

local toolbar = plugin:CreateToolbar("Roblox Asset AI")
local importBtn = toolbar:CreateButton("Import Asset", "Import latest generated asset", "")

importBtn.Click:Connect(function()
    print("[Asset AI] Connecting to http://localhost:3000/api/export...")
end)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(luaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-900 border border-studio-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-studio-100">
        <div className="px-6 py-4 border-b border-studio-800 flex items-center justify-between bg-studio-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-roblox-blue/20 flex items-center justify-center text-roblox-blue border border-roblox-blue/40">
              <Plug className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Roblox Studio Plugin Bridge</h2>
              <p className="text-xs text-studio-400">
                Connect the web app directly to your running Roblox Studio session
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

        <div className="p-6 space-y-4 text-xs overflow-y-auto">
          <div className="space-y-2">
            <h3 className="font-semibold text-studio-200">How to Install in Roblox Studio:</h3>
            <ol className="list-decimal pl-4 space-y-1.5 text-studio-300">
              <li>In Roblox Studio, go to the <strong className="text-white">Plugins</strong> tab.</li>
              <li>Click on <strong className="text-white">Plugins Folder</strong> to open your local plugins directory.</li>
              <li>Save <code className="bg-studio-950 px-1 py-0.5 rounded text-roblox-blue">AssetAIPlugin.lua</code> inside that folder.</li>
              <li>Enable <strong className="text-white">HttpService</strong> in Game Settings &gt; Security &gt; Allow HTTP Requests.</li>
            </ol>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-studio-300">Luau Plugin Script</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-roblox-blue hover:underline font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-roblox-green" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Lua Script'}</span>
              </button>
            </div>
            <pre className="bg-studio-950 p-3 rounded-lg border border-studio-800 font-mono text-[11px] text-studio-300 overflow-x-auto">
              {luaCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
