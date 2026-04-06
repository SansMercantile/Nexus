export interface GemmaGenerateRequest {
  model?: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

export const GEMMA_HOST = process.env.NEXT_PUBLIC_GEMMA_HOST ?? 'http://localhost:11434';
export const GEMMA_MODEL = process.env.NEXT_PUBLIC_GEMMA_MODEL ?? 'gemma4:2b';

export async function generateGemma(prompt: string) {
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
