import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  DollarSign, 
  Target, 
  User, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  Layers, 
  Filter,
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Deal, PipelineStage } from '../../types';
import { useCrm } from '../../context/CrmContext';

export interface MetricDrillDownSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  metricTitle: string;
  metricValue: string;
  metricSubtitle?: string;
  metricCategory?: string;
  deals: Deal[];
  onSelectDeal?: (deal: Deal) => void;
}

const STAGE_CONFIG: Record<PipelineStage, { label: string; color: string; badge: string }> = {
  lead: { label: 'Lead / Identified', color: 'bg-slate-400', badge: 'bg-slate-50 text-slate-700 border-slate-200' },
  outreach: { label: 'Outreach & Sourcing', color: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  diligence: { label: 'Due Diligence', color: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  pitch: { label: 'Pitch / Sync', color: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  proposal: { label: 'Term Sheet / Proposal', color: 'bg-indigo-600', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  won: { label: 'Closed Won', color: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  lost: { label: 'Closed Lost', color: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export const MetricDrillDownSidePanel: React.FC<MetricDrillDownSidePanelProps> = ({
  isOpen,
  onClose,
  metricTitle,
  metricValue,
  metricSubtitle,
  metricCategory,
  deals,
  onSelectDeal
}) => {
  const { teamMembers, setSelectedDeal } = useCrm();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'value_desc' | 'score_desc' | 'recent'>('value_desc');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset filters when opened
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setStageFilter('all');
    }
  }, [isOpen, metricTitle]);

  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => {
        const matchesSearch = 
          (deal.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (deal.organization?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (deal.contactPerson?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (deal.space?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;

        return matchesSearch && matchesStage;
      })
      .sort((a, b) => {
        if (sortBy === 'value_desc') {
          return b.value - a.value;
        }
        if (sortBy === 'score_desc') {
          const scoreA = (a.leadScore?.strategicFit || 0) + (a.leadScore?.fundingCapacity || 0) + (a.leadScore?.networkLeverage || 0) + (a.leadScore?.diligenceSpeed || 0);
          const scoreB = (b.leadScore?.strategicFit || 0) + (b.leadScore?.fundingCapacity || 0) + (b.leadScore?.networkLeverage || 0) + (b.leadScore?.diligenceSpeed || 0);
          return scoreB - scoreA;
        }
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      });
  }, [deals, searchTerm, stageFilter, sortBy]);

  const totalFilteredValue = useMemo(() => {
    return filteredDeals.reduce((sum, d) => sum + (d.stage !== 'lost' ? d.value : 0), 0);
  }, [filteredDeals]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 text-slate-800">
        {/* Panel Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 sticky top-0 z-20">
          <div className="flex items-start justify-between gap-4">
            <div>
              {metricCategory && (
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                  {metricCategory}
                </div>
              )}
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{metricTitle}</span>
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {metricValue}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {deals.length} Opportunities
                </span>
              </div>
              {metricSubtitle && (
                <p className="text-xs text-slate-500 mt-1">
                  {metricSubtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              title="Close panel (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search deals, company, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="value_desc">Highest Capital</option>
              <option value="score_desc">Lead Score</option>
              <option value="recent">Recently Updated</option>
            </select>
          </div>

          {/* Filter Pills */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <button
              type="button"
              onClick={() => setStageFilter('all')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                stageFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All ({deals.length})
            </button>
            {(Object.keys(STAGE_CONFIG) as PipelineStage[]).map(stg => {
              const count = deals.filter(d => d.stage === stg).length;
              if (count === 0) return null;
              return (
                <button
                  key={stg}
                  type="button"
                  onClick={() => setStageFilter(stg)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                    stageFilter === stg
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {STAGE_CONFIG[stg].label.split('/')[0]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Contributing Deals List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredDeals.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Target className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-600">No matching deals found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search criteria or stage filters.
              </p>
            </div>
          ) : (
            filteredDeals.map(deal => {
              const assignee = teamMembers.find(m => m.id === deal.assigneeId);
              const totalScore = (deal.leadScore?.strategicFit || 0) + 
                (deal.leadScore?.fundingCapacity || 0) + 
                (deal.leadScore?.networkLeverage || 0) + 
                (deal.leadScore?.diligenceSpeed || 0);

              const stageMeta = STAGE_CONFIG[deal.stage] || STAGE_CONFIG.lead;

              return (
                <div
                  key={deal.id}
                  onClick={() => {
                    if (onSelectDeal) {
                      onSelectDeal(deal);
                    } else if (setSelectedDeal) {
                      setSelectedDeal(deal);
                      onClose();
                    }
                  }}
                  className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stageMeta.badge}`}>
                          {stageMeta.label}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {deal.space}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-indigo-600 transition-colors">
                        {deal.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {deal.organization || deal.contactPerson || 'Sovereign Counterparty'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-slate-900 font-mono">
                        ${deal.value.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span className="font-semibold text-slate-600">{totalScore} PTS</span>
                      </div>
                    </div>
                  </div>

                  {/* Lead Score Mini Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[130px]">
                        {assignee?.name || 'Unassigned'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{deal.expectedCloseDate || 'Target Open'}</span>
                    </div>

                    <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform text-[11px]">
                      <span>View Deal</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            Filtered Pipeline: <strong className="text-slate-900 font-mono">${totalFilteredValue.toLocaleString()}</strong> ({filteredDeals.length} deals)
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
