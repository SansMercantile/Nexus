import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Award, 
  Layers, 
  MessageSquare, 
  Send, 
  Clock, 
  Tag, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Deal, PipelineStage } from '../../types';

const STAGE_STEPS: { id: PipelineStage; label: string }[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'diligence', label: 'Diligence' },
  { id: 'pitch', label: 'Pitch' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'won', label: 'Won' },
];

export const DealDetailDrawer: React.FC = () => {
  const { 
    selectedDeal, 
    setSelectedDeal, 
    teamMembers, 
    moveDealStage, 
    addDealNote, 
    setDealToEdit, 
    setIsDealModalOpen, 
    deleteDeal 
  } = useCrm();

  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'note' | 'sync' | 'call' | 'email'>('note');

  if (!selectedDeal) return null;

  const assignee = teamMembers.find(m => m.id === selectedDeal.assigneeId);
  const score = selectedDeal.leadScore;
  const totalScore = score.strategicFit + score.fundingCapacity + score.networkLeverage + score.diligenceSpeed;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addDealNote(selectedDeal.id, noteContent.trim(), noteType);
    setNoteContent('');
  };

  return (
    <div 
      id="smo-deal-drawer-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex justify-end"
      onClick={() => setSelectedDeal(null)}
    >
      <div 
        id="smo-deal-drawer"
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                {selectedDeal.space}
              </span>
              <span className="text-[11px] font-semibold uppercase text-slate-500">
                Priority: {selectedDeal.priority}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {selectedDeal.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {selectedDeal.organization}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setDealToEdit(selectedDeal);
                setIsDealModalOpen(true);
              }}
              className="p-1.5 hover:bg-slate-200/80 rounded-md text-slate-600 transition-colors"
              title="Edit Deal"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete deal "${selectedDeal.title}"?`)) {
                  deleteDeal(selectedDeal.id);
                }
              }}
              className="p-1.5 hover:bg-rose-100 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
              title="Delete Deal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDeal(null)}
              className="p-1.5 hover:bg-slate-200/80 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Progress Ribbon */}
        <div className="px-5 py-3 bg-white border-b border-slate-200">
          <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Pipeline Stage Progression</div>
          <div className="grid grid-cols-6 gap-1">
            {STAGE_STEPS.map((step, idx) => {
              const currentIndex = STAGE_STEPS.findIndex(s => s.id === selectedDeal.stage);
              const isPast = idx < currentIndex;
              const isCurrent = step.id === selectedDeal.stage;

              return (
                <button
                  key={step.id}
                  onClick={() => moveDealStage(selectedDeal.id, step.id)}
                  className={`py-1 text-[11px] font-semibold text-center rounded transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isPast
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Core Deal Attributes */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Deal / Grant Value</span>
              <div className="text-lg font-black text-slate-900 mt-0.5 font-mono">
                ${selectedDeal.value.toLocaleString()} USD
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Expected Closing</span>
              <div className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedDeal.expectedCloseDate || 'Not specified'}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium">Primary Contact</span>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedDeal.contactPerson}</div>
              <div className="text-[11px] text-slate-500">{selectedDeal.contactEmail}</div>
            </div>
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium">Sovereign Assignee</span>
              {assignee ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs font-semibold text-slate-800">{assignee.name}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Unassigned</div>
              )}
            </div>
          </div>

          {/* Lead Scoring Rubric Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">Lead Scoring Rubric (CBDO Standard)</h3>
              </div>
              <span className={`text-xs font-black px-2 py-0.5 rounded ${
                totalScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-50 text-indigo-800'
              }`}>
                {totalScore} / 100 PTS
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Strategic Fit (Max 25)</span>
                  <span className="font-bold">{score.strategicFit}/25</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(score.strategicFit / 25) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Funding / Capital Capacity (Max 25)</span>
                  <span className="font-bold">{score.fundingCapacity}/25</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(score.fundingCapacity / 25) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Network & Rail Leverage (Max 25)</span>
                  <span className="font-bold">{score.networkLeverage}/25</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(score.networkLeverage / 25) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Diligence & Closing Velocity (Max 25)</span>
                  <span className="font-bold">{score.diligenceSpeed}/25</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(score.diligenceSpeed / 25) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {selectedDeal.tags.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">Tags & Categorization</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedDeal.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity & Notes Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-900">Activity & Sync Notes ({selectedDeal.notes.length})</h3>
              </div>
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <textarea
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="Log weekly sync remarks, diligence notes, or jury feedback..."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none h-18"
              />
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <select
                    value={noteType}
                    onChange={e => setNoteType(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-medium"
                  >
                    <option value="note">General Note</option>
                    <option value="sync">Weekly Sync Note</option>
                    <option value="call">Call / Pitch Note</option>
                    <option value="email">Email Touchpoint</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!noteContent.trim()}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Log Entry</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-2.5 pt-2">
              {selectedDeal.notes.map(note => (
                <div key={note.id} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{note.authorName}</span>
                    <span className="text-slate-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
