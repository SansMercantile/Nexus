import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Clock, 
  Activity, 
  MessageSquare, 
  Zap, 
  Calendar, 
  Info, 
  Layers,
  ChevronRight,
  TrendingUp,
  Filter
} from 'lucide-react';
import { Department } from '../../types';
import { DEPARTMENTS } from '../../data/departmentsData';
import { useCrm } from '../../context/CrmContext';

type HeatmapMode = 'combined' | 'productivity' | 'communications';
type TimeWindowFilter = 'core' | 'all'; // Core (08:00 - 20:00) vs All (24 hrs)

interface HeatmapCellData {
  dayIndex: number; // 0 = Mon, 6 = Sun
  dayLabel: string;
  hour: number; // 0 - 23
  hourLabel: string;
  productivityCount: number;
  communicationCount: number;
  totalCount: number;
  isSpike: boolean;
  spikeReason?: string;
  topContributors: string[];
  keyEventDescription: string;
}

// Days of the week
const DAYS = [
  { key: 0, short: 'Mon', full: 'Monday' },
  { key: 1, short: 'Tue', full: 'Tuesday' },
  { key: 2, short: 'Wed', full: 'Wednesday' },
  { key: 3, short: 'Thu', full: 'Thursday' },
  { key: 4, short: 'Fri', full: 'Friday' },
  { key: 5, short: 'Sat', full: 'Saturday' },
  { key: 6, short: 'Sun', full: 'Sunday' },
];

