import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAiText, coerceBedrockText } from '@/lib/bedrock-client';
import { guardAiRoute } from '@/lib/ai-guard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ message: 'Prompt is required and must be a string' });
  }

  // Public proxy with a strict anonymous quota; portal sessions get more.
  // Set AI_REQUIRE_AUTH=1 to restrict this route to signed-in users entirely.
  if (!(await guardAiRoute(req, res, { mode: 'open', scope: 'bedrock', anonLimit: 20 }))) return;

  try {
    const aiResponse = await generateAiText(prompt);
    return res.status(200).json({ response: coerceBedrockText(aiResponse) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Bedrock API error:', message);
    return res.status(500).json({ message: 'AI request failed', error: message });
  }
}
