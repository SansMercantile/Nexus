# AI Backend Deployment Guide for Private Trading App

This guide walks you through deploying the AI backend with Vercel Blob storage for your Private Trading App.

## 🎯 What You Get

- ✅ Complete AI backend with Vercel Blob storage
- ✅ 20+ specialized AI data directories
- ✅ API routes for AI signals and analysis
- ✅ Secure data encryption (at rest & in transit)
- ✅ TypeScript with full type safety
- ✅ Verification & testing scripts
- ✅ Comprehensive documentation
- ✅ Example usage scripts

## 📁 Files Created

### Core Infrastructure
- `/lib/vercel-blob-storage.ts` - Blob storage management (400+ lines)
- `/src/ai/backend/connection.ts` - AI backend connection (350+ lines)

### API Routes
- `/pages/api/ai/signal.ts` - AI signal generation & storage
- `/pages/api/ai/analysis.ts` - AI market analysis & storage

### Scripts & Tools
- `/scripts/verify-ai-backend.ts` - Connection verification & setup
- `/examples/ai-backend-usage.ts` - Usage examples

### Documentation
- `/docs/ai-backend.md` - Complete documentation
- `/README-AI-BACKEND-DEPLOYMENT.md` - This deployment guide

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Install Dependencies

```bash
cd sansmercantile-nexus

# Install Vercel Blob SDK
npm install @vercel/blob

# Install verification script dependencies
npm install ts-node readline dotenv --save-dev
```

### Step 2: Vercel Connection (Choose One Method)

---

## 🎯 METHOD A: Using Vercel CLI (Recommended)

### 2A. Install & Login

```bash
# Install Vercel CLI globally (if needed)
npm i -g vercel

# Login to Vercel
vercel login

# Follow browser authentication
```

### 2B. Link Project

```bash
# Link to existing project or create new one
vercel link

# When prompted:
# - Select "Link to existing Vercel project" or "Create new Vercel project"
# - Choose your organization (private-kpasc if personal)
```

### 2C. Add Blob Storage

```bash
# Add environment variable for token
vercel env add BLOB_READ_WRITE_TOKEN

# You'll be prompted: What Environment? → Select "Development"
# Value will be automatically generated ✨
```

### 2D. Pull Environment

```bash
# Download environment variables
vercel env pull

# This creates .env.local with your token
```

**📋 Verify Token**: Check `.env.local`:
```env
BLOB_READ_WRITE_TOKEN=va_xxxxxxxxxxxxxxxxxxxx...
```

---

## 🎯 METHOD B: Manual Setup via Vercel Dashboard

### 2A. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended) or email
3. Verify email address

### 2B. Create Project

1. Click **"Add New..."** → **"Project"**
2. Select GitHub as Git provider
3. Authorize Vercel to access your repos
4. Find & select your `sansmercantile-nexus` repo
5. Import project

### 2C. Add Blob Storage

1. Go to **"Storage"** tab → **"Vercel Blob"**
2. Click **"Create Token"**
3. **Permissions**: Check "Blob - Read & Write"
4. Copy the token (looks like: `va_...`)
5. Set as environment variable:

```bash
# In project directory
vercel env add BLOB_READ_WRITE_TOKEN

# When prompted for value, paste the token
```

### 2D. Configure Environment

```bash
# Pull environment to local
vercel pull

# Verify token exists
cat .env.local
```

---

## 🎯 METHOD C: Interactive Setup (No Vercel CLI)

### 2A. Create Vercel Account

1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub

### 2B. Deploy via GitHub Integration

1. In Vercel dashboard: **"Add New..."** → **"Project"**
2. Import your `sansmercantile-nexus` repo
3. Vercel auto-detects Next.js
4. Click **"Deploy"**

### 2C. Add Blob Token

After deployment:

1. Go to project dashboard
2. **"Settings"** → **"Environment Variables"**
3. **"Add Variable"**: `BLOB_READ_WRITE_TOKEN`
4. Value: Leave empty → Vercel auto-generates

### 2D. Get Token

1. Go to **"Storage"** → **"Vercel Blob"**
2. Click **"Create Token"**
3. Set permissions → Copy token
4. Update environment variable with token value

### 2E. Download Configuration

In your local project:

```bash
# Copy token to .env.local
echo "BLOB_READ_WRITE_TOKEN=YOUR_TOKEN_HERE" > .env.local

# Add to gitignore
if [ ! -f .gitignore ]; then echo ".env.local" >> .gitignore; fi
```

---

## 🎯 METHOD D: Using Interactive Verification Script

```bash
# Run interactive setup
tsc scripts/verify-ai-backend.ts connect

# Or if pre-compiled:
node scripts/verify-ai-backend.js connect
```

Follow prompts:
1. Do you have a Vercel token? (Yes/No)
2. If yes → paste token
3. If no → shows instructions to get token

---

## Step 3: Verify Connection

After token is set (in `.env.local`):

