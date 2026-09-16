import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  FileSpreadsheet, 
  Calendar, 
  Clock, 
  Check, 
  Plus, 
  Trash2, 
  Download, 
  Sliders, 
  Bell, 
  Mail, 
  MessageSquare, 
  Layers, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Target,
  Copy
} from 'lucide-react';
import { CustomReportTemplate, ReportWidgetChoice } from '../../types';

export const TEMPLATES_STORAGE_KEY = 'SMO_CRM_REPORT_TEMPLATES_V1';

export const ALL_REPORT_WIDGETS: Array<{ id: ReportWidgetChoice; label: string; description: string; category: string }> = [
  { id: 'ai_weekly_summary', label: 'Executive AI Synthesis', description: 'Weekly AI overview, anomaly detection, and priorities', category: 'Executive Intelligence' },
  { id: 'kpi_cards', label: 'Portfolio Capital & Conversion KPIs', description: 'Total pipeline value, closed revenue, win rate, and lead scores', category: 'Core Financials' },
  { id: 'activity_heatmap', label: 'Activity & Communication Heatmap', description: 'Weekly user productivity hours and cross-department communication spikes', category: 'Operations & Comms' },
  { id: 'weekly_velocity', label: 'Deal Velocity & Transit Speed', description: 'Weekly capital movement pacing and department actions', category: 'Velocity Tracking' },
  { id: 'target_vs_actual', label: 'Target vs. Actual Quotas & OKRs', description: 'Department monthly quotas, actual pacing, and quarterly OKRs', category: 'Quota Management' },
  { id: 'executive_notes', label: 'Executive Summary Notes', description: 'Directives from Sovereign Executive Command', category: 'Strategic Directives' },
  { id: 'predictive_forecast', label: 'Predictive Capital Forecasting', description: 'Probabilistic weighted forward-looking capital projections', category: 'Forecasting' },
  { id: 'stage_funnel', label: 'Pipeline Stage Funnel Distribution', description: 'Value and opportunity volume progression across pipeline stages', category: 'Pipeline Health' },
  { id: 'team_sentiment', label: 'Team Morale & Qualitative Sentiment', description: 'Department morale metrics and qualitative team feedback', category: 'Team Health' },
  { id: 'distribution', label: 'Workspace & Team Allocation', description: 'Breakdown by sovereign workspace and assigned portfolio owners', category: 'Resource Allocation' },
];

export const DEFAULT_TEMPLATES: CustomReportTemplate[] = [
  {
    id: 'tmpl-exec-board-pack',
    name: 'Sovereign Board & LP Briefing',
    description: 'High-level synthesis for sovereign stakeholders focusing on portfolio capital, velocity, and quarterly OKRs.',
    format: 'pdf',
    timeframe: 'qtd',
    widgets: ['ai_weekly_summary', 'kpi_cards', 'target_vs_actual', 'weekly_velocity', 'executive_notes', 'predictive_forecast'],
    isRecurring: true,
    schedule: {
      frequency: 'weekly',
      dayOfWeek: 1, // Monday
      timeUtc: '08:00',
      distributionEmails: ['mezzoforte@sansmercantile.com', 'christopher@sansmercantile.com'],
      channelNotify: true,
    },
    createdAt: '2026-09-01',
    updatedAt: '2026-09-15',
  },
  {
    id: 'tmpl-ops-velocity-audit',
    name: 'Deal Ops & Communication Velocity Audit',
    description: 'Comprehensive operational telemetry report with activity heatmaps and stage velocity transit times.',
    format: 'csv',
    timeframe: '30d',
    widgets: ['activity_heatmap', 'weekly_velocity', 'stage_funnel', 'distribution', 'kpi_cards'],
    isRecurring: true,
    schedule: {
      frequency: 'monthly',
      dayOfMonth: 1,
      timeUtc: '09:00',
      distributionEmails: ['operations@sansmercantile.com'],
      channelNotify: true,
    },
    createdAt: '2026-09-05',
    updatedAt: '2026-09-15',
  },
  {
    id: 'tmpl-all-hands-pack',
    name: 'Complete All-Hands Comprehensive Pack',
    description: 'Full portfolio report spanning every analytics widget, team sentiment, and predictive forecasting.',
    format: 'both',
    timeframe: '7d',
    widgets: ['ai_weekly_summary', 'kpi_cards', 'activity_heatmap', 'weekly_velocity', 'target_vs_actual', 'executive_notes', 'predictive_forecast', 'stage_funnel', 'team_sentiment', 'distribution'],
    isRecurring: false,
    createdAt: '2026-09-10',
    updatedAt: '2026-09-15',
  },
];

interface CustomReportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunTemplate: (template: CustomReportTemplate) => void;
}

