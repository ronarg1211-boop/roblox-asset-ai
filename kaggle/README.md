# Roblox Asset AI - Dedicated Kaggle Model Guide
### Ultra-Specialized 3D Model & Animation LLM (Zero Chat • Pure Roblox Studio)

This guide explains how to fine-tune, export, and host the **Roblox Asset AI Specialized Model** on Kaggle's free T4 GPU environment (16GB VRAM).

---

## 🎯 Model Philosophy: Pure Roblox Studio Intelligence
Unlike general chatbots (ChatGPT, Claude, Gemini) that output conversational paragraphs, markdown advice, or general python scripts:
1. **Zero General Chat / Zero Distractions:** The model is strictly conditioned to accept asset requests and output **Roblox Intermediate Representation (IR) JSON**.
2. **Compact & Lightweight (1.5B Parameters):** Uses `Qwen2.5-Coder-1.5B-Instruct` or `Llama-3.2-1B-Instruct`. Fits into less than 2 GB of VRAM with 4-bit QLoRA.
3. **Runs on Free Hardware:** Trains in under 15 minutes on a free Kaggle T4 GPU, and can even run inference on standard CPU.
4. **Dual Capability:** Generates both **3D Models** (with parts, shapes, materials, positions, rotations, colors) and **Keyframe Animations** (with joint transforms and easing styles).

---

## 📂 Kaggle Files Overview

| File | Purpose |
|---|---|
| `kaggle/RobloxAssetAI_Kaggle.ipynb` | **Turnkey Jupyter Notebook** to upload to Kaggle. Runs end-to-end training & live server. |
| `kaggle/train.py` | Full PyTorch + Hugging Face LoRA/QLoRA fine-tuning script. |
| `kaggle/serve.py` | Fast REST API inference server with FastAPI, uvicorn, and ngrok tunneling. |
| `dataset/roblox_sft_train.jsonl` | 1,200 specialized training pairs in modern SFT chat instruction format. |
| `dataset/roblox_sft_val.jsonl` | 150 validation pairs for measuring format adherence and loss. |

---

## 🚀 Step-by-Step Kaggle Setup

### Step 1: Create a Kaggle Notebook
1. Go to [kaggle.com](https://www.kaggle.com) and create a new Python notebook.
2. In the right-hand panel, go to **Settings** → **Accelerator** and select **GPU T4 x 2** or **GPU T4 x 1**.
3. Enable **Internet: On** in the notebook settings.

### Step 2: Upload Files
Upload the `kaggle/` and `dataset/` folders, or clone your repository directly into Kaggle:
```bash
!git clone <your-repo-url>
cd roblox-asset-ai
```

### Step 3: Run the Training Pipeline
Run the cells in `RobloxAssetAI_Kaggle.ipynb` or run the CLI command:
```bash
python kaggle/train.py \
    --model_name "Qwen/Qwen2.5-Coder-1.5B-Instruct" \
    --data_dir "./dataset" \
    --output_dir "./checkpoints/roblox-asset-ai-t4" \
    --batch_size 2 \
    --grad_accum 4 \
    --epochs 3 \
    --lr 2e-4 \
    --use_4bit
```

### Step 4: Launch Live Inference Server
In your Kaggle notebook, run `kaggle/serve.py` to start the live inference API:
```bash
python kaggle/serve.py --port 8000 --ngrok_token "YOUR_NGROK_AUTHTOKEN"
```
*(Get a free ngrok authtoken at [ngrok.com](https://ngrok.com) to generate a public HTTPS link).*

The server will display a live URL:
```text
🚀 LIVE PUBLIC KAGGLE URL: https://xxxx-xx-xx-xx.ngrok-free.app
```

---

## 🔗 Connecting to the Web Application

1. Open your Roblox Asset AI web application (`http://localhost:3000`).
2. Click the **"Kaggle Dedicated AI"** button in the top navigation bar.
3. Paste your public ngrok URL (or `http://localhost:8000` if running locally).
4. Click **"Test Connection"** to verify that your Kaggle LLM is online and responsive.
5. In the generation panel, select **"Kaggle Dedicated LLM"** as the AI Engine!
