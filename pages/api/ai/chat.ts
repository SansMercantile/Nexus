import type { NextApiRequest, NextApiResponse } from 'next';
import { generateGemma } from '@/lib/gemma-client';
import { getSupportContext } from '@/lib/support-context';

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
    
    return res.status(200).json({
      response: gemmaResponse,
      context_used: "Public Support Knowledge Base"
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ message: 'Failed to process your request.' });
  }
}