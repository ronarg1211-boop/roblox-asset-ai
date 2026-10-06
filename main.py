#!/usr/bin/env python3
"""
=============================================================================
ROBLOX ASSET AI - MASTER APPLICATION RUNNER
=============================================================================
Usage:
    python main.py              -> Starts the Roblox Asset AI Web Studio
    python main.py --kaggle     -> Launches Kaggle Model Server (FastAPI + ngrok)
    python main.py --train      -> Starts fine-tuning the 1.5B Roblox LLM
    python main.py --generate "A wooden chest" -> CLI Generator (exports .rbxmx)
    python main.py --benchmark  -> Runs the automated RobloxAssetBench
=============================================================================
"""

import os
import sys
import argparse
import subprocess
import webbrowser
import time
import json
import urllib.request
import urllib.error

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(line_buffering=True)
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(line_buffering=True)

def print_banner():
    banner = r"""
=============================================================================
  ____            _       _             _                     _          _ 
 |  _ \ ___  _ __| | ___ | |_  __      / \   ___  ___   ___  | |_       / \  ___ ___  ___| |_ 
 | |_) / _ \| '__| |/ _ \| \ \/ /____ / _ \ / __|/ __| / _ \ | __|____ / _ \/ __/ __|/ _ \ __|
 |  _ < (_) | |  | | (_) | |>  <_____/ ___ \\__ \\__ \|  __/ | ||_____/ ___ \__ \__ \  __/ |_ 
 |_| \_\___/|_|  |_|\___/|_/_/\_\   /_/   \_\___/|___/ \___|  \__|    /_/   \_\___/___/\___|\__|
=============================================================================
 Specialized Roblox Studio AI Engine (3D Models & Keyframe Animations Only)
 No General Chat • Pure Roblox Geometry & Transforms • .rbxmx / .rbxm Exporter
=============================================================================
"""
    print(banner)

def check_environment():
    """Checks Python version and Node/npm availability."""
    print(f"[*] Python Version: {sys.version.split()[0]} on {sys.platform}")
    
    # Check Node / npm for web frontend
    node_installed = False
    try:
        node_res = subprocess.run(["node", "--version"], capture_output=True, text=True, check=True, shell=(os.name == 'nt'))
        print(f"[*] Node.js Detected: {node_res.stdout.strip()}")
        node_installed = True
    except (subprocess.SubprocessError, FileNotFoundError):
        print("[!] Node.js not detected in system PATH.")
    
    return node_installed

def run_web(port=3000, auto_open=True, dev=False, prod=False):
    """Starts the Roblox Asset AI Web Application."""
    print_banner()
    has_node = check_environment()
    
    # Probe all configured keys and select the Top 5 best models
    try:
        from scripts.key_rotator import display_and_select_routes
        display_and_select_routes(PROJECT_DIR)
    except Exception as e:
        print(f"[!] Key probe notice: {e}")
    
    if not has_node:
        print("[!] Node.js is required to run the Next.js Web Studio.")
        print("[*] Starting standalone Python API server instead...")
        run_kaggle_server(port=port)
        return

    print(f"\n[*] Launching Roblox Asset AI Web Studio on http://localhost:{port}...")
    
    # Check if dependencies installed
    if not os.path.exists(os.path.join(PROJECT_DIR, "node_modules")):
        print("[*] Installing frontend dependencies (npm install)...")
        subprocess.run(["npm", "install"], cwd=PROJECT_DIR, check=True, shell=(os.name == 'nt'))

    # Check if production build exists (specifically the BUILD_ID file created by 'next build')
    build_dir = os.path.join(PROJECT_DIR, ".next")
    has_prod_build = os.path.exists(os.path.join(build_dir, "BUILD_ID"))

    if prod:
        if not has_prod_build:
            print("[*] Production build not found. Running 'npm run build'...")
            subprocess.run(["npm", "run", "build"], cwd=PROJECT_DIR, check=True, shell=(os.name == 'nt'))
        cmd = ["npm", "start"]
    elif dev:
        cmd = ["npm", "run", "dev"]
    else:
        # Default: if production build is ready, use it for fastest startup; otherwise run dev
        cmd = ["npm", "start"] if has_prod_build else ["npm", "run", "dev"]

    print(f"[*] Executing: {' '.join(cmd)}")
    proc = subprocess.Popen(cmd, cwd=PROJECT_DIR, shell=(os.name == 'nt'))

    # Wait for server to become responsive
    url = f"http://localhost:{port}"
    print(f"[*] Waiting for server to initialize at {url}...")
    
    for _ in range(30):
        time.sleep(1)
        # Check if the process crashed early
        if proc.poll() is not None:
            if cmd == ["npm", "start"]:
                print("[!] 'npm start' failed (no production build or crashed). Falling back to 'npm run dev'...")
                cmd = ["npm", "run", "dev"]
                print(f"[*] Executing: {' '.join(cmd)}")
                proc = subprocess.Popen(cmd, cwd=PROJECT_DIR, shell=(os.name == 'nt'))
            else:
                print(f"[!] Server process exited unexpectedly with code {proc.returncode}.")
                return

        try:
            with urllib.request.urlopen(url, timeout=2) as response:
                if response.status == 200:
                    print(f"\n[+] SERVER IS LIVE: {url}")
                    if auto_open:
                        webbrowser.open(url)
                    break
        except (urllib.error.URLError, TimeoutError, ConnectionRefusedError):
            pass

    try:
        proc.wait()
    except KeyboardInterrupt:
        print("\n[*] Shutting down server gracefully...")
        proc.terminate()
        proc.wait()
        print("[+] Server stopped.")

