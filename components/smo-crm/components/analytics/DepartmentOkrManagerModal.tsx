import React, { useState, useEffect } from 'react';
import { 
  X, 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Save, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  Building2,
  DollarSign
} from 'lucide-react';
import { Department, DepartmentOkr, KeyResult } from '../../types';
import { DEPARTMENTS } from '../../data/departmentsData';
import { useCrm } from '../../context/CrmContext';

export const OKR_STORAGE_KEY = 'SMO_CRM_DEPT_OKRS_V1';
export const TARGETS_STORAGE_KEY = 'SMO_CRM_DEPT_TARGETS_V1';

export const INITIAL_OKRS: Record<Department, DepartmentOkr> = {
  cbdo: {
    id: 'okr-cbdo-q3',
    department: 'cbdo',
    quarter: 'Q3 2026',
    objective: 'Accelerate Sovereign Private Syndicate Commitments and Expand Tier-1 LP Pipeline',
    targetQuotaUsd: 1500000,
    ownerName: 'Christopher Maddison',
    updatedAt: '2026-09-15',
    keyResults: [
      {
        id: 'kr-cbdo-1',
        title: 'Ingest $3.5M+ in qualified institutional opportunities into Diligence stage',
        targetValue: 3500000,
        currentValue: 2850000,
        unit: '$',
        status: 'on_track',
      },
      {
        id: 'kr-cbdo-2',
        title: 'Achieve terminal conversion on Meridian Apex $3.2M debt syndicate',
        targetValue: 100,
        currentValue: 85,
        unit: '%',
        status: 'on_track',
      },
      {
        id: 'kr-cbdo-3',
        title: 'Compress average diligence transit time down to < 14 calendar days',
        targetValue: 14,
        currentValue: 16,
        unit: 'days',
        status: 'needs_attention',
      },
    ],
  },
  executive: {
    id: 'okr-exec-q3',
    department: 'executive',
    quarter: 'Q3 2026',
    objective: 'Institutionalize Sovereign Command Operations and Secure Strategic Sovereign Grants',
    targetQuotaUsd: 1000000,
    ownerName: 'Mezzoforte Privilege',
    updatedAt: '2026-09-15',
    keyResults: [
      {
        id: 'kr-exec-1',
        title: 'Secure Palladium Science Award sovereign grant funding ($350K tranche)',
        targetValue: 350000,
        currentValue: 350000,
        unit: '$',
        status: 'achieved',
      },
      {
        id: 'kr-exec-2',
        title: 'Complete cross-department alignment across all 5 divisions with verified KPIs',
        targetValue: 100,
        currentValue: 92,
        unit: '%',
        status: 'on_track',
      },
    ],
  },
  dev: {
    id: 'okr-dev-q3',
    department: 'dev',
    quarter: 'Q3 2026',
    objective: 'Harden Azure Priv Pay Microservices and Expand Commercial Tech Pilot Implementations',
    targetQuotaUsd: 400000,
    ownerName: 'Mohammed Kabir',
    updatedAt: '2026-09-15',
    keyResults: [
      {
        id: 'kr-dev-1',
        title: 'Commercial tech pilot deployment contracts signed',
        targetValue: 400000,
        currentValue: 310000,
        unit: '$',
        status: 'on_track',
      },
      {
        id: 'kr-dev-2',
        title: 'Maintain 99.98% SLA with < 15ms MQTT latency under 20k TPS stress tests',
        targetValue: 99.98,
        currentValue: 99.99,
        unit: '%',
        status: 'achieved',
      },
    ],
  },
  communications: {
    id: 'communications',
    department: 'communications',
    quarter: 'Q3 2026',
    objective: 'Amplify Brand Equity via Swell PR Wire and Secure Key Commercial Media Sponsorships',
    targetQuotaUsd: 250000,
    ownerName: 'Pascaline Khoza',
    updatedAt: '2026-09-15',
    keyResults: [
      {
        id: 'kr-comms-1',
        title: 'Commercial sponsor brand integration & PR partnership commitments',
        targetValue: 250000,
        currentValue: 180000,
        unit: '$',
        status: 'on_track',
      },
      {
        id: 'kr-comms-2',
        title: 'Secure exclusive embargo feature in Bloomberg or TechCrunch for Priv Pay launch',
        targetValue: 100,
        currentValue: 70,
        unit: '%',
        status: 'needs_attention',
      },
    ],
  },
  hr: {
    id: 'hr',
    department: 'hr',
    quarter: 'Q3 2026',
    objective: 'Deploy AI Autonomous Candidate Vetting and Close Senior Technical Hiring Quotas',
    targetQuotaUsd: 150000,
    ownerName: 'Amara Chen',
    updatedAt: '2026-09-15',
    keyResults: [
      {
        id: 'kr-hr-1',
        title: 'Onboard Senior Azure Cloud Architect and Head of Communications staff',
        targetValue: 4,
        currentValue: 3,
        unit: 'count',
        status: 'on_track',
      },
      {
        id: 'kr-hr-2',
        title: 'Achieve > 85% candidate satisfaction across automated video interview pipelines',
        targetValue: 85,
        currentValue: 92,
        unit: '%',
        status: 'achieved',
      },
    ],
  },
};

