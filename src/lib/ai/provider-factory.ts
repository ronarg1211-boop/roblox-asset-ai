// ============================================================
// Roblox Asset AI - AI Provider Factory
// ============================================================

import { AIProvider } from './types';
import { ProceduralProvider } from './procedural-provider';
import { GeminiProvider } from './gemini-provider';
import { OpenAIProvider } from './openai-provider';
import { KaggleLLMProvider } from './kaggle-llm-provider';
import { FrontierThinkingProvider } from './frontier-provider';

export function getAIProvider(preferred?: string): AIProvider {
  const provider = preferred || process.env.DEFAULT_AI_PROVIDER || 'frontier';

  // 1. Frontier 70B Thinking Engine (OpenRouter / Groq / Cerebras)
  if (
    provider === 'frontier' ||
    provider === 'llm' ||
    provider === 'groq' ||
    provider === 'openrouter'
  ) {
    return new FrontierThinkingProvider();
  }

  // 2. Dedicated Kaggle GPU server
  if (provider === 'kaggle') {
    return new KaggleLLMProvider();
  }

  // 3. Local Native Engine
  if (provider === 'native' || provider === 'mock') {
    return new ProceduralProvider();
  }

  // 4. Gemini or OpenAI if configured
  if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
    return new GeminiProvider();
  }

  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }

  // Default fallback hierarchy: Frontier LLM -> Kaggle -> Native
  if (
    process.env.OPENROUTER_API_KEYS ||
    process.env.GROQ_API_KEYS ||
    process.env.GROQ_API_KEY ||
    process.env.CEREBRAS_API_KEYS
  ) {
    return new FrontierThinkingProvider();
  }

  if (process.env.KAGGLE_API_URL) {
    return new KaggleLLMProvider();
  }

  return new ProceduralProvider();
}
