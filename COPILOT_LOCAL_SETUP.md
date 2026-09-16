# VS Code GitHub Copilot + Mpeti Setup

## ✅ Your Environment (ACTIVE)

| Component | Status | URL |
|-----------|--------|-----|
| **Web App** | ✅ Running | http://localhost:3002 |
| **LLM Endpoint** | ✅ AWS Bedrock | Configured via `AWS_REGION` / `BEDROCK_MODEL` |
| **Web API** | ✅ Ready | http://localhost:3002/api/llm-support |
| **Direct Mpeti** | ✅ Ready | http://localhost:3002/api/bedrock |

---

## 🚀 Immediate Next Steps

### Step 1: Configure AWS Bedrock

All AI routes in this repo call AWS Bedrock through `lib/bedrock-client.ts`.
Set these environment variables (`.env.local` for development):

```powershell
$env:AWS_ACCESS_KEY_ID="your_aws_key_id"
$env:AWS_SECRET_ACCESS_KEY="your_aws_secret"
$env:AWS_REGION="us-east-1"
$env:BEDROCK_MODEL="amazon.titan-text-express-v1"
```

Verify with:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3002/api/bedrock `
  -ContentType 'application/json' `
  -Body '{"prompt":"Hello Bedrock"}'
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
   - Choose **Custom Endpoint**
   - Set endpoint: `http://localhost:3002/api/llm-support`

### Step 3: Start Using Copilot

Once Bedrock is configured and the dev server is running:

- **Open Copilot Chat:** `Ctrl+Shift+I` or click the Copilot icon
- **Inline Suggestions:** Press `Ctrl+I` on any line
- **Ask Questions:** Type `/ask` or just chat naturally
- **Get Completions:** Start typing for AI auto-complete

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

**Direct Bedrock Proxy**
```bash
POST http://localhost:3002/api/bedrock
Content-Type: application/json

{
  "prompt": "What is the Sans Mercantile constellation?"
}
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Bedrock not configured** | Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `BEDROCK_MODEL` in `.env.local` |
| **AccessDenied on InvokeModel** | Enable model access in the Bedrock console for your region and grant `bedrock:InvokeModel` |
| **Wrong region errors** | The model must be enabled in `AWS_REGION`; SigV4 signing is region-scoped |

---

## 📊 Bedrock Notes

| Property | Value |
|----------|-------|
| **Provider** | AWS Bedrock (sole AI provider) |
| **Default model** | `amazon.titan-text-express-v1` (override with `BEDROCK_MODEL`) |
| **Auth** | SigV4 request signing, no extra SDK needed |
| **Fallbacks** | SMO routes degrade to local heuristics when Bedrock is unreachable |

---

## ✨ Key Features

✅ **Single provider** - All AI routes call AWS Bedrock
✅ **No local GPU needed** - Inference runs in your AWS region
✅ **Signed requests** - SigV4 via `lib/bedrock-client.ts`

---

## 📍 Current Status

- ✅ Web app running on http://localhost:3002
- ✅ Next.js dev environment ready
- ✅ LLM API endpoints configured
- ✅ VS Code AI Toolkit installed
- ⏳ **Waiting for:** AWS Bedrock credentials in `.env.local`

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
3. Make sure the dev server is running and Bedrock is configured.
4. Open GitHub Copilot Chat or use inline suggestions with `Ctrl+I`.

---

**Ready when you are. Set your Bedrock credentials, start the dev server, and you're all set!**
