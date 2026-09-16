import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Bell, 
  Filter, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export interface VelocityAlert {
  id: string;
  metricName: string;
  currentValue: number;
  formattedCurrentValue: string;
  rollingAverageValue: number;
  formattedRollingAverage: string;
  deviationPct: number; // positive or negative
  thresholdPct: number; // e.g. 20
  direction: 'surge' | 'lag';
  severity: 'critical' | 'high' | 'positive_surge' | 'moderate';
  status: 'active' | 'acknowledged';
  category: 'capital_velocity' | 'deal_count' | 'transit_speed' | 'department_action';
  department?: string;
  summary: string;
  detailedAnalysis: string;
  recommendedAction: string;
  timestamp: string;
}

interface VelocityAlertsWidgetProps {
  dateRange: '7d' | '30d' | 'qtd';
}

export const VelocityAlertsWidget: React.FC<VelocityAlertsWidgetProps> = ({ dateRange }) => {
  const { deals, candidateApplications, meetings, currentSpace } = useCrm();
  const [thresholdFilter, setThresholdFilter] = useState<number>(20); // 20% default as specified
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'surge' | 'lag'>('all');
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Compute deviations from rolling average
  const alerts: VelocityAlert[] = useMemo(() => {
    const list: VelocityAlert[] = [];

    // 1. Capital Velocity Metric
    // Trailing 3-week rolling average = ($580k + $820k + $1.45M) / 3 = $950,000
    const rollingAvgCapital = 950000;
    const currentCapitalMoved = 1680000;
    const capitalDeviationPct = Math.round(((currentCapitalMoved - rollingAvgCapital) / rollingAvgCapital) * 100);

    if (Math.abs(capitalDeviationPct) >= thresholdFilter) {
      list.push({
        id: 'alert-capital-velocity',
        metricName: 'Capital Movement Velocity',
        currentValue: currentCapitalMoved,
        formattedCurrentValue: `$${(currentCapitalMoved / 1000000).toFixed(2)}M`,
        rollingAverageValue: rollingAvgCapital,
        formattedRollingAverage: `$${(rollingAvgCapital / 1000).toFixed(0)}k`,
        deviationPct: capitalDeviationPct,
        thresholdPct: thresholdFilter,
        direction: capitalDeviationPct > 0 ? 'surge' : 'lag',
        severity: capitalDeviationPct > 50 ? 'positive_surge' : 'high',
        status: 'active',
        category: 'capital_velocity',
        department: 'CBDO / Sovereign Command',
        summary: `Capital movement deviated by +${capitalDeviationPct}% above rolling 3-period baseline ($950k).`,
        detailedAnalysis: `A significant capital injection occurred in Series A Meridian Apex ($1.2M) and Palladium Science Award ($350k) pipeline stages, shifting portfolio momentum far beyond standard sprint bands.`,
        recommendedAction: `Ensure CBDO and Legal expedite term sheet redlines before scheduled October committee review.`,
        timestamp: 'Live • Sprint W37',
      });
    }

    // 2. Stage Transit Speed Metric
    // Baseline rolling average: 5.8 days/stage. Current: 4.2 days/stage.
    // Speed improvement = ((5.8 - 4.2) / 5.8) * 100 = 27.6% faster transit
    const rollingAvgTransit = 5.8;
    const currentTransit = 4.2;
    const transitDeviationPct = Math.round(((rollingAvgTransit - currentTransit) / rollingAvgTransit) * 100);

    if (Math.abs(transitDeviationPct) >= thresholdFilter) {
      list.push({
        id: 'alert-transit-speed',
        metricName: 'Pipeline Transit Duration',
        currentValue: currentTransit,
        formattedCurrentValue: '4.2 Days/Stage',
        rollingAverageValue: rollingAvgTransit,
        formattedRollingAverage: '5.8 Days/Stage',
        deviationPct: transitDeviationPct,
        thresholdPct: thresholdFilter,
        direction: 'surge',
        severity: 'positive_surge',
        status: 'active',
        category: 'transit_speed',
        department: 'Operations & Diligence',
        summary: `Stage transit accelerated by +${transitDeviationPct}% compared to rolling average cycle time.`,
        detailedAnalysis: `Fast-track triage of Due Diligence materials reduced bottleneck time by 1.6 days per stage, dramatically speeding up lead qualification.`,
        recommendedAction: `Maintain automated dossier checklists to prevent post-pitch stalls.`,
        timestamp: 'Live • Sprint W37',
      });
    }

    // 3. Weekly Active Deals Moved
    // Rolling avg = (3 + 4 + 5) / 3 = 4.0 deals. Current = 6 deals.
    const rollingAvgDeals = 4.0;
    const currentDealsMoved = 6;
    const dealsDeviationPct = Math.round(((currentDealsMoved - rollingAvgDeals) / rollingAvgDeals) * 100);

    if (Math.abs(dealsDeviationPct) >= thresholdFilter) {
      list.push({
        id: 'alert-deals-volume',
        metricName: 'Deal Advancement Throughput',
        currentValue: currentDealsMoved,
        formattedCurrentValue: `${currentDealsMoved} Deals`,
        rollingAverageValue: rollingAvgDeals,
        formattedRollingAverage: '4.0 Deals/Wk',
        deviationPct: dealsDeviationPct,
        thresholdPct: thresholdFilter,
        direction: 'surge',
        severity: 'high',
        status: 'active',
        category: 'deal_count',
        department: 'Cross-Department',
        summary: `Deal throughput deviated by +${dealsDeviationPct}% above rolling average throughput.`,
        detailedAnalysis: `6 separate institutional opportunities moved forward simultaneously this sprint, compared to the 4-deal baseline rolling average.`,
        recommendedAction: `Distribute deal assignee reviews across secondary associates to avoid diligence bottlenecks.`,
        timestamp: 'Sprint W37 Telemetry',
      });
    }

    // 4. HR & Talent Ingestion Velocity Anomaly
    const talentIngestedCount = candidateApplications.length || 7;
    const rollingAvgTalent = 5.2;
    const talentDeviationPct = Math.round(((talentIngestedCount - rollingAvgTalent) / rollingAvgTalent) * 100);

    if (Math.abs(talentDeviationPct) >= thresholdFilter) {
      list.push({
        id: 'alert-talent-velocity',
        metricName: 'Talent Evaluation Pacing',
        currentValue: talentIngestedCount,
        formattedCurrentValue: `${talentIngestedCount} Dossiers`,
        rollingAverageValue: rollingAvgTalent,
        formattedRollingAverage: '5.2 Dossiers',
        deviationPct: talentDeviationPct,
        thresholdPct: thresholdFilter,
        direction: 'surge',
        severity: 'moderate',
        status: 'active',
        category: 'department_action',
        department: 'HR & Talent Operations',
        summary: `Talent intake rate deviated by +${talentDeviationPct}% from 3-week rolling average.`,
        detailedAnalysis: `A high volume of engineering candidates applied for the Azure PRIV Rail Cloud Architect position, requiring automated AI battery grading.`,
        recommendedAction: `Enable automated video test transcripts to expedite interview scoring.`,
        timestamp: 'Sprint W37 Telemetry',
      });
    }

    return list;
  }, [thresholdFilter, deals, candidateApplications]);

  // Filtered by severity and dismissals
  const activeAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (dismissedAlertIds.has(a.id)) return false;
      if (filterSeverity === 'surge') return a.direction === 'surge';
      if (filterSeverity === 'lag') return a.direction === 'lag';
      return true;
    });
  }, [alerts, dismissedAlertIds, filterSeverity]);

  const toggleDismiss = (id: string) => {
    setDismissedAlertIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasHighDeviation = activeAlerts.some(a => Math.abs(a.deviationPct) >= 20);

  return (
    <div 
      id="smo-velocity-alerts-widget"
      className={`rounded-xl border transition-all duration-300 overflow-hidden shadow-xs ${
        hasHighDeviation
          ? 'bg-white border-amber-300 ring-2 ring-amber-400/20'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Alert Header Strip with Highlight Pulsing Indicator */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-amber-50/60 via-white to-indigo-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="p-2 rounded-lg bg-amber-500 text-white shadow-2xs flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </span>
              {hasHighDeviation && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600 border-2 border-white" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Velocity Alerts & Deviation Engine
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                  ±{thresholdFilter}% Threshold
                </span>
                {hasHighDeviation && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                    Deviation Highlight Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated monitors highlighting when deal velocity or throughput metrics deviate &gt;20% from rolling averages.
              </p>
            </div>
          </div>

          {/* Quick Threshold & Status Filters */}
          <div className="flex items-center gap-2">
            {/* Threshold Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <SlidersHorizontal className="w-3 h-3 text-slate-400 ml-1" />
              <span className="text-[10px] font-semibold text-slate-500">Trigger:</span>
              {[15, 20, 25].map(thresh => (
                <button
                  key={thresh}
                  type="button"
                  onClick={() => setThresholdFilter(thresh)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    thresholdFilter === thresh
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`Trigger alert when metrics deviate by more than ${thresh}% from rolling baseline`}
                >
                  ±{thresh}%
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              {(
                [
                  { id: 'all', label: `All (${activeAlerts.length})` },
                  { id: 'surge', label: 'Surges' },
                  { id: 'lag', label: 'Lags' },
                ] as const
              ).map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterSeverity(f.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    filterSeverity === f.id
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Notifications List */}
      <div className="divide-y divide-slate-100">
        {activeAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">All Deal Velocity Metrics Within Normal Bounds</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No velocity metric has deviated more than ±{thresholdFilter}% from the previous rolling period average.
            </p>
          </div>
        ) : (
          activeAlerts.map(alert => {
            const isPositive = alert.direction === 'surge';
            const isExpanded = selectedAlertId === alert.id;

            return (
              <div 
                key={alert.id}
                className={`p-4 transition-colors ${
                  isPositive 
                    ? 'bg-amber-50/20 hover:bg-amber-50/40' 
                    : 'bg-rose-50/20 hover:bg-rose-50/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      isPositive 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </span>

                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-900">{alert.metricName}</span>
                        <span className="text-[10px] font-semibold text-slate-400">({alert.department})</span>

                        {/* Deviation Percentage Badge (Highlighted) */}
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {isPositive ? '+' : ''}{alert.deviationPct}% vs Rolling Avg
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          {alert.severity === 'positive_surge' ? 'Velocity Surge' : 'Anomaly Detected'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium mt-1">
                        {alert.summary}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1.5 font-mono">
                        <span>Current: <strong className="text-slate-900 font-bold">{alert.formattedCurrentValue}</strong></span>
                        <span>•</span>
                        <span>Rolling Baseline: <strong className="text-slate-700">{alert.formattedRollingAverage}</strong></span>
                        <span>•</span>
                        <span>Threshold: <strong className="text-amber-700">±{alert.thresholdPct}%</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedAlertId(isExpanded ? null : alert.id)}
                      className="px-2.5 py-1 rounded text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      {isExpanded ? 'Hide Diligence' : 'View Diligence'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDismiss(alert.id)}
                      className="px-2.5 py-1 rounded text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>

                {/* Expanded Diligence Drawer */}
                {isExpanded && (
                  <div className="mt-3 p-3.5 rounded-lg bg-white border border-slate-200/90 text-xs space-y-2 animate-in fade-in duration-150">
                    <div>
                      <span className="font-bold text-slate-800 block mb-0.5">Root Cause Telemetry:</span>
                      <p className="text-slate-600 leading-relaxed">{alert.detailedAnalysis}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="font-bold text-indigo-700 block mb-0.5">Executive Recommended Action:</span>
                      <p className="text-slate-700 leading-relaxed font-medium">{alert.recommendedAction}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
