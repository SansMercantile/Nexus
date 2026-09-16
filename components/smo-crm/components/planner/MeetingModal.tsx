import React, { useState } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { WorkspaceSpace } from '../../types';

export const MeetingModal: React.FC = () => {
  const { 
    isMeetingModalOpen, 
    setIsMeetingModalOpen, 
    addMeeting, 
    teamMembers, 
    currentSpace 
  } = useCrm();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM UTC');
  const [space, setSpace] = useState<WorkspaceSpace>('CBDO workspace');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([
    teamMembers[0]?.id || '',
    teamMembers[1]?.id || '',
  ]);
  const [notes, setNotes] = useState('');
  const [actionItemsInput, setActionItemsInput] = useState('');

  if (!isMeetingModalOpen) return null;

  const toggleAttendee = (id: string) => {
    if (selectedAttendees.includes(id)) {
      setSelectedAttendees(selectedAttendees.filter(a => a !== id));
    } else {
      setSelectedAttendees([...selectedAttendees, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const actionItems = actionItemsInput
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    addMeeting({
      title: title.trim(),
      date,
      time,
      durationMinutes: 30,
      space,
      attendees: selectedAttendees,
      locationOrLink: 'Virtual / TBD',
      agendaNotes: notes.trim(),
      keyActionItems: actionItems.length > 0 ? actionItems : ['Review sync deliverables'],
      status: 'upcoming',
    });

    setIsMeetingModalOpen(false);
  };

  return (
    <div 
      id="smo-meeting-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsMeetingModalOpen(false)}
    >
      <div 
        id="smo-meeting-modal"
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Schedule Team Sync or Pitch</h2>
              <p className="text-[11px] text-slate-500">Sans Mercantile Operations Calendar</p>
            </div>
          </div>
          <button
            onClick={() => setIsMeetingModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Sync Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Weekly Sync — Christopher Maddison (CBDO)"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Time & Timezone</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="10:00 AM UTC"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Workspace Space</label>
            <select
              value={space}
              onChange={e => setSpace(e.target.value as WorkspaceSpace)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            >
              <option value="CBDO workspace">CBDO workspace</option>
              <option value="Sovereign Command">Sovereign Command</option>
              <option value="PR & Comms">PR & Comms</option>
              <option value="Mpeti">Mpeti</option>
              <option value="CrazyJam Records">CrazyJam Records</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Attendees</label>
            <div className="grid grid-cols-2 gap-2">
              {teamMembers.map(m => {
                const isSelected = selectedAttendees.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => toggleAttendee(m.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/60 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="truncate font-medium">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Agenda / Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Sync agenda, review items, deliverables..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-20 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Action Items (one per line)</label>
            <textarea
              value={actionItemsInput}
              onChange={e => setActionItemsInput(e.target.value)}
              placeholder="Deliverable 1&#10;Deliverable 2"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-16 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsMeetingModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
