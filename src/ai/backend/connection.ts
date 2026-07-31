/**
 * Private Trading App - AI Backend with Vercel Blob Storage
 * Secure storage for AI-generated analysis, signals, and chat history
 */

import { VercelBlobStorage, AI_BLOB_DIRECTORIES } from "@/lib/vercel-blob-storage";
import type { PutBlobResult } from "@vercel/blob";

// AI Backend Storage Configuration
export interface AIStorageConfig {
  enabled: boolean;
  encrypt: boolean;
  type: "blob";
  token?: string;
}

/**
 * AIConnection - Manages AI backend with Vercel Blob storage
 * Singleton pattern for efficient resource management
 */
export class AIConnection {
  private static instance: AIConnection;
  private storage: VercelBlobStorage;
  private config: AIStorageConfig;

  private constructor() {
    this.storage = VercelBlobStorage.getInstance();
    this.config = {
      enabled: process.env.AI_STORAGE_ENABLED === "true",
      encrypt: process.env.AI_STORAGE_ENCRYPT === "true",
      type: "blob",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    };

    // Initialize storage if token available
    if (this.config.token) {
      this.storage.initialize(this.config.token);
    }

    if (!this.storage.isConfigured() && process.env.NODE_ENV === "production") {
      console.warn("Warning: AIConnection storage not configured properly");
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AIConnection {
    if (!AIConnection.instance) {
      AIConnection.instance = new AIConnection();
    }
    return AIConnection.instance;
  }

  /**
   * Check if AI connection is configured
   */
  public isConfigured(): boolean {
    return this.storage.isConfigured() && this.config.enabled;
  }

  /**
   * Get storage configuration
   */
  public getConfig(): AIStorageConfig {
    return { ...this.config };
  }

  /**
   * Upload AI-generated trading signal
   */
  public async storeSignal(
    symbol: string,
    signal: {
      signal_type: "BUY" | "SELL" | "HOLD";
      confidence: number;
      technical_score?: number;
      fundamental_score?: number;
      news_score?: number;
      sentiment_score?: number;
      risk_score?: number;
    }
  ): Promise<PutBlobResult | null> {
    if (!this.isConfigured()) {
      console.warn("AIConnection: Storage not configured, skipping signal storage");
      return null;
    }

    try {
      const data = {
        symbol,
        confidence: signal.confidence,
        signal_type: signal.signal_type,
        technical_score: signal.technical_score || 0,
        fundamental_score: signal.fundamental_score || 0,
        news_score: signal.news_score || 0,
        sentiment_score: signal.sentiment_score || 0,
        risk_score: signal.risk_score || 0,
        timestamp: new Date().toISOString(),
      };

      const result = await this.storage.uploadAISignal(symbol, data);
      console.log(`AIConnection: Stored signal for ${symbol} - ${signal.signal_type} (${signal.confidence}%)`);
      return result;
    } catch (error) {
      console.error("AIConnection: Error storing signal:", error);
      return null;
    }
  }

  /**
   * Upload AI market analysis
   */
  public async storeAnalysis(
    symbol: string,
    analysis: {
      type: string;
      content: string;
      technical?: Record<string, any>;
      fundamental?: Record<string, any>;
      news?: Record<string, any>;
      sentiment?: Record<string, any>;
      risk?: Record<string, any>;
    }
  ): Promise<PutBlobResult | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const data = {
        symbol,
        type: analysis.type,
        content: analysis.content,
        technical: analysis.technical,
        fundamental: analysis.fundamental,
        news: analysis.news,
        sentiment: analysis.sentiment,
        risk: analysis.risk,
        timestamp: new Date().toISOString(),
        metadata: {
          version: "1.0",
          model: process.env.AI_MODEL || "unknown",
        },
      };

      const result = await this.storage.uploadAIAnalysis(symbol, data);
      console.log(`AIConnection: Stored analysis for ${symbol} - ${analysis.type}`);
      return result;
    } catch (error) {
      console.error("AIConnection: Error storing analysis:", error);
      return null;
    }
  }

