import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Users, 
  PieChart, 
  Layers, 
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Building,
  FileSpreadsheet,
  LayoutGrid,
  ListFilter,
  Image as ImageIcon,
  Sliders,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { WeeklyVelocityWidget, DateRangeFilter } from './WeeklyVelocityWidget';
import { VelocityAlertsWidget } from './VelocityAlertsWidget';
import { InteractiveTimeSeriesChart } from './InteractiveTimeSeriesChart';
import { ExecutiveSummaryNotes } from './ExecutiveSummaryNotes';
import { PredictiveForecastingWidget } from './PredictiveForecastingWidget';
import { TargetVsActualWidget } from './TargetVsActualWidget';
import { TeamSentimentWidget } from './TeamSentimentWidget';
import { VelocityAnomalyToast } from './VelocityAnomalyToast';
import { AiWeeklySummaryCard } from './AiWeeklySummaryCard';
import { MetricDrillDownSidePanel } from './MetricDrillDownSidePanel';
import { exportDashboardVisualizations } from '../../utils/exportVisualizations';
import { generateAnalyticsPdf } from '../../utils/exportPdfReport';
import { DEPARTMENTS } from '../../data/departmentsData';
import { Deal, CustomReportTemplate } from '../../types';
import { ActivityHeatmapWidget } from './ActivityHeatmapWidget';
import { CustomReportTemplateModal } from './CustomReportTemplateModal';

export type AnalyticsWidgetId = 
  | 'ai_weekly_summary'
  | 'kpi_cards'
  | 'activity_heatmap'
  | 'weekly_velocity'
  | 'target_vs_actual'
  | 'executive_notes'
  | 'predictive_forecast'
  | 'stage_funnel'
  | 'team_sentiment'
  | 'time_series'
  | 'distribution';

interface WidgetMeta {
  title: string;
  category: string;
}

const WIDGET_META: Record<AnalyticsWidgetId, WidgetMeta> = {
  ai_weekly_summary: { title: 'Executive Weekly AI Performance Synthesis', category: 'Executive AI Brief' },
  kpi_cards: { title: 'Portfolio Capital & Conversion Overview', category: 'Core Metrics' },
  activity_heatmap: { title: 'Cross-Department Activity & Communication Heatmap', category: 'Operations & Comms' },
  weekly_velocity: { title: 'Weekly Deal Velocity & Department Activity', category: 'Velocity Tracking' },
  target_vs_actual: { title: 'Target vs Actual Department Quotas & OKRs', category: 'Quota Management' },
  executive_notes: { title: 'Executive Summary Notes & Directives', category: 'Strategic Directives' },
  predictive_forecast: { title: 'Predictive Capital Forecasting', category: 'Projections' },
  stage_funnel: { title: 'Pipeline Stage Funnel Distribution', category: 'Pipeline Health' },
  team_sentiment: { title: 'Team Morale & Qualitative Sentiment', category: 'Team Operations' },
  time_series: { title: 'Interactive Capital Time Series', category: 'Historical Trends' },
  distribution: { title: 'Workspace & Team Member Distribution', category: 'Allocation' },
};

const PRESETS: Record<string, { label: string; order: AnalyticsWidgetId[] }> = {
  default: {
    label: 'Standard Executive Grid',
    order: [
      'ai_weekly_summary',
      'kpi_cards',
      'activity_heatmap',
      'weekly_velocity',
      'target_vs_actual',
      'executive_notes',
      'predictive_forecast',
      'stage_funnel',
      'team_sentiment',
      'time_series',
      'distribution'
    ]
  },
  executive: {
    label: 'Executive Briefing Priority',
    order: [
      'ai_weekly_summary',
      'executive_notes',
      'kpi_cards',
      'activity_heatmap',
      'target_vs_actual',
      'predictive_forecast',
      'weekly_velocity',
      'stage_funnel',
      'team_sentiment',
      'time_series',
      'distribution'
    ]
  },
  pipeline_ops: {
    label: 'Deal Flow & Operations Focus',
    order: [
      'kpi_cards',
      'activity_heatmap',
      'weekly_velocity',
      'target_vs_actual',
      'stage_funnel',
      'ai_weekly_summary',
      'predictive_forecast',
      'executive_notes',
      'team_sentiment',
      'time_series',
      'distribution'
    ]
  }
};

const STORAGE_WIDGETS_KEY = 'SMO_CRM_ANALYTICS_WIDGETS_ORDER_V2';

