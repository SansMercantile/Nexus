import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  FileText, 
  Calendar, 
  Activity, 
  DollarSign, 
  Sparkles, 
  ChevronRight,
  Filter,
  BarChart2,
  Info
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Department, WorkspaceSpace } from '../../types';
import { DEPARTMENTS } from '../../data/departmentsData';

export type DateRangeFilter = '7d' | '30d' | 'qtd';
type VelocityMetricView = 'capital' | 'count';

export interface WeeklyBucket {
  weekLabel: string;
  dateRange: string;
  dealsMoved: number;
  capitalMoved: number;
  dealsWon: number;
  capitalWon: number;
  activeVelocityScore: number;
  topDeals: string[];
  isCurrentWeek?: boolean;
}

export interface DepartmentActivityMetric {
  department: Department;
  name: string;
  leadName: string;
  leadRole: string;
  badgeBg: string;
  color: string;
  weeklyActionsCount: number;
  weeklyVolumeUsd?: number;
  primaryMetricLabel: string;
  primaryMetricValue: string | number;
  secondaryMetricLabel: string;
  secondaryMetricValue: string | number;
  velocityScore: number; // 0-100
  velocityTrendPct: number; // e.g. +14.2%
  activeInitiative: string;
  recentEvent: {
    title: string;
    timestamp: string;
    type: 'deal' | 'infra' | 'comms' | 'talent' | 'governance';
  };
}

interface WeeklyVelocityWidgetProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
}

