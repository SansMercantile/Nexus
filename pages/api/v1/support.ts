import type { NextApiRequest, NextApiResponse } from 'next';
import { generateGemma } from '@/lib/gemma-client';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow both GET and POST for flexibility
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ 
      message: 'Method not allowed',
      allowed: ['GET', 'POST'],
      received: req.method
    });
  }

  try {
    // Handle GET requests (for health checks or simple queries)
    if (req.method === 'GET') {
      const { prompt } = req.query;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(200).json({
          status: 'ready',
          message: 'Support API is ready for requests',
          usage: {
            post: 'POST /api/v1/support with { prompt: string, messages?: Message[] }',
            get: 'GET /api/v1/support?prompt=your_question'
          }
        });
      }

      // Simple GET request with prompt
      const gemmaResponse = await generateGemma(prompt);
      return res.status(200).json({ response: gemmaResponse });
    }

    // Handle POST requests (for complex queries with message history)
    const { prompt, messages } = req.body as { prompt?: string; messages?: Message[] };

    const normalizedPrompt = prompt?.trim() ||
      (Array.isArray(messages)
        ? messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n')
        : '');

    if (!normalizedPrompt) {
      return res.status(400).json({ message: 'Prompt or messages are required' });
    }

    const gemmaResponse = await generateGemma(normalizedPrompt);
    return res.status(200).json({ response: gemmaResponse });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Support API] Error:', message);
    
    return res.status(500).json({ 
      message: 'AI request failed', 
      error: message,
      timestamp: new Date().toISOString()
    });
  }
}