```bash
# Run verification
npm run verify:ai

# Or directly:
ts-node scripts/verify-ai-backend.ts verify
```

**Expected Output**:
```
⚙️ Running AI Backend Verification

✅ Env Var BLOB_READ_WRITE_TOKEN: Set to: va_...
✅ Vercel Token: Token format valid (length: 44)
✅ AI Storage Configuration: Storage is enabled
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

## Step 4: Test AI Backend

### Run Examples

```bash
# Run usage examples
npm run test:ai-backend

# Expected: All examples pass with blob URLs
```

### Test API Routes

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Test AI signal endpoint
curl -X POST http://localhost:3000/api/ai/signal \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","timeframe":"1h"}'

# Expected: JSON with signal data and "stored": true

# Terminal 2: Test AI analysis endpoint  
curl -X POST http://localhost:3000/api/ai/analysis \
  -H "Content-Type: application/json" \
  -d '{"symbol":"TSLA","analysisType":"comprehensive"}'

# Expected: JSON with analysis and "stored": true
```

### Check Vercel Dashboard

1. Go to **"Storage"** → **"Vercel Blob"**
2. See files stored in `ai-signals/` and `ai-analysis/` directories
3. Click files to verify content

## Step 5: Deploy to Production

```bash
# Commit your changes
git add .
git commit -m "feat: Add AI backend with Vercel Blob storage"

# Push to trigger Vercel deployment
git push origin main

# Or deploy manually:
vercel --prod
```

## 🎓 Verify Everything Works

### Post-Deployment Tests

```bash
# Production endpoint
curl -X POST https://your-project.vercel.app/api/ai/signal \
  -H "Content-Type: application/json" \
  -d '{"symbol":"MSFT","timeframe":"4h"}'

# Check Vercel dashboard:
# 1. Project → "Deployments" → See successful deployment
# 2. "Storage" → "Vercel Blob" → See stored data
```

## 📚 Documentation

- **Usage Guide**: See `/docs/ai-backend.md`
- **API Docs**: See API routes in `/pages/api/ai/*.ts`
- **Examples**: See `/examples/ai-backend-usage.ts`
- **Telegram Bot**: See `/lib/ai-trading-agent.ts`

## 🎯 Next Steps

### 1. Integrate with Telegram Bot

Update AI agent to use blob storage:

```typescript
// In lib/ai-trading-agent.ts
import { aiConnection } from '@/src/ai/backend/connection';

// Store signals
await aiConnection.storeSignal(symbol, signal);

// Store analysis
await aiConnection.storeAnalysis(symbol, analysis);
```

### 2. Add Monitoring

```bash
# Enable Vercel analytics
vercel analytics

# Set up alerts for blob storage usage
```

### 3. Configure Retention

```bash
# Add cron job for cleanup
echo "0 0 * * 0 npm run cleanup:ai" | crontab -
```

### 4. Multi-Environment Setup

```bash
# Production token
vercel env add BLOB_READ_WRITE_TOKEN production

# Staging token
vercel env add BLOB_READ_WRITE_TOKEN preview

# Development token
vercel env add BLOB_READ_WRITE_TOKEN development
```

## 🔧 Troubleshooting

### Connection Fails

```bash
# Check token
npm run verify:ai

# If fails: Get new token
vercel env add BLOB_READ_WRITE_TOKEN

# Re-verify
npm run verify:ai
```

### API Routes Return 500

```bash
# Check logs
vercel logs --tail

# Check token permissions
echo $BLOB_READ_WRITE_TOKEN | wc -c  # Should be ~44
```

### Blob Storage Not Showing Files

1. Wait 30-60 seconds (indexing delay)
2. Check Vercel dashboard → "Storage" → "Blobs"
3. Check file paths correct (should start with `ai-*/`)
4. Verify token has "Blob - Read & Write" permissions

## 📞 Support

If you get stuck, run verification:

```bash
npm run verify:ai
```

This will show exactly what's wrong and how to fix it!

## ✅ Final Checklist

- [ ] Token in `.env.local`
- [ ] `npm run verify:ai` passes
- [ ] API routes work (`npm run test:ai-signal`)
- [ ] Files appear in Vercel dashboard
- [ ] Telegram bot integration (if needed)
- [ ] Production deployment successful
- [ ] Examples run successfully (`npm run test:ai-backend`)
- [ ] All documentation reviewed

---

## 🎉 You did it!

Your AI backend with Vercel Blob is now fully operational and ready for the Private Trading App!

**Usage**:
```typescript
import { aiConnection } from '@/src/ai/backend/connection';

// Store AI signals
await aiConnection.storeSignal('AAPL', {
  signal_type: 'BUY',
  confidence: 82,
  technical_score: 25,
  // ...
});

// Store analysis
await aiConnection.storeAnalysis('TSLA', analysis);

// Retrieve data
const signals = await aiConnection.getSignals('AAPL');
```

**Questions?** Check `/docs/ai-backend.md` or run `npm run verify:ai` for diagnostics.