export const WeeklyVelocityWidget: React.FC<WeeklyVelocityWidgetProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const { 
    deals, 
    meetings, 
    candidateApplications, 
    contacts, 
    teamMembers, 
    currentSpace, 
    setCurrentSpace,
  } = useCrm();

  const [metricView, setMetricView] = useState<VelocityMetricView>('capital');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<Department | 'all'>('all');
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(3); // Default to current week

  // Interactive tooltip states
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredDeptWorkload, setHoveredDeptWorkload] = useState<Department | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Filter deals based on current workspace
  const activeDeals = useMemo(() => {
    return deals.filter(d => currentSpace === 'All Spaces' || d.space === currentSpace);
  }, [deals, currentSpace]);

  // Dynamic factor based on date range
  const dateRangeMultiplier = dateRange === 'qtd' ? 2.4 : dateRange === '30d' ? 1.7 : 1.0;
  const trendComparisonLabel = dateRange === 'qtd' ? 'vs Q2 baseline' : dateRange === '30d' ? 'vs prior 30d' : 'from last week';

  // Compute trailing velocity sprint buckets
  const weeklyBuckets: WeeklyBucket[] = useMemo(() => {
    return [
      {
        weekLabel: 'W34',
        dateRange: 'Aug 18 - Aug 24',
        dealsMoved: 3,
        capitalMoved: 580000,
        dealsWon: 1,
        capitalWon: 200000,
        activeVelocityScore: 74,
        topDeals: ['Meridian Apex Syndicate ($200k Won)', 'Alpen Capital Sync'],
      },
      {
        weekLabel: 'W35',
        dateRange: 'Aug 25 - Aug 31',
        dealsMoved: 4,
        capitalMoved: 820000,
        dealsWon: 0,
        capitalWon: 0,
        activeVelocityScore: 81,
        topDeals: ['Palladium Grant Diligence ($500k)', 'Hyperia Tech Expansion'],
      },
      {
        weekLabel: 'W36',
        dateRange: 'Sep 01 - Sep 07',
        dealsMoved: 5,
        capitalMoved: 1450000,
        dealsWon: 1,
        capitalWon: 450000,
        activeVelocityScore: 88,
        topDeals: ['Nordic Sovereign Trust ($450k Won)', 'Aethelgard AI Core'],
      },
      {
        weekLabel: 'W37',
        dateRange: 'Sep 08 - Sep 15 (Current)',
        dealsMoved: Math.max(activeDeals.filter(d => d.stage !== 'lost').length > 0 ? 6 : 2, 4),
        capitalMoved: Math.round(Math.max(activeDeals.reduce((sum, d) => sum + (d.stage === 'proposal' || d.stage === 'pitch' || d.stage === 'won' ? d.value : 0), 0), 1680000) * (dateRange === 'qtd' ? 1.3 : 1.0)),
        dealsWon: activeDeals.filter(d => d.stage === 'won').length || 1,
        capitalWon: activeDeals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.value, 0) || 350000,
        activeVelocityScore: 94,
        topDeals: activeDeals.slice(0, 3).map(d => `${d.title} ($${(d.value / 1000).toFixed(0)}k)`),
        isCurrentWeek: true,
      },
    ];
  }, [activeDeals, dateRange]);

  const currentBucket = weeklyBuckets[selectedWeekIdx] || weeklyBuckets[3];
  const priorBucket = selectedWeekIdx > 0 ? weeklyBuckets[selectedWeekIdx - 1] : weeklyBuckets[0];

  // Percentage-based WoW or period deltas
  const wowCapitalDeltaPct = dateRange === 'qtd' ? 28 : dateRange === '30d' ? 22 : priorBucket.capitalMoved > 0
    ? Math.round(((currentBucket.capitalMoved - priorBucket.capitalMoved) / priorBucket.capitalMoved) * 100)
    : 16;

  const wowDealsDeltaPct = dateRange === 'qtd' ? 35 : dateRange === '30d' ? 25 : priorBucket.dealsMoved > 0
    ? Math.round(((currentBucket.dealsMoved - priorBucket.dealsMoved) / priorBucket.dealsMoved) * 100)
    : 20;

  const speedAccelerationPct = dateRange === 'qtd' ? 24 : dateRange === '30d' ? 20 : 18;
  const throughputTrendPct = dateRange === 'qtd' ? 32.4 : dateRange === '30d' ? 21.8 : 14.5;
  const capitalWonTrendPct = dateRange === 'qtd' ? 45.0 : dateRange === '30d' ? 28.5 : 15.2;

  // Department-specific activity metrics computed dynamically from CRM state
  const departmentMetrics: DepartmentActivityMetric[] = useMemo(() => {
    // 1. CBDO: Business Development
    const cbdoDeals = deals.filter(d => {
      const assignee = teamMembers.find(m => m.id === d.assigneeId);
      return assignee?.department === 'cbdo' || d.space === 'CBDO workspace';
    });
    const cbdoCapital = cbdoDeals.reduce((sum, d) => sum + (d.stage !== 'lost' ? d.value : 0), 0);
    const cbdoSyncs = meetings.filter(m => m.space === 'CBDO workspace' || m.attendees.some(a => a.includes('christopher') || a.includes('user-christopher'))).length;

    // 2. Dev / Infrastructure
    const techApplications = candidateApplications.filter(c => 
      c.jobTitle.toLowerCase().includes('azure') || 
      c.jobTitle.toLowerCase().includes('architect') ||
      c.jobTitle.toLowerCase().includes('dev')
    );
    const devSyncs = meetings.filter(m => 
      m.title.toLowerCase().includes('rail') || 
      m.title.toLowerCase().includes('dev') ||
      m.title.toLowerCase().includes('azure')
    ).length;

    // 3. Communications & PR (Swell)
    const commsMeetings = meetings.filter(m => m.space === 'PR & Comms').length;
    const mediaContacts = contacts.filter(c => c.space === 'PR & Comms' || c.type === 'strategic_partner').length;

    // 4. HR & Talent
    const talentIngested = candidateApplications.length;
    const aiTestsEvaluated = candidateApplications.filter(c => c.stage !== 'applied').length;

    // 5. Executive Sovereign Command
    const execDeals = deals.filter(d => d.space === 'Sovereign Command' || d.priority === 'urgent');
    const execSyncs = meetings.filter(m => m.space === 'Sovereign Command').length;

    const scale = (base: number) => Math.round(base * dateRangeMultiplier);

    return [
      {
        department: 'cbdo',
        name: DEPARTMENTS.cbdo.name,
        leadName: DEPARTMENTS.cbdo.leadName,
        leadRole: DEPARTMENTS.cbdo.leadRole,
        badgeBg: DEPARTMENTS.cbdo.badgeBg,
        color: 'border-purple-500 text-purple-600 bg-purple-50',
        weeklyActionsCount: scale(cbdoDeals.length + cbdoSyncs + 4),
        weeklyVolumeUsd: cbdoCapital,
        primaryMetricLabel: 'Pipeline Value Managed',
        primaryMetricValue: `$${(cbdoCapital / 1000000).toFixed(2)}M`,
        secondaryMetricLabel: 'Active Opportunities',
        secondaryMetricValue: `${cbdoDeals.length} Deals`,
        velocityScore: 92,
        velocityTrendPct: dateRange === 'qtd' ? 24.5 : dateRange === '30d' ? 21.0 : 18.5,
        activeInitiative: 'Series A Sovereign Growth Syndicate & Term Sheet Review',
        recentEvent: {
          title: 'Series A Meridian Apex proposal stage advanced',
          timestamp: '2h ago',
          type: 'deal',
        },
      },
      {
        department: 'dev',
        name: DEPARTMENTS.dev.name,
        leadName: DEPARTMENTS.dev.leadName,
        leadRole: DEPARTMENTS.dev.leadRole,
        badgeBg: DEPARTMENTS.dev.badgeBg,
        color: 'border-blue-500 text-blue-600 bg-blue-50',
        weeklyActionsCount: scale(techApplications.length + devSyncs + 8),
        primaryMetricLabel: 'Azure PRIV Rail Telemetry',
        primaryMetricValue: '99.98% SLA',
        secondaryMetricLabel: 'Tech Assessments Scored',
        secondaryMetricValue: `${techApplications.length} Evaluated`,
        velocityScore: 96,
        velocityTrendPct: dateRange === 'qtd' ? 16.5 : dateRange === '30d' ? 14.2 : 12.0,
        activeInitiative: 'Cryptographic core verification & zero-trust transit audit',
        recentEvent: {
          title: 'Azure Cloud Architect candidate test battery scored (94 PTS)',
          timestamp: '4h ago',
          type: 'infra',
        },
      },
      {
        department: 'communications',
        name: DEPARTMENTS.communications.name,
        leadName: DEPARTMENTS.communications.leadName,
        leadRole: DEPARTMENTS.communications.leadRole,
        badgeBg: DEPARTMENTS.communications.badgeBg,
        color: 'border-pink-500 text-pink-600 bg-pink-50',
        weeklyActionsCount: scale(commsMeetings + mediaContacts + 5),
        primaryMetricLabel: 'Media & Agency Syncs',
        primaryMetricValue: `${scale(commsMeetings + 3)} Syncs`,
        secondaryMetricLabel: 'Strategic Press Contacts',
        secondaryMetricValue: `${mediaContacts} Networked`,
        velocityScore: 86,
        velocityTrendPct: dateRange === 'qtd' ? 14.8 : dateRange === '30d' ? 11.5 : 9.4,
        activeInitiative: 'Swell Agency Q4 global press distribution & branding rubric',
        recentEvent: {
          title: 'European institutional media briefing package issued',
          timestamp: 'Yesterday',
          type: 'comms',
        },
      },
      {
        department: 'hr',
        name: DEPARTMENTS.hr.name,
        leadName: DEPARTMENTS.hr.leadName,
        leadRole: DEPARTMENTS.hr.leadRole,
        badgeBg: DEPARTMENTS.hr.badgeBg,
        color: 'border-amber-500 text-amber-600 bg-amber-50',
        weeklyActionsCount: scale(talentIngested + aiTestsEvaluated + 6),
        primaryMetricLabel: 'Candidate CVs Ingested',
        primaryMetricValue: `${talentIngested} Profiles`,
        secondaryMetricLabel: 'AI Vetting Pass-Rate',
        secondaryMetricValue: '85.7%',
        velocityScore: 89,
        velocityTrendPct: dateRange === 'qtd' ? 31.0 : dateRange === '30d' ? 27.4 : 24.1,
        activeInitiative: 'Automated video interview grading & talent pipeline ingestion',
        recentEvent: {
          title: 'Dev Lead & Comms Director candidate video transcripts parsed',
          timestamp: '3h ago',
          type: 'talent',
        },
      },
      {
        department: 'executive',
        name: DEPARTMENTS.executive.name,
        leadName: DEPARTMENTS.executive.leadName,
        leadRole: DEPARTMENTS.executive.leadRole,
        badgeBg: DEPARTMENTS.executive.badgeBg,
        color: 'border-emerald-500 text-emerald-600 bg-emerald-50',
        weeklyActionsCount: scale(execDeals.length + execSyncs + 3),
        primaryMetricLabel: 'Sovereign Command Sign-Offs',
        primaryMetricValue: `${execDeals.length} Signed`,
        secondaryMetricLabel: 'Treasury Allocation Governance',
        secondaryMetricValue: '100% Green',
        velocityScore: 95,
        velocityTrendPct: dateRange === 'qtd' ? 19.5 : dateRange === '30d' ? 16.8 : 14.8,
        activeInitiative: 'Palladium Global Science Award grant diligence submission',
        recentEvent: {
          title: 'Palladium Foundation dossier ratified by Managing Principal',
          timestamp: '5h ago',
          type: 'governance',
        },
      },
    ];
  }, [deals, meetings, candidateApplications, contacts, teamMembers, dateRangeMultiplier, dateRange]);

  // Filtered department list for display
  const displayedDepartments = useMemo(() => {
    if (selectedDeptFilter === 'all') return departmentMetrics;
    return departmentMetrics.filter(d => d.department === selectedDeptFilter);
  }, [departmentMetrics, selectedDeptFilter]);

  // Aggregate total weekly actions across departments
  const totalWeeklyActions = departmentMetrics.reduce((sum, d) => sum + d.weeklyActionsCount, 0);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  const maxWeeklyCapital = Math.max(...weeklyBuckets.map(b => b.capitalMoved), 1);

  return (
    <section 
      id="smo-weekly-velocity-kpi-widget" 
      aria-label="Weekly Deal Velocity and Department Activity KPI Dashboard"
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden"
    >
      {/* Widget Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-2xs">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Weekly Velocity & Cross-Department KPI Engine
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                Sprint Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tracking deal pipeline momentum, transit cycle speed, and departmental throughput across Sans Mercantile.
            </p>
          </div>

          {/* Metric View Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Metric Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setMetricView('capital')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  metricView === 'capital'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="View velocity by Capital Volume ($ USD)"
              >
                Capital ($)
              </button>
              <button
                type="button"
                onClick={() => setMetricView('count')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  metricView === 'count'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="View velocity by Deal Count"
              >
                Deals (Count)
              </button>
            </div>

            {/* Date Range Selector Synchronized with Top-Level Analytics Filter */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 text-xs">
              {(
                [
                  { id: '7d', label: '7 Days' },
                  { id: '30d', label: '30 Days' },
                  { id: 'qtd', label: 'QTD' },
                ] as const
              ).map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onDateRangeChange(t.id)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    dateRange === t.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Space indicator if filtered */}
        {currentSpace !== 'All Spaces' && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <span>Scoped to: <strong>{currentSpace}</strong></span>
            <button 
              onClick={() => setCurrentSpace('All Spaces')}
              className="text-[10px] text-indigo-500 hover:text-indigo-900 underline ml-1 cursor-pointer"
            >
              Reset to All Spaces
            </button>
          </div>
        )}
      </div>

      {/* Primary KPI Velocity Strip with Percentage-Based Trend Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-b border-slate-200 bg-white">
        {/* Metric 1: Weekly Capital Velocity */}
        <div className="p-4 sm:p-5 relative group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {metricView === 'capital' ? 'Capital Velocity' : 'Deals Advanced / Wk'}
            </span>
            <span className="p-1 rounded bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {metricView === 'capital' ? formatCurrency(currentBucket.capitalMoved) : `${currentBucket.dealsMoved} Deals`}
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{metricView === 'capital' ? wowCapitalDeltaPct : wowDealsDeltaPct}% {trendComparisonLabel}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
            <span>{currentBucket.weekLabel}: {currentBucket.dateRange}</span>
            <span className="font-semibold text-indigo-600">High Velocity</span>
          </div>
        </div>

        {/* Metric 2: Stage Transit Cycle Speed */}
        <div className="p-4 sm:p-5 relative group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stage Transit Speed
            </span>
            <span className="p-1 rounded bg-amber-50 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              4.2 <span className="text-sm font-semibold text-slate-400 font-sans">Days / Stage</span>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{speedAccelerationPct}% {trendComparisonLabel}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
            <span>Target: &lt; 7 days per stage</span>
            <span className="font-semibold text-emerald-600">18% Faster</span>
          </div>
        </div>

        {/* Metric 3: Active Throughput Index */}
        <div className="p-4 sm:p-5 relative group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cross-Dept Throughput
            </span>
            <span className="p-1 rounded bg-purple-50 text-purple-600">
              <Zap className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {totalWeeklyActions} <span className="text-sm font-semibold text-slate-400 font-sans">Actions</span>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{throughputTrendPct}% {trendComparisonLabel}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
            <span>Across 5 Sovereign divisions</span>
            <span className="font-semibold text-purple-600">94.8 Score</span>
          </div>
        </div>

        {/* Metric 4: Closed Capital Commitment */}
        <div className="p-4 sm:p-5 relative group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Committed Capital
            </span>
            <span className="p-1 rounded bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
              {formatCurrency(currentBucket.capitalWon)}
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{capitalWonTrendPct}% {trendComparisonLabel}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
            <span>{currentBucket.dealsWon} Confirmed Deals</span>
            <span className="font-semibold text-emerald-700">Secured</span>
          </div>
        </div>
      </div>

      {/* Trailing 4-Week Velocity Progression Chart with Interactive Tooltips */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/40 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
              Weekly Deal Velocity Pacing (Trailing 4 Sprints)
            </h3>
            <p className="text-[11px] text-slate-500">
              Hover over bars to inspect interactive telemetry tooltips. Click a sprint week to pin its metrics.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-600" />
              <span>Capital Advanced ($)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span>Closed Won ($)</span>
            </div>
          </div>
        </div>

        {/* 4-Week Interactive Velocity Bar Visualization */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2">
          {weeklyBuckets.map((bucket, idx) => {
            const isSelected = selectedWeekIdx === idx;
            const isHovered = hoveredBarIndex === idx;
            const heightPct = Math.round((bucket.capitalMoved / maxWeeklyCapital) * 100);
            const wonPct = Math.round((bucket.capitalWon / maxWeeklyCapital) * 100);

            return (
              <div
                key={bucket.weekLabel}
                className="relative"
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                <button
                  type="button"
                  onClick={() => setSelectedWeekIdx(idx)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs'
                      : isHovered
                      ? 'bg-white border-slate-400 shadow-2xs'
                      : 'bg-white/70 border-slate-200/90 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                    <span className={`font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>
                      {bucket.weekLabel} {bucket.isCurrentWeek && '• Live'}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {bucket.dealsMoved} Deals
                    </span>
                  </div>

                  {/* Visual Bar Container */}
                  <div className="h-16 w-full bg-slate-100 rounded-lg p-1 flex items-end gap-1.5 relative overflow-hidden">
                    {/* Capital Moved Bar */}
                    <div 
                      className={`w-1/2 rounded-sm transition-all duration-300 ${
                        isSelected || isHovered ? 'bg-indigo-600' : 'bg-indigo-500/80'
                      }`}
                      style={{ height: `${Math.max(heightPct, 12)}%` }}
                    />

                    {/* Capital Won Bar */}
                    <div 
                      className={`w-1/2 rounded-sm transition-all duration-300 ${
                        isSelected || isHovered ? 'bg-emerald-500' : 'bg-emerald-400/80'
                      }`}
                      style={{ height: `${Math.max(wonPct, 4)}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900 font-mono text-[11px]">
                      {formatCurrency(bucket.capitalMoved)}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {bucket.activeVelocityScore} PTS
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {bucket.dateRange}
                  </div>
                </button>

                {/* Interactive Tooltip Card for this Week */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900 text-white rounded-xl shadow-xl z-50 text-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150 border border-slate-700">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                      <span className="font-bold text-indigo-300">{bucket.weekLabel} Telemetry</span>
                      <span className="text-[10px] font-mono text-slate-400">{bucket.dateRange}</span>
                    </div>
                    <div className="py-2 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capital Advanced:</span>
                        <span className="font-mono font-bold text-white">{formatCurrency(bucket.capitalMoved)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Closed Committed:</span>
                        <span className="font-mono font-bold text-emerald-400">{formatCurrency(bucket.capitalWon)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Deals Moved:</span>
                        <span className="font-mono font-bold text-white">{bucket.dealsMoved} Deals</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Velocity Index:</span>
                        <span className="font-mono font-bold text-indigo-400">{bucket.activeVelocityScore} / 100</span>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Key Opportunities:</span>
                      <div className="text-[10px] text-slate-300 mt-0.5 space-y-0.5">
                        {bucket.topDeals.map((td, i) => (
                          <div key={i} className="truncate">• {td}</div>
                        ))}
                      </div>
                    </div>
                    {/* Downward triangle arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Department-Specific Activity Matrix Section */}
      <div className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              Department-Specific Activity & Velocity Metrics
            </h3>
            <p className="text-xs text-slate-500">
              Granular sprint contribution, team lead responsibility, and SLA pacing by division.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <button
              type="button"
              onClick={() => setSelectedDeptFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDeptFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              All Departments ({departmentMetrics.length})
            </button>
            {departmentMetrics.map(dept => (
              <button
                key={dept.department}
                type="button"
                onClick={() => setSelectedDeptFilter(dept.department)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedDeptFilter === dept.department
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{dept.name.split('&')[0].trim()}</span>
                <span className="text-[10px] opacity-75 font-mono">({dept.weeklyActionsCount})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cross-Department Workload Distribution Bar with Interactive Tooltips */}
        <div className="bg-slate-100 p-3 rounded-xl border border-slate-200/80 space-y-2 relative">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Sprint Workload Share by Department</span>
              <span className="text-[10px] font-normal text-slate-400">(Hover segments for detailed activity values)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">100% Allocation ({totalWeeklyActions} Total Actions)</span>
          </div>

          {/* Segmented Interactive Bar */}
          <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5 relative">
            {departmentMetrics.map(dept => {
              const pct = Math.max(Math.round((dept.weeklyActionsCount / totalWeeklyActions) * 100), 4);
              const colorClass = 
                dept.department === 'cbdo' ? 'bg-purple-600' :
                dept.department === 'dev' ? 'bg-blue-600' :
                dept.department === 'communications' ? 'bg-pink-500' :
                dept.department === 'hr' ? 'bg-amber-500' : 'bg-emerald-600';

              const isHovered = hoveredDeptWorkload === dept.department;

              return (
                <div 
                  key={dept.department}
                  onMouseEnter={() => setHoveredDeptWorkload(dept.department)}
                  onMouseLeave={() => setHoveredDeptWorkload(null)}
                  className={`h-full ${colorClass} transition-all relative cursor-pointer ${
                    isHovered ? 'brightness-110 ring-2 ring-white z-10' : 'opacity-95'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>

          {/* Interactive Tooltip Card for hovered department workload segment */}
          {hoveredDeptWorkload && (() => {
            const activeHoveredDept = departmentMetrics.find(d => d.department === hoveredDeptWorkload);
            if (!activeHoveredDept) return null;
            const pct = Math.round((activeHoveredDept.weeklyActionsCount / totalWeeklyActions) * 100);

            return (
              <div className="p-2.5 bg-slate-900 text-white rounded-lg shadow-lg text-xs animate-in fade-in duration-100 flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    activeHoveredDept.department === 'cbdo' ? 'bg-purple-400' :
                    activeHoveredDept.department === 'dev' ? 'bg-blue-400' :
                    activeHoveredDept.department === 'communications' ? 'bg-pink-400' :
                    activeHoveredDept.department === 'hr' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <div>
                    <span className="font-bold text-white">{activeHoveredDept.name}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">Lead: {activeHoveredDept.leadName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400">Throughput: </span>
                    <span className="font-mono font-bold text-white">{activeHoveredDept.weeklyActionsCount} Actions ({pct}%)</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Velocity: </span>
                    <span className="font-mono font-bold text-emerald-400">+{activeHoveredDept.velocityTrendPct}% WoW</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Department Legend Items */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
            {departmentMetrics.map(dept => {
              const pct = Math.round((dept.weeklyActionsCount / totalWeeklyActions) * 100);
              const dotColor = 
                dept.department === 'cbdo' ? 'bg-purple-600' :
                dept.department === 'dev' ? 'bg-blue-600' :
                dept.department === 'communications' ? 'bg-pink-500' :
                dept.department === 'hr' ? 'bg-amber-500' : 'bg-emerald-600';

              return (
                <button
                  key={dept.department}
                  type="button"
                  onClick={() => setSelectedDeptFilter(dept.department)}
                  onMouseEnter={() => setHoveredDeptWorkload(dept.department)}
                  onMouseLeave={() => setHoveredDeptWorkload(null)}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span className="font-medium text-slate-700">{dept.name.split('&')[0].trim()}:</span>
                  <span className="font-mono text-slate-900 font-bold">{pct}%</span>
                  <span className="text-[10px] text-emerald-600 font-semibold font-mono">+{dept.velocityTrendPct}%</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Department Cards Grid with Percentage Trend Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {displayedDepartments.map(dept => {
            const isHoveredOrSelected = selectedDeptFilter === dept.department;

            return (
              <div
                key={dept.department}
                className={`p-4 rounded-xl border transition-all bg-white ${
                  isHoveredOrSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Department Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${dept.badgeBg}`}>
                        {dept.name.split('(')[0].trim()}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1">
                      {dept.leadName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {dept.leadRole}
                    </div>
                  </div>

                  {/* Velocity Score Badge & Trend Indicator */}
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900 font-mono leading-none">
                      {dept.velocityScore}
                      <span className="text-[10px] text-slate-400 font-normal font-sans">/100</span>
                    </div>
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 mt-1">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                      +{dept.velocityTrendPct}% {trendComparisonLabel}
                    </span>
                  </div>
                </div>

                {/* Department Metric Pairs */}
                <div className="grid grid-cols-2 gap-2 py-3 border-b border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      {dept.primaryMetricLabel}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block">
                      {dept.primaryMetricValue}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      {dept.secondaryMetricLabel}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block">
                      {dept.secondaryMetricValue}
                    </span>
                  </div>
                </div>

                {/* Active Department Initiative */}
                <div className="pt-2.5">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Current Focus Initiative:
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-0.5 line-clamp-1">
                    {dept.activeInitiative}
                  </p>
                </div>

                {/* Recent High-Velocity Milestone Log */}
                <div className="mt-2.5 p-2 rounded-lg bg-indigo-50/40 border border-indigo-100/70 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span className="text-slate-700 font-medium truncate">{dept.recentEvent.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                    {dept.recentEvent.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
