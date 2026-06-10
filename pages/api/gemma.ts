import type { NextApiRequest, NextApiResponse } from 'next';
import { generateGemma } from '@/lib/gemma-client';

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
    return res.status(200).json(gemmaResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemma API error:', message);
    return res.status(500).json({ message: 'Local Gemma request failed', error: message });
  }
}
