import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAiText } from '@/lib/bedrock-client';
import { guardAiRoute } from '@/lib/ai-guard';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt, messages } = req.body as { prompt?: string; messages?: Message[] };

  const normalizedPrompt = prompt?.trim() ||
    (Array.isArray(messages)
      ? messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n')
      : '');

  if (!normalizedPrompt) {
    return res.status(400).json({ message: 'Prompt or messages are required' });
  }

  // Public support chat: strict anonymous quota, generous for portal sessions.
  if (!(await guardAiRoute(req, res, { mode: 'open', scope: 'llm-support' }))) return;

  try {
    const aiResponse = await generateAiText(normalizedPrompt);
    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('LLM support API error:', message);
    return res.status(500).json({ message: 'AI request failed', error: message });
  }
}
