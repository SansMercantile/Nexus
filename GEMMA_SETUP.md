# Gemma 4 Local Setup

This project now includes a local integration layer for Gemma 4 via Ollama.

## Install Ollama

1. Install Ollama using winget (Windows):
   ```powershell
   winget install --id Ollama.Ollama -e --silent
   ```

2. Verify the installation:
   ```powershell
   ollama version
   ```

## Run Gemma locally

Start the local Gemma model server:

```powershell
ollama run gemma4:2b
```

For most local machines, `gemma4:2b` is the recommended Gemma 4 model.

## VS Code BYOM / GitHub Copilot Local Inference

If you install the VS Code AI Toolkit or GitHub Copilot extensions, point the custom/local model picker to:

```text
http://localhost:11434
```

This enables VS Code Copilot to use your local Gemma 4 engine without external token billing.

## Local repo integration

- `lib/gemma-client.ts` - client helper for direct local Gemma requests
- `pages/api/gemma.ts` - Next.js API proxy endpoint to forward prompts to the local Gemma instance
- `scripts/gemma_local.py` - local Python helper for quick tests

## Usage

### From the repo API

Send a POST request to:

```
/api/gemma
```

with JSON:

```json
{
  "prompt": "Hello Gemma"
}
```

### From Python

Install `requests` if needed:

```bash
pip install requests
```

Run:

```bash
python scripts/gemma_local.py "Tell me about Sans Mercantile"
```