export const CustomReportTemplateModal: React.FC<CustomReportTemplateModalProps> = ({
  isOpen,
  onClose,
  onRunTemplate,
}) => {
  const [templates, setTemplates] = useState<CustomReportTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [editingTemplate, setEditingTemplate] = useState<CustomReportTemplate>(DEFAULT_TEMPLATES[0]);
  const [saveToast, setSaveToast] = useState(false);

  // Sync editing template when selectedTemplateId changes
  useEffect(() => {
    const found = templates.find(t => t.id === selectedTemplateId);
    if (found) {
      setEditingTemplate({ ...found });
    }
  }, [selectedTemplateId, templates]);

  if (!isOpen) return null;

  const handleToggleWidget = (widgetId: ReportWidgetChoice) => {
    setEditingTemplate(prev => {
      const exists = prev.widgets.includes(widgetId);
      const updated = exists
        ? prev.widgets.filter(w => w !== widgetId)
        : [...prev.widgets, widgetId];
      return { ...prev, widgets: updated };
    });
  };

  const handleSelectAllWidgets = () => {
    setEditingTemplate(prev => ({
      ...prev,
      widgets: ALL_REPORT_WIDGETS.map(w => w.id),
    }));
  };

  const handleDeselectAllWidgets = () => {
    setEditingTemplate(prev => ({
      ...prev,
      widgets: ['kpi_cards'],
    }));
  };

  // Merges a partial schedule edit with defaults so the result always
  // satisfies the required CustomReportTemplate schedule shape.
  const getSchedule = (): NonNullable<CustomReportTemplate['schedule']> => ({
    ...editingTemplate.schedule,
    frequency: editingTemplate.schedule?.frequency || 'weekly',
    timeUtc: editingTemplate.schedule?.timeUtc || '08:00',
    distributionEmails: editingTemplate.schedule?.distributionEmails || [],
  });

  const handleSaveTemplate = () => {
    const updated = {
      ...editingTemplate,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const nextList = templates.map(t => t.id === updated.id ? updated : t);
    setTemplates(nextList);
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.warn('Failed to save templates to storage', e);
    }

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleCreateNewTemplate = () => {
    const newTmpl: CustomReportTemplate = {
      id: `tmpl-${Date.now()}`,
      name: 'New Custom Report Template',
      description: 'Custom curated export template with tailored widgets and timeframe.',
      format: 'pdf',
      timeframe: '30d',
      widgets: ['ai_weekly_summary', 'kpi_cards', 'activity_heatmap', 'weekly_velocity', 'target_vs_actual'],
      isRecurring: false,
      schedule: {
        frequency: 'weekly',
        dayOfWeek: 1,
        timeUtc: '08:00',
        distributionEmails: ['executive@sansmercantile.com'],
        channelNotify: true,
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const nextList = [newTmpl, ...templates];
    setTemplates(nextList);
    setSelectedTemplateId(newTmpl.id);
    setEditingTemplate(newTmpl);
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (templates.length <= 1) {
      alert('You must maintain at least one report template.');
      return;
    }
    if (window.confirm('Delete this report template?')) {
      const nextList = templates.filter(t => t.id !== id);
      setTemplates(nextList);
      setSelectedTemplateId(nextList[0].id);
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(nextList));
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleDuplicateTemplate = (tmpl: CustomReportTemplate) => {
    const dup: CustomReportTemplate = {
      ...tmpl,
      id: `tmpl-dup-${Date.now()}`,
      name: `${tmpl.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const nextList = [dup, ...templates];
    setTemplates(nextList);
    setSelectedTemplateId(dup.id);
    setEditingTemplate(dup);
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all report templates to standard sovereign presets?')) {
      setTemplates(DEFAULT_TEMPLATES);
      setSelectedTemplateId(DEFAULT_TEMPLATES[0].id);
      setEditingTemplate(DEFAULT_TEMPLATES[0]);
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(DEFAULT_TEMPLATES));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Custom Report Templates & Automated Schedules
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                  PDF & CSV Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Define curated reporting packs. Select individual widgets, default timeframes, and configure automated recurring delivery.
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

        {/* Modal Layout: 2 Columns */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Template List & Presets */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/40 p-4 flex flex-col overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Templates ({templates.length})
              </span>
              <button
                onClick={handleCreateNewTemplate}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors border border-indigo-200"
              >
                <Plus className="w-3.5 h-3.5" />
                New Template
              </button>
            </div>

            {/* List of Templates */}
            <div className="space-y-2 flex-1">
              {templates.map(tmpl => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-indigo-500 shadow-xs ring-2 ring-indigo-100'
                        : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900 truncate">
                        {tmpl.name}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        tmpl.format === 'pdf' ? 'bg-indigo-50 text-indigo-700' :
                        tmpl.format === 'csv' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {tmpl.format}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                      {tmpl.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-600">
                        {tmpl.widgets.length} Widgets • {tmpl.timeframe.toUpperCase()}
                      </span>
                      {tmpl.isRecurring ? (
                        <span className="text-indigo-600 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tmpl.schedule?.frequency}
                        </span>
                      ) : (
                        <span>On-demand</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                onClick={handleResetDefaults}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>
          </div>

          {/* Right Column: Template Configurator Form */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-white">
            {/* Template Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex-1">
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="text-base font-bold text-slate-900 border-0 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 p-0 w-full"
                  placeholder="Template Name..."
                />
                <input
                  type="text"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="text-xs text-slate-500 border-0 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 p-0 w-full mt-1"
                  placeholder="Add a concise description..."
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDuplicateTemplate(editingTemplate)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  title="Duplicate Template"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(editingTemplate.id)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Core Settings: Format & Timeframe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Export Format */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Export Document Format
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate({ ...editingTemplate, format: 'pdf' })}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                      editingTemplate.format === 'pdf'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>PDF Doc</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingTemplate({ ...editingTemplate, format: 'csv' })}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                      editingTemplate.format === 'csv'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>CSV Sheet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingTemplate({ ...editingTemplate, format: 'both' })}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                      editingTemplate.format === 'both'
                        ? 'border-purple-500 bg-purple-50 text-purple-800 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>Dual Export</span>
                  </button>
                </div>
              </div>

              {/* Timeframe Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Report Historical Timeframe
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                  {(
                    [
                      { id: '7d', label: '7 Days' },
                      { id: '30d', label: '30 Days' },
                      { id: 'qtd', label: 'QTD' },
                      { id: 'ytd', label: 'YTD' },
                    ] as const
                  ).map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setEditingTemplate({ ...editingTemplate, timeframe: t.id })}
                      className={`py-2 px-1 rounded-lg border text-center transition-all ${
                        editingTemplate.timeframe === t.id
                          ? 'bg-slate-900 border-slate-900 text-white font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Determines data aggregation boundaries for all included widgets
                </span>
              </div>
            </div>

            {/* Widget Selection Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Included Report Widgets ({editingTemplate.widgets.length}/{ALL_REPORT_WIDGETS.length})
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Select specific modules to compile into this report
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAllWidgets}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={handleDeselectAllWidgets}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ALL_REPORT_WIDGETS.map(w => {
                  const isChecked = editingTemplate.widgets.includes(w.id);
                  return (
                    <div
                      key={w.id}
                      onClick={() => handleToggleWidget(w.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-indigo-50/50 border-indigo-300 shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{w.label}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{w.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {w.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recurring Automated Schedule Section */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Recurring Automated Report Schedule
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Deliver compiled report automatically to leadership channels on a set cadence
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setEditingTemplate({ ...editingTemplate, isRecurring: !editingTemplate.isRecurring })}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    editingTemplate.isRecurring ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      editingTemplate.isRecurring ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {editingTemplate.isRecurring && (
                <div className="pt-3 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Cadence</span>
                      <select
                        value={editingTemplate.schedule?.frequency || 'weekly'}
                        onChange={(e) => setEditingTemplate({
                          ...editingTemplate,
                          schedule: { ...getSchedule(), frequency: e.target.value as NonNullable<CustomReportTemplate['schedule']>['frequency'] }
                        })}
                        className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2"
                      >
                        <option value="daily">Daily (Mon-Fri)</option>
                        <option value="weekly">Weekly (Monday Morning)</option>
                        <option value="monthly">Monthly (1st of month)</option>
                        <option value="quarterly">Quarterly Close</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">UTC Dispatch Time</span>
                      <input
                        type="text"
                        value={editingTemplate.schedule?.timeUtc || '08:00'}
                        onChange={(e) => setEditingTemplate({
                          ...editingTemplate,
                          schedule: { ...getSchedule(), timeUtc: e.target.value }
                        })}
                        placeholder="08:00 UTC"
                        className="w-full text-xs font-mono font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Chat Announcement</span>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={editingTemplate.schedule?.channelNotify ?? true}
                          onChange={(e) => setEditingTemplate({
                            ...editingTemplate,
                            schedule: { ...getSchedule(), channelNotify: e.target.checked }
                          })}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        Post in #executive-sync
                      </label>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                      Recipient Email Distribution List (comma-separated)
                    </span>
                    <input
                      type="text"
                      value={(editingTemplate.schedule?.distributionEmails || []).join(', ')}
                      onChange={(e) => setEditingTemplate({
                        ...editingTemplate,
                        schedule: {
                          ...getSchedule(),
                          distributionEmails: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                        }
                      })}
                      placeholder="mezzoforte@sansmercantile.com, christopher@sansmercantile.com"
                      className="w-full text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Template Saved!
              </span>
            )}
            <button
              onClick={handleSaveTemplate}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              Save Template Changes
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSaveTemplate();
                onRunTemplate(editingTemplate);
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Run & Export Now using Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
