/**
 * AI Backend Usage Examples
 * Demonstrates how to use the AI backend with Vercel Blob storage
 * 
 * Make sure you have:
 * 1. Set up Vercel with BLOB_READ_WRITE_TOKEN
 * 2. Run the verifier to confirm connection
 */

import { aiConnection } from '@/src/ai/backend/connection';
import type { PutBlobResult } from '@vercel/blob';

/**
 * Example 1: Store AI-generated trading signal
 */
export async function storeTradingSignalExample(): Promise<PutBlobResult | null> {
  console.log('📝 Storing AI trading signal...\n');

  // Generate AI signal for AAPL
  const symbol = 'AAPL';
  const signal = {
    signal_type: 'BUY' as const,
    confidence: 82,
    technical_score: 25,
    fundamental_score: 20,
    news_score: 15,
    sentiment_score: 12,
    risk_score: 10,
  };

  try {
    const result = await aiConnection.storeSignal(symbol, signal);

    if (result) {
      console.log('✅ Signal stored successfully:');
      console.log(`   Symbol: ${symbol}`);
      console.log(`   Signal: ${signal.signal_type}`);
      console.log(`   Confidence: ${signal.confidence}%`);
      console.log(`   Blob URL: ${result.url}`);
      console.log(`   Created: ${result.pathname}\n`);
    } else {
      console.log('❌ Failed to store signal\n');
    }

    return result;
  } catch (error) {
    console.error('Error storing signal:', error);
    return null;
  }
}

/**
 * Example 2: Store AI market analysis
 */
export async function storeMarketAnalysisExample(): Promise<PutBlobResult | null> {
  console.log('📊 Storing AI market analysis...\n');

  const symbol = 'TSLA';
  const analysis = {
    type: 'comprehensive',
    content: 'Tesla shows strong momentum with positive earnings surprise and AI developments in autonomous driving. Technical indicators suggest continuation of uptrend, RSI at 72 indicates overbought conditions but momentum remains strong. Fundamental strength with improving margins in energy sector.',
    technical: {
      rsi: 72,
      macd: 'Bullish',
      sma_50: 240.5,
      support: 220.0,
      resistance: 280.0,
    },
    fundamental: {
      pe_ratio: 65.2,
      revenue_growth: 0.23,
      margin_improvement: 0.05,
    },
    news: {
      catalyst: 'Q4 earnings beat expectations',
      sentiment: 'positive',
      events: ['earnings_beat', 'ai_announcement'],
    },
    sentiment: {
      social_score: 0.75,
      analyst_consensus: 'Buy',
      retail_interest: 'high',
    },
    risk: {
      volatility: 'high',
      sector_risk: 'medium',
      stop_loss: 210.0,
      position_size: '5%',
    },
  };

  try {
    const result = await aiConnection.storeAnalysis(symbol, analysis);

    if (result) {
      console.log('✅ Analysis stored successfully:');
      console.log(`   Symbol: ${symbol}`);
      console.log(`   Type: ${analysis.type}`);
      console.log(`   Blob URL: ${result.url}\n`);
    } else {
      console.log('❌ Failed to store analysis\n');
    }

    return result;
  } catch (error) {
    console.error('Error storing analysis:', error);
    return null;
  }
}

/**
 * Example 3: Store AI chat history
 */
export async function storeChatHistoryExample(): Promise<PutBlobResult | null> {
  console.log('💬 Storing AI chat history...\n');

  const userId = 'user-123';
  const sessionId = 'session-' + Date.now();
  const messages = [
    {
      role: 'user' as const,
      content: 'What are the trading opportunities for AAPL this week?',
    },
    {
      role: 'assistant' as const,
      content: 'AAPL shows strong technical setup with RSI at 32 indicating oversold conditions. Key support at $170, resistance at $185. Fibonacci retracement suggests 38.2% level at $178.50. Economic calendar shows Fed minutes Wednesday could impact tech sector.',
    },
    {
      role: 'user' as const,
      content: 'Should I go long or short?',
    },
    {
      role: 'assistant' as const,
      content: 'Based on technical analysis, AAPL appears setup for a potential bullish reversal. Consider a long position with entry around $170-172, stop loss below $168, targeting $185-190 for swing trade. Risk: Macro uncertainty with upcoming Fed decision.',
    },
  ];

  try {
    const result = await aiConnection.storeChatHistory(userId, sessionId, messages);

    if (result) {
      console.log('✅ Chat history stored successfully:');
      console.log(`   User: ${userId}`);
      console.log(`   Session: ${sessionId}`);
      console.log(`   Messages: ${messages.length}`);
      console.log(`   Blob URL: ${result.url}\n`);
    } else {
      console.log('❌ Failed to store chat history\n');
    }

    return result;
  } catch (error) {
    console.error('Error storing chat history:', error);
    return null;
  }
}

/**
 * Example 4: Store technical indicators
 */
