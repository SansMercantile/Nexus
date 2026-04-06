# VS Code GitHub Copilot + Gemma 4 BYOM Setup

## ✅ Your Environment (ACTIVE)

| Component | Status | URL |
|-----------|--------|-----|
| **Web App** | ✅ Running | http://localhost:3002 |
| **LLM Endpoint** | ⏳ Pending Ollama | http://localhost:11434 |
| **Web API** | ✅ Ready | http://localhost:3002/api/llm-support |
| **Direct Gemma** | ✅ Ready | http://localhost:3002/api/gemma |

---

## 🚀 Immediate Next Steps

### Step 1: Get Ollama Running

Ollama needs to be installed and started. You have two options:

**Option A: Portable Version (Fastest)**
```powershell
cd 'C:\Users\kpasc\source\repos\sansmercantile-nexus\ollama2'
.\ollama.exe run gemma4:2b
```

**Option B: Full Installation**
Download from https://ollama.ai/download and run the installer, then:
```powershell
ollama run gemma4:2b
```

Once running, you should see:
```
pulling manifest
pulling 1cb8eed600fb... 100% ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 1.3 GB
...
listening on 127.0.0.1:11434
```

### Step 2: Open VS Code and Configure Copilot

1. **Open VS Code** (it's already installed on your system)
2. **Install AI Toolkit** (should already be done, but verify):
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search: `Windows AI Studio` by Microsoft
   - Click **Install** if not already there
3. **Configure the endpoint:**
   - Click the **AI icon** in the VS Code sidebar
   - Click **Settings/Model Selector**
   - Choose **Ollama** or **Custom Endpoint**
   - Set endpoint: `http://localhost:11434`
   - Set model: `gemma4:2b`

### Step 3: Start Using Copilot

Once Ollama is running and VS Code is configured:

- **Open Copilot Chat:** `Ctrl+Shift+I` or click the Copilot icon
- **Inline Suggestions:** Press `Ctrl+I` on any line
- **Ask Questions:** Type `/ask` or just chat naturally
- **Get Completions:** Start typing and Gemma will auto-complete

---

## 📡 API Reference

### Web App Endpoints

**Generic LLM Endpoint (Recommended)**
```bash
POST http://localhost:3002/api/llm-support
Content-Type: application/json

{
  "prompt": "Explain the Sans Mercantile constellation"
}
```

**Direct Ollama Passthrough**
```bash
POST http://localhost:3002/api/gemma
Content-Type: application/json

{
  "prompt": "What is Gemma 4?"
}
```

**Ollama Native Endpoint**
```bash
POST http://localhost:11434/api/generate
Content-Type: application/json

{
  "model": "gemma4:2b",
  "prompt": "Hello",
  "stream": false
}
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Ollama not found** | Download from https://ollama.ai or use portable version in `ollama2/` folder |
| **Port 11434 in use** | Kill process: `Get-Process \| Where { $_.Port -eq 11434 } \| Stop-Process` |
| **VS Code can't connect** | Confirm Ollama running: `curl http://localhost:11434/api/tags` |
| **Model downloading slowly** | First run downloads ~2GB. Normal. Be patient. |
| **Out of memory errors** | Use `gemma4:2b` (2B) not `gemma4:7b` (7B) |

---

## 📊 Gemma 4 Specs

| Property | Value |
|----------|-------|
| **Model Size** | 2B parameters (lightweight) |
| **License** | Apache 2.0 (Sovereign) |
| **Context Window** | ~8k tokens |
| **Speed** | 10-20 tokens/sec |
| **Use Cases** | Code generation, documentation, Q&A |
| **Data Privacy** | All processing local to your machine |

---

## ✨ Key Features

✅ **BYOM (Bring Your Own Model)** - No GitHub token usage  
✅ **Full Privacy** - All data stays on your machine  
✅ **Apache 2.0** - Can embed in your own applications  
✅ **Fast** - 2B model runs even on modest hardware  
✅ **Offline** - Works without internet after initial download  

---

## 📍 Current Status

- ✅ Web app running on http://localhost:3002
- ✅ Next.js dev environment ready
- ✅ LLM API endpoints configured
- ✅ VS Code AI Toolkit installed
- ⏳ **Waiting for:** Ollama to be installed and running
- ⏳ **Next:** Point VS Code to http://localhost:11434

---

## 🧩 VS Code Workspace Integration

This repository includes a workspace `.vscode` configuration for GitHub Copilot/MCP and local code augmentation.

### Updated files
- `.vscode/settings.json`
- `.vscode/extensions.json`

### What is configured
- GitHub Copilot enabled for this workspace
- MCP support enabled for Copilot Chat
- Local code augmentation preferences turned on
- Recommended extensions added for Copilot and AI Toolkit

### Recommended VS Code Extensions
- `github.copilot-chat`
- `ms-windows-ai-studio.windows-ai-studio`

### How to use it
1. Open this repo in VS Code.
2. Accept the recommended extensions if prompted.
3. Make sure Ollama is running on `http://localhost:11434`.
4. Open GitHub Copilot Chat or use inline suggestions with `Ctrl+I`.

---

**Ready when you are. Start Ollama, then configure VS Code's AI Toolkit, and you're all set!**
