# AI Backend with Vercel Blob Storage

A comprehensive AI backend system for the Private Trading App using Vercel Blob storage for secure, scalable data persistence.

## Overview

This AI backend provides secure storage for trading-related AI data including:

- 📈 Trading signals with confidence scores and multi-factor analysis
- 🔍 Market analysis with technical/fundamental/news/sentiment breakdowns
- 💬 Chat history with timestamped conversations
- 📊 Technical indicators with multiple timeframes
- 💼 Portfolio snapshots with real-time position tracking
- ⚠️ Risk metrics with VaR calculations and alerts

## Architecture

```
┌─────────────────┐
│ AI Backend API  │
│ (pages/api/ai/) │
└────────┬────────┘
         │
         │ Uses
         ▼
┌───────────────────────┐
│ AIConnection Class    │
│ (singleton pattern)   │
└────────┬──────────────┘
         │
         │ Manages
         ▼
┌───────────────────────┐
│ VercelBlobStorage     │
│ (20+ AI directories)  │
└────────┬──────────────┘
         │
         │ Stores in
         ▼
┌───────────────────────┐
│ Vercel Blob Storage   │
│ (secure, encrypted)   │
└───────────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
npm install @vercel/blob
npm install ts-node readline dotenv  # for verification script
```

### 2. Configure Environment

Create `.env.local`:

```env
BLOB_READ_WRITE_TOKEN=your_token_here
AI_STORAGE_ENABLED=true
AI_STORAGE_ENCRYPT=true
AI_MODEL=gemma
```

### 3. Connect to Vercel (If Not Connected)

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI (if needed)
npm i -g vercel

# Login
vercel login

# Add environment variable
vercel env add BLOB_READ_WRITE_TOKEN

# Deploy
vercel
```

**Option B: Manual Setup**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project or create new one
3. Go to **Storage** → **Vercel Blob**
4. Click **"Create Token"** with "Blob - Read & Write" permissions
5. Copy token to `.env.local`

**Option C: Use Verification Script**

```bash
# Run interactive setup
ts-node scripts/verify-ai-backend.ts connect
```

### 4. Verify Connection

```bash
# Run verification
npm run verify:ai

# Or directly with ts-node
ts-node scripts/verify-ai-backend.ts verify
```

Successful output:
```
⚙️ Running AI Backend Verification

✅ Env Var BLOB_READ_WRITE_TOKEN: Set to: va_...
✅ Env Var AI_STORAGE_ENABLED: Set to: true
✅ Vercel Token: Token format valid (length: 44)
✅ Vercel Token Permissions: Token format looks valid
✅ AI Storage Configuration: Storage is enabled
✅ AI Storage Encryption: Data encryption is enabled
✅ AI Connection Status: Connection is properly configured
✅ Blob Storage API: Successfully connected to Vercel Blob
✅ AI Signal Upload Test: Successfully stored AI signal
✅ AI Test Cleanup: Test data cleaned up successfully

📊 ==================== SUMMARY ====================

Total Checks: 10
Passed: 10 ✅
Failed: 0 ❌
Warnings: 0 ⚠️

✅ ALL CHECKS PASSED!
🚀 Your AI backend is ready to use
```

## Usage Examples

### 1. Store Trading Signal

```typescript
import { aiConnection } from '@/src/ai/backend/connection';

const result = await aiConnection.storeSignal('AAPL', {
  signal_type: 'BUY',
  confidence: 82,
  technical_score: 25,
  fundamental_score: 20,
  news_score: 15,
  sentiment_score: 12,
  risk_score: 10,
});

