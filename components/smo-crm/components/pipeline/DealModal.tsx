import React, { useState, useEffect } from 'react';
import { X, Sparkles, Award } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Deal, PipelineStage, DealPriority, WorkspaceSpace } from '../../types';

export const DealModal: React.FC = () => {
  const { 
    isDealModalOpen, 
    setIsDealModalOpen, 
    dealToEdit, 
    addDeal, 
    updateDeal, 
    teamMembers, 
    currentSpace 
  } = useCrm();

  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [value, setValue] = useState<number>(100000);
  const [stage, setStage] = useState<PipelineStage>('lead');
  const [priority, setPriority] = useState<DealPriority>('normal');
  const [space, setSpace] = useState<WorkspaceSpace>('CBDO workspace');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Lead score criteria
  const [strategicFit, setStrategicFit] = useState(20);
  const [fundingCapacity, setFundingCapacity] = useState(20);
  const [networkLeverage, setNetworkLeverage] = useState(20);
  const [diligenceSpeed, setDiligenceSpeed] = useState(20);

  useEffect(() => {
    if (dealToEdit) {
      setTitle(dealToEdit.title);
      setOrganization(dealToEdit.organization);
      setContactPerson(dealToEdit.contactPerson);
      setContactEmail(dealToEdit.contactEmail);
      setValue(dealToEdit.value);
      setStage(dealToEdit.stage);
      setPriority(dealToEdit.priority);
      setSpace(dealToEdit.space);
      setAssigneeId(dealToEdit.assigneeId);
      setExpectedCloseDate(dealToEdit.expectedCloseDate);
      setTagsInput(dealToEdit.tags.join(', '));
      setStrategicFit(dealToEdit.leadScore.strategicFit);
      setFundingCapacity(dealToEdit.leadScore.fundingCapacity);
      setNetworkLeverage(dealToEdit.leadScore.networkLeverage);
      setDiligenceSpeed(dealToEdit.leadScore.diligenceSpeed);
    } else {
      setTitle('');
      setOrganization('');
      setContactPerson('');
      setContactEmail('');
      setValue(150000);
      setStage('lead');
      setPriority('normal');
      setSpace(currentSpace === 'All Spaces' ? 'CBDO workspace' : currentSpace);
      setAssigneeId(teamMembers[0]?.id || '');
      setExpectedCloseDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setTagsInput('Grant, VC, Strategic');
      setStrategicFit(22);
      setFundingCapacity(20);
      setNetworkLeverage(21);
      setDiligenceSpeed(20);
    }
  }, [dealToEdit, isDealModalOpen, currentSpace, teamMembers]);

  if (!isDealModalOpen) return null;

  const totalScore = strategicFit + fundingCapacity + networkLeverage + diligenceSpeed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const dealPayload = {
      title: title.trim(),
      organization: organization.trim(),
      contactPerson: contactPerson.trim() || 'Principal Contact',
      contactEmail: contactEmail.trim() || 'contact@example.com',
      value: Number(value) || 0,
      stage,
      priority,
      space,
      assigneeId: assigneeId || teamMembers[0]?.id || 'user-mezzoforte',
      expectedCloseDate: expectedCloseDate || new Date().toISOString().split('T')[0],
      leadScore: {
        strategicFit,
        fundingCapacity,
        networkLeverage,
        diligenceSpeed,
      },
      tags,
    };

    if (dealToEdit) {
      updateDeal(dealToEdit.id, dealPayload);
    } else {
      addDeal(dealPayload);
    }

    setIsDealModalOpen(false);
  };

  return (
    <div 
      id="smo-deal-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsDealModalOpen(false)}
    >
      <div 
        id="smo-deal-modal"
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {dealToEdit ? 'Edit Pipeline Opportunity' : 'New Deal / Grant Opportunity'}
              </h2>
              <p className="text-[11px] text-slate-500">Sans Mercantile Operations Pipeline</p>
            </div>
          </div>
          <button
            onClick={() => setIsDealModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Deal or Award Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Series A Sovereign Round / Palladium Science Award"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Organization / Syndicate *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="e.g. Meridian Apex Capital"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Deal Value (USD) *</label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder="e.g. Vivienne De Vries"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="e.g. v.devries@meridianapex.com"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Pipeline Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as PipelineStage)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="lead">Lead / Identified</option>
                <option value="outreach">Outreach & Sourcing</option>
                <option value="diligence">Due Diligence</option>
                <option value="pitch">Pitch / Sync Scheduled</option>
                <option value="proposal">Term Sheet / Proposal</option>
                <option value="won">Closed Won / Committed</option>
                <option value="lost">Passed / Archived</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as DealPriority)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Workspace Space</label>
              <select
                value={space}
                onChange={e => setSpace(e.target.value as WorkspaceSpace)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="Sovereign Command">Sovereign Command</option>
                <option value="CBDO workspace">CBDO workspace</option>
                <option value="PR & Comms">PR & Comms</option>
                <option value="Mpeti">Mpeti</option>
                <option value="CrazyJam Records">CrazyJam Records</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Assignee</label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role.split('&')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Grant, Science Award, Series A, Lead Investor"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Lead Scoring Rubric Form */}
          <div className="pt-3 border-t border-slate-200 bg-slate-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Lead Scoring Rubric Evaluation</span>
              </div>
              <span className="font-black text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded text-xs">
                Score: {totalScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <div className="flex justify-between mb-1 text-slate-600 font-medium">
                  <span>Strategic Fit: {strategicFit}/25</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={strategicFit}
                  onChange={e => setStrategicFit(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-600 font-medium">
                  <span>Capital Scale: {fundingCapacity}/25</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={fundingCapacity}
                  onChange={e => setFundingCapacity(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-600 font-medium">
                  <span>Network Leverage: {networkLeverage}/25</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={networkLeverage}
                  onChange={e => setNetworkLeverage(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-600 font-medium">
                  <span>Diligence Velocity: {diligenceSpeed}/25</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={diligenceSpeed}
                  onChange={e => setDiligenceSpeed(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDealModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              {dealToEdit ? 'Save Changes' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
