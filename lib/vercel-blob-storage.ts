/**
 * Private Trading App - Vercel Blob Storage for AI Backend
 * Secure storage for AI-generated trading data, signals, and analysis
 */

import { put, list, del, copy, head } from "@vercel/blob";
import type { PutBlobResult } from "@vercel/blob";

// AI Backend Storage Directory Structure
export const AI_BLOB_DIRECTORIES = {
  // AI Signals and Analysis
  AI_SIGNALS: "/ai/signals/",
  AI_ANALYSIS: "/ai/analysis/",
  AI_CHAT_HISTORY: "/ai/chat/",
  AI_EMBEDDINGS: "/ai/embeddings/",
  
  // Trading Strategy Data
  STRATEGY_CONFIGS: "/strategies/configs/",
  STRATEGY_BACKTESTS: "/strategies/backtests/",
  STRATEGY_PERFORMANCE: "/strategies/performance/",
  
  // Risk and Portfolio Management
  RISK_METRICS: "/risk/metrics/",
  RISK_REPORTS: "/risk/reports/",
  PORTFOLIO_SNAPSHOTS: "/portfolio/snapshots/",
  PORTFOLIO_ALERTS: "/portfolio/alerts/",
  
  // Market Data and Analysis
  MARKET_DATA: "/market/prices/",
  TECHNICAL_INDICATORS: "/market/indicators/",
  FUNDAMENTAL_DATA: "/market/fundamentals/",
  NEWS_SENTIMENT: "/market/sentiment/",
  
  // User and Session Management
  USER_PREFERENCES: "/user/preferences/",
  USER_SESSIONS: "/user/sessions/",
  API_USAGE: "/user/usage/",
  
  // Logs and Monitoring
  AI_LOGS: "/logs/ai/",
  TRADING_LOGS: "/logs/trading/",
  SYSTEM_METRICS: "/logs/system/",
  
  // Temporary and Cache
  TEMP_CACHE: "/temp/cache/",
  UPLOAD_STAGING: "/temp/uploads/",
  
  // Compliance and Audit
  COMPLIANCE_REPORTS: "/compliance/reports/",
  AUDIT_LOGS: "/compliance/audit/",

  // Test and Quality Assurance  
  QA_TEST_RESULTS: "/qa/test-results/",
  BENCHMARK_RESULTS: "/qa/benchmarks/",
};

