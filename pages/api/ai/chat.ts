import type { NextApiRequest, NextApiResponse } from 'next';
import { generateGemma } from '@/lib/gemma-client';
import { getSupportContext } from '@/lib/support-context';
import { aiConnection } from '@/src/ai/backend/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt, userId, tenantId } = req.body;

  try {

    const context = await getSupportContext();

    const enrichedPrompt = `
      You are an AI Support Agent for Sans Mercantile. 
      Your goal is to help customers with their inquiries about our services.
      
      CONTEXT:
      ${JSON.stringify(context)}

      USER QUERY:
      ${prompt}

      INSTRUCTIONS:
      - Be professional and helpful.
      - If a customer asks about internal patents, proprietary algorithms, or "how we built the moat", 
        politely decline to share specific technical details but offer to connect them with a human representative.
      - Focus on the value provided by our constellation of systems.
    `;

    const gemmaResponse = await generateGemma(enrichedPrompt);
    
    // Store chat history in Vercel Blob if AI backend is configured
    let chatStored = false;
    try {
      if (aiConnection.isConfigured()) {
        const sessionId = `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        await aiConnection.storeChatHistory(
          userId || 'anonymous',
          sessionId,
          [
            { role: 'user' as const, content: prompt },
            { role: 'assistant' as const, content: gemmaResponse }
          ]
        );
        chatStored = true;
      } else {
        console.log('AI Chat: Vercel Blob not configured, skipping storage');
      }
    } catch (storageError) {
      console.error('AI Chat: Failed to store conversation:', storageError);
      // Non-critical error, continue with response
    }
    
    return res.status(200).json({
      response: gemmaResponse,
      context_used: "Public Support Knowledge Base",
      chat_stored: chatStored
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ message: 'Failed to process your request.' });
  }
}