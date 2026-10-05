# 🚀 Complete Kaggle Setup & Python Runner Guide
### Dedicated Roblox Studio AI (3D Models & Keyframe Animations Only)

This guide walks you through setting up, fine-tuning, and hosting the specialized **Roblox Asset AI** on **Kaggle** (using a free NVIDIA T4 GPU), and running the system with **Python (`main.py` / `run.py`)**.

---

## 💡 What is this AI?
- **NOT A CHATBOT:** It will **not** chat with you, write school essays, or answer homework questions.
- **PURE ROBLOX STUDIO INTELLIGENCE:** It understands Roblox 3D scene graphs, Part instances, materials, CFrames, and Keyframe animations.
- **LIGHTWEIGHT & FAST (1.5B PARAMETERS):** Based on `Qwen2.5-Coder-1.5B` or `Llama-3.2-1B` with **4-bit QLoRA**. It uses less than 2 GB of VRAM and fine-tunes in ~15 minutes on a free Kaggle T4 GPU!

---

## 🖥️ Running Locally with Python (`main.py`)

No JavaScript/Node commands needed to start! Simply use Python:

### 1. Launch the Full Web Studio (UI + 3D Viewport)
```bash
python main.py
```
*(Or `python run.py`). This automatically verifies the environment, launches the studio on `http://localhost:3000`, and opens your web browser!*

### 2. Generate Assets from the Command Line (No Browser Needed)
```bash
python main.py --generate "Create a stylized pirate treasure chest with gold lock"
```
*Outputs a valid `.rbxmx` XML file directly to your project folder ready for Roblox Studio!*

To export binary `.rbxm` or animations:
```bash
python main.py --generate "Combat Mech with missile launcher" --format rbxm
python main.py --generate "Heroic sword slash attack" --type animation
```

### 3. Run Automated Benchmarks
```bash
python main.py --benchmark
```

---

## ⚡ Step-by-Step Kaggle Setup Guide

### Step 1: Create a Kaggle Notebook
1. Go to [kaggle.com](https://www.kaggle.com) and click **"+ Create"** → **"New Notebook"**.
2. On the right-side **Settings** panel:
   - **Accelerator:** Select `GPU T4 x 2` or `GPU T4 x 1` (Free!).
   - **Internet:** Toggle to **On** (required to download the base 1.5B model).

---

### Step 2: Upload or Clone the Code into Kaggle

In your first Kaggle notebook code cell, run:
```python
# Clone the repository (or upload the zip file directly to Kaggle)
!git clone https://github.com/your-username/roblox-asset-ai.git
%cd roblox-asset-ai
```

---

### Step 3: Install Python Dependencies

In Kaggle Cell 2:
```python
!pip install -q transformers peft accelerate bitsandbytes datasets fastapi uvicorn pyngrok
```

Verify your free T4 GPU is active:
```python
!nvidia-smi
```

---

### Step 4: Generate the Specialized Training Dataset

In Kaggle Cell 3:
```python
!python scripts/generate_synthetic_dataset.py
```
*Generates 1,200 training examples and 150 validation examples for 35+ asset types and 10+ animations in `dataset/`.*

---

### Step 5: Start Fine-Tuning the Roblox LLM (Python)

In Kaggle Cell 4, launch the training process:
```python
!python main.py --train --epochs 3
```
*Alternatively, run the dedicated trainer script with custom parameters:*
```python
!python kaggle/train.py \
    --model_name "Qwen/Qwen2.5-Coder-1.5B-Instruct" \
    --data_dir "./dataset" \
    --output_dir "./checkpoints/roblox-asset-ai-t4" \
    --epochs 3 \
    --batch_size 2 \
    --grad_accum 4 \
    --lr 2e-4 \
    --use_4bit
```

**Training Highlights:**
- **Duration:** ~12–15 minutes on a free T4 GPU.
- **Memory Footprint:** Under 2.8 GB VRAM thanks to 4-bit NF4 quantization.
- **Output:** Saves trained LoRA adapter weights to `./checkpoints/roblox-asset-ai-t4`.

---

### Step 6: Launch the Live Kaggle Server (with Public URL)

To connect your Kaggle model to your local web browser, launch the FastAPI server with a free `ngrok` tunnel:

```python
# Sign up for a free token at https://ngrok.com
NGROK_TOKEN = "your_ngrok_authtoken_here"

!python kaggle/serve.py --port 8000 --ngrok_token $NGROK_TOKEN
```

The output will display your live public HTTPS link:
```text
==================================================
🚀 LIVE PUBLIC KAGGLE URL: https://abcd-1234.ngrok-free.app
Paste this URL into your Roblox Asset AI settings!
==================================================
```

---

### Step 7: Connect the Web App to Kaggle

1. In your local terminal, run `python main.py` to open the web studio.
2. Click the **"Kaggle Dedicated AI"** button in the top navigation bar.
3. Paste your public ngrok URL (e.g. `https://abcd-1234.ngrok-free.app`).
4. Click **"Test Connection"** — it will report:
   ```text
   Online! Connected to RobloxAssetAI-Specialized-1.5B (Kaggle Dedicated).
   ```
5. In the left panel, select **"Kaggle Dedicated LLM"** as your AI Engine.
6. Type any prompt and watch your fine-tuned Kaggle model generate custom Roblox assets!

---

## 🎮 How to Import Generated Assets into Roblox Studio

1. Generate any model on the website and click **"Download .rbxmx"**.
2. Open **Roblox Studio** and load any place/game.
3. In the **Explorer** window, right-click on `Workspace`.
4. Click **"Insert from File..."** and select your downloaded `.rbxmx` file.
5. Your asset will appear in the workspace with proper colors, textures, and geometry!