export const AnalyticsView: React.FC = () => {
  const { deals, contacts, teamMembers, currentSpace, meetings, candidateApplications } = useCrm();

  // Date range filter: '7d' | '30d' | 'qtd'
  const [dateRange, setDateRange] = useState<DateRangeFilter>('7d');
  
  // Layout toggle: 'wide' | 'compressed'
  const [layoutMode, setLayoutMode] = useState<'wide' | 'compressed'>('wide');

  // PDF export feedback state
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  // Image export feedback state (PNG / SVG)
  const [isExportingImage, setIsExportingImage] = useState<'png' | 'svg' | null>(null);
  const [showImageExportMenu, setShowImageExportMenu] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  // Custom Report Template modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Drill-down side-panel state
  const [drillDownState, setDrillDownState] = useState<{
    isOpen: boolean;
    title: string;
    value: string;
    subtitle?: string;
    category?: string;
    deals: Deal[];
  }>({
    isOpen: false,
    title: '',
    value: '',
    deals: []
  });

  // Drag-and-drop widget layout state
  const [widgetOrder, setWidgetOrder] = useState<AnalyticsWidgetId[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WIDGETS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(id => id in WIDGET_META);
          const missing = (Object.keys(WIDGET_META) as AnalyticsWidgetId[]).filter(id => !valid.includes(id));
          return [...valid, ...missing];
        }
      }
    } catch (e) {
      console.error('Failed reading widget order:', e);
    }
    return PRESETS.default.order;
  });

  const [draggedWidgetId, setDraggedWidgetId] = useState<AnalyticsWidgetId | null>(null);
  const [dragOverWidgetId, setDragOverWidgetId] = useState<AnalyticsWidgetId | null>(null);

  // Interactive tooltip state for Stage Funnel & Breakdown
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);
  // Interactive tooltip state for Spaces
  const [hoveredSpaceName, setHoveredSpaceName] = useState<string | null>(null);
  // Interactive tooltip state for Team Members
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

  const filteredDeals = deals.filter(d => currentSpace === 'All Spaces' || d.space === currentSpace);

  // Dynamic factors based on date range
  const dateRangeMultiplier = dateRange === 'qtd' ? 2.5 : dateRange === '30d' ? 1.8 : 1.0;
  const trendComparisonLabel = dateRange === 'qtd' ? 'vs Q2 baseline' : dateRange === '30d' ? 'vs prior 30d' : 'from last week';

  // Total active pipeline
  const baseTotalValue = filteredDeals.reduce((sum, d) => sum + (d.stage !== 'lost' ? d.value : 0), 0);
  const totalValue = Math.round(baseTotalValue * (dateRange === 'qtd' ? 1.25 : dateRange === '30d' ? 1.1 : 1.0));

  const wonDeals = filteredDeals.filter(d => d.stage === 'won');
  const baseWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = Math.round(baseWonValue * (dateRange === 'qtd' ? 2.2 : dateRange === '30d' ? 1.6 : 1.0));

  const winRate = filteredDeals.length > 0 ? Math.round((wonDeals.length / filteredDeals.length) * 100) : 0;

  // Average Lead Score
  const avgScore = filteredDeals.length > 0
    ? Math.round(
        filteredDeals.reduce((sum, d) => {
          const s = d.leadScore;
          return sum + ((s?.strategicFit || 0) + (s?.fundingCapacity || 0) + (s?.networkLeverage || 0) + (s?.diligenceSpeed || 0));
        }, 0) / filteredDeals.length
      )
    : 0;

  // Percentage trend indicators
  const pipelineTrendPct = dateRange === 'qtd' ? 26.4 : dateRange === '30d' ? 18.2 : 14.2;
  const wonTrendPct = dateRange === 'qtd' ? 42.0 : dateRange === '30d' ? 25.5 : 18.0;
  const winRateTrendPct = dateRange === 'qtd' ? 8.5 : dateRange === '30d' ? 6.2 : 5.0;
  const scoreTrendPct = dateRange === 'qtd' ? 6.8 : dateRange === '30d' ? 4.5 : 3.4;

  // Stage breakdown
  const stages = [
    { id: 'lead', label: 'Lead / Identified', color: 'bg-slate-400', avgTransitDays: 2.1 },
    { id: 'outreach', label: 'Outreach & Sourcing', color: 'bg-blue-500', avgTransitDays: 3.4 },
    { id: 'diligence', label: 'Due Diligence', color: 'bg-amber-500', avgTransitDays: 5.2 },
    { id: 'pitch', label: 'Pitch / Sync', color: 'bg-purple-500', avgTransitDays: 4.0 },
    { id: 'proposal', label: 'Term Sheet / Proposal', color: 'bg-indigo-600', avgTransitDays: 6.1 },
    { id: 'won', label: 'Closed Won', color: 'bg-emerald-500', avgTransitDays: 4.8 },
  ];

  const stageData = stages.map(s => {
    const matching = filteredDeals.filter(d => d.stage === s.id);
    const sum = matching.reduce((acc, d) => acc + d.value, 0);
    const scaledSum = Math.round(sum * (dateRange === 'qtd' ? 1.25 : dateRange === '30d' ? 1.1 : 1.0));
    const avgDealSize = matching.length > 0 ? Math.round(scaledSum / matching.length) : 0;
    
    const stageAvgScore = matching.length > 0
      ? Math.round(
          matching.reduce((acc, d) => {
            const ls = d.leadScore;
            return acc + ((ls?.strategicFit || 0) + (ls?.fundingCapacity || 0) + (ls?.networkLeverage || 0) + (ls?.diligenceSpeed || 0));
          }, 0) / matching.length
        )
      : 80;

    return {
      ...s,
      count: matching.length,
      value: scaledSum,
      pct: totalValue > 0 ? Math.round((scaledSum / totalValue) * 100) : 0,
      avgDealSize,
      stageAvgScore,
      sampleDeals: matching.slice(0, 3).map(d => d.title),
    };
  });

  // Spaces breakdown
  const spaces = ['Sovereign Command', 'CBDO workspace', 'PR & Comms', 'Mpeti', 'CrazyJam Records'];
  const spaceData = spaces.map(sp => {
    const spDeals = deals.filter(d => d.space === sp);
    const sum = spDeals.reduce((acc, d) => acc + d.value, 0);
    const scaledSum = Math.round(sum * (dateRange === 'qtd' ? 1.3 : dateRange === '30d' ? 1.15 : 1.0));
    return {
      name: sp,
      count: spDeals.length,
      value: scaledSum,
      pct: totalValue > 0 ? Math.round((scaledSum / totalValue) * 100) : 0,
      topDeal: spDeals[0]?.title || 'No active deal',
    };
  });

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  // Open Metric Drill-down panel
  const openDrillDown = (
    title: string,
    value: string,
    subtitle: string,
    metricDeals: Deal[],
    category = 'Metric Drill-down'
  ) => {
    setDrillDownState({
      isOpen: true,
      title,
      value,
      subtitle,
      category,
      deals: metricDeals
    });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: AnalyticsWidgetId) => {
    setDraggedWidgetId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: AnalyticsWidgetId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverWidgetId !== id) {
      setDragOverWidgetId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: AnalyticsWidgetId) => {
    e.preventDefault();
    if (!draggedWidgetId || draggedWidgetId === targetId) {
      setDraggedWidgetId(null);
      setDragOverWidgetId(null);
      return;
    }

    const current = [...widgetOrder];
    const fromIndex = current.indexOf(draggedWidgetId);
    const toIndex = current.indexOf(targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      current.splice(fromIndex, 1);
      current.splice(toIndex, 0, draggedWidgetId);
      setWidgetOrder(current);
      try {
        localStorage.setItem(STORAGE_WIDGETS_KEY, JSON.stringify(current));
      } catch (err) {
        console.error(err);
      }
    }

    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  const handleDragEnd = () => {
    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  const moveWidget = (id: AnalyticsWidgetId, direction: -1 | 1) => {
    const current = [...widgetOrder];
    const idx = current.indexOf(id);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= current.length) return;

    const [removed] = current.splice(idx, 1);
    current.splice(targetIdx, 0, removed);
    setWidgetOrder(current);
    try {
      localStorage.setItem(STORAGE_WIDGETS_KEY, JSON.stringify(current));
    } catch (err) {
      console.error(err);
    }
  };

  const applyPreset = (presetKey: string) => {
    if (PRESETS[presetKey]) {
      setWidgetOrder(PRESETS[presetKey].order);
      try {
        localStorage.setItem(STORAGE_WIDGETS_KEY, JSON.stringify(PRESETS[presetKey].order));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const resetWidgetOrder = () => {
    setWidgetOrder(PRESETS.default.order);
    try {
      localStorage.removeItem(STORAGE_WIDGETS_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Visualizations Image Export (PNG / SVG)
  const handleExportVisualizations = async (format: 'png' | 'svg') => {
    setIsExportingImage(format);
    setShowImageExportMenu(false);
    try {
      const res = await exportDashboardVisualizations({
        elementId: 'analytics-visualizations-board',
        format,
        filenamePrefix: `SMO-Executive-Analytics-${dateRange}`
      });
      setExportSuccessMessage(`Visualizations exported successfully! Downloaded: ${res.filename}`);
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Failed to export visualization image:', err);
    } finally {
      setIsExportingImage(null);
    }
  };

  // Handle PDF Export
  const handleExportPdf = () => {
    setIsExportingPdf(true);
    setExportSuccessMessage(null);

    try {
      const cbdoDeals = deals.filter(d => d.space === 'CBDO workspace');
      const cbdoCapital = cbdoDeals.reduce((sum, d) => sum + (d.stage !== 'lost' ? d.value : 0), 0);
      const techApplications = candidateApplications.filter(c => c.jobTitle.toLowerCase().includes('azure') || c.jobTitle.toLowerCase().includes('architect'));
      const devSyncs = meetings.filter(m => m.title.toLowerCase().includes('dev') || m.title.toLowerCase().includes('rail')).length;
      const commsMeetings = meetings.filter(m => m.space === 'PR & Comms').length;
      const mediaContacts = contacts.filter(c => c.space === 'PR & Comms').length;
      const execDeals = deals.filter(d => d.space === 'Sovereign Command');

      const timeHorizonLabel = 
        dateRange === '7d' ? 'Last 7 Days' :
        dateRange === '30d' ? 'Last 30 Days' : 'Quarter-to-Date (Q3 2026)';

      const departmentMetricsForPdf = [
        {
          name: DEPARTMENTS.cbdo.name,
          leadName: DEPARTMENTS.cbdo.leadName,
          leadRole: DEPARTMENTS.cbdo.leadRole,
          weeklyActionsCount: cbdoDeals.length + 8,
          primaryMetricLabel: 'Pipeline Managed',
          primaryMetricValue: formatCurrency(cbdoCapital),
          velocityScore: 92,
          velocityTrendPct: 18.5,
          activeInitiative: 'Series A Sovereign Growth Syndicate & Term Sheet Review',
        },
        {
          name: DEPARTMENTS.dev.name,
          leadName: DEPARTMENTS.dev.leadName,
          leadRole: DEPARTMENTS.dev.leadRole,
          weeklyActionsCount: techApplications.length + devSyncs + 12,
          primaryMetricLabel: 'Engineering Sprint Throughput',
          primaryMetricValue: '96.4% on Schedule',
          velocityScore: 96,
          velocityTrendPct: 24.2,
          activeInitiative: 'Azure Architecture Core & Sovereign API Integration',
        },
        {
          name: DEPARTMENTS.communications.name,
          leadName: DEPARTMENTS.communications.leadName,
          leadRole: DEPARTMENTS.communications.leadRole,
          weeklyActionsCount: commsMeetings + mediaContacts + 15,
          primaryMetricLabel: 'Media Engagements',
          primaryMetricValue: '18 Tier-1 Outlets',
          velocityScore: 89,
          velocityTrendPct: 14.8,
          activeInitiative: 'Global Financial Press Syndication & Brand Alignment',
        },
        {
          name: DEPARTMENTS.hr.name,
          leadName: DEPARTMENTS.hr.leadName,
          leadRole: DEPARTMENTS.hr.leadRole,
          weeklyActionsCount: candidateApplications.length + 6,
          primaryMetricLabel: 'Talent Intake',
          primaryMetricValue: `${candidateApplications.length} Ingested Profiles`,
          velocityScore: 85,
          velocityTrendPct: 12.0,
          activeInitiative: 'Infrastructure Lead & Quant Strategist Screening',
        },
        {
          name: DEPARTMENTS.executive.name,
          leadName: DEPARTMENTS.executive.leadName,
          leadRole: DEPARTMENTS.executive.leadRole,
          weeklyActionsCount: execDeals.length + 10,
          primaryMetricLabel: 'Sovereign Mandates',
          primaryMetricValue: formatCurrency(totalValue),
          velocityScore: 95,
          velocityTrendPct: 22.0,
          activeInitiative: 'Capital Allocation & Sovereign Entity Synthesis',
        },
      ];

      const weeklyBucketsForPdf = [
        {
          weekLabel: 'W34',
          dateRange: 'Aug 18 - Aug 24',
          capitalMoved: 950000,
          dealsMoved: 3,
          capitalWon: 120000,
          activeVelocityScore: 82,
        },
        {
          weekLabel: 'W35',
          dateRange: 'Aug 25 - Aug 31',
          capitalMoved: 1240000,
          dealsMoved: 5,
          capitalWon: 250000,
          activeVelocityScore: 88,
        },
        {
          weekLabel: 'W36',
          dateRange: 'Sep 01 - Sep 07',
          capitalMoved: 1420000,
          dealsMoved: 4,
          capitalWon: 180000,
          activeVelocityScore: 91,
        },
        {
          weekLabel: 'W37 (Live)',
          dateRange: 'Sep 08 - Sep 15',
          capitalMoved: 1680000,
          dealsMoved: 6,
          capitalWon: 350000,
          activeVelocityScore: 94,
        },
      ];

      generateAnalyticsPdf({
        timeHorizonLabel,
        currentSpace,
        totalPipelineValue: totalValue,
        closedCommittedValue: wonValue,
        winRatePct: winRate,
        avgLeadScore: avgScore,
        pipelineTrendPct,
        closedTrendPct: wonTrendPct,
        winRateTrendPct,
        scoreTrendPct,
        transitSpeedDays: 4.2,
        totalWeeklyActions: departmentMetricsForPdf.reduce((s, d) => s + d.weeklyActionsCount, 0),
        weeklyBuckets: weeklyBucketsForPdf,
        departmentMetrics: departmentMetricsForPdf,
        stageData: stageData.map(s => ({
          label: s.label,
          count: s.count,
          value: s.value,
          pct: s.pct,
        })),
      });

      const filename = `SMO-Executive-KPI-Report-${dateRange}.pdf`;
      setExportSuccessMessage(`Report compiled successfully! Downloaded: ${filename}`);
      setTimeout(() => {
        setExportSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Run Custom Report Template (generates tailored PDF/CSV with template settings)
  const handleRunReportTemplate = (template: CustomReportTemplate) => {
    try {
      if (template.timeframe === '7d' || template.timeframe === '30d' || template.timeframe === 'qtd') {
        setDateRange(template.timeframe);
      }

      if (template.format === 'pdf' || template.format === 'both') {
        const timeHorizonLabel = template.timeframe === 'qtd' 
          ? 'Quarter-to-Date (Q3 2026)' 
          : template.timeframe === '30d' 
          ? 'Last 30 Days' 
          : template.timeframe === 'ytd'
          ? 'Year-to-Date (FY 2026)'
          : 'Last 7 Days';

        const departmentMetricsForPdf = Object.values(DEPARTMENTS).map((dept, index) => {
          const deptDeals = filteredDeals.filter(d => d.space === currentSpace);
          const deptValue = deptDeals.reduce((sum, d) => sum + d.value, 0);
          return {
            name: dept.name,
            leadName: dept.leadName,
            leadRole: dept.leadRole,
            weeklyActionsCount: 14 + (index * 6),
            primaryMetricLabel: 'Scoped pipeline value',
            primaryMetricValue: formatCurrency(deptValue),
            velocityScore: 82 + (index * 3),
            velocityTrendPct: 4.8 + (index * 0.9),
            activeInitiative: dept.description,
          };
        });

        generateAnalyticsPdf({
          templateName: template.name,
          reportTitle: template.name,
          includedWidgets: template.widgets,
          isAutomatedSchedule: template.isRecurring,
          scheduleFrequency: template.schedule?.frequency,
          timeHorizonLabel,
          currentSpace,
          totalPipelineValue: totalValue,
          closedCommittedValue: wonValue,
          winRatePct: winRate,
          avgLeadScore: avgScore,
          pipelineTrendPct,
          closedTrendPct: wonTrendPct,
          winRateTrendPct,
          scoreTrendPct,
          transitSpeedDays: 4.2,
          totalWeeklyActions: departmentMetricsForPdf.reduce((s, d) => s + d.weeklyActionsCount, 0),
          weeklyBuckets: [
            { weekLabel: 'Week 34', dateRange: 'Aug 18 - Aug 24', capitalMoved: 450000, dealsMoved: 4, capitalWon: 120000, activeVelocityScore: 81 },
            { weekLabel: 'Week 35', dateRange: 'Aug 25 - Aug 31', capitalMoved: 620000, dealsMoved: 5, capitalWon: 180000, activeVelocityScore: 85 },
            { weekLabel: 'Week 36', dateRange: 'Sep 01 - Sep 07', capitalMoved: 780000, dealsMoved: 7, capitalWon: 220000, activeVelocityScore: 88 },
            { weekLabel: 'Week 37', dateRange: 'Sep 08 - Sep 14', capitalMoved: 950000, dealsMoved: 6, capitalWon: 350000, activeVelocityScore: 94 },
          ],
          departmentMetrics: departmentMetricsForPdf,
          stageData: stageData.map(s => ({
            label: s.label,
            count: s.count,
            value: s.value,
            pct: s.pct,
          })),
        });
      }

      if (template.format === 'csv' || template.format === 'both') {
        handleExportCsv();
      }

      setExportSuccessMessage(
        `Custom Template "${template.name}" executed! (${template.widgets.length} widgets • ${template.timeframe.toUpperCase()}${template.isRecurring ? ` • Scheduled ${template.schedule?.frequency}` : ''})`
      );
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (e) {
      console.error('Template run failed:', e);
    }
  };

  // Raw KPI CSV Export
  const handleExportCsv = () => {
    try {
      const rows: string[][] = [];

      rows.push(['SOVEREIGN MERCANTILE ORGANIZATION - RAW EXECUTIVE KPI DATASET']);
      rows.push(['Report Generated At', new Date().toLocaleString()]);
      rows.push(['Timeframe Filter', dateRange === 'qtd' ? 'Quarter-to-Date' : dateRange === '30d' ? 'Last 30 Days' : 'Last 7 Days']);
      rows.push(['Workspace Scope', currentSpace]);
      rows.push([]);

      const avgDealSize = filteredDeals.length > 0 ? Math.round(totalValue / filteredDeals.length) : 0;

      rows.push(['EXECUTIVE AGGREGATE KPIS']);
      rows.push(['Metric Name', 'Value (USD / %)', 'Trend vs Prior Period']);
      rows.push(['Active Pipeline Value', totalValue.toString(), `+${pipelineTrendPct}%`]);
      rows.push(['Closed Won Capital', wonValue.toString(), `+${wonTrendPct}%`]);
      rows.push(['Win Rate', `${winRate}%`, `+${winRateTrendPct}%`]);
      rows.push(['Average Lead Score', `${avgScore}/100`, `+${scoreTrendPct}%`]);
      rows.push(['Active Opportunities Count', filteredDeals.length.toString(), 'Current Scope']);
      rows.push(['Average Deal Value', avgDealSize.toString(), 'Per Active Opportunity']);
      rows.push([]);

      rows.push(['PIPELINE STAGE FUNNEL DISTRIBUTION']);
      rows.push(['Stage Name', 'Deal Count', 'Capital Value (USD)', 'Share of Pipeline (%)', 'Avg Lead Score', 'Avg Transit Days']);
      stageData.forEach(s => {
        rows.push([
          `"${s.label}"`,
          s.count.toString(),
          s.value.toString(),
          `${s.pct}%`,
          s.stageAvgScore.toString(),
          s.avgTransitDays.toString()
        ]);
      });
      rows.push([]);

      rows.push(['DETAILED DEALS & OPPORTUNITIES RAW LOG']);
      rows.push(['Deal Title', 'Organization', 'Space', 'Stage', 'Value (USD)', 'Lead Score', 'Assignee', 'Expected Close']);
      filteredDeals.forEach(d => {
        const assignee = teamMembers.find(m => m.id === d.assigneeId)?.name || 'Unassigned';
        const leadScoreNum = d.leadScore 
          ? ((d.leadScore.strategicFit || 0) + (d.leadScore.fundingCapacity || 0) + (d.leadScore.networkLeverage || 0) + (d.leadScore.diligenceSpeed || 0)) 
          : 0;
        rows.push([
          `"${(d.title || '').replace(/"/g, '""')}"`,
          `"${(d.organization || '').replace(/"/g, '""')}"`,
          `"${d.space}"`,
          `"${d.stage}"`,
          d.value.toString(),
          leadScoreNum.toString(),
          `"${assignee}"`,
          `"${d.expectedCloseDate || 'N/A'}"`
        ]);
      });

      const csvContent = rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `SMO-Raw-KPI-Data-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccessMessage(`Raw KPI data exported to CSV: ${filename}`);
      setTimeout(() => {
        setExportSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('CSV export failed:', err);
    }
  };

  // Render individual widget component based on ID
  const renderWidgetContent = (widgetId: AnalyticsWidgetId) => {
    switch (widgetId) {
      case 'ai_weekly_summary':
        return (
          <AiWeeklySummaryCard
            kpis={{
              timeframe: dateRange === 'qtd' ? 'Quarter-to-Date (Q3 2026)' : dateRange === '30d' ? 'Last 30 Days' : 'Last 7 Days',
              currentSpace,
              totalValue,
              wonValue,
              winRate,
              avgScore,
              dealCount: filteredDeals.length,
              weightedForecast: Math.round(totalValue * 0.65),
              pipelineTrendPct,
              wonTrendPct,
              velocityScore: 88,
              lowerQuartile: 76
            }}
            anomalyFlags={[
              {
                type: 'healthy_bounds',
                severity: 'info',
                message: 'Deal velocity (88 PTS) is 12 PTS above the historical lower quartile warning threshold (76 PTS).',
                metric: 'Transit Velocity'
              },
              {
                type: 'stage_acceleration',
                severity: 'info',
                message: 'Due diligence stage transit accelerated to 5.2 days, outperforming target baseline of 7.0 days.',
                metric: 'Due Diligence'
              }
            ]}
            stageBreakdown={stageData.map(s => ({
              label: s.label,
              count: s.count,
              value: s.value
            }))}
          />
        );

      case 'activity_heatmap':
        return <ActivityHeatmapWidget />;

      case 'weekly_velocity':
        return (
          <WeeklyVelocityWidget 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
        );

      case 'kpi_cards':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Portfolio Capital & Conversion Overview</h3>
                <p className="text-xs text-slate-500">
                  Aggregated metrics reflecting <strong className="text-slate-700">{dateRange === 'qtd' ? 'Quarter-to-Date' : dateRange === '30d' ? 'Last 30 Days' : 'Last 7 Days'}</strong> performance • Click any metric to inspect contributing deals
                </p>
              </div>
              <div className="text-[11px] font-semibold text-slate-400">
                Trends indexed {trendComparisonLabel}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Active Pipeline Card */}
              <div 
                onClick={() => openDrillDown(
                  'Active Pipeline Opportunities',
                  formatCurrency(totalValue),
                  `All active opportunities currently moving through diligence, pitch, and proposal stages (${filteredDeals.filter(d => d.stage !== 'lost').length} active deals)`,
                  filteredDeals.filter(d => d.stage !== 'lost'),
                  'Active Capital'
                )}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                title="Click to inspect all active deals contributing to pipeline capital"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Pipeline</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 font-semibold flex items-center gap-0.5 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Drill Down
                    </span>
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 font-mono group-hover:text-indigo-600 transition-colors">
                  {formatCurrency(totalValue)}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    +{pipelineTrendPct}%
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {trendComparisonLabel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{filteredDeals.filter(d => d.stage !== 'lost').length} active opportunities</span>
                  <span className="text-indigo-600 font-semibold text-[10px]">Inspect Deals →</span>
                </div>
              </div>

              {/* Closed Committed Card */}
              <div 
                onClick={() => openDrillDown(
                  'Closed Won Commitments',
                  formatCurrency(wonValue),
                  `Institutional capital committed through finalized proposals and contracts (${wonDeals.length} closed won opportunities)`,
                  wonDeals,
                  'Committed Capital'
                )}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
                title="Click to inspect all closed committed deals"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Closed Committed</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 font-semibold flex items-center gap-0.5 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Drill Down
                    </span>
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 font-mono group-hover:text-emerald-600 transition-colors">
                  {formatCurrency(wonValue)}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    +{wonTrendPct}%
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {trendComparisonLabel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{wonDeals.length} institutional awards</span>
                  <span className="text-emerald-600 font-semibold text-[10px]">Inspect Deals →</span>
                </div>
              </div>

              {/* Average Lead Score Card */}
              <div 
                onClick={() => openDrillDown(
                  'Deal Lead Scoring Portfolio',
                  `${avgScore} / 100 PTS`,
                  'Ranked by composite score across strategic fit, funding capacity, network leverage, and diligence speed',
                  [...filteredDeals].sort((a, b) => {
                    const sA = (a.leadScore?.strategicFit || 0) + (a.leadScore?.fundingCapacity || 0) + (a.leadScore?.networkLeverage || 0) + (a.leadScore?.diligenceSpeed || 0);
                    const sB = (b.leadScore?.strategicFit || 0) + (b.leadScore?.fundingCapacity || 0) + (b.leadScore?.networkLeverage || 0) + (b.leadScore?.diligenceSpeed || 0);
                    return sB - sA;
                  }),
                  'Lead Quality'
                )}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
                title="Click to inspect opportunities ranked by lead qualification score"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Lead Score</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 group-hover:text-amber-600 font-semibold flex items-center gap-0.5 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Drill Down
                    </span>
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 font-mono group-hover:text-amber-600 transition-colors">
                  {avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    +{scoreTrendPct}%
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {trendComparisonLabel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Tier-1 threshold is 85+ PTS</span>
                  <span className="text-amber-600 font-semibold text-[10px]">Inspect Deals →</span>
                </div>
              </div>

              {/* Win Rate % Card */}
              <div 
                onClick={() => openDrillDown(
                  'Pipeline Conversion & Win Rate',
                  `${winRate}% Win Rate`,
                  `Overall ratio of won contracts (${wonDeals.length}) compared to active opportunities in scope (${filteredDeals.length})`,
                  filteredDeals,
                  'Conversion Health'
                )}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                title="Click to view full conversion breakdown across deals"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Win Rate %</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 group-hover:text-purple-600 font-semibold flex items-center gap-0.5 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Drill Down
                    </span>
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 font-mono group-hover:text-purple-600 transition-colors">
                  {winRate}%
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    +{winRateTrendPct}%
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {trendComparisonLabel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Opportunity conversion ratio</span>
                  <span className="text-purple-600 font-semibold text-[10px]">Inspect Deals →</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'target_vs_actual':
        return <TargetVsActualWidget />;

      case 'executive_notes':
        return <ExecutiveSummaryNotes />;

      case 'predictive_forecast':
        return <PredictiveForecastingWidget />;

      case 'stage_funnel':
        return (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Pipeline Stage Funnel Distribution</span>
                  <span className="text-[11px] font-normal text-slate-400">• Click any stage to inspect deals</span>
                </h2>
                <p className="text-xs text-slate-500">Value and deal volume progression across pipeline stages</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">
                Total: {formatCurrency(totalValue)}
              </span>
            </div>

            <div className="space-y-3 pt-3">
              {stageData.map(stg => {
                const isHovered = hoveredStageId === stg.id;
                const stageDeals = filteredDeals.filter(d => d.stage === stg.id);

                return (
                  <div 
                    key={stg.id} 
                    className="space-y-1 relative group cursor-pointer"
                    onMouseEnter={() => setHoveredStageId(stg.id)}
                    onMouseLeave={() => setHoveredStageId(null)}
                    onClick={() => openDrillDown(
                      `${stg.label} Stage Opportunities`,
                      formatCurrency(stg.value),
                      `Active opportunities in ${stg.label} (${stg.count} deals, ${stg.avgTransitDays} days avg stage duration)`,
                      stageDeals,
                      'Stage Funnel'
                    )}
                    title={`Click to inspect ${stg.count} deals in ${stg.label}`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700 flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                        <span className={`w-2 h-2 rounded-full ${stg.color}`} />
                        <span className="font-semibold">{stg.label}</span>
                        <span className="text-slate-400 text-[11px]">({stg.count} deals)</span>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 ml-1 transition-colors" />
                      </span>
                      <span className="font-mono text-slate-900 font-bold group-hover:text-indigo-600 transition-colors">
                        {formatCurrency(stg.value)} ({stg.pct}%)
                      </span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stg.color} rounded-full transition-all duration-300 ${
                          isHovered ? 'brightness-110 shadow-xs scale-y-110' : ''
                        }`} 
                        style={{ width: `${Math.max(stg.pct, 2)}%` }} 
                      />
                    </div>

                    {isHovered && (
                      <div className="absolute top-full left-0 mt-1 z-30 w-72 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-xs pointer-events-none animate-in fade-in duration-100">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${stg.color}`} />
                            {stg.label}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">{stg.pct}% of Pipeline</span>
                        </div>

                        <div className="py-2 space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Deals Count:</span>
                            <span className="font-mono font-bold text-white">{stg.count} opportunities</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Stage Capital:</span>
                            <span className="font-mono font-bold text-emerald-400">{formatCurrency(stg.value)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Avg Deal Size:</span>
                            <span className="font-mono text-white">{formatCurrency(stg.avgDealSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Avg Lead Score:</span>
                            <span className="font-mono text-amber-400">{stg.stageAvgScore} / 100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Transit Duration:</span>
                            <span className="font-mono text-indigo-300">{stg.avgTransitDays} days avg</span>
                          </div>
                        </div>

                        {stg.sampleDeals.length > 0 && (
                          <div className="pt-1.5 border-t border-slate-800">
                            <span className="text-[10px] uppercase font-semibold text-slate-400">Sample Deals (Click bar to view all):</span>
                            <div className="text-[10px] text-slate-300 mt-0.5 space-y-0.5">
                              {stg.sampleDeals.map((title, i) => (
                                <div key={i} className="truncate">• {title}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'team_sentiment':
        return <TeamSentimentWidget />;

      case 'time_series':
        return <InteractiveTimeSeriesChart dateRange={dateRange} />;

      case 'distribution':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Value by Workspace Space */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Deal Value by Workspace Space</h2>
                  <p className="text-xs text-slate-500">Distribution across sovereign workspaces • Click to inspect deals</p>
                </div>
                <Building className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3 pt-3">
                {spaceData.map(sp => {
                  const isHovered = hoveredSpaceName === sp.name;
                  const spDeals = deals.filter(d => d.space === sp.name);

                  return (
                    <div 
                      key={sp.name} 
                      className="space-y-1 relative group cursor-pointer"
                      onMouseEnter={() => setHoveredSpaceName(sp.name)}
                      onMouseLeave={() => setHoveredSpaceName(null)}
                      onClick={() => openDrillDown(
                        `${sp.name} Workspace Deals`,
                        formatCurrency(sp.value),
                        `Active and committed deals assigned within the ${sp.name} workspace (${spDeals.length} opportunities)`,
                        spDeals,
                        'Workspace Distribution'
                      )}
                      title={`Click to inspect deals in ${sp.name}`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 font-semibold group-hover:text-indigo-600 flex items-center gap-1 transition-colors">
                          <span>{sp.name}</span>
                          <span className="text-slate-400 text-[11px]">({sp.count} deals)</span>
                          <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 ml-1 transition-colors" />
                        </span>
                        <span className="font-mono text-slate-900 font-bold group-hover:text-indigo-600 transition-colors">
                          {formatCurrency(sp.value)}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-indigo-600 rounded-full transition-all duration-300 ${
                            isHovered ? 'bg-indigo-500 brightness-110' : ''
                          }`}
                          style={{ width: `${Math.max(sp.pct, 3)}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Value by Team Member */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Deal Value by Team Member</h2>
                  <p className="text-xs text-slate-500">Capital managed across responsible leaders • Click to inspect deals</p>
                </div>
                <Users className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3 pt-3">
                {teamMembers.slice(0, 5).map(member => {
                  const assignedDeals = deals.filter(d => d.assigneeId === member.id);
                  const sum = assignedDeals.reduce((acc, d) => acc + d.value, 0);
                  const scaledSum = Math.round(sum * (dateRange === 'qtd' ? 1.3 : dateRange === '30d' ? 1.15 : 1.0));
                  const isHovered = hoveredMemberId === member.id;

                  return (
                    <div 
                      key={member.id} 
                      className="relative group"
                      onMouseEnter={() => setHoveredMemberId(member.id)}
                      onMouseLeave={() => setHoveredMemberId(null)}
                      onClick={() => openDrillDown(
                        `${member.name}'s Managed Deals`,
                        formatCurrency(scaledSum),
                        `${assignedDeals.length} opportunities assigned to ${member.name} (${member.role} • ${member.department})`,
                        assignedDeals,
                        'Team Member Pipeline'
                      )}
                      title={`Click to inspect deals assigned to ${member.name}`}
                    >
                      <div className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                        isHovered ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                              <span>{member.name}</span>
                              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div className="text-[10px] text-slate-400">{member.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {formatCurrency(scaledSum)}
                          </div>
                          <div className="text-[10px] text-slate-400">{assignedDeals.length} deals assigned</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/40 overflow-y-auto">
      {/* Header with Date Range Filter, Layout Toggle & Export Buttons */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive CRM Analytics</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Live Sovereign Metrics
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                {layoutMode === 'wide' ? 'Wide Dashboard View' : 'Compressed Widget View'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive capital telemetry, lead scoring health, drag-and-drop grid customization, and AI briefings.
            </p>
          </div>

          {/* Action Bar: View Switcher, Date Range, Layout Customizer, Image & PDF Exports */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* View Mode Toggle: Wide vs Compressed */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setLayoutMode('wide')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  layoutMode === 'wide'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Wide Dashboard View for High-Resolution Screens"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Wide</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('compressed')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  layoutMode === 'compressed'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Compressed Widget List View for Compact Screens"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Compressed</span>
              </button>
            </div>

            {/* Layout Preset & Customizer */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-500" />
                Layout:
              </span>
              <select
                onChange={(e) => applyPreset(e.target.value)}
                defaultValue="default"
                className="bg-white border border-slate-200 text-slate-700 font-semibold py-1 px-2 rounded-md text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                title="Choose a dashboard layout preset"
              >
                <option value="default">Preset: Default Grid</option>
                <option value="executive">Preset: Executive Briefing</option>
                <option value="pipeline_ops">Preset: Deal Flow Focus</option>
              </select>
              <button
                type="button"
                onClick={resetWidgetOrder}
                className="ml-1 p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
                title="Reset layout to default order"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Date Range Filter Selector */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                Timeframe:
              </span>
              {(
                [
                  { id: '7d', label: 'Last 7 Days' },
                  { id: '30d', label: 'Last 30 Days' },
                  { id: 'qtd', label: 'Quarter-to-Date' },
                ] as const
              ).map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDateRange(t.id)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    dateRange === t.id
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Custom Report Templates Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowTemplateModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Define custom report templates (select specific widgets, timeframes, and recurring automated reports)"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Report Templates</span>
            </button>

            {/* Export Visualizations Button (PNG / SVG) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowImageExportMenu(!showImageExportMenu)}
                disabled={isExportingImage !== null}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                title="Export current data visualizations as high-quality PNG or SVG image files for presentations"
              >
                {isExportingImage ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span>Exporting {isExportingImage.toUpperCase()}...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Export Visuals</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </>
                )}
              </button>

              {showImageExportMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in duration-150 text-slate-800">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Stakeholder Presentation Exports
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportVisualizations('png')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold">High-Res PNG</div>
                      <div className="text-[10px] text-slate-400 font-normal">Retina 2x resolution for slides</div>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-mono font-bold">.png</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportVisualizations('svg')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold">Scalable Vector Graphics</div>
                      <div className="text-[10px] text-slate-400 font-normal">Lossless vector format</div>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-mono font-bold">.svg</span>
                  </button>
                </div>
              )}
            </div>

            {/* Export Raw CSV Button */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Export raw KPI metrics, deal records, and stage breakdowns as a CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            {/* Export PDF Document Button */}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              title="Export formatted PDF document containing KPI metrics, weekly velocity, and department reports"
            >
              {isExportingPdf ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Anomaly Toast Notification System */}
        <div className="mt-3">
          <VelocityAnomalyToast
            currentVelocityScore={88}
            historicalAverageScore={84}
            lowerQuartileThreshold={76}
            currentWeekLabel={dateRange === 'qtd' ? 'QTD' : dateRange === '30d' ? 'Last 30 Days' : 'Last 7 Days'}
          />
        </div>

        {/* Export Success Toast Banner */}
        {exportSuccessMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{exportSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setExportSuccessMessage(null)}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-semibold ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Main Drag-and-Drop Widgets Board */}
      <div className={`w-full mx-auto transition-all duration-200 ${layoutMode === 'wide' ? 'p-6 max-w-6xl' : 'p-4 max-w-4xl'}`}>
        <div 
          id="analytics-visualizations-board" 
          className="space-y-6"
        >
          {widgetOrder.map((widgetId, index) => {
            const meta = WIDGET_META[widgetId];
            if (!meta) return null;

            const isBeingDragged = draggedWidgetId === widgetId;
            const isDragOver = dragOverWidgetId === widgetId && draggedWidgetId !== widgetId;

            return (
              <div
                key={widgetId}
                draggable
                onDragStart={(e) => handleDragStart(e, widgetId)}
                onDragOver={(e) => handleDragOver(e, widgetId)}
                onDrop={(e) => handleDrop(e, widgetId)}
                onDragEnd={handleDragEnd}
                className={`relative group transition-all duration-200 ${
                  isBeingDragged ? 'opacity-40 scale-[0.99] border-dashed border-2 border-indigo-400 rounded-xl' : ''
                } ${
                  isDragOver ? 'ring-2 ring-indigo-500 ring-offset-2 rounded-xl' : ''
                }`}
              >
                {/* Drag Handle Bar & Quick Reorder Controls */}
                <div 
                  className="flex items-center justify-between px-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-t-xl text-[11px] text-slate-500 select-none transition-colors"
                  data-no-export="true"
                >
                  <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-bold text-slate-700">{meta.title}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-white border border-slate-200 text-slate-600 hidden sm:inline">
                      {meta.category}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden md:inline">
                      • Drag handle to reorder
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveWidget(widgetId, -1)}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move widget up in dashboard"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveWidget(widgetId, 1)}
                      disabled={index === widgetOrder.length - 1}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move widget down in dashboard"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Widget Component View */}
                <div className="mt-0">
                  {renderWidgetContent(widgetId)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drill-down Side Panel */}
      <MetricDrillDownSidePanel
        isOpen={drillDownState.isOpen}
        onClose={() => setDrillDownState(prev => ({ ...prev, isOpen: false }))}
        metricTitle={drillDownState.title}
        metricValue={drillDownState.value}
        metricSubtitle={drillDownState.subtitle}
        metricCategory={drillDownState.category}
        deals={drillDownState.deals}
      />

      {/* Custom Report Template Modal */}
      <CustomReportTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onRunTemplate={handleRunReportTemplate}
      />
    </div>
  );
};