export async function storeTechnicalIndicatorsExample(): Promise<PutBlobResult | null> {
  console.log('📈 Storing technical indicators...\n');

  const symbol = 'GOOGL';
  const indicators = {
    sma: [
      { timestamp: new Date().toISOString(), value: 142.5, period: 20 },
      { timestamp: new Date().toISOString(), value: 138.2, period: 50 },
      { timestamp: new Date().toISOString(), value: 135.8, period: 200 },
    ],
    ema: [
      { timestamp: new Date().toISOString(), value: 141.8, period: 12 },
      { timestamp: new Date().toISOString(), value: 139.5, period: 26 },
    ],
    rsi: [
      { timestamp: new Date().toISOString(), value: 58.3, period: 14 },
    ],
    macd: [
      { 
        timestamp: new Date().toISOString(), 
        value: 2.1, 
        signal: 1.8, 
        histogram: 0.3 
      },
    ],
    bollinger: [
      { 
        timestamp: new Date().toISOString(), 
        upper: 145.2, 
        middle: 142.5, 
        lower: 139.8 
      },
    ],
  };

  try {
    const result = await aiConnection.storeTechnicalIndicators(symbol, indicators);

    if (result) {
      console.log('✅ Technical indicators stored successfully:');
      console.log(`   Symbol: ${symbol}`);
      console.log(`   Indicators: ${Object.keys(indicators).length}`);
      console.log(`   Blob URL: ${result.url}\n`);
    } else {
      console.log('❌ Failed to store indicators\n');
    }

    return result;
  } catch (error) {
    console.error('Error storing technical indicators:', error);
    return null;
  }
}

/**
 * Example 5: Store portfolio snapshot
 */
export async function storePortfolioSnapshotExample(): Promise<PutBlobResult | null> {
  console.log('💼 Storing portfolio snapshot...\n');

  const userId = 'user-123';
  const holdings = [
    { symbol: 'AAPL', quantity: 100, value: 17950, unrealized_pl: 1250 },
    { symbol: 'TSLA', quantity: 50, value: 13250, unrealized_pl: -450 },
    { symbol: 'MSFT', quantity: 75, value: 31500, unrealized_pl: 2100 },
  ];
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

  try {
    const result = await aiConnection.storePortfolioSnapshot(userId, holdings, totalValue);

    if (result) {
      console.log('✅ Portfolio snapshot stored successfully:');
      console.log(`   User: ${userId}`);
      console.log(`   Holdings: ${holdings.length}`);
      console.log(`   Total Value: $${totalValue.toLocaleString()}`);
      console.log(`   Blob URL: ${result.url}\n`);
    } else {
      console.log('❌ Failed to store portfolio snapshot\n');
    }

    return result;
  } catch (error) {
    console.error('Error storing portfolio snapshot:', error);
    return null;
  }
}

/**
 * Example 6: Store risk metrics
 */
export async function storeRiskMetricsExample(): Promise<PutBlobResult | null> {
  console.log('⚠️ Storing risk metrics...\n');

  const metrics = {
    var_95: 1250.50,
    var_99: 2150.75,
    sharpe_ratio: 1.85,
    max_drawdown: 0.12,
    win_rate: 0.68,
    profit_factor: 2.1,
  };
  const alerts = [
    'Portfolio concentration in tech > 60%',
    'AAPL earnings next week - volatility expected',
    'Stop loss hit on TSLA position',
  ];

  try {
    const result = await aiConnection.storeRiskMetrics(metrics, alerts);

    if (result) {
      console.log('✅ Risk metrics stored successfully:');
      console.log(`   VaR (95%): $${metrics.var_95}`);
      console.log(`   VaR (99%): $${metrics.var_99}`);
      console.log(`   Sharpe Ratio: ${metrics.sharpe_ratio}`);
      console.log(`   Alerts: ${alerts.length}`);
      console.log(`   Blob URL: ${result.url}\n`);
    } else {
      console.log('❌ Failed to store risk metrics\n');
    }

    return result;
  } catch (error) {
    console.error('Error storing risk metrics:', error);
    return null;
  }
}

/**
 * Example 7: Retrieve stored signals
 */
export async function retrieveSignalsExample(): Promise<void> {
  console.log('🔍 Retrieving stored signals...\n');

  try {
    const signals = await aiConnection.getSignals('AAPL', 10);
    
    console.log(`   Retrieved ${signals.length} signals\n`);
    
    signals.forEach((signal, index) => {
      console.log(`   Signal ${index + 1}:`);
      if (typeof signal === 'object') {
        console.log(`     - URL: ${signal.url}`);
        console.log(`     - Path: ${signal.pathname}`);
        console.log(`     - Uploaded: ${signal.uploadedAt}`);
      }
    });
    
    console.log('');
  } catch (error) {
    console.error('Error retrieving signals:', error);
  }
}

/**
 * Run all examples
 */
export async function runAllExamples(): Promise<void> {
  console.log('🚀 Running AI Backend Usage Examples\n');
  console.log('=====================================\n');
  
  // Wait for connection
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await storeTradingSignalExample();
  await storeMarketAnalysisExample();
  await storeChatHistoryExample();
  await storeTechnicalIndicatorsExample();
  await storePortfolioSnapshotExample();
  await storeRiskMetricsExample();
  await retrieveSignalsExample();
  
  console.log('✅ All examples completed!\n');
}

// Run examples if called directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}