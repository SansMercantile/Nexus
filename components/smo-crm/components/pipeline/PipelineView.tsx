import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Kanban, 
  Table as TableIcon, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  DollarSign, 
  Calendar, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Deal, PipelineStage, DealPriority } from '../../types';

interface StageMeta {
  id: PipelineStage;
  label: string;
  color: string;
  badgeColor: string;
}

const STAGES: StageMeta[] = [
  { id: 'lead', label: 'Lead / Identified', color: 'border-t-slate-400', badgeColor: 'bg-slate-100 text-slate-700' },
  { id: 'outreach', label: 'Outreach & Sourcing', color: 'border-t-blue-500', badgeColor: 'bg-blue-50 text-blue-700' },
  { id: 'diligence', label: 'Due Diligence', color: 'border-t-amber-500', badgeColor: 'bg-amber-50 text-amber-700' },
  { id: 'pitch', label: 'Pitch / Sync Scheduled', color: 'border-t-purple-500', badgeColor: 'bg-purple-50 text-purple-700' },
  { id: 'proposal', label: 'Term Sheet / Proposal', color: 'border-t-indigo-600', badgeColor: 'bg-indigo-50 text-indigo-700' },
  { id: 'won', label: 'Closed Won / Committed', color: 'border-t-emerald-500', badgeColor: 'bg-emerald-50 text-emerald-700' },
  { id: 'lost', label: 'Passed / Archived', color: 'border-t-rose-400', badgeColor: 'bg-rose-50 text-rose-700' },
];

