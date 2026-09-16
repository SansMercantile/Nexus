import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Pin, 
  Trash2, 
  Edit3, 
  Clock, 
  Tag, 
  Send, 
  Sparkles, 
  User, 
  Check, 
  X, 
  MessageSquare,
  AlertCircle,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';
import { ExecutiveSummaryNote, Department } from '../../types';
import { useCrm } from '../../context/CrmContext';

const STORAGE_KEY = 'SMO_EXECUTIVE_ANALYTICS_NOTES_V1';

const INITIAL_NOTES: ExecutiveSummaryNote[] = [
  {
    id: 'note-exec-1',
    authorId: 'user-mezzoforte',
    authorName: 'Mezzoforte Privilege',
    authorRole: 'Managing Principal & Sovereign Head',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'executive',
    content: 'Portfolio capital movement velocity exceeded our trailing 3-period rolling average by +76.8% ($1.68M vs $950k baseline). The primary catalysts remain the Palladium Science Award ($350k) progression and Meridian Apex ($1.2M) proposal review. Maintain strict diligence pacing.',
    periodLabel: 'Sprint W37 • Sep 2026',
    category: 'velocity',
    isPinned: true,
    createdAt: '2026-09-15T09:30:00Z',
  },
  {
    id: 'note-exec-2',
    authorId: 'user-christopher',
    authorName: 'Christopher Maddison',
    authorRole: 'Chief Business Development Officer',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'cbdo',
    content: 'CBDO workspace closing ratio is currently 42% with average deal size tracking at $385k. We are seeing fast transit through Pitch stage (down to 4.2 days). Expecting two binding term sheets by early Q4.',
    periodLabel: 'Sprint W37 • Sep 2026',
    category: 'capital',
    isPinned: true,
    createdAt: '2026-09-14T16:15:00Z',
  },
  {
    id: 'note-exec-3',
    authorId: 'user-kabir',
    authorName: 'Mohammed Kabir',
    authorRole: 'Engineering Lead & Cloud Architect',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'dev',
    content: 'PRIV Rail infrastructure SLA has held steady at 99.98% uptime. Talent ingestion velocity surged +24% due to high applicant volume for the Azure PRIV Rail Cloud Architect position. AI evaluation batteries are actively triaging.',
    periodLabel: 'Sprint W36 • Sep 2026',
    category: 'risk',
    isPinned: false,
    createdAt: '2026-09-12T11:45:00Z',
  },
];

export const ExecutiveSummaryNotes: React.FC = () => {
  const { currentUser, teamMembers } = useCrm();

  // Persistent notes state
  const [notes, setNotes] = useState<ExecutiveSummaryNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to persist executive notes', e);
    }
  }, [notes]);

  // Form state for new note
  const [isComposing, setIsComposing] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ExecutiveSummaryNote['category']>('velocity');
  const [newPeriod, setNewPeriod] = useState('Sprint W37 • Sep 2026');
  const [newIsPinned, setNewIsPinned] = useState(false);

  // Edit note state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Filter state
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newNote: ExecutiveSummaryNote = {
      id: `note-exec-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      department: currentUser.department,
      content: newContent.trim(),
      periodLabel: newPeriod.trim() || 'Sprint W37 • Sep 2026',
      category: newCategory,
      isPinned: newIsPinned,
      createdAt: new Date().toISOString(),
    };

    setNotes(prev => [newNote, ...prev]);
    setNewContent('');
    setIsComposing(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleStartEdit = (note: ExecutiveSummaryNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) return;
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, content: editContent.trim(), updatedAt: new Date().toISOString() }
          : n
      )
    );
    setEditingNoteId(null);
  };

  const filteredNotes = notes.filter(n => {
    if (filterCategory !== 'all' && n.category !== filterCategory) return false;
    return true;
  });

  // Pinned notes first, then chronological
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getCategoryBadge = (category: ExecutiveSummaryNote['category']) => {
    switch (category) {
      case 'velocity':
        return { label: 'Deal Velocity', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'capital':
        return { label: 'Capital Allocation', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'risk':
        return { label: 'Risk & Diligence', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'forecast':
        return { label: 'Forecast & Horizon', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Governance', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div 
      id="smo-executive-summary-notes"
      className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-slate-800 text-white shadow-2xs">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Executive Summary Notes & Annotations
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-200 text-slate-700">
                {notes.length} Active Observations
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Managerial qualitative annotations and context that persist alongside portfolio KPI metrics.
            </p>
          </div>
        </div>

        {/* Action & Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            aria-label="Filter observations by category"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="velocity">Deal Velocity</option>
            <option value="capital">Capital Allocation</option>
            <option value="risk">Risk & Diligence</option>
            <option value="forecast">Forecast & Horizon</option>
          </select>

          <button
            type="button"
            onClick={() => setIsComposing(!isComposing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs transition-colors cursor-pointer"
          >
            {isComposing ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isComposing ? 'Cancel' : 'Add Note'}</span>
          </button>
        </div>
      </div>

      {/* New Note Composer */}
      {isComposing && (
        <form onSubmit={handleCreateNote} className="p-4 bg-indigo-50/40 border-b border-indigo-100 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-900">
            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Annotate KPI Performance as {currentUser.name} ({currentUser.role})</span>
          </div>

          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Record managerial observation on current velocity spikes, diligence pacing, capital allocation, or risks..."
            className="w-full text-xs p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[90px]"
            required
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mr-1.5">Category:</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as ExecutiveSummaryNote['category'])}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800"
                >
                  <option value="velocity">Deal Velocity</option>
                  <option value="capital">Capital Allocation</option>
                  <option value="risk">Risk & Diligence</option>
                  <option value="forecast">Forecast & Horizon</option>
                  <option value="governance">Governance</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mr-1.5">Sprint / Cycle:</label>
                <input
                  type="text"
                  value={newPeriod}
                  onChange={e => setNewPeriod(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 w-36"
                  placeholder="Sprint W37 • Sep 2026"
                />
              </div>

              <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer ml-1">
                <input
                  type="checkbox"
                  checked={newIsPinned}
                  onChange={e => setNewIsPinned(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Pin to Top</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="px-3 py-1 rounded text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
        {sortedNotes.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">No executive observations found for this filter.</p>
          </div>
        ) : (
          sortedNotes.map(note => {
            const badge = getCategoryBadge(note.category);
            const isEditing = editingNoteId === note.id;

            return (
              <div 
                key={note.id}
                className={`p-4 transition-colors ${
                  note.isPinned ? 'bg-amber-50/20' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={note.authorAvatar}
                      alt={note.authorName}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0 mt-0.5"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-900">{note.authorName}</span>
                        <span className="text-[10px] text-slate-500 font-medium">({note.authorRole})</span>

                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400">
                          {note.periodLabel}
                        </span>

                        {note.isPinned && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            <Pin className="w-2.5 h-2.5 fill-amber-800" />
                            Pinned
                          </span>
                        )}
                      </div>

                      {/* Content or Edit Field */}
                      {isEditing ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            rows={3}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(note.id)}
                              className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="px-2 py-0.5 rounded text-[11px] text-slate-500 hover:text-slate-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {note.content}
                        </p>
                      )}

                      <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                        Logged {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {note.updatedAt && ' (edited)'}
                      </div>
                    </div>
                  </div>

                  {/* Note Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(note.id)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        note.isPinned ? 'text-amber-600 bg-amber-100/60' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(note)}
                        className="p-1.5 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Edit note"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
