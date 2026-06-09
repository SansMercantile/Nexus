export interface GemmaGenerateRequest {
  model?: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

export const GEMMA_HOST = process.env.NEXT_PUBLIC_GEMMA_HOST ?? '[https://silo-rocky-extruding.ngrok-free.dev](https://silo-rocky-extruding.ngrok-free.dev)';
const MODEL_ALIASES: Record<string, string> = {
  mpeti: 'gemma:2b',
  'mpeti:2b': 'gemma:2b',
  gemma: 'gemma:2b',
  gemma4: 'gemma:2b',
  'gemma4:2b': 'gemma:2b',
};
const rawModel = (process.env.NEXT_PUBLIC_GEMMA_MODEL ?? 'mpeti').toLowerCase();
export const GEMMA_MODEL = MODEL_ALIASES[rawModel] ?? rawModel;

export async function generateGemma(prompt: string) {
  // If we are using Cloudflare Workers AI, we route the request to our CF Worker
  if (process.env.NEXT_PUBLIC_AI_PROVIDER === 'cloudflare') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CF_WORKER_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CF_AI_TOKEN}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare AI request failed: ${response.status}`);
    }
    return response.json();
  }

  // Fallback to local Ollama/Gemma host
  const payload: GemmaGenerateRequest = {
    model: GEMMA_MODEL,
    prompt,
    max_tokens: 256,
    temperature: 0.7,
  };

  const response = await fetch(`${GEMMA_HOST}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gemma request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