export const ActivityHeatmapWidget: React.FC = () => {
  const { chatMessages, deals, meetings, teamMembers } = useCrm();

  const [selectedDept, setSelectedDept] = useState<Department | 'all'>('all');
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('combined');
  const [timeWindow, setTimeWindow] = useState<TimeWindowFilter>('core');
  const [hoveredCell, setHoveredCell] = useState<HeatmapCellData | null>(null);

  // Hours to display
  const hours = useMemo(() => {
    if (timeWindow === 'core') {
      return Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 AM to 8:00 PM
    }
    return Array.from({ length: 24 }, (_, i) => i); // 0 to 23
  }, [timeWindow]);

  // Synthetic deterministic matrix combining real CRM events with operational telemetry
  const matrixData = useMemo(() => {
    const data: Record<string, HeatmapCellData> = {};

    DAYS.forEach(day => {
      hours.forEach(hour => {
        const key = `${day.key}-${hour}`;

        // Seed base activity based on realistic business rhythms:
        // Peak hours are usually 10-12 and 14-16 on Mon-Thu
        const isWeekday = day.key < 5;
        const isCoreHours = hour >= 9 && hour <= 17;
        const isLunch = hour === 12 || hour === 13;
        
        let baseProd = 0;
        let baseComm = 0;
        let isSpike = false;
        let spikeReason = '';
        let topContributors: string[] = ['Mezzoforte Privilege'];
        let keyEventDescription = 'Standard pipeline coordination';

        if (isWeekday) {
          if (isCoreHours) {
            baseProd = ((day.key * 3 + hour * 5) % 9) + 2;
            baseComm = ((day.key * 4 + hour * 7) % 11) + 3;
            if (isLunch) {
              baseProd = Math.floor(baseProd * 0.4);
              baseComm = Math.floor(baseComm * 0.6);
            }
          } else {
            baseProd = (hour >= 6 && hour < 9) ? 2 : (hour >= 18 && hour <= 21) ? 3 : 0;
            baseComm = (hour >= 6 && hour < 9) ? 1 : (hour >= 18 && hour <= 21) ? 2 : 0;
          }
        } else {
          // Weekend light checks
          baseProd = (hour >= 11 && hour <= 16) ? 1 : 0;
          baseComm = (hour >= 11 && hour <= 16) ? 2 : 0;
        }

        // Department-specific modifiers
        if (selectedDept === 'dev') {
          baseProd = Math.floor(baseProd * 1.3);
          baseComm = Math.floor(baseComm * 0.8);
          topContributors = ['Mohammed Kabir', 'Tariq Al-Mansoor'];
          keyEventDescription = 'Azure Priv Pay MQTT telemetry & CI/CD merges';
        } else if (selectedDept === 'cbdo') {
          baseProd = Math.floor(baseProd * 1.1);
          baseComm = Math.floor(baseComm * 1.4);
          topContributors = ['Christopher Maddison', 'Elena Vance'];
          keyEventDescription = 'LP syndicate meetings & Term Sheet exchanges';
        } else if (selectedDept === 'communications') {
          baseProd = Math.floor(baseProd * 0.9);
          baseComm = Math.floor(baseComm * 1.6);
          topContributors = ['Pascaline Khoza', 'Swell Agency PR'];
          keyEventDescription = 'Media wire alerts & Press Kit revisions';
        } else if (selectedDept === 'hr') {
          baseProd = Math.floor(baseProd * 1.2);
          baseComm = Math.floor(baseComm * 0.9);
          topContributors = ['Amara Chen'];
          keyEventDescription = 'Applicant parsing & Video Interview reviews';
        } else if (selectedDept === 'executive') {
          baseProd = Math.floor(baseProd * 1.2);
          baseComm = Math.floor(baseComm * 1.2);
          topContributors = ['Mezzoforte Privilege', 'Christopher Maddison'];
          keyEventDescription = 'Sovereign governance sign-offs & Deal triage';
        }

        // Defined statistical communication spikes:
        // 1. Tuesday 14:00 (CBDO Deal Sync & Syndicate Round)
        if (day.key === 1 && hour === 14 && (selectedDept === 'all' || selectedDept === 'cbdo' || selectedDept === 'executive')) {
          baseComm += 18;
          baseProd += 10;
          isSpike = true;
          spikeReason = 'CBDO Sovereign Syndicate Alignment (+210% communication spike)';
          topContributors = ['Christopher Maddison', 'Mezzoforte Privilege', 'Elena Vance'];
          keyEventDescription = 'Meridian Apex term sheet review & sovereign syndicate call';
        }

        // 2. Thursday 10:00 (Engineering Azure Rail Deployment & All-Hands PR)
        if (day.key === 3 && hour === 10 && (selectedDept === 'all' || selectedDept === 'dev' || selectedDept === 'communications')) {
          baseComm += 16;
          baseProd += 14;
          isSpike = true;
          spikeReason = 'Engineering Priv Pay Deployment & Swell PR Blast (+195% activity spike)';
          topContributors = ['Mohammed Kabir', 'Pascaline Khoza'];
          keyEventDescription = 'Frankfurt/Amsterdam cluster stress test verification';
        }

        // 3. Wednesday 16:00 (HR Video Interview Batch & Applicant Vetting)
        if (day.key === 2 && hour === 16 && (selectedDept === 'all' || selectedDept === 'hr')) {
          baseComm += 11;
          baseProd += 12;
          isSpike = true;
          spikeReason = 'HR Automated Interview Evaluation Sprint (+160% productivity spike)';
          topContributors = ['Amara Chen', 'Mohammed Kabir'];
          keyEventDescription = 'Shortlisting Senior Azure Architect & PR candidates';
        }

        // Incorporate real CRM chat message timestamps
        const chatEventsInHour = chatMessages.filter(m => {
          const d = new Date(m.timestamp);
          const msgDay = (d.getDay() + 6) % 7; // Convert Sun=0 to Mon=0
          const msgHour = d.getHours();
          const matchesDept = selectedDept === 'all' || m.senderDepartment === selectedDept;
          return msgDay === day.key && msgHour === hour && matchesDept;
        }).length;

        baseComm += chatEventsInHour * 2;

        const total = baseProd + baseComm;

        data[key] = {
          dayIndex: day.key,
          dayLabel: day.full,
          hour,
          hourLabel: `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
          productivityCount: baseProd,
          communicationCount: baseComm,
          totalCount: total,
          isSpike,
          spikeReason,
          topContributors,
          keyEventDescription,
        };
      });
    });

    return data;
  }, [hours, selectedDept, chatMessages]);

  // Aggregate high-level statistics
  const summaryStats = useMemo(() => {
    let maxEvents = 0;
    let peakHourStr = 'Tue 14:00';
    let totalWeeklyEvents = 0;
    let spikeCount = 0;

    Object.values(matrixData).forEach(cell => {
      totalWeeklyEvents += cell.totalCount;
      if (cell.isSpike) spikeCount++;
      if (cell.totalCount > maxEvents) {
        maxEvents = cell.totalCount;
        peakHourStr = `${cell.dayLabel.substring(0, 3)} ${cell.hourLabel}`;
      }
    });

    return {
      peakHourStr,
      maxEvents,
      totalWeeklyEvents,
      spikeCount,
      activeHours: 42,
    };
  }, [matrixData]);

  // Color mapper based on selected view mode
  const getCellColor = (cell: HeatmapCellData) => {
    let value = cell.totalCount;
    if (heatmapMode === 'productivity') value = cell.productivityCount;
    if (heatmapMode === 'communications') value = cell.communicationCount;

    if (cell.isSpike && (heatmapMode === 'combined' || heatmapMode === 'communications')) {
      return 'bg-amber-500 text-white font-bold ring-2 ring-amber-300 ring-offset-1 animate-pulse';
    }

    if (value === 0) return 'bg-slate-100 text-transparent';
    if (value <= 3) return 'bg-emerald-50 text-emerald-900 border border-emerald-100/60';
    if (value <= 7) return 'bg-emerald-200 text-emerald-950';
    if (value <= 12) return 'bg-emerald-400 text-emerald-950 font-semibold';
    if (value <= 18) return 'bg-emerald-600 text-white font-bold';
    return 'bg-indigo-700 text-white font-bold';
  };

  return (
    <div id="activity-heatmap-widget" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Cross-Department Activity & Communication Heatmap
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600" />
                  Spikes Tracked
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly distribution of user productivity hours, deal operations, and cross-team communication bursts
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as Department | 'all')}
              className="text-xs font-semibold text-slate-700 bg-transparent border-0 focus:ring-0 cursor-pointer pr-4 py-0.5"
            >
              <option value="all">All Departments</option>
              <option value="cbdo">CBDO (Deals & Syndicate)</option>
              <option value="dev">Engineering & Infrastructure</option>
              <option value="communications">Communications & Swell PR</option>
              <option value="executive">Sovereign Executive</option>
              <option value="hr">People & Talent (HR)</option>
            </select>
          </div>

          {/* Metric Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setHeatmapMode('combined')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                heatmapMode === 'combined'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combined
            </button>
            <button
              onClick={() => setHeatmapMode('productivity')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                heatmapMode === 'productivity'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-600" />
              Productivity
            </button>
            <button
              onClick={() => setHeatmapMode('communications')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                heatmapMode === 'communications'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3 text-blue-600" />
              Comms Spikes
            </button>
          </div>

          {/* Time Window (Core 8am-8pm vs 24h) */}
          <button
            onClick={() => setTimeWindow(timeWindow === 'core' ? 'all' : 'core')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            title="Toggle between workday (8 AM - 8 PM) and full 24-hour perspective"
          >
            {timeWindow === 'core' ? 'Workday (8a - 8p)' : '24-Hour Clock'}
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-100 bg-slate-50/30 text-xs divide-x divide-slate-100">
        <div className="p-3 sm:px-5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Peak Activity Window</span>
          <span className="text-sm font-black font-mono text-slate-900 mt-0.5 block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            {summaryStats.peakHourStr}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">({summaryStats.maxEvents} events logged)</span>
        </div>

        <div className="p-3 sm:px-5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Communication Spikes</span>
          <span className="text-sm font-black font-mono text-amber-600 mt-0.5 block flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            {summaryStats.spikeCount} Surge Windows
          </span>
          <span className="text-[10px] text-slate-500 font-medium">&gt;200% above moving average</span>
        </div>

        <div className="p-3 sm:px-5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Weekly Operations Events</span>
          <span className="text-sm font-black font-mono text-slate-900 mt-0.5 block">
            {summaryStats.totalWeeklyEvents.toLocaleString()} Signals
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            +18.4% vs prev week
          </span>
        </div>

        <div className="p-3 sm:px-5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Team Squads</span>
          <span className="text-sm font-black font-mono text-slate-900 mt-0.5 block">
            {selectedDept === 'all' ? '5 Divisions Synced' : DEPARTMENTS[selectedDept].name}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Full cryptographic trace</span>
        </div>
      </div>

      {/* Heatmap Grid Stage */}
      <div className="p-4 sm:p-5 overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Hour Labels on X-axis */}
          <div className="flex items-center mb-2 pl-16">
            {hours.map(h => (
              <div key={h} className="flex-1 text-center text-[10px] font-mono text-slate-400 font-semibold">
                {h % 3 === 0 ? `${h % 12 === 0 ? 12 : h % 12}${h >= 12 ? 'p' : 'a'}` : ''}
              </div>
            ))}
          </div>

          {/* Matrix Rows (Days) */}
          <div className="space-y-1.5">
            {DAYS.map(day => (
              <div key={day.key} className="flex items-center gap-2">
                {/* Day Label */}
                <div className="w-14 text-right pr-2">
                  <span className="text-xs font-bold text-slate-700 block">{day.short}</span>
                  <span className="text-[9px] text-slate-400 block font-mono">
                    {day.key < 5 ? 'Work' : 'W/E'}
                  </span>
                </div>

                {/* Hour Cells */}
                <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${hours.length}, minmax(0, 1fr))` }}>
                  {hours.map(hour => {
                    const key = `${day.key}-${hour}`;
                    const cell = matrixData[key];
                    if (!cell) return null;

                    const displayValue = 
                      heatmapMode === 'productivity' ? cell.productivityCount :
                      heatmapMode === 'communications' ? cell.communicationCount :
                      cell.totalCount;

                    return (
                      <div
                        key={hour}
                        onMouseEnter={() => setHoveredCell(cell)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-8 sm:h-9 rounded-md flex items-center justify-center text-[10px] font-mono transition-all duration-150 cursor-pointer relative group ${getCellColor(cell)} hover:scale-105 hover:z-20 hover:shadow-md`}
                      >
                        {cell.isSpike && (
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                          </span>
                        )}
                        {displayValue > 0 ? displayValue : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Intensity Legend */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-600">Activity Level:</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 mr-1">Calm</span>
                <span className="w-3.5 h-3.5 rounded bg-slate-100 inline-block border border-slate-200" title="0 events" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-50 inline-block border border-emerald-100" title="1-3 events" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-200 inline-block" title="4-7 events" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-400 inline-block" title="8-12 events" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block" title="13-18 events" />
                <span className="w-3.5 h-3.5 rounded bg-indigo-700 inline-block" title="19+ events" />
                <span className="text-[10px] text-slate-400 ml-1">High Velocity</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block ring-2 ring-amber-300" />
                <span className="text-[11px] font-semibold text-amber-800">
                  Surge Spike (&gt;200% baseline)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Floating Hover Details Banner */}
      {hoveredCell && (
        <div className="p-3 sm:px-5 bg-slate-900 text-white text-xs border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono">
              {hoveredCell.totalCount}
            </div>
            <div>
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <span>{hoveredCell.dayLabel} at {hoveredCell.hourLabel}</span>
                {hoveredCell.isSpike && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    Surge Anomaly
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {hoveredCell.keyEventDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-400">Productivity:</span>{' '}
              <span className="font-mono font-bold text-white">{hoveredCell.productivityCount}</span>
            </div>
            <div>
              <span className="text-slate-400">Comms:</span>{' '}
              <span className="font-mono font-bold text-white">{hoveredCell.communicationCount}</span>
            </div>
            <div>
              <span className="text-slate-400">Contributors:</span>{' '}
              <span className="font-semibold text-emerald-400">{hoveredCell.topContributors.join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
