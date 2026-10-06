#!/usr/bin/env python3
"""
Roblox Asset AI - API Key Probe & Top 5 Model Selector
Probes all configured API keys, tests response status & latency,
and selects the top 5 best models for sequential rate-limit failover.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error
import concurrent.futures
from typing import List, Dict, Any, Optional

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_env_file(filepath: str) -> Dict[str, str]:
    env = {}
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def get_all_keys(env: Dict[str, str], *var_names: str) -> List[str]:
    keys = []
    for var in var_names:
        raw = env.get(var) or os.environ.get(var) or ""
        for k in raw.split(","):
            k = k.strip()
            if k and k not in keys:
                keys.append(k)
    return keys

def build_candidates(env: Dict[str, str]) -> List[Dict[str, Any]]:
    candidates = []

    # 1. Groq Keys
    groq_keys = get_all_keys(env, "GROQ_API_KEYS", "GROQ_API_KEY")
    for i, k in enumerate(groq_keys):
        candidates.append({
            "id": f"groq_k{i+1}_qwen27b",
            "name": f"Groq Key #{i+1} [Qwen-3.8-27B]",
            "provider": "Groq",
            "url": "https://api.groq.com/openai/v1/chat/completions",
            "model": "qwen/qwen3.8-27b",
            "apiKey": k,
            "weight": 98,
            "headers": {"User-Agent": "RobloxAssetAI/1.0"}
        })
        candidates.append({
            "id": f"groq_k{i+1}_gpt120b",
            "name": f"Groq Key #{i+1} [GPT-OSS-120B]",
            "provider": "Groq",
            "url": "https://api.groq.com/openai/v1/chat/completions",
            "model": "openai/gpt-oss-120b",
            "apiKey": k,
            "weight": 95,
            "headers": {"User-Agent": "RobloxAssetAI/1.0"}
        })
        candidates.append({
            "id": f"groq_k{i+1}_gpt20b",
            "name": f"Groq Key #{i+1} [GPT-OSS-20B]",
            "provider": "Groq",
            "url": "https://api.groq.com/openai/v1/chat/completions",
            "model": "openai/gpt-oss-20b",
            "apiKey": k,
            "weight": 86,
            "headers": {"User-Agent": "RobloxAssetAI/1.0"}
        })

    # 2. OpenRouter Keys
    openrouter_keys = get_all_keys(env, "OPENROUTER_API_KEYS", "OPENROUTER_API_KEY")
    for i, k in enumerate(openrouter_keys):
        candidates.append({
            "id": f"openrouter_k{i+1}_llama70b",
            "name": f"OpenRouter Key #{i+1} [Llama-3.3-70B]",
            "provider": "OpenRouter",
            "url": "https://openrouter.ai/api/v1/chat/completions",
            "model": "meta-llama/llama-3.3-70b-instruct",
            "apiKey": k,
            "weight": 96,
            "headers": {
                "User-Agent": "RobloxAssetAI/1.0",
                "HTTP-Referer": "https://roblox-asset-ai.local",
                "X-Title": "Roblox Asset AI"
            }
        })
        candidates.append({
            "id": f"openrouter_k{i+1}_qwen32b",
            "name": f"OpenRouter Key #{i+1} [Qwen-2.5-Coder-32B]",
            "provider": "OpenRouter",
            "url": "https://openrouter.ai/api/v1/chat/completions",
            "model": "qwen/qwen-2.5-coder-32b-instruct",
            "apiKey": k,
            "weight": 94,
            "headers": {
                "User-Agent": "RobloxAssetAI/1.0",
                "HTTP-Referer": "https://roblox-asset-ai.local",
                "X-Title": "Roblox Asset AI"
            }
        })

    # 3. Cerebras Keys
    cerebras_keys = get_all_keys(env, "CEREBRAS_API_KEYS", "CEREBRAS_API_KEY")
    for i, k in enumerate(cerebras_keys):
        candidates.append({
            "id": f"cerebras_k{i+1}_llama70b",
            "name": f"Cerebras Key #{i+1} [Llama-3.3-70B]",
            "provider": "Cerebras",
            "url": "https://api.cerebras.ai/v1/chat/completions",
            "model": "llama-3.3-70b",
            "apiKey": k,
            "weight": 97,
            "headers": {"User-Agent": "RobloxAssetAI/1.0"}
        })

    # 4. Mistral Keys
    mistral_keys = get_all_keys(env, "MISTRAL_API_KEYS", "MISTRAL_API_KEY")
    for i, k in enumerate(mistral_keys):
        candidates.append({
            "id": f"mistral_k{i+1}_large",
            "name": f"Mistral Key #{i+1} [Mistral-Large]",
            "provider": "Mistral",
            "url": "https://api.mistral.ai/v1/chat/completions",
            "model": "mistral-large-latest",
            "apiKey": k,
            "weight": 93,
            "headers": {"User-Agent": "RobloxAssetAI/1.0"}
        })

    # 5. SambaNova Keys
    sambanova_keys = get_all_keys(env, "SAMBANOVA_API_KEYS", "SAMBANOVA_API_KEY")
    for i, k in enumerate(sambanova_keys):
        candidates.append({
            "id": f"sambanova_k{i+1}_llama70b",
            "name": f"SambaNova Key #{i+1} [Llama-3.3-70B]",
            "provider": "SambaNova",
            "url": "https://api.sambanova.ai/v1/chat/completions",
            "model": "Meta-Llama-3.3-70B-Instruct",
            "apiKey": k,
            "weight": 92,
            "headers": {"User-Agent": "RobloxAssetAI/1.0"}
        })

    return candidates

def probe_candidate(candidate: Dict[str, Any]) -> Dict[str, Any]:
    t0 = time.time()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {candidate['apiKey']}",
        **candidate.get("headers", {})
    }
    payload = json.dumps({
        "model": candidate["model"],
        "messages": [{"role": "user", "content": "ping"}],
        "max_tokens": 5,
        "temperature": 0.1
    }).encode("utf-8")

    req = urllib.request.Request(candidate["url"], data=payload, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=6) as res:
            latency_ms = round((time.time() - t0) * 1000)
            return {
                **candidate,
                "status": "ready",
                "statusCode": res.status,
                "latencyMs": latency_ms,
                "score": candidate["weight"] * 10 - min(latency_ms * 0.05, 50)
            }
    except urllib.error.HTTPError as e:
        latency_ms = round((time.time() - t0) * 1000)
        status = "rate_limited" if e.code == 429 else "error"
        return {
            **candidate,
            "status": status,
            "statusCode": e.code,
            "latencyMs": latency_ms,
            "score": -100
        }
    except Exception as e:
        return {
            **candidate,
            "status": "unreachable",
            "statusCode": 0,
            "latencyMs": 0,
            "score": -200
        }

def select_top_routes(project_dir: str = PROJECT_DIR, top_n: int = 5) -> List[Dict[str, Any]]:
    """Probes all configured keys, filters working ones, and selects the Top 5."""
    env_local_path = os.path.join(project_dir, ".env.local")
    env_path = os.path.join(project_dir, ".env")

    env = {}
    env.update(load_env_file(env_path))
    env.update(load_env_file(env_local_path))

    candidates = build_candidates(env)
    if not candidates:
        return []

    # Probe concurrently
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
        results = list(executor.map(probe_candidate, candidates))

    # Filter only ready routes
    valid_routes = [r for r in results if r["status"] == "ready"]

    # Sort by score descending (high model capability + low latency)
    valid_routes.sort(key=lambda x: x["score"], reverse=True)

    top_routes = valid_routes[:top_n]

    # Save to active_routes.json in project root
    out_file = os.path.join(project_dir, "active_routes.json")
    try:
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(top_routes, f, indent=2)
    except Exception as e:
        print(f"[!] Warning: Could not write active_routes.json: {e}")

    return top_routes

def display_and_select_routes(project_dir: str = PROJECT_DIR) -> List[Dict[str, Any]]:
    print("\n[*] Probing AI Keys & Selecting Top 5 Best Models...")
    top_routes = select_top_routes(project_dir=project_dir, top_n=5)

    if not top_routes:
        print("[!] No active LLM routes responded with 200 OK. Falling back to local domain synthesis.")
        return []

    print("-" * 75)
    for i, r in enumerate(top_routes):
        num = f"#{i + 1}"
        name = r["name"]
        latency = f"{r['latencyMs']}ms"
        print(f"  [{num}] {name:38} | Latency: {latency:>5} | Status: READY")
    print("-" * 75)
    print(f"[+] Top {len(top_routes)} routes locked in! Sequential rollover active on rate limits (429).\n")

    return top_routes

if __name__ == "__main__":
    display_and_select_routes()
