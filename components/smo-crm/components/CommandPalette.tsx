import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Kanban, 
  Users, 
  Inbox, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Plus, 
  Download, 
  ArrowRight,
  Sparkles,
  Command as CommandIcon,
  X
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    deals, 
    contacts, 
    setSelectedDeal, 
    setActiveTab, 
    setIsDealModalOpen, 
    setIsContactModalOpen, 
    setIsMeetingModalOpen,
    exportDealsAsCsv,
    exportDataAsJson
  } = useCrm();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.organization.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.organization.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div 
      id="smo-command-palette-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div 
        id="smo-command-palette"
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative border-b border-slate-200 p-3 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, search deals, or jump to contacts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-8 pr-10 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-96 overflow-y-auto p-2 text-xs space-y-3">
          {/* Quick Navigation */}
          <div>
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  setActiveTab('pipeline');
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-left text-slate-700 font-medium"
              >
                <Kanban className="w-3.5 h-3.5 text-indigo-600" />
                <span>Deals Pipeline</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('contacts');
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-left text-slate-700 font-medium"
              >
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Contacts Directory</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('inbox');
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-left text-slate-700 font-medium"
              >
                <Inbox className="w-3.5 h-3.5 text-indigo-600" />
                <span>ClickUp Inbox</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('planner');
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-left text-slate-700 font-medium"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Planner & Syncs</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('docs');
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-left text-slate-700 font-medium"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Docs & Rubrics</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-left text-slate-700 font-medium"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Executive Analytics</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsDealModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Create New Deal or Grant Opportunity</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add New Contact / Investor</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsMeetingModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 hover:text-amber-900 text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Schedule Team Sync or Diligence Pitch</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  exportDealsAsCsv();
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Deals to CSV</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Deals results if querying */}
          {filteredDeals.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Deals ({filteredDeals.length})
              </div>
              <div className="space-y-0.5">
                {filteredDeals.map(deal => (
                  <button
                    key={deal.id}
                    onClick={() => {
                      setSelectedDeal(deal);
                      setActiveTab('pipeline');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{deal.title}</div>
                      <div className="text-[10px] text-slate-400">{deal.organization} · ${deal.value.toLocaleString()}</div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {deal.stage}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contacts results if querying */}
          {filteredContacts.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Contacts ({filteredContacts.length})
              </div>
              <div className="space-y-0.5">
                {filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setActiveTab('contacts');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{contact.name}</div>
                      <div className="text-[10px] text-slate-400">{contact.title} at {contact.organization}</div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {contact.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">ESC</kbd>
            <span>to close</span>
          </div>
          <span className="font-medium text-indigo-600">SMO Sovereign Command</span>
        </div>
      </div>
    </div>
  );
};
