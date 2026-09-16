import React, { useState, useEffect } from 'react';
import { Target, Edit3, Check, DollarSign, Award, HelpCircle, Layers, TrendingUp, Sliders, CheckCircle2 } from 'lucide-react';
import { Department, DepartmentOkr } from '../../types';
import { DEPARTMENTS } from '../../data/departmentsData';
import { useCrm } from '../../context/CrmContext';
import { DepartmentOkrManagerModal, OKR_STORAGE_KEY, TARGETS_STORAGE_KEY, INITIAL_OKRS } from './DepartmentOkrManagerModal';

const DEFAULT_TARGETS: Record<Department, number> = {
  cbdo: 1500000,        // $1.5M deal pipeline target
  executive: 1000000,   // $1.0M sovereign grants target
  dev: 400000,          // $400k tech pilot implementations
  communications: 250000,// $250k commercial sponsors / PR partnerships
  hr: 150000,           // $150k talent bounty & enterprise training allocation
};

// Circular progress calculation
function CircularProgress({
  percentage,
  size = 80,
  strokeWidth = 7,
  colorClass = 'text-indigo-600',
  trackColor = '#E2E8F0',
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trackColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className={`${colorClass} transition-all duration-700 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-black font-mono text-slate-900 leading-none">
          {Math.round(percentage)}%
        </span>
        <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
          Quota
        </span>
      </div>
    </div>
  );
}

export const TargetVsActualWidget: React.FC = () => {
  const { deals, currentUser } = useCrm();
  const isAdmin = currentUser.isAdmin || currentUser.department === 'executive';

  const [targets, setTargets] = useState<Record<Department, number>>(() => {
    try {
      const saved = localStorage.getItem(TARGETS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_TARGETS;
    } catch {
      return DEFAULT_TARGETS;
    }
  });

  const [okrs, setOkrs] = useState<Record<Department, DepartmentOkr>>(() => {
    try {
      const saved = localStorage.getItem(OKR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_OKRS;
    } catch {
      return INITIAL_OKRS;
    }
  });

  const [isOkrModalOpen, setIsOkrModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const saveQuota = (dept: Department) => {
    const num = parseFloat(editValue.replace(/[^0-9.]/g, ''));
    if (!isNaN(num) && num > 0) {
      const updatedTargets = { ...targets, [dept]: num };
      const updatedOkrs = {
        ...okrs,
        [dept]: {
          ...okrs[dept],
          targetQuotaUsd: num,
        },
      };
      setTargets(updatedTargets);
      setOkrs(updatedOkrs);
      try {
        localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(updatedTargets));
        localStorage.setItem(OKR_STORAGE_KEY, JSON.stringify(updatedOkrs));
      } catch (e) {
        console.warn('Failed to save targets', e);
      }
    }
    setEditingDept(null);
  };

  const handleOkrsUpdated = (
    updatedOkrs: Record<Department, DepartmentOkr>,
    updatedTargets: Record<Department, number>
  ) => {
    setOkrs(updatedOkrs);
    setTargets(updatedTargets);
  };

  const startEdit = (dept: Department, currentVal: number) => {
    if (!isAdmin) return;
    setEditingDept(dept);
    setEditValue(currentVal.toString());
  };

  // Compute actuals per department from deals
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  const getActualForDept = (dept: Department): number => {
    if (dept === 'cbdo') {
      return deals
        .filter(d => d.space === 'CBDO workspace' && d.stage !== 'lost')
        .reduce((sum, d) => sum + d.value, 0);
    }
    if (dept === 'executive') {
      return deals
        .filter(d => d.space === 'Sovereign Command' && d.stage !== 'lost')
        .reduce((sum, d) => sum + d.value, 0);
    }
    if (dept === 'communications') {
      return deals
        .filter(d => d.space === 'PR & Comms' && d.stage !== 'lost')
        .reduce((sum, d) => sum + d.value, 0);
    }
    if (dept === 'dev') {
      return deals
        .filter(d => (d.space === 'Mpeti' || d.tags?.some(t => t.toLowerCase().includes('pos') || t.toLowerCase().includes('rail'))) && d.stage !== 'lost')
        .reduce((sum, d) => sum + d.value, 0);
    }
    if (dept === 'hr') {
      return deals
        .filter(d => d.space === 'CrazyJam Records' && d.stage !== 'lost')
        .reduce((sum, d) => sum + d.value, 0);
    }
    return 0;
  };

  const departmentsList: Department[] = ['cbdo', 'executive', 'dev', 'communications', 'hr'];

  const totalActual = departmentsList.reduce((acc, d) => acc + getActualForDept(d), 0);
  const totalTarget = departmentsList.reduce((acc, d) => acc + (targets[d] || 1), 0);
  const totalPacingPct = Math.round((totalActual / totalTarget) * 100);

  const deptColorMap: Record<Department, { bar: string; badge: string }> = {
    cbdo: { bar: 'text-purple-600', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    executive: { bar: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    dev: { bar: 'text-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    communications: { bar: 'text-pink-600', badge: 'bg-pink-50 text-pink-700 border-pink-200' },
    hr: { bar: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  };

  return (
    <>
      <div id="target-vs-actual-widget" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Quarterly Target vs. Actual Quotas & OKRs
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-indigo-100 text-indigo-800">
                    Q3 2026 Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time capital pacing synchronized with department Objectives & Key Results
                </p>
              </div>
            </div>
          </div>

          {/* Action & Global Pacing Metric Pill */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Manage Department OKRs Button */}
            <button
              onClick={() => setIsOkrModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Set and manage department quarterly OKRs and capital targets"
            >
              <Sliders className="w-3.5 h-3.5" />
              Manage Department OKRs
            </button>

            <div className="text-right pl-2 border-l border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Portfolio Pacing</div>
              <div className="text-sm font-black font-mono text-slate-900 flex items-center gap-1.5 justify-end">
                <span>{formatCurrency(totalActual)}</span>
                <span className="text-xs text-slate-400 font-normal">/ {formatCurrency(totalTarget)}</span>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 font-mono text-xs font-black text-indigo-700">
              {totalPacingPct}%
            </div>
          </div>
        </div>

        {/* Circular Progress Bars Grid per Department */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {departmentsList.map(dept => {
            const info = DEPARTMENTS[dept];
            const actual = getActualForDept(dept);
            const target = targets[dept] || 1;
            const percentage = (actual / target) * 100;
            const styling = deptColorMap[dept];
            const isEditing = editingDept === dept;
            const deptOkr = okrs[dept];

            return (
              <div
                key={dept}
                id={`quota-card-${dept}`}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col items-center text-center relative group"
              >
                {/* Department Header Badge */}
                <div className="w-full flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${styling.badge}`}>
                    {info.name.split(' ')[0]}
                  </span>
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => startEdit(dept, target)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                        title={`Quick edit ${info.name} quota`}
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Circular Gauge */}
                <div className="my-1">
                  <CircularProgress
                    percentage={percentage}
                    size={76}
                    strokeWidth={6.5}
                    colorClass={styling.bar}
                  />
                </div>

                {/* Department Name & Lead */}
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]" title={info.name}>
                    {info.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    Lead: {info.leadName}
                  </div>
                </div>

                {/* Active OKR Objective Snip */}
                {deptOkr && (
                  <div className="mt-2 px-2 py-1 bg-white rounded border border-slate-200/80 w-full text-left">
                    <span className="text-[9px] font-bold text-indigo-700 uppercase block tracking-wider">
                      OKR Objective
                    </span>
                    <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight" title={deptOkr.objective}>
                      {deptOkr.objective}
                    </p>
                  </div>
                )}

                {/* Financial Metrics */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 w-full flex items-center justify-between text-xs">
                  <div className="text-left">
                    <div className="text-[9px] uppercase font-bold text-slate-400">Actual</div>
                    <div className="font-mono font-bold text-slate-900 text-[11px]">
                      {formatCurrency(actual)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[9px] uppercase font-bold text-slate-400">Target Quota</div>
                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="w-16 px-1 py-0.5 text-[10px] font-mono border border-indigo-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveQuota(dept);
                            if (e.key === 'Escape') setEditingDept(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => saveQuota(dept)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Save quota"
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEdit(dept, target)}
                        className={`font-mono font-bold text-slate-600 text-[11px] ${isAdmin ? 'cursor-pointer hover:text-indigo-600 underline decoration-dotted' : ''}`}
                        title={isAdmin ? 'Click to adjust target quota or use Manage OKRs' : undefined}
                      >
                        {formatCurrency(target)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${percentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'} transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department OKR Manager Modal */}
      <DepartmentOkrManagerModal
        isOpen={isOkrModalOpen}
        onClose={() => setIsOkrModalOpen(false)}
        onOkrsUpdated={handleOkrsUpdated}
      />
    </>
  );
};