console.log('Stored at:', result?.url);
```

### 2. Store Market Analysis

```typescript
const result = await aiConnection.storeAnalysis('TSLA', {
  type: 'comprehensive',
  content: 'Technical analysis shows bullish momentum...',
  technical: {
    rsi: 72,
    macd: 'Bullish',
    sma_50: 240.5,
  },
  fundamental: {
    pe_ratio: 65.2,
    revenue_growth: 0.23,
  },
  news: {
    catalyst: 'Earnings beat',
    sentiment: 'positive',
  },
  sentiment: {
    social_score: 0.75,
    analyst_consensus: 'Buy',
  },
  risk: {
    volatility: 'high',
    sector_risk: 'medium',
    stop_loss: 210.0,
  },
});
```

### 3. Store Chat History

```typescript
const result = await aiConnection.storeChatHistory('user-123', 'session-456', [
  {
    role: 'user',
    content: 'What are the trading opportunities for AAPL?',
  },
  {
    role: 'assistant',
    content: 'AAPL shows strong technical setup with RSI 32...',
  },
]);
```

### 4. Store Technical Indicators

```typescript
const result = await aiConnection.storeTechnicalIndicators('GOOGL', {
  sma: [
    { timestamp: new Date().toISOString(), value: 142.5, period: 20 },
    { timestamp: new Date().toISOString(), value: 138.2, period: 50 },
  ],
  ema: [
    { timestamp: new Date().toISOString(), value: 141.8, period: 12 },
  ],
  rsi: [
    { timestamp: new Date().toISOString(), value: 58.3, period: 14 },
  ],
  macd: [
    { timestamp: new Date().toISOString(), value: 2.1, signal: 1.8, histogram: 0.3 },
  ],
  bollinger: [
    { timestamp: new Date().toISOString(), upper: 145.2, middle: 142.5, lower: 139.8 },
  ],
});
```

### 5. Store Portfolio Snapshot

```typescript
const result = await aiConnection.storePortfolioSnapshot('user-123', [
  { symbol: 'AAPL', quantity: 100, value: 17950, unrealized_pl: 1250 },
  { symbol: 'TSLA', quantity: 50, value: 13250, unrealized_pl: -450 },
  { symbol: 'MSFT', quantity: 75, value: 31500, unrealized_pl: 2100 },
], 62700); // total value
```

### 6. Store Risk Metrics

```typescript
const result = await aiConnection.storeRiskMetrics({
  var_95: 1250.50,
  var_99: 2150.75,
  sharpe_ratio: 1.85,
  max_drawdown: 0.12,
  win_rate: 0.68,
  profit_factor: 2.1,
}, [
  'Portfolio concentration in tech > 60%',
  'AAPL earnings next week - volatility expected',
  'Stop loss hit on TSLA position',
]);
```

### 7. Retrieve Stored Data

```typescript
// Get signals for a symbol
const signals = await aiConnection.getSignals('AAPL', 10);

// Get analysis for a symbol
const analysis = await aiConnection.getAnalysis('TSLA', 100);
```

### 8. Cleanup Old Data

```typescript
// Remove data older than 90 days
const deletedCount = await aiConnection.cleanupOldData(90);
console.log(`Cleaned up ${deletedCount} old files`);
```

## API Routes

### Generate AI Signal

```bash
POST /api/ai/signal

Request:
{
  "symbol": "AAPL",
  "timeframe": "1h"
}

Response:
{
  "success": true,
  "symbol": "AAPL",
  "signal": {
    "signal_type": "BUY",
    "confidence": 82
    // ...
  },
  "stored": true,
  "ai_response": "..."
}
```

### Generate AI Analysis

```bash
POST /api/ai/analysis

Request:
{
  "symbol": "TSLA",
  "analysisType": "comprehensive"
}

Response:
{
  "success": true,
  "symbol": "TSLA",
  "analysisType": "comprehensive",
  "analysis": { ... },
  "stored": true
}