interface DepartmentOkrManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOkrsUpdated: (updatedOkrs: Record<Department, DepartmentOkr>, updatedTargets: Record<Department, number>) => void;
}

export const DepartmentOkrManagerModal: React.FC<DepartmentOkrManagerModalProps> = ({
  isOpen,
  onClose,
  onOkrsUpdated,
}) => {
  const { currentUser } = useCrm();
  const isAdmin = currentUser.isAdmin || currentUser.department === 'executive';

  const [okrs, setOkrs] = useState<Record<Department, DepartmentOkr>>(() => {
    try {
      const saved = localStorage.getItem(OKR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_OKRS;
    } catch {
      return INITIAL_OKRS;
    }
  });

  const [selectedDept, setSelectedDept] = useState<Department>('cbdo');
  const [activeQuarter, setActiveQuarter] = useState<'Q3 2026' | 'Q4 2026' | 'Q1 2027'>('Q3 2026');

  // Working copy for the active department OKR form
  const currentOkr = okrs[selectedDept];
  const [objectiveText, setObjectiveText] = useState(currentOkr.objective);
  const [targetQuotaInput, setTargetQuotaInput] = useState(currentOkr.targetQuotaUsd.toString());
  const [keyResults, setKeyResults] = useState<KeyResult[]>(currentOkr.keyResults);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Sync state when active department changes
  useEffect(() => {
    const okr = okrs[selectedDept];
    setObjectiveText(okr.objective);
    setTargetQuotaInput(okr.targetQuotaUsd.toString());
    setKeyResults(okr.keyResults);
    setSaveSuccessNotice(false);
  }, [selectedDept, okrs]);

  if (!isOpen) return null;

  const handleUpdateKeyResult = (id: string, updates: Partial<KeyResult>) => {
    setKeyResults(prev => prev.map(kr => kr.id === id ? { ...kr, ...updates } : kr));
  };

  const handleAddKeyResult = () => {
    const newKr: KeyResult = {
      id: `kr-${Date.now()}`,
      title: 'New Measurable Key Result (Target vs Actual)',
      targetValue: 100,
      currentValue: 0,
      unit: '%',
      status: 'on_track',
    };
    setKeyResults(prev => [...prev, newKr]);
  };

  const handleRemoveKeyResult = (id: string) => {
    setKeyResults(prev => prev.filter(kr => kr.id !== id));
  };

  const handleSaveOkr = () => {
    const parsedQuota = parseFloat(targetQuotaInput.replace(/[^0-9.]/g, '')) || currentOkr.targetQuotaUsd;

    const updatedOkr: DepartmentOkr = {
      ...currentOkr,
      quarter: activeQuarter,
      objective: objectiveText,
      targetQuotaUsd: parsedQuota,
      keyResults,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const updatedOkrs = {
      ...okrs,
      [selectedDept]: updatedOkr,
    };

    // Construct corresponding target quotas for TargetVsActualWidget
    const updatedTargets: Record<Department, number> = {
      cbdo: updatedOkrs.cbdo.targetQuotaUsd,
      executive: updatedOkrs.executive.targetQuotaUsd,
      dev: updatedOkrs.dev.targetQuotaUsd,
      communications: updatedOkrs.communications.targetQuotaUsd,
      hr: updatedOkrs.hr.targetQuotaUsd,
    };

    setOkrs(updatedOkrs);

    try {
      localStorage.setItem(OKR_STORAGE_KEY, JSON.stringify(updatedOkrs));
      localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(updatedTargets));
    } catch (e) {
      console.warn('Failed to persist OKRs', e);
    }

    onOkrsUpdated(updatedOkrs, updatedTargets);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all department quarterly OKRs to defaults?')) {
      setOkrs(INITIAL_OKRS);
      const defaultTargets: Record<Department, number> = {
        cbdo: INITIAL_OKRS.cbdo.targetQuotaUsd,
        executive: INITIAL_OKRS.executive.targetQuotaUsd,
        dev: INITIAL_OKRS.dev.targetQuotaUsd,
        communications: INITIAL_OKRS.communications.targetQuotaUsd,
        hr: INITIAL_OKRS.hr.targetQuotaUsd,
      };
      localStorage.setItem(OKR_STORAGE_KEY, JSON.stringify(INITIAL_OKRS));
      localStorage.setItem(TARGETS_STORAGE_KEY, JSON.stringify(defaultTargets));
      onOkrsUpdated(INITIAL_OKRS, defaultTargets);
    }
  };

  // Compute OKR completion percentage for active department
  const computeOkrProgress = () => {
    if (!keyResults.length) return 0;
    const scores = keyResults.map(kr => {
      if (kr.unit === 'days') {
        // Lower is better for days
        return Math.min(100, Math.round((kr.targetValue / Math.max(1, kr.currentValue)) * 100));
      }
      return Math.min(100, Math.round((kr.currentValue / Math.max(1, kr.targetValue)) * 100));
    });
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avg);
  };

  const okrProgress = computeOkrProgress();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-2xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Quarterly Department OKR & Quota Management
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                  Auto-Synchronized
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Define measurable Objectives and Key Results. Changes to Target Capital directly adjust CRM Target vs. Actual progress bars.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Department Selector Tabs */}
        <div className="px-5 pt-3 pb-0 bg-slate-100/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {(['cbdo', 'executive', 'dev', 'communications', 'hr'] as Department[]).map(dept => {
              const info = DEPARTMENTS[dept];
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    dept === 'cbdo' ? 'bg-purple-500' :
                    dept === 'executive' ? 'bg-emerald-500' :
                    dept === 'dev' ? 'bg-blue-500' :
                    dept === 'communications' ? 'bg-pink-500' : 'bg-amber-500'
                  }`} />
                  {info.name.split('&')[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Quarter Switcher */}
          <div className="flex items-center gap-1 pb-1">
            <span className="text-xs font-semibold text-slate-500 mr-1">Quarter:</span>
            {(['Q3 2026', 'Q4 2026', 'Q1 2027'] as const).map(q => (
              <button
                key={q}
                onClick={() => setActiveQuarter(q)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                  activeQuarter === q
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body / Form */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Department Meta Banner */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Selected Division</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {DEPARTMENTS[selectedDept].name}
              </h3>
              <p className="text-xs text-slate-500">
                Department Lead: <span className="font-semibold text-slate-700">{DEPARTMENTS[selectedDept].leadName}</span> ({DEPARTMENTS[selectedDept].leadRole})
              </p>
            </div>

            {/* Live Progress Ring */}
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-600 flex items-center justify-center text-xs font-black font-mono text-indigo-700">
                {okrProgress}%
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">OKR Pacing</span>
                <span className="text-xs font-bold text-slate-800">
                  {okrProgress >= 80 ? 'On Track' : okrProgress >= 50 ? 'Needs Attention' : 'At Risk'}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields: Objective & Target Quota */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Strategic Objective */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Strategic Objective ({activeQuarter})
              </label>
              <textarea
                rows={2}
                value={objectiveText}
                onChange={(e) => setObjectiveText(e.target.value)}
                placeholder="e.g. Expand institutional investor syndicate and accelerate diligence pipelines..."
                className="w-full text-xs text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                High-level strategic aspiration aligning the department for the quarter
              </span>
            </div>

            {/* Target Quota in USD (Updates Target vs Actual Bar) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Target Capital Quota (USD)</span>
                <span className="text-[10px] font-semibold text-indigo-600">Syncs Target vs Actual</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={targetQuotaInput}
                  onChange={(e) => setTargetQuotaInput(e.target.value)}
                  className="w-full text-xs font-bold font-mono text-slate-900 pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1500000"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Formatted: ${(parseFloat(targetQuotaInput.replace(/[^0-9.]/g, '')) || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Key Results Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Measurable Key Results (KRs)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Specific quantitative milestones that determine completion of the strategic objective
                </p>
              </div>

              <button
                onClick={handleAddKeyResult}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Key Result
              </button>
            </div>

            <div className="space-y-3">
              {keyResults.map((kr, idx) => {
                const pct = kr.unit === 'days'
                  ? Math.min(100, Math.round((kr.targetValue / Math.max(1, kr.currentValue)) * 100))
                  : Math.min(100, Math.round((kr.currentValue / Math.max(1, kr.targetValue)) * 100));

                return (
                  <div
                    key={kr.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={kr.title}
                          onChange={(e) => handleUpdateKeyResult(kr.id, { title: e.target.value })}
                          className="w-full text-xs font-semibold text-slate-900 border-0 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 px-1 py-0.5"
                          placeholder="e.g. Close 3 sovereign agreements..."
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveKeyResult(kr.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Delete Key Result"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Values and Status Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Current</span>
                        <input
                          type="number"
                          value={kr.currentValue}
                          onChange={(e) => handleUpdateKeyResult(kr.id, { currentValue: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target</span>
                        <input
                          type="number"
                          value={kr.targetValue}
                          onChange={(e) => handleUpdateKeyResult(kr.id, { targetValue: parseFloat(e.target.value) || 1 })}
                          className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Unit</span>
                        <select
                          value={kr.unit}
                          onChange={(e) => handleUpdateKeyResult(kr.id, { unit: e.target.value as any })}
                          className="w-full text-xs font-semibold text-slate-700 border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="$">Currency ($)</option>
                          <option value="%">Percentage (%)</option>
                          <option value="count">Count / Qty</option>
                          <option value="days">Days (Latency)</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Status</span>
                        <select
                          value={kr.status}
                          onChange={(e) => handleUpdateKeyResult(kr.id, { status: e.target.value as any })}
                          className={`w-full text-xs font-bold border rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 ${
                            kr.status === 'achieved' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            kr.status === 'on_track' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                            kr.status === 'needs_attention' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            'bg-red-50 text-red-800 border-red-300'
                          }`}
                        >
                          <option value="on_track">On Track</option>
                          <option value="needs_attention">Needs Attention</option>
                          <option value="at_risk">At Risk</option>
                          <option value="achieved">Achieved</option>
                        </select>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span>Pacing: {kr.unit === '$' ? `$${kr.currentValue.toLocaleString()}` : kr.currentValue} / {kr.unit === '$' ? `$${kr.targetValue.toLocaleString()}` : kr.targetValue} {kr.unit !== '$' && kr.unit}</span>
                        <span className="font-bold text-slate-800">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            pct >= 100 ? 'bg-emerald-600' :
                            pct >= 70 ? 'bg-indigo-600' :
                            pct >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            {saveSuccessNotice && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Target vs. Actual Synchronized!
              </span>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSaveOkr}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save OKR & Update Progress Bars
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
