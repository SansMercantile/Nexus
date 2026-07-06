import type { NextApiRequest, NextApiResponse } from 'next';
import { generateGemma } from '@/lib/gemma-client';

function coerceText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'object') {
    if ('outputText' in value && typeof (value as { outputText?: unknown }).outputText === 'string') {
      return (value as { outputText: string }).outputText;
    }
    if ('completion' in value && typeof (value as { completion?: unknown }).completion === 'string') {
      return (value as { completion: string }).completion;
    }
    if ('response' in value && typeof (value as { response?: unknown }).response === 'string') {
      return (value as { response: string }).response;
    }
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ message: 'Prompt is required and must be a string' });
  }

  try {
    const gemmaResponse = await generateGemma(prompt);
    return res.status(200).json({ response: coerceText(gemmaResponse) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemma API error:', message);
    return res.status(500).json({ message: 'AI request failed', error: message });
  }
}