export const PipelineView: React.FC = () => {
  const { 
    deals, 
    currentSpace, 
    searchQuery, 
    teamMembers,
    setSelectedDeal,
    setIsDealModalOpen,
    setDealToEdit,
    moveDealStage,
    deleteDeal
  } = useCrm();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesSpace = currentSpace === 'All Spaces' || deal.space === currentSpace;
      const matchesSearch = 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = priorityFilter === 'all' || deal.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === 'all' || deal.assigneeId === assigneeFilter;

      return matchesSpace && matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [deals, currentSpace, searchQuery, priorityFilter, assigneeFilter]);

  // Aggregate stats
  const totalValue = filteredDeals.reduce((sum, d) => sum + (d.stage !== 'lost' ? d.value : 0), 0);
  const wonValue = filteredDeals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.value, 0);
  const inDiligenceCount = filteredDeals.filter(d => d.stage === 'diligence' || d.stage === 'proposal').length;
  
  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  const getPriorityBadge = (p: DealPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">High</span>;
      case 'normal':
        return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Normal</span>;
      case 'low':
        return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">Low</span>;
    }
  };

  const calculateLeadScore = (deal: Deal) => {
    const s = deal.leadScore;
    return s.strategicFit + s.fundingCapacity + s.networkLeverage + s.diligenceSpeed;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/40 overflow-hidden">
      {/* Top Banner / Filter Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Deal & Investor Pipeline</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {filteredDeals.length} Opportunities
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Managing venture rounds, institutional grants, and strategic sovereign contracts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
              <button
                id="smo-view-kanban-btn"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                id="smo-view-table-btn"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            {/* New Deal Trigger */}
            <button
              id="smo-create-deal-btn"
              onClick={() => {
                setDealToEdit(null);
                setIsDealModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Deal / Grant</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            <span className="text-[11px] font-medium text-slate-500">Active Pipeline</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">{formatCurrency(totalValue)}</div>
          </div>
          <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
            <span className="text-[11px] font-medium text-emerald-700">Closed / Committed</span>
            <div className="text-base font-bold text-emerald-800 mt-0.5">{formatCurrency(wonValue)}</div>
          </div>
          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
            <span className="text-[11px] font-medium text-amber-700">In Deep Diligence</span>
            <div className="text-base font-bold text-amber-800 mt-0.5">{inDiligenceCount} Deals</div>
          </div>
          <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
            <span className="text-[11px] font-medium text-indigo-700">Flagship Milestone</span>
            <div className="text-xs font-bold text-indigo-900 mt-0.5 truncate">Priv Pay Commercial Rail</div>
          </div>
        </div>

        {/* Sub Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-700">Filters:</span>
          </div>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium hover:bg-slate-100 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={e => setAssigneeFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium hover:bg-slate-100 focus:outline-none"
          >
            <option value="all">All Command Assignees</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {(priorityFilter !== 'all' || assigneeFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setPriorityFilter('all');
                setAssigneeFilter('all');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Board or Table */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        {viewMode === 'kanban' ? (
          <div className="flex gap-4 h-full min-w-max pb-2">
            {STAGES.map(stage => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage.id);
              const stageSum = stageDeals.reduce((s, d) => s + d.value, 0);

              return (
                <div
                  key={stage.id}
                  id={`smo-stage-column-${stage.id}`}
                  className="w-72 bg-slate-100/80 rounded-xl flex flex-col h-full border border-slate-200/90 shadow-2xs"
                >
                  {/* Column Header */}
                  <div className={`p-3 bg-white rounded-t-xl border-b border-slate-200 border-t-4 ${stage.color}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-xs font-bold text-slate-800">{stage.label}</h2>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {stageDeals.length}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-700 font-mono">
                        {formatCurrency(stageSum)}
                      </span>
                    </div>
                  </div>

                  {/* Deals Scroll Area */}
                  <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                    {stageDeals.length === 0 ? (
                      <div className="h-28 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs p-3 text-center">
                        <span className="font-medium">No deals in this stage</span>
                      </div>
                    ) : (
                      stageDeals.map(deal => {
                        const assignee = teamMembers.find(m => m.id === deal.assigneeId);
                        const score = calculateLeadScore(deal);

                        return (
                          <div
                            key={deal.id}
                            id={`smo-deal-card-${deal.id}`}
                            onClick={() => setSelectedDeal(deal)}
                            className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              {getPriorityBadge(deal.priority)}
                              <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded truncate max-w-[110px]">
                                {deal.space}
                              </span>
                            </div>

                            <h3 className="text-xs font-bold text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {deal.title}
                            </h3>

                            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                              {deal.organization}
                            </div>

                            {/* Value and Lead Score */}
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                              <span className="text-xs font-extrabold text-slate-900 font-mono">
                                {formatCurrency(deal.value)}
                              </span>

                              <div 
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                                  score >= 85 
                                    ? 'bg-emerald-50 text-emerald-700' 
                                    : score >= 70 
                                    ? 'bg-amber-50 text-amber-700' 
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                                title={`Lead Score: ${score}/100`}
                              >
                                <Award className="w-2.5 h-2.5" />
                                <span>{score}</span>
                              </div>
                            </div>

                            {/* Footer: Tags, Notes count, Assignee */}
                            <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                              <span className="truncate max-w-[130px]">
                                Due: {deal.expectedCloseDate || 'TBD'}
                              </span>

                              {assignee && (
                                <div className="flex items-center gap-1" title={`Assigned to ${assignee.name}`}>
                                  <img
                                    src={assignee.avatar}
                                    alt={assignee.name}
                                    className="w-4 h-4 rounded-full object-cover ring-1 ring-white"
                                  />
                                  <span className="text-slate-600 font-medium truncate max-w-[70px]">
                                    {assignee.name.split(' ')[0]}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Quick Stage Mover */}
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]" onClick={e => e.stopPropagation()}>
                              <span className="text-slate-400">Move:</span>
                              <select
                                value={deal.stage}
                                onChange={e => moveDealStage(deal.id, e.target.value as PipelineStage)}
                                className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium hover:bg-slate-100 focus:outline-none cursor-pointer"
                              >
                                {STAGES.map(s => (
                                  <option key={s.id} value={s.id}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs h-full flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Deal / Grant Title</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Value</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Space</th>
                    <th className="py-3 px-4">Lead Score</th>
                    <th className="py-3 px-4">Assignee</th>
                    <th className="py-3 px-4">Close Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeals.map(deal => {
                    const assignee = teamMembers.find(m => m.id === deal.assigneeId);
                    const score = calculateLeadScore(deal);

                    return (
                      <tr
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                          <div className="truncate">{deal.title}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {deal.organization}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900 font-mono">
                          {formatCurrency(deal.value)}
                        </td>
                        <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                          <select
                            value={deal.stage}
                            onChange={e => moveDealStage(deal.id, e.target.value as PipelineStage)}
                            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700"
                          >
                            {STAGES.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          {getPriorityBadge(deal.priority)}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px]">
                            {deal.space}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            score >= 85 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 bg-slate-100'
                          }`}>
                            {score}/100
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {assignee ? (
                            <div className="flex items-center gap-1.5">
                              <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-slate-700 font-medium">{assignee.name}</span>
                            </div>
                          ) : '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {deal.expectedCloseDate}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setDealToEdit(deal);
                                setIsDealModalOpen(true);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                              title="Edit deal"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete deal "${deal.title}"?`)) {
                                  deleteDeal(deal.id);
                                }
                              }}
                              className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600"
                              title="Delete deal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
