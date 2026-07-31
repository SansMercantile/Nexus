#!/usr/bin/env ts-node

/**
 * AI Backend Verification Script for Private Trading App
 * This script helps verify and setup the AI backend connection to Vercel Blob storage
 */

import dotenv from 'dotenv';
import { AIConnection } from '@/src/ai/backend/connection';
import { VercelBlobStorage } from '@/lib/vercel-blob-storage';
import { prompt } from 'readline';

dotenv.config();

type CheckResult = {
  check: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: any;
};

export class AIBackendVerifier {
  private results: CheckResult[] = [];
  private aiConnection: AIConnection;
  private storage: VercelBlobStorage;

  constructor() {
    this.aiConnection = AIConnection.getInstance();
    this.storage = VercelBlobStorage.getInstance();
  }

  async runAllChecks(): Promise<CheckResult[]> {
    console.log('⚙️ Running AI Backend Verification\n');

    await this.checkEnvironmentVariables();
    await this.checkVercelToken();
    await this.checkStorageConfiguration();
    await this.checkBlobConnection();
    await this.checkAIConnection();

    this.printResults();
    
    return this.results;
  }

  private addResult(check: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: any) {
    this.results.push({ check, status, message, details });
    
    const symbol = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${symbol} ${check}: ${message}`);
    if (details) {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
    console.log('');
  }

  async checkEnvironmentVariables(): Promise<void> {
    console.log('🔍 Checking environment variables...\n');

    const checks = [
      {
        name: 'BLOB_READ_WRITE_TOKEN',
        var: process.env.BLOB_READ_WRITE_TOKEN,
        required: true,
      },
      {
        name: 'AI_STORAGE_ENABLED',
        var: process.env.AI_STORAGE_ENABLED || 'true',
        required: false,
        default: 'true',
      },
      {
        name: 'AI_STORAGE_ENCRYPT',
        var: process.env.AI_STORAGE_ENCRYPT || 'true',
        required: false,
        default: 'true',
      },
      {
        name: 'AI_MODEL',
        var: process.env.AI_MODEL || 'gemma',
        required: false,
        default: 'gemma',
      },
    ];

    for (const check of checks) {
      if (check.required && !process.env[check.name]) {
        this.addResult(
          `Env Var ${check.name}`,
          'FAIL',
          `${check.name} is required but not set`,
          { required: true }
        );
      } else {
        this.addResult(
          `Env Var ${check.name}`,
          'PASS',
          `Set to: ${check.var || check.default}`,
          { value: check.var }
        );
      }
    }
  }

  async checkVercelToken(): Promise<void> {
    console.log('🔍 Checking Vercel token configuration...\n');

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      this.addResult(
        'Vercel Token',
        'FAIL',
        'Missing BLOB_READ_WRITE_TOKEN',
        {
          message: 'Run: vercel env add BLOB_READ_WRITE_TOKEN',
          docs: 'https://vercel.com/docs/storage/vercel-blob#token-permissions'
        }
      );
      return;
    }

    if (token.length < 20) {
      this.addResult(
        'Vercel Token',
        'FAIL',
        'Token appears too short (should be ~44 characters)',
        { length: token.length }
      );
      return;
    }

    this.addResult(
      'Vercel Token',
      'PASS',
      `Token format valid (length: ${token.length})`,
      { token_prefix: token.substring(0, 8) + '...' }
    );

    // Check token permissions (would need actual API call for full validation)
    this.addResult(
      'Vercel Token Permissions',
      'WARN',
      'Token format looks valid. Full permission check requires actual API call.',
      {
        suggestion: 'Test with actual blob upload to verify token permissions'
      }
    );
  }

  async checkStorageConfiguration(): Promise<void> {
    console.log('🔍 Checking storage configuration...\n');

    const config = this.aiConnection.getConfig();
    
    if (config.enabled) {
      this.addResult(
        'AI Storage Configuration',
        'PASS',
        'Storage is enabled',
        { config }
      );
    } else {
      this.addResult(
        'AI Storage Configuration',
        'WARN',
        'Storage is disabled via AI_STORAGE_ENABLED=false',
        { config }
      );
    }

    if (config.encrypt) {
      this.addResult(
        'AI Storage Encryption',
        'PASS',
        'Data encryption is enabled',
        { encrypt: true }
      );
    } else {
      this.addResult(
        'AI Storage Encryption',
        'WARN',
        'Data encryption is disabled',
        { encrypt: false }
      );
    }

    const isConfigured = this.aiConnection.isConfigured();
    this.addResult(
      'AI Connection Status',
      isConfigured ? 'PASS' : 'FAIL',
      isConfigured ? 'Connection is properly configured' : 'Connection is not configured',
      { isConfigured }
    );
  }

  async checkBlobConnection(): Promise<void> {
    console.log('🔍 Checking Vercel Blob connection...\n');

    if (!this.storage.isConfigured()) {
      this.addResult(
        'Blob Storage Connection',
        'FAIL',
        'Storage not configured',
        { advice: 'Run ai_backend_verifier("connect") to setup connection' }
      );
      return;
    }

    try {
      // Test list operation (least invasive)
      const testPath = 'test/';
      const blobs = await this.storage.listBlobs(testPath);
      
      this.addResult(
        'Blob Storage API',
        'PASS',
        'Successfully connected to Vercel Blob',
        { connection: 'active', blob_count: blobs.length }
      );
    } catch (error) {
      this.addResult(
        'Blob Storage API',
        'FAIL',
        'Failed to connect to Vercel Blob',
        {
          error: error instanceof Error ? error.message : String(error),
          advice: 'Check token permissions and network connectivity'
        }
      );
    }
  }

  async checkAIConnection(): Promise<void> {
    console.log('🔍 Checking AI backend connection...\n');

    if (!this.aiConnection.isConfigured()) {
      this.addResult(
        'AI Backend Connection',
        'FAIL',
        'AI backend not configured',
        { advice: 'Run with valid BLOB_READ_WRITE_TOKEN to connect' }
      );
      return;
    }

    try {
      // Test with a dummy signal upload
      const testSymbol = 'TEST-USD';
      const now = Date.now();
      
      const result = await this.aiConnection.storeSignal(testSymbol, {
        signal_type: 'HOLD',
        confidence: 75,
        technical_score: 20,
        fundamental_score: 15,
        news_score: 10,
        sentiment_score: 7,
        risk_score: 5,
      });

      if (result) {
        this.addResult(
          'AI Signal Upload Test',
          'PASS',
          'Successfully stored AI signal',
          { symbol: testSymbol, blob_url: result.url }
        );

        // Cleanup test data
        await this.storage.deleteBlob(result.url);
        
        this.addResult(
          'AI Test Cleanup',
          'PASS',
          'Test data cleaned up successfully',
          {}
        );
      } else {
        this.addResult(
          'AI Signal Upload Test',
          'FAIL',
          'Failed to store AI signal',
          {}
        );
      }
    } catch (error) {
      this.addResult(
        'AI Signal Upload Test',
        'FAIL',
        'Error during upload test',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  private printResults(): void {
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warnCount = this.results.filter(r => r.status === 'WARN').length;

    console.log('📊 ==================== SUMMARY ====================\n');
    console.log(`Total Checks: ${this.results.length}`);
    console.log(`Passed: ${passCount} ✅`);
    console.log(`Failed: ${failCount} ❌`);
    console.log(`Warnings: ${warnCount} ⚠️`);
    console.log('\n');

    if (failCount > 0) {
      console.log('❌ SOME CHECKS FAILED');
      console.log('💡 Next steps:');
      console.log('1. Run: vercel env add BLOB_READ_WRITE_TOKEN to connect Vercel');
      console.log('2. Ensure your token has "Blob - Read & Write" permissions');
      console.log('3. Re-run this verification script\n');
    } else if (warnCount > 0) {
      console.log('⚠️ WARNINGS DETECTED - Backend may work but could be improved');
      console.log('💡 Address warnings for optimal performance\n');
    } else {
      console.log('✅ ALL CHECKS PASSED!');
      console.log('🚀 Your AI backend is ready to use\n');
      console.log('Usage examples:');
      console.log('  const aiConnection = AIConnection.getInstance();');
      console.log('  await aiConnection.storeSignal("AAPL", {...});');
      console.log('\n');
    }
  }

  /**
   * Interactive setup to connect Vercel if not already configured
   */
  async connectVercel(): Promise<void> {
    console.log('🔗 Connecting to Vercel Blob Storage...\n');

    // Check if already connected
    if (this.storage.isConfigured()) {
      console.log('✅ Already connected to Vercel');
      return;
    }

    console.log('📌 To connect to Vercel Blob storage, you need:');
    console.log('1. A Vercel account (https://vercel.com)');
    console.log('2. Your project deployed on Vercel');
    console.log('3. A "Blob - Read & Write" token\n');

    console.log('📝 Getting your token:');
    console.log('   1. Go to your Vercel console');
    console.log('   2. Navigate to "Storage" > "Vercel Blob"');
    console.log('   3. Click "Create Token"');
    console.log('   4. Copy the token\n');

    console.log('💡 Alternative: Run this command:');
    console.log('   vercel env add BLOB_READ_WRITE_TOKEN\n');

    // For demonstration, we'll create a prompt
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (question: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(question, resolve);
      });
    };

    try {
      const haveToken = await askQuestion('Do you have a Vercel Blob token ready? (y/n): ');
      
      if (haveToken.toLowerCase() === 'y') {
        const token = await askQuestion('Please enter your BLOB_READ_WRITE_TOKEN: ');
        
        if (token.trim()) {
          // Update .env file
          const fs = require('fs');
          const envContent = fs.readFileSync('.env.local', 'utf8');
          const updatedEnv = envContent.replace(/^BLOB_READ_WRITE_TOKEN=.*/gm, `BLOB_READ_WRITE_TOKEN=${token}`);
          fs.writeFileSync('.env.local', updatedEnv);
          
          console.log('✅ Token saved to .env.local');
          console.log('🔄 Re-running verification...\n');
          
          // Reinitialize storage
          this.storage.initialize(token);
          
          // Re-run checks
          await this.runAllChecks();
        }
      } else {
        console.log('\nℹ️ Visit https://vercel.com/dashboard to get your token');
        console.log('Then add it with: vercel env add BLOB_READ_WRITE_TOKEN');
      }
    } catch (error) {
      console.error('Error during setup:', error);
    } finally {
      rl.close();
    }
  }

  async cleanupVerificationData(): Promise<void> {
    console.log('🧹 Cleaning up verification test data...\n');
    
    try {
      // Remove any TEST-* files
      const testBlobs = await this.storage.listBlobs('');
      let deletedCount = 0;
      
      for (const blob of testBlobs) {
        if (blob.pathname.includes('TEST-') || blob.pathname.includes('demo')) {
          try {
            await this.storage.deleteBlob(blob.url);
            deletedCount++;
          } catch (error) {
            console.warn(`Failed to delete ${blob.pathname}:`, error);
          }
        }
      }
      
      this.addResult(
        'Cleanup Test Data',
        deletedCount > 0 ? 'PASS' : 'PASS',
        `Cleaned up ${deletedCount} test files`,
        { deleted_count: deletedCount }
      );
    } catch (error) {
      this.addResult(
        'Cleanup Test Data',
        'WARN',
        'Some test data may remain',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}

// CLI interface
if (require.main === module) {
  async function main() {
    const verifier = new AIBackendVerifier();
    
    // Get command from args
    const command = process.argv[2];
    
    switch (command) {
      case 'verify':
        await verifier.runAllChecks();
        break;
      case 'connect':
        await verifier.connectVercel();
        break;
      case 'cleanup':
        await verifier.cleanupVerificationData();
        break;
      default:
        console.log('Usage: ts-node verify-ai-backend.ts [verify|connect|cleanup]');
        console.log('  verify  - Run all verification checks');
        console.log('  connect - Interactive Vercel connection setup');
        console.log('  cleanup - Remove test data\n');
        await verifier.runAllChecks();
    }
  }
  
  main().catch(console.error);
}

// Export for use in other scripts
export default AIBackendVerifier;