def run_kaggle_server(port=8000, ngrok_token=None):
    """Starts the dedicated Kaggle inference server in Python."""
    print_banner()
    serve_script = os.path.join(PROJECT_DIR, "kaggle", "serve.py")
    cmd = [sys.executable, serve_script, "--port", str(port)]
    if ngrok_token:
        cmd.extend(["--ngrok_token", ngrok_token])
    
    print(f"[*] Starting Kaggle LLM Server on port {port}...")
    subprocess.run(cmd, cwd=PROJECT_DIR)

def run_training(epochs=3, use_4bit=True):
    """Starts fine-tuning the 1.5B Roblox LLM."""
    print_banner()
    train_script = os.path.join(PROJECT_DIR, "kaggle", "train.py")
    cmd = [
        sys.executable,
        train_script,
        "--model_name", "Qwen/Qwen2.5-Coder-1.5B-Instruct",
        "--data_dir", os.path.join(PROJECT_DIR, "dataset"),
        "--output_dir", os.path.join(PROJECT_DIR, "checkpoints", "roblox-asset-ai-t4"),
        "--epochs", str(epochs),
    ]
    if use_4bit:
        cmd.append("--use_4bit")

    print(f"[*] Launching specialized Roblox LLM fine-tuning...")
    print(f"[*] Command: {' '.join(cmd)}")
    subprocess.run(cmd, cwd=PROJECT_DIR)

def run_benchmark():
    """Runs the automated benchmark suite."""
    print_banner()
    print("[*] Running RobloxAssetBench suite...")
    subprocess.run(["npm", "run", "benchmark"], cwd=PROJECT_DIR, shell=(os.name == 'nt'))

def cli_generate(prompt: str, asset_type: str = "model", out_format: str = "rbxmx"):
    """Command-line asset generation without needing a browser."""
    print_banner()
    print(f"[*] Generating '{asset_type}' for prompt: '{prompt}'")
    
    # Call the local or live API
    url = "http://localhost:3000/api/generate"
    try:
        req_data = json.dumps({
            "prompt": prompt,
            "assetType": asset_type,
            "maxIterations": 3,
            "qualityThreshold": 0.90,
            "stylePreset": "stylized",
            "provider": "frontier"
        }).encode("utf-8")
        
        req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=90) as res:
            data = json.loads(res.read().decode("utf-8"))
            
            if data.get("success"):
                model_name = data["finalModelIR"]["name"]
                instances_count = len(data["finalModelIR"]["instances"])
                score = round(data["finalQualityScore"] * 100)
                print(f"[+] Generated: {model_name} ({instances_count} Roblox parts, Quality: {score}%)")
                
                # Fetch export
                export_url = "http://localhost:3000/api/export"
                exp_data = json.dumps({
                    "modelIR": data["finalModelIR"],
                    "format": out_format
                }).encode("utf-8")
                
                exp_req = urllib.request.Request(export_url, data=exp_data, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(exp_req) as exp_res:
                    out_file = f"{model_name}.{out_format}"
                    with open(out_file, "wb") as f:
                        f.write(exp_res.read())
                    print(f"[+] Exported file saved to: {os.path.abspath(out_file)}")
            else:
                print(f"[!] Generation failed: {data.get('error')}")
    except Exception as e:
        print(f"[!] Error: {e}. Is the server running? Start it with 'python main.py'.")

def main():
    parser = argparse.ArgumentParser(description="Roblox Asset AI - Master Python Application Runner")
    parser.add_argument("--web", action="store_true", help="Launch the full Web Studio UI (Default)")
    parser.add_argument("--dev", action="store_true", help="Launch in development mode with hot-reloading")
    parser.add_argument("--prod", action="store_true", help="Launch in optimized production mode")
    parser.add_argument("--kaggle", action="store_true", help="Launch the Kaggle Model Inference Server")
    parser.add_argument("--train", action="store_true", help="Fine-tune the Roblox LLM on Kaggle/GPU")
    parser.add_argument("--benchmark", action="store_true", help="Run the automated RobloxAssetBench")
    parser.add_argument("--generate", type=str, default=None, help="Generate an asset via CLI prompt")
    parser.add_argument("--type", type=str, default="model", choices=["model", "animation", "model_with_animation"], help="Asset type")
    parser.add_argument("--format", type=str, default="rbxmx", choices=["rbxmx", "rbxm"], help="Export format")
    parser.add_argument("--port", type=int, default=3000, help="Web studio port")
    parser.add_argument("--ngrok", type=str, default=None, help="Ngrok token for Kaggle server tunnel")
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs")

    args = parser.parse_args()

    if args.kaggle:
        run_kaggle_server(port=8000, ngrok_token=args.ngrok)
    elif args.train:
        run_training(epochs=args.epochs)
    elif args.benchmark:
        run_benchmark()
    elif args.generate:
        cli_generate(prompt=args.generate, asset_type=args.type, out_format=args.format)
    else:
        # Default action: run the web studio
        run_web(port=args.port, dev=args.dev, prod=args.prod)

if __name__ == "__main__":
    main()
