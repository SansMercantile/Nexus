import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Video, 
  FileText, 
  ChevronRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { MeetingSync } from '../../types';

export const PlannerView: React.FC = () => {
  const { 
    meetings, 
    teamMembers, 
    currentSpace, 
    setIsMeetingModalOpen,
    deals,
    startVideoCall 
  } = useCrm();

  const [selectedMeeting, setSelectedMeeting] = useState<MeetingSync | null>(meetings[0] || null);

  const filteredMeetings = meetings.filter(m => {
    return currentSpace === 'All Spaces' || m.space === currentSpace;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/40 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Syncs, Meetings & Launch Milestones</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {filteredMeetings.length} Scheduled
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Weekly syncs with CBDO Christopher Maddison, Azure lead Mohammed Kabir, and team deliverables.
            </p>
          </div>

          <button
            id="smo-schedule-sync-btn"
            onClick={() => setIsMeetingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Sync</span>
          </button>
        </div>

        {/* Milestone Banner */}
        <div className="mt-4 p-3 bg-linear-to-r from-indigo-900 to-slate-900 rounded-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-2">
                <span>FLAGSHIP MILESTONE: Priv Pay Launch</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                  Sep 4, 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Target commercial rail activation with verified MQTT Azure broker & Swell PR launch.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 self-stretch sm:self-auto text-center">
            Status: <span className="text-emerald-400 font-bold">On Schedule</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left column: meetings list */}
        <div className="w-full md:w-5/12 border-r border-slate-200 overflow-y-auto bg-white p-4 space-y-3">
          <div className="text-[11px] font-bold uppercase text-slate-400 px-1">
            Upcoming Team Syncs & Milestones
          </div>

          {filteredMeetings.map(meeting => {
            const isSelected = selectedMeeting?.id === meeting.id;

            return (
              <div
                key={meeting.id}
                id={`smo-meeting-item-${meeting.id}`}
                onClick={() => setSelectedMeeting(meeting)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/80 bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {meeting.space}
                  </span>
                  <span className="text-[11px] font-mono text-indigo-700 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    {meeting.date} · {meeting.time}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 mt-2">
                  {meeting.title}
                </h3>

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {meeting.attendees.map(id => {
                      const member = teamMembers.find(m => m.id === id);
                      if (!member) return null;
                      return (
                        <img
                          key={id}
                          src={member.avatar}
                          alt={member.name}
                          title={member.name}
                          className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {meeting.keyActionItems.length} action items
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Meeting Detail / Agenda */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-50/50 overflow-y-auto p-6">
          {selectedMeeting ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-xs">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded border border-indigo-100">
                      {selectedMeeting.space}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {selectedMeeting.date} at {selectedMeeting.time}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedMeeting.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const names = selectedMeeting.attendees
                        .map(id => teamMembers.find(m => m.id === id)?.name)
                        .filter(Boolean) as string[];
                      startVideoCall(selectedMeeting.title, 'video', names);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    title="Launch Zoom / Skype video call with live AI Note Taker"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Video Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const names = selectedMeeting.attendees
                        .map(id => teamMembers.find(m => m.id === id)?.name)
                        .filter(Boolean) as string[];
                      startVideoCall(selectedMeeting.title, 'voice', names);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                    title="Join voice only stream"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Voice</span>
                  </button>
                </div>
              </div>

              {/* Attendees */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Command Attendees</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.attendees.map(id => {
                    const member = teamMembers.find(m => m.id === id);
                    if (!member) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                      >
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-800 leading-tight">{member.name}</div>
                          <div className="text-[10px] text-slate-400 leading-tight">{member.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Meeting Notes */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sync Agenda & Directives</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                  {selectedMeeting.agendaNotes}
                </div>
              </div>

              {/* Action items */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Action Items & Deliverables ({selectedMeeting.keyActionItems.length})</span>
                </div>
                <div className="space-y-2">
                  {selectedMeeting.keyActionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select a sync meeting from the list
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
