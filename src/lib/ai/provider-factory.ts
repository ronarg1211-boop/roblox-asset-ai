// ============================================================
// Roblox Asset AI - AI Provider Factory
// ============================================================

import { AIProvider } from './types';
import { ProceduralProvider } from './procedural-provider';
import { GeminiProvider } from './gemini-provider';
import { OpenAIProvider } from './openai-provider';
import { KaggleLLMProvider } from './kaggle-llm-provider';

export function getAIProvider(preferred?: string): AIProvider {
  const provider = preferred || process.env.DEFAULT_AI_PROVIDER || 'mock';

  if (provider === 'kaggle' || process.env.KAGGLE_API_URL) {
    return new KaggleLLMProvider();
  }

  if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
    return new GeminiProvider();
  }

  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }

  // Default robust offline procedural provider
  return new ProceduralProvider();
}
