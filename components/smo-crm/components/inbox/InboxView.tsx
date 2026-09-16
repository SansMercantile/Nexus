import React, { useState, useMemo } from 'react';
import { 
  Inbox as InboxIcon, 
  Clock, 
  CheckCircle2, 
  Archive, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Check, 
  Send, 
  Tag, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { InboxCategory, InboxItem } from '../../types';

export const InboxView: React.FC = () => {
  const { 
    inboxItems, 
    markInboxCategory, 
    markInboxRead, 
    convertInboxToDeal, 
    currentSpace, 
    searchQuery,
    setSelectedDeal,
    deals,
    setActiveTab
  } = useCrm();

  const [activeCategory, setActiveCategory] = useState<InboxCategory>('primary');
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [repliedNotice, setRepliedNotice] = useState<string | null>(null);

  const categoryCounts = useMemo(() => {
    return {
      primary: inboxItems.filter(i => i.category === 'primary').length,
      other: inboxItems.filter(i => i.category === 'other').length,
      later: inboxItems.filter(i => i.category === 'later').length,
      cleared: inboxItems.filter(i => i.category === 'cleared').length,
    };
  }, [inboxItems]);

  const filteredItems = useMemo(() => {
    return inboxItems.filter(item => {
      const matchesCategory = item.category === activeCategory;
      const matchesSpace = currentSpace === 'All Spaces' || item.relatedSpace === currentSpace;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.senderName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSpace && matchesSearch;
    });
  }, [inboxItems, activeCategory, currentSpace, searchQuery]);

  const handleSelect = (item: InboxItem) => {
    setSelectedItem(item);
    if (item.unread) {
      markInboxRead(item.id, false);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedItem) return;
    setRepliedNotice(`Reply sent to ${selectedItem.senderName}: "${replyText.trim()}"`);
    setReplyText('');
    setTimeout(() => setRepliedNotice(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/40 overflow-hidden">
      {/* Inbox Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sovereign Command Inbox</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Synchronized with ClickUp
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Unified notifications, deal leads, meeting sync notes, and executive task dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                filteredItems.forEach(item => markInboxCategory(item.id, 'cleared'));
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            >
              Clear All in View
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-6 mt-4 pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => {
              setActiveCategory('primary');
              setSelectedItem(null);
            }}
            className={`pb-2 font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeCategory === 'primary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <InboxIcon className="w-3.5 h-3.5" />
            <span>Primary</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
              {categoryCounts.primary}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('other');
              setSelectedItem(null);
            }}
            className={`pb-2 font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeCategory === 'other'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Other</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
              {categoryCounts.other}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('later');
              setSelectedItem(null);
            }}
            className={`pb-2 font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeCategory === 'later'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Later / Snoozed</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
              {categoryCounts.later}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('cleared');
              setSelectedItem(null);
            }}
            className={`pb-2 font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeCategory === 'cleared'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cleared</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
              {categoryCounts.cleared}
            </span>
          </button>
        </div>
      </div>

      {/* Main Inbox Two-Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Item List */}
        <div className="w-full md:w-1/2 border-r border-slate-200 overflow-y-auto bg-white">
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mb-2" />
              <div className="font-semibold text-slate-700">All caught up!</div>
              <p className="text-[11px] text-slate-400 mt-1">
                No items in the {activeCategory} category right now.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                const associatedDeal = deals.find(d => d.id === item.associatedDealId);

                return (
                  <div
                    key={item.id}
                    id={`smo-inbox-item-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className={`p-4 transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600'
                        : item.unread
                        ? 'bg-white font-bold border-l-4 border-l-amber-500 hover:bg-slate-50'
                        : 'bg-white hover:bg-slate-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-slate-800 truncate">
                          {item.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ({item.senderRole || item.relatedSpace})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.date}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1.5 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {item.snippet}
                    </p>

                    {/* Footer tags and quick action buttons */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                          {item.relatedSpace}
                        </span>
                        {associatedDeal && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px] border border-indigo-100">
                            Linked Deal
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                        {item.category !== 'cleared' && (
                          <button
                            onClick={() => markInboxCategory(item.id, 'cleared')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-emerald-700"
                            title="Mark Cleared"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {item.category === 'primary' && (
                          <button
                            onClick={() => markInboxCategory(item.id, 'later')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-indigo-600"
                            title="Snooze to Later"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Pane: Detailed View */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-50/50 overflow-y-auto p-6">
          {selectedItem ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {selectedItem.relatedSpace}
                    </span>
                    <span className="text-[11px] text-slate-400">{selectedItem.date}, 2026</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {selectedItem.title}
                  </h2>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    From: <span className="text-slate-800 font-semibold">{selectedItem.senderName}</span> ({selectedItem.senderRole})
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {selectedItem.category !== 'cleared' && (
                    <button
                      onClick={() => markInboxCategory(selectedItem.id, 'cleared')}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                  {selectedItem.category !== 'later' && (
                    <button
                      onClick={() => markInboxCategory(selectedItem.id, 'later')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Snooze</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Body snippet / content */}
              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 font-sans">
                {selectedItem.snippet}
              </div>

              {/* Action Banner: Convert to CRM Deal */}
              <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>CRM Pipeline Automation</span>
                  </div>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    Convert this notification directly into an active Sovereign Pipeline deal.
                  </p>
                </div>

                <button
                  onClick={() => convertInboxToDeal(selectedItem.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Convert to Deal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Associated deal quick jump if exists */}
              {selectedItem.associatedDealId && (
                (() => {
                  const deal = deals.find(d => d.id === selectedItem.associatedDealId);
                  if (!deal) return null;
                  return (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Linked CRM Opportunity</span>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">{deal.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">${deal.value.toLocaleString()} USD · {deal.stage.toUpperCase()}</div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDeal(deal);
                          setActiveTab('pipeline');
                        }}
                        className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Open Deal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })()
              )}

              {/* Reply stream simulation */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Executive Reply / Team Dispatch</span>
                </div>

                {repliedNotice && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium">
                    {repliedNotice}
                  </div>
                )}

                <form onSubmit={handleSendReply} className="space-y-2">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedItem.senderName}...`}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none h-20"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Dispatch</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center">
              <InboxIcon className="w-10 h-10 text-slate-300 mb-2 stroke-1" />
              <div className="font-semibold text-slate-700">Select an item from the inbox</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Inspect updates, convert to deals, or dispatch team instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