// Type definitions for stored data
type StoredDataTypes = {
  ai_signals: {
    symbol: string;
    signal_type: "BUY" | "SELL" | "HOLD";
    confidence: number;
    timestamp: string;
    factors: Record<string, number>;
  };
  ai_analysis: {
    symbol: string;
    analysis_type: string;
    content: string;
    timestamp: string;
    metadata: Record<string, any>;
  };
  chat_history: {
    user_id: string;
    session_id: string;
    messages: Array<{
      role: "user" | "assistant";
      content: string;
      timestamp: string;
    }>;
  };
  embeddings: {
    vector_id: string;
    embedding: number[];
    metadata: Record<string, any>;
  };
  risk_metrics: {
    timestamp: string;
    metrics: Record<string, number>;
    alerts: string[];
  };
  portfolio_snapshots: {
    user_id: string;
    timestamp: string;
    holdings: Array<{
      symbol: string;
      quantity: number;
      value: number;
    }>;
    total_value: number;
  };
  market_data: {
    symbol: string;
    timeframe: string;
    ohlcv: Array<{
      timestamp: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>;
  };
  technical_indicators: {
    symbol: string;
    indicators: Record<string, Array<{ timestamp: string; value: number }>>;
  };
};

 /**
 * VercelBlobStorage - Singleton for managing AI trading data storage
 * Secure, scalable storage for AI-generated analysis, signals, and trading data
 */
export class VercelBlobStorage {
  private static instance: VercelBlobStorage;
  private token: string | null = null;
  private readonly baseUrl: string;
  
  private constructor() {
    this.token = process.env.BLOB_READ_WRITE_TOKEN || null;
    this.baseUrl = process.env.BLOB_BASE_URL || "https://api.priv.sansmercantile.com";
    
    // Warn if token is missing in production
    if (!this.token && process.env.NODE_ENV === "production") {
      console.warn("Warning: BLOB_READ_WRITE_TOKEN not found in environment variables");
    }
  }

  /**
   * Get singleton instance of VercelBlobStorage
   */
  public static getInstance(): VercelBlobStorage {
    if (!VercelBlobStorage.instance) {
      VercelBlobStorage.instance = new VercelBlobStorage();
    }
    return VercelBlobStorage.instance;
  }

  /**
   * Initialize storage with token (useful for testing or dynamic configuration)
   */
  public initialize(token: string): void {
    this.token = token;
  }

  /**
   * Check if storage is properly configured
   */
  public isConfigured(): boolean {
    return this.token !== null;
  }

  /**
   * Get the base URL for all blob operations
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  // AI SIGNALS AND ANALYSIS METHODS

  /**
   * Store AI-generated trading signal
   */
  public async uploadAISignal(symbol: string, signal: StoredDataTypes["ai_signals"]): Promise<PutBlobResult> {
    const timestamp = new Date().toISOString().split("T")[0];
    const path = `${AI_BLOB_DIRECTORIES.AI_SIGNALS}${symbol}/${timestamp}-${Date.now()}.json`;
    
    return put(path, JSON.stringify(signal, null, 2), {
      access: "public",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  /**
   * Store AI market analysis
   */
  public async uploadAIAnalysis(symbol: string, analysis: StoredDataTypes["ai_analysis"]): Promise<PutBlobResult> {
    const timestamp = new Date().toISOString();
    const path = `${AI_BLOB_DIRECTORIES.AI_ANALYSIS}${symbol}/${timestamp}-${Date.now()}.json`;
    
    return put(path, JSON.stringify(analysis, null, 2), {
      access: "public",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  /**
   * Store AI chat history
   */
  public async uploadChatHistory(userId: string, sessionId: string, messages: StoredDataTypes["chat_history"]["messages"]): Promise<PutBlobResult> {
    const chatData: StoredDataTypes["chat_history"] = {
      user_id: userId,
      session_id: sessionId,
      messages,
    };
    
    const path = `${AI_BLOB_DIRECTORIES.AI_CHAT_HISTORY}${userId}/${sessionId}-${Date.now()}.json`;
    
    return put(path, JSON.stringify(chatData, null, 2), {
      access: "private",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  /**
   * Store embedding vectors for similarity search
   */
  public async uploadEmbedding(embeddingId: string, embedding: StoredDataTypes["embeddings"]): Promise<PutBlobResult> {
    const path = `${AI_BLOB_DIRECTORIES.AI_EMBEDDINGS}${embeddingId}-${Date.now()}.json`;
    
    return put(path, JSON.stringify(embedding, null, 2), {
      access: "private",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  // TRADING STRATEGY METHODS

  /**
   * Store strategy configuration
   */
  public async uploadStrategyConfig(strategyId: string, version: string, config: Record<string, any>): Promise<PutBlobResult> {
    const path = `${AI_BLOB_DIRECTORIES.STRATEGY_CONFIGS}${strategyId}/${version}.json`;
    
    return put(path, JSON.stringify({ strategy_id: strategyId, version, config }, null, 2), {
      access: "private",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  /**
   * Store backtest results
   */
  public async uploadBacktestResults(strategyId: string, results: StoredDataTypes["portfolio_snapshots"]): Promise<PutBlobResult> {
    const backtestDate = new Date().toISOString().split("T")[0];
    const path = `${AI_BLOB_DIRECTORIES.STRATEGY_BACKTESTS}${strategyId}/${backtestDate}-${Date.now()}.json`;
    
    return put(path, JSON.stringify(results, null, 2), {
      access: "public",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  // RISK MANAGEMENT METHODS

  /**
   * Store risk metrics and calculations
   */
  public async uploadRiskMetrics(timestamp: string, metrics: StoredDataTypes["risk_metrics"]): Promise<PutBlobResult> {
    const path = `${AI_BLOB_DIRECTORIES.RISK_METRICS}${timestamp}-${Date.now()}.json`;
    
    return put(path, JSON.stringify(metrics, null, 2), {
      access: "public",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  /**
   * Store portfolio snapshot
   */
  public async uploadPortfolioSnapshot(userId: string, snapshot: StoredDataTypes["portfolio_snapshots"]): Promise<PutBlobResult> {
    const path = `${AI_BLOB_DIRECTORIES.PORTFOLIO_SNAPSHOTS}${userId}/${new Date().toISOString()}-${Date.now()}.json`;
    
    return put(path, JSON.stringify(snapshot, null, 2), {
      access: "private",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  // MARKET DATA METHODS

  /**
   * Store market OHLCV data
   */
  public async uploadMarketData(symbol: string, timeframe: string, data: StoredDataTypes["market_data"]): Promise<PutBlobResult> {
    const path = `${AI_BLOB_DIRECTORIES.MARKET_DATA}${symbol}/${timeframe}-${Date.now()}.json`;
    
    return put(path, JSON.stringify(data, null, 2), {
      access: "public",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  /**
   * Store technical indicators
   */
  public async uploadTechnicalIndicators(symbol: string, indicators: StoredDataTypes["technical_indicators"]): Promise<PutBlobResult> {
    const path = `${AI_BLOB_DIRECTORIES.TECHNICAL_INDICATORS}${symbol}/${Date.now()}.json`;
    
    return put(path, JSON.stringify(indicators, null, 2), {
      access: "public",
      addRandomSuffix: false,
      token: this.token || undefined,
    });
  }

  // RETRIEVAL METHODS

  /**
   * List all blobs in a directory
   */
  public async listBlobs(directory: string): Promise<Array<{ url: string; pathname: string; size: number; uploadedAt: string }>> {
    const { blobs } = await list({
      prefix: directory,
      token: this.token || undefined,
    });
    
    return blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));
  }

  /**
   * Delete a blob by URL
   */
  public async deleteBlob(url: string): Promise<void> {
    await del(url, {
      token: this.token || undefined,
    });
  }

  /**
   * Get blob metadata (head request)
   */
  public async getBlobMetadata(url: string): Promise<{ size: number; contentType: string; uploadedAt: string }> {
    const metadata = await head(url, {
      token: this.token || undefined,
    });
    
    return {
      size: metadata.size,
      contentType: metadata.contentType,
      uploadedAt: metadata.uploadedAt,
    };
  }

  // BULK OPERATIONS

  /**
   * Upload multiple AI signals at once
   */
  public async uploadMultipleSignals(signals: Array<{ symbol: string; signal: StoredDataTypes["ai_signals"] }>): Promise<PutBlobResult[]> {
    const promises = signals.map(({ symbol, signal }) => this.uploadAISignal(symbol, signal));
    return Promise.all(promises);
  }

  /**
   * Copy blob to new location
   */
  public async copyBlob(fromUrl: string, toPath: string): Promise<void> {
    await copy(fromUrl, `${AI_BLOB_DIRECTORIES.BACKUP}${toPath}-${Date.now()}.json`, {
      token: this.token || undefined,
    });
  }
}

// Export singleton instance
export const blobStorage = VercelBlobStorage.getInstance();