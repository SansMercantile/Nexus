/**
 * SMO-Suite Backend Integration
 * 
 * Bridges the sansmercantile-nexus Next.js frontend to the
 * constellation backend running on port 8000.
 * 
 * Attribution: SansMercantile™ AI Development Team
 */

// SMO Suite backend URL — defaults to localhost in dev, set SMO_BACKEND_URL on Vercel for production
const SMO_BASE = (typeof window === 'undefined'
  ? process.env.SMO_BACKEND_URL
  : undefined) || 'http://localhost:8000';

const SMO_WS_BASE = SMO_BASE.replace(/^http/, 'ws');

export const SMO_SUITE_CONFIG = {
  // Backend endpoints — driven by SMO_BACKEND_URL env var
  endpoints: {
    health:     `${SMO_BASE}/api/v1/system/health`,
    telemetry:  `${SMO_BASE}/api/v1/telemetry`,
    synthesize: `${SMO_BASE}/api/v1/synthesize`,
    signaling:  `${SMO_BASE}/api/v1/synthesis/signal`,
    stressTest: `${SMO_BASE}/api/v1/system/stress-test`,
  },

  // WebSocket for real-time updates
  websocket: `${SMO_WS_BASE}/ws/telemetry`,
  
  // Polling interval (ms)
  pollingInterval: 2000,
  
  // VRAM thresholds
  vramThresholds: {
    critical: 90,
    warning: 85,
    normal: 75,
  },
  
  // Sector layers
  sectorLayers: [
    { name: 'Core', color: '#4a9eff' },
    { name: 'Finance', color: '#22c55e' },
    { name: 'Synthesis', color: '#a855f7' },
    { name: 'Identity', color: '#f59e0b' },
    { name: 'Orchestration', color: '#06b6d4' },
  ],
};

export type TelemetryData = {
  timestamp: string;
  xauusd: {
    symbol: string;
    price: number;
    trend: 'bullish' | 'bearish' | 'neutral';
    rsi: number;
    pattern: string;
    conviction: 'High' | 'Medium' | 'Low';
    animation_trigger: string;
  };
  btcusd: {
    symbol: string;
    price: number;
    trend: string;
    rsi: number;
    volume: number;
  };
  vram: {
    usage_percent: number;
    memory_total: number;
    memory_used: number;
    memory_free: number;
    gpu_temp: number;
    throttling: boolean;
    peak_usage: number;
    quality_action: string;
  };
  priv: {
    status: string;
    active_requests: number;
    zkp_verifications: number;
    last_briefing: string;
    expressions: string[];
    current_expression: string;
    zkp_enabled: boolean;
    optical_truth: boolean;
  };
  mpeti: {
    status: string;
    renders_queued: number;
    synthesis_active: boolean;
    model: string;
    fps: number;
    stress_test: boolean;
    resolution: string;
  };
  sectors: Array<{
    id: string;
    name: string;
    status: string;
    health: number;
    layer: string;
  }>;
  blender: {
    available: boolean;
    render_queue: number;
    golden_monolith: {
      scale: number;
      emission: number;
      rotation: number;
      pulse_phase: number;
    };
    status: string;
  };
  status: string;
  zkp_signature: string;
};

export async function fetchTelemetry(): Promise<TelemetryData | null> {
  try {
    const response = await fetch(SMO_SUITE_CONFIG.endpoints.telemetry);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch telemetry:', error);
    return null;
  }
}

export async function fetchHealth(): Promise<any> {
  try {
    const response = await fetch(SMO_SUITE_CONFIG.endpoints.health);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch health:', error);
    return null;
  }
}

export async function toggleStressTest(enable: boolean): Promise<boolean> {
  try {
    const response = await fetch(SMO_SUITE_CONFIG.endpoints.stressTest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enable }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to toggle stress test:', error);
    return false;
  }
}

export function createWebSocketConnection(
  onMessage: (data: TelemetryData) => void,
  onError?: (error: Event) => void,
  onClose?: () => void
): WebSocket {
  const ws = new WebSocket(SMO_SUITE_CONFIG.websocket);
  
  ws.onopen = () => console.log('WebSocket connected to SMO-Suite');
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as TelemetryData;
      onMessage(data);
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
    }
  };
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError?.(error);
  };
  ws.onclose = () => {
    console.log('WebSocket disconnected');
    onClose?.();
  };
  
  return ws;
}

export function getVRAMStatus(usagePercent: number): {
  status: 'critical' | 'warning' | 'normal';
  color: string;
  message: string;
} {
  if (usagePercent >= SMO_SUITE_CONFIG.vramThresholds.critical) {
    return {
      status: 'critical',
      color: '#ef4444',
      message: 'VRAM Critical - Downscaling quality',
    };
  } else if (usagePercent >= SMO_SUITE_CONFIG.vramThresholds.warning) {
    return {
      status: 'warning',
      color: '#eab308',
      message: 'VRAM Warning - Monitor closely',
    };
  }
  return {
    status: 'normal',
    color: '#22c55e',
    message: 'VRAM Normal',
  };
}

export function getAnimationEmoji(trigger: string): string {
  const animations: Record<string, string> = {
    money_bag: '💰',
    reset_mallet: '🔨',
    rocket_launch: '🚀',
    tnt_explosion: '🧨',
    anvil_drop: '⬇️',
    none: '🎭',
  };
  return animations[trigger] || animations.none;
}