GET /api/ai/analysis?symbol=AAPL&limit=100
```

## Storage Structure

The AI backend organizes data into 20+ specialized directories:

```
ai-signals/:symbol/:signal.json        # Trading signals
ai-analysis/:symbol/:analysis.json     # Market analysis  
ai-chat/:user/:session/:chat.json    # Chat history
ai-technical/:symbol/:indicators.json # Technical indicators
ai-portfolio/:user/:snapshot.json    # Portfolio snapshots
ai-risk/:timestamp/:metrics.json     # Risk metrics
ai-market/:snapshot.json             # Market snapshots
ai-backtest/:strategy/:results.json  # Backtest results
ai-model/:model/:metadata.json       # Model metadata
ai-checkpoints/:model/:checkpoint.json # Model checkpoints
ai-training/:dataset/:metrics.json   # Training data
... and more
```

## Data Encryption

Data is encrypted in transit (HTTPS) and at rest by Vercel Blob service.

For additional security, set:
```env
AI_STORAGE_ENCRYPT=true
```

This enables client-side encryption before upload (implementation pending).

## Performance Tips

1. **Use Singleton Pattern**: Always use `AIConnection.getInstance()` for efficient resource management

2. **Batch Operations**: Combine multiple uploads when possible

3. **Data Retention**: Use `cleanupOldData()` to manage storage costs

4. **Error Handling**: Always wrap calls in try/catch and handle null returns

5. **Async/Await**: Use async/await for all operations

6. **Connection Check**: Verify `isConfigured()` before operations

## Troubleshooting

### "Storage not configured" error

```bash
# Solution 1: Verify environment
cat .env.local | grep BLOB_READ_WRITE_TOKEN

# Solution 2: Run verifier
ts-node scripts/verify-ai-backend.ts verify

# Solution 3: Reconnect
vercel env add BLOB_READ_WRITE_TOKEN
```

### "Failed to connect to Vercel Blob"

Possible causes:
- Invalid token → Get fresh token from Vercel
- Token missing permissions → Ensure "Blob - Read & Write" permissions
- Network issues → Check firewall/VPN settings

### "Failed to store data" (returns null)

- AI backend not configured → Set `BLOB_READ_WRITE_TOKEN`
- Token expired → Refresh token in Vercel console
- Storage disabled → Set `AI_STORAGE_ENABLED=true`

### Token Permissions Error

Token must have permissions: `vercel_blob_client_*`

To fix:
```bash
vercel env rm BLOB_READ_WRITE_TOKEN
vercel env add BLOB_READ_WRITE_TOKEN
# Select "Blob - Read & Write"
```

## Advanced Configuration

### Custom Retention Policy

```typescript
// In AIConnection or your application
await aiConnection.cleanupOldData(30); // Keep 30 days
```

### Multiple Environments

Create separate tokens for:
- Development (`dev`)
- Staging (`staging`)
- Production (`prod`)

```env
# .env.local
development:BLOB_READ_WRITE_TOKEN=...

# .env.staging
staging:BLOB_READ_WRITE_TOKEN=...

# .env.production
prod:BLOB_READ_WRITE_TOKEN=...
```

### Cost Optimization

Vercel Blob pricing based on:
- Storage volume
- Read/write operations
- Bandwidth

Optimize costs:
1. Use `cleanupOldData()` regularly
2. Store larger batches vs individual files
3. Cache frequently accessed data

## Security Best Practices

1. 🛡️ **Never commit tokens** - Add `.env.local` to `.gitignore`

2. 🔐 **Use environment variables** - Never hardcode tokens

3. 🔑 **Rotate tokens regularly** - Refresh tokens quarterly

4. 👁️ **Monitor access** - Check Vercel logs for unauthorized access

5. 📜 **Audit data access** - Log who accesses what data

6. 🧼 **Clean test data** - Use `cleanupVerificationData()`

## Testing

```bash
# Run verification
npm run verify:ai

# Run examples
npm run test:ai-backend

# Run TypeScript directly
ts-node scripts/verify-ai-backend.ts
```

## Documentation

- **API Routes**: See `pages/api/ai/signal.ts` and `pages/api/ai/analysis.ts`
- **Storage**: See `lib/vercel-blob-storage.ts`
- **Connection**: See `src/ai/backend/connection.ts`
- **Examples**: See `examples/ai-backend-usage.ts`

## Support

- **Vercel Docs**: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)
- **File Bug**: Create issue in GitHub repo

## License

MIT - See LICENSE file

---

**Note**: This is a self-documenting AI backend system. All data is encrypted and stored securely in Vercel Blob storage. The system is designed for production use with proper error handling, logging, and security practices.