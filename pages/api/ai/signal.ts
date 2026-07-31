import type { NextApiRequest, NextApiResponse } from 'next';
import { aiConnection } from '@/src/ai/backend/connection';
import { generateGemma } from '@/lib/gemma-client';

/**
 * POST /api/ai/signal
 * Generate AI trading signal and store in Vercel Blob
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, timeframe = '1h' } = req.body;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    // Generate AI signal using Gemma
    const prompt = `
      You are a professional trading analyst. Analyze ${symbol} on the ${timeframe} timeframe.
      
      Provide a trading signal with:
      - Signal type (BUY, SELL, or HOLD)
      - Confidence score (0-100)
      - Technical analysis score (0-30)
      - Fundamental analysis score (0-25)
      - News sentiment score (0-20)
      - Market sentiment score (0-15)
      - Risk management score (0-10)
      
      Respond in JSON format only.
    `;

    const aiResponse = await generateGemma(prompt);
    
    // Parse AI response
    let signalData;
    try {
      // Try to parse JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        signalData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: extract signal from text
        signalData = {
          signal_type: "HOLD",
          confidence: 50,
          technical_score: 15,
          fundamental_score: 12,
          news_score: 10,
          sentiment_score: 7,
          risk_score: 6,
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      signalData = {
        signal_type: "HOLD",
        confidence: 50,
        technical_score: 15,
        fundamental_score: 12,
        news_score: 10,
        sentiment_score: 7,
        risk_score: 6,
        error: "Failed to parse AI response",
        raw_response: aiResponse,
      };
    }

    // Store in Vercel Blob
    const blobResult = await aiConnection.storeSignal(symbol, {
      signal_type: signalData.signal_type || "HOLD",
      confidence: parseInt(String(signalData.confidence)) || 50,
      technical_score: parseInt(String(signalData.technical_score)) || 15,
      fundamental_score: parseInt(String(signalData.fundamental_score)) || 12,
      news_score: parseInt(String(signalData.news_score)) || 10,
      sentiment_score: parseInt(String(signalData.sentiment_score)) || 7,
      risk_score: parseInt(String(signalData.risk_score)) || 6,
    });

    return res.status(200).json({
      success: true,
      symbol,
      signal: signalData,
      stored: !!blobResult,
      ai_response: aiResponse,
    });

  } catch (error) {
    console.error('AI Signal Generation Error:', error);
    return res.status(500).json({
      error: 'Failed to generate AI signal',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}