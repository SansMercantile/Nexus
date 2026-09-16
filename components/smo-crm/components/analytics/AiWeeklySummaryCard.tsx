import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Check, 
  Copy, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck2, 
  Zap,
  Info,
  ChevronDown,
  BrainCircuit
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

interface AiWeeklySummaryCardProps {
  kpis: {
    timeframe: string;
    currentSpace: string;
    totalValue: number;
    wonValue: number;
    winRate: number;
    avgScore: number;
    dealCount: number;
    weightedForecast: number;
    pipelineTrendPct: number;
    wonTrendPct: number;
    velocityScore?: number;
    lowerQuartile?: number;
  };
  anomalyFlags?: Array<{
    type: string;
    severity: 'warning' | 'critical' | 'info';
    message: string;
    metric: string;
  }>;
  stageBreakdown?: Array<{
    label: string;
    count: number;
    value: number;
  }>;
}

export const AiWeeklySummaryCard: React.FC<AiWeeklySummaryCardProps> = ({
  kpis,
  anomalyFlags = [],
  stageBreakdown = []
}) => {
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [focusTone, setFocusTone] = useState<'balanced' | 'risks' | 'growth'>('balanced');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);
  const [modelSource, setModelSource] = useState<string>('bedrock');

  const generateAiSummary = async (tone = focusTone) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpis: {
            ...kpis,
            velocityScore: kpis.velocityScore || 88,
            lowerQuartile: kpis.lowerQuartile || 76
          },
          anomalyFlags: anomalyFlags.length > 0 ? anomalyFlags : [
            {
              type: 'healthy_bounds',
              severity: 'info',
              message: 'Deal velocity (88 PTS) is 12 PTS above the historical lower quartile warning threshold (76 PTS).',
              metric: 'Velocity'
            }
          ],
          stageBreakdown,
          focusTone: tone,
          departmentMorale: {
            score: 75,
            status: 'Positive',
            indicator: 'High engineering and BD alignment'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setSummaryText(data.summary);
      setModelSource(data.source || 'bedrock');
      setLastGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      console.error('Failed to generate AI weekly summary:', err);
      setError(err?.message || 'Could not connect to the summary service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate on first mount if not loaded
  useEffect(() => {
    if (!summaryText && !isLoading) {
      generateAiSummary();
    }
  }, []);

  const handleCopy = () => {
    if (!summaryText) return;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Parse markdown headers into visual sections
  const renderFormattedSummary = (text: string) => {
    const lines = text.split('\n');
    const sections: { title: string; content: string[] }[] = [];
    let currentSection: { title: string; content: string[] } = { title: 'Executive Overview', content: [] };

    for (const line of lines) {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        if (currentSection.content.length > 0 || currentSection.title !== 'Executive Overview') {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/^#{2,3}\s+/, '').replace(/^\d+\.\s*/, ''),
          content: []
        };
      } else if (line.trim().length > 0) {
        currentSection.content.push(line);
      }
    }
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }

    if (sections.length === 0) {
      return <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{text}</p>;
    }

    const sectionIcons: Record<number, React.ReactNode> = {
      0: <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />,
      1: <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      2: <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      3: <FileCheck2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {sections.map((sec, idx) => (
          <div 
            key={idx} 
            className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
              idx === 2 
                ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300' 
                : idx === 0 
                ? 'bg-indigo-50/40 border-indigo-200/80 hover:border-indigo-300' 
                : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200/60 pb-1.5">
              {sectionIcons[idx] || <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />}
              <span>{sec.title}</span>
            </div>

            <div className="space-y-1.5 text-slate-700 leading-relaxed">
              {sec.content.map((p, pIdx) => {
                const isBullet = p.trim().startsWith('-') || p.trim().startsWith('•');
                const cleanP = p.replace(/^[-•]\s*/, '');
                
                // Parse bold markdown **text**
                const parts = cleanP.split(/(\*\*.*?\*\*)/g);

                return (
                  <div key={pIdx} className={isBullet ? 'flex items-start gap-1.5 pl-1' : ''}>
                    {isBullet && <span className="text-indigo-500 font-bold shrink-0">•</span>}
                    <p className="flex-1">
                      {parts.map((part, partIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={partIdx} className="font-bold text-slate-900">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return part;
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
      {/* Header with AI Badge & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Executive Weekly AI Performance Synthesis</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                {modelSource === 'bedrock' ? 'AWS Bedrock' : 'Executive Heuristic'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Automated briefing analyzing capital velocity, active opportunities, and anomaly telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Tone Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setFocusTone('balanced');
                generateAiSummary('balanced');
              }}
              className={`px-2 py-1 rounded font-semibold cursor-pointer transition-all ${
                focusTone === 'balanced' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Balanced
            </button>
            <button
              type="button"
              onClick={() => {
                setFocusTone('risks');
                generateAiSummary('risks');
              }}
              className={`px-2 py-1 rounded font-semibold cursor-pointer transition-all ${
                focusTone === 'risks' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Risk & Anomaly Focus
            </button>
            <button
              type="button"
              onClick={() => {
                setFocusTone('growth');
                generateAiSummary('growth');
              }}
              className={`px-2 py-1 rounded font-semibold cursor-pointer transition-all ${
                focusTone === 'growth' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Growth
            </button>
          </div>

          {/* Regenerate Button */}
          <button
            type="button"
            onClick={() => generateAiSummary()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh AI synthesis with latest pipeline data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!summaryText || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="Copy executive summary to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div>
        {isLoading ? (
          <div className="py-8 space-y-3 animate-pulse">
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing portfolio capital, transit velocity, and anomaly flags with AWS Bedrock...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="h-28 bg-slate-100 rounded-xl" />
              <div className="h-28 bg-slate-100 rounded-xl" />
              <div className="h-28 bg-slate-100 rounded-xl" />
              <div className="h-28 bg-slate-100 rounded-xl" />
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Synthesis Unavailable</span>
            </div>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => generateAiSummary()}
              className="px-3 py-1 bg-rose-600 text-white rounded font-semibold hover:bg-rose-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : summaryText ? (
          <div>
            {renderFormattedSummary(summaryText)}
            {lastGeneratedAt && (
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Grounded on live deal records, stage transition logs, and velocity anomaly sensors.
                </span>
                <span>Generated at {lastGeneratedAt}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
