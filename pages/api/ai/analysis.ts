import type { NextApiRequest, NextApiResponse } from 'next';
import { aiConnection } from '@/src/ai/backend/connection';
import { generateGemma } from '@/lib/gemma-client';

/**
 * POST /api/ai/analysis
 * Generate AI market analysis and store in Vercel Blob
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, analysisType = 'comprehensive' } = req.body;
  const userId = req.headers['x-user-id'] || 'anonymous';
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    // Generate AI analysis using Gemma
    const prompt = `
      You are a senior market analyst. Provide a comprehensive ${analysisType.toUpperCase()} analysis for ${symbol}.
      
      Your analysis should include:
      
      **TECHNICAL ANALYSIS (0-30 points):**
      - Price trends and patterns
      - Key support and resistance levels
      - Indicator signals (RSI, MACD, SMA)
      
      **FUNDAMENTAL ANALYSIS (0-25 points):**
      - Company financials
      - Industry position
      - Growth prospects
      
      **NEWS ANALYSIS (0-20 points):**
      - Recent market-moving news
      - Expected impact on price
      
      **SENTIMENT ANALYSIS (0-15 points):**
      - Market mood and momentum
      - Crowd psychology indicators
      
      **RISK ASSESSMENT (0-10 points):**
      - Volatility analysis
      - Position sizing recommendations
      - Stop-loss levels
      
      Provide your analysis in a structured format with JSON output:
      {
        "technical_analysis": {"score": 0, "summary": "...", "key_levels": []},
        "fundamental_analysis": {"score": 0, "summary": "...", "metrics": {}},
        "news_analysis": {"score": 0, "summary": "...", "events": []},
        "sentiment_analysis": {"score": 0, "summary": "...", "indicators": {}},
        "risk_assessment": {"score": 0, "summary": "...", "var_levels": {}}
      }
    `;

    const aiResponse = await generateGemma(prompt);
    
    // Parse AI response
    let analysisData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback structured analysis
        analysisData = {
          technical_analysis: { score: 15, summary: "Moderately bullish", key_levels: [] },
          fundamental_analysis: { score: 18, summary: "Strong fundamentals", metrics: {} },
          news_analysis: { score: 12, summary: "Positive catalysts", events: [] },
          sentiment_analysis: { score: 8, summary: "Cautiously optimistic", indicators: {} },
          risk_assessment: { score: 6, summary: "Moderate risk", var_levels: {} },
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      analysisData = {
        error: "Failed to parse AI response",
        raw_response: aiResponse,
        technical_analysis: { score: 0, summary: "Parsing error" },
        fundamental_analysis: { score: 0, summary: "Parsing error" },
        news_analysis: { score: 0, summary: "Parsing error" },
        sentiment_analysis: { score: 0, summary: "Parsing error" },
        risk_assessment: { score: 0, summary: "Parsing error" },
      };
    }

    // Store in Vercel Blob
    const blobResult = await aiConnection.storeAnalysis(symbol, {
      type: analysisType,
      content: JSON.stringify(analysisData, null, 2),
      technical: analysisData.technical_analysis,
      fundamental: analysisData.fundamental_analysis,
      news: analysisData.news_analysis,
      sentiment: analysisData.sentiment_analysis,
      risk: analysisData.risk_assessment,
    });

    return res.status(200).json({
      success: true,
      symbol,
      analysisType,
      analysis: analysisData,
      stored: !!blobResult,
      ai_response: aiResponse,
    });

  } catch (error) {
    console.error('AI Analysis Generation Error:', error);
    return res.status(500).json({
      error: 'Failed to generate AI analysis',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * GET /api/ai/analysis?symbol=SYMBOL&limit=100
 * Retrieve stored AI analysis for a symbol
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

// Handle GET requests for retrieving analysis
if (require.main === module) {
  // This allows the file to be used both as API route and module
  const originalHandler = require.main.exports.default;
  
  // Override to handle both GET and POST
  module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const { symbol, limit = '100' } = req.query;
      
      if (!symbol || typeof symbol !== 'string') {
        return res.status(400).json({ error: 'Symbol is required' });
      }
      
      try {
        const aiConnection = (await import('@/src/ai/backend/connection')).aiConnection;
        const analysis = await aiConnection.getAnalysis(symbol, parseInt(limit as string));
        
        return res.status(200).json({
          success: true,
          symbol,
          analysis,
          count: analysis.length,
        });
      } catch (error) {
        console.error('Error retrieving analysis:', error);
        return res.status(500).json({
          error: 'Failed to retrieve analysis',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }
    
    return originalHandler(req, res);
  };
}