  /**
   * Store AI chat history
   */
  public async storeChatHistory(
    userId: string,
    sessionId: string,
    messages: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<PutBlobResult | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const timestampedMessages = messages.map(msg => ({
        ...msg,
        timestamp: new Date().toISOString(),
      }));

      const result = await this.storage.uploadChatHistory(userId, sessionId, timestampedMessages);
      console.log(`AIConnection: Stored chat history for user ${userId}, session ${sessionId}`);
      return result;
    } catch (error) {
      console.error("AIConnection: Error storing chat history:", error);
      return null;
    }
  }

  /**
   * Store technical indicators
   */
  public async storeTechnicalIndicators(
    symbol: string,
    indicators: {
      sma?: Array<{ timestamp: string; value: number; period: number }>;
      ema?: Array<{ timestamp: string; value: number; period: number }>;
      rsi?: Array<{ timestamp: string; value: number; period: number }>;
      macd?: Array<{ timestamp: string; value: number; signal: number; histogram: number }>;
      bollinger?: Array<{ timestamp: string; upper: number; middle: number; lower: number }>;
    }
  ): Promise<PutBlobResult | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const data = {
        symbol,
        indicators,
        timestamp: new Date().toISOString(),
      };

      const result = await this.storage.uploadTechnicalIndicators(symbol, data);
      console.log(`AIConnection: Stored technical indicators for ${symbol}`);
      return result;
    } catch (error) {
      console.error("AIConnection: Error storing technical indicators:", error);
      return null;
    }
  }

  /**
   * Store portfolio snapshot
   */
  public async storePortfolioSnapshot(
    userId: string,
    holdings: Array<{
      symbol: string;
      quantity: number;
      value: number;
      unrealized_pl?: number;
    }>,
    totalValue: number
  ): Promise<PutBlobResult | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const snapshot: StoredDataTypes["portfolio_snapshots"] = {
        user_id: userId,
        timestamp: new Date().toISOString(),
        holdings,
        total_value: totalValue,
      };

      const result = await this.storage.uploadPortfolioSnapshot(userId, snapshot);
      console.log(`AIConnection: Stored portfolio snapshot for user ${userId}`);
      return result;
    } catch (error) {
      console.error("AIConnection: Error storing portfolio snapshot:", error);
      return null;
    }
  }

  /**
   * Store risk metrics
   */
  public async storeRiskMetrics(
    metrics: {
      var_95?: number;
      var_99?: number;
      sharpe_ratio?: number;
      max_drawdown?: number;
      win_rate?: number;
      profit_factor?: number;
    },
    alerts?: string[]
  ): Promise<PutBlobResult | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const timestamp = new Date().toISOString();
      const riskData: StoredDataTypes["risk_metrics"] = {
        timestamp,
        metrics,
        alerts: alerts || [],
      };

      const result = await this.storage.uploadRiskMetrics(timestamp, riskData);
      console.log(`AIConnection: Stored risk metrics for ${timestamp}`);
      return result;
    } catch (error) {
      console.error("AIConnection: Error storing risk metrics:", error);
      return null;
    }
  }

  /**
   * Retrieve AI signals for a symbol
   */
  public async getSignals(symbol: string, limit: number = 100): Promise<any[]> {
    try {
      const blobs = await this.storage.listBlobs(`${AI_BLOB_DIRECTORIES.AI_SIGNALS}${symbol}/`);
      return blobs.slice(0, limit);
    } catch (error) {
      console.error("AIConnection: Error retrieving signals:", error);
      return [];
    }
  }

  /**
   * Retrieve analysis for a symbol
   */
  public async getAnalysis(symbol: string, limit: number = 100): Promise<any[]> {
    try {
      const blobs = await this.storage.listBlobs(`${AI_BLOB_DIRECTORIES.AI_ANALYSIS}${symbol}/`);
      return blobs.slice(0, limit);
    } catch (error) {
      console.error("AIConnection: Error retrieving analysis:", error);
      return [];
    }
  }

  /**
   * Cleanup old data (retention policy)
   */
  public async cleanupOldData(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const blobs = await this.storage.listBlobs(AI_BLOB_DIRECTORIES.AI_SIGNALS);
      let deletedCount = 0;
      
      for (const blob of blobs) {
        const uploadDate = new Date(blob.uploadedAt);
        if (uploadDate < cutoffDate) {
          await this.storage.deleteBlob(blob.url);
          deletedCount++;
        }
      }
      
      console.log(`AIConnection: Cleaned up ${deletedCount} old data files`);
      return deletedCount;
    } catch (error) {
      console.error("AIConnection: Error during cleanup:", error);
      return 0;
    }
  }
}

// Export singleton instance
export const aiConnection = AIConnection.getInstance();