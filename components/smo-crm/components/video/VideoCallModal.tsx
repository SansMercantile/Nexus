import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  Users, 
  Download, 
  Maximize2, 
  Minimize2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Share2, 
  Bot,
  Terminal,
  Radio
} from 'lucide-react';
import { TeamMember } from '../../types';
import { useCrm } from '../../context/CrmContext';

export interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle?: string;
  initialMode?: 'video' | 'voice';
  targetAttendeeNames?: string[];
  meetingLink?: string;
}

interface TranscriptItem {
  id: string;
  speaker: string;
  avatar: string;
  time: string;
  text: string;
  isAiNote?: boolean;
}

interface ActionItemGenerated {
  id: string;
  text: string;
  assignee: string;
  completed: boolean;
}

const SAMPLE_TRANSCRIPTS: Omit<TranscriptItem, 'id'>[] = [
  {
    speaker: 'Mezzoforte Privilege',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    time: '00:05',
    text: 'Good morning team. We are convening to finalize our Priv Pay launch checklist and review the Series A term sheet commentary.',
  },
  {
    speaker: 'Christopher Maddison',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    time: '00:18',
    text: 'Understood. Meridian Apex confirmed the 15% valuation cap amendment. We need final sign-off before Friday 5 PM GMT.',
  },
  {
    speaker: 'Mohammed Kabir',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    time: '00:32',
    text: 'On the Azure MQTT infrastructure side: load testing completed with 500,000 telemetry events per minute without packet drop.',
  },
  {
    speaker: 'Pascaline Khoza',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    time: '00:48',
    text: 'Swell PR media distribution is embargoed until 09:00 UTC. Nadia confirmed placement on leading Pan-African tech journals.',
  },
];

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  meetingTitle = 'Sovereign Command Executive Sync',
  initialMode = 'video',
  targetAttendeeNames = ['Christopher Maddison', 'Mohammed Kabir', 'Pascaline Khoza'],
  meetingLink = 'https://meet.sansmercantile.internal/smo-call-live'
}) => {
  const { currentUser, teamMembers, addMeeting } = useCrm();

  const [isVideoOn, setIsVideoOn] = useState(initialMode === 'video');
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAiNoteTakerActive, setIsAiNoteTakerActive] = useState(true);

  // Real-time transcripts
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [activeTab, setActiveTab] = useState<'notes' | 'transcript' | 'chat'>('notes');

  // AI Generated Action Items & Summary
  const [aiSummary, setAiSummary] = useState<string>(
    'Executive sync discussing Priv Pay launch readiness, Azure MQTT telemetry verification, and Series A Meridian Apex term sheet sign-off.'
  );
  const [actionItems, setActionItems] = useState<ActionItemGenerated[]>([
    { id: 'act-1', text: 'Sign Meridian Apex valuation cap clause amendment before Friday', assignee: 'Christopher Maddison', completed: false },
    { id: 'act-2', text: 'Confirm Azure MQTT zero-packet drop benchmark under peak load', assignee: 'Mohammed Kabir', completed: true },
    { id: 'act-3', text: 'Authorize Swell PR embargoed distribution for launch morning', assignee: 'Pascaline Khoza', completed: false },
  ]);
  const [newActionInput, setNewActionInput] = useState('');
  const [inCallChatInput, setInCallChatInput] = useState('');
  const [inCallMessages, setInCallMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Christopher Maddison', text: 'Pushed the revised prospectus to the investor data room.', time: '10:02' },
    { sender: 'Mohammed Kabir', text: 'Cert regen script completed in staging.', time: '10:04' },
  ]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Seed sample transcript on open
  useEffect(() => {
    if (!isOpen) return;
    setTranscripts(
      SAMPLE_TRANSCRIPTS.map((t, idx) => ({
        ...t,
        id: `tr-${idx}`,
      }))
    );
  }, [isOpen]);

  // Live simulation of AI note taker listening
  useEffect(() => {
    if (!isOpen || !isAiNoteTakerActive) return;

    const interval = setInterval(() => {
      const candidates = [
        {
          speaker: 'AI Note Taker',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          time: formatDuration(callDuration),
          text: 'Key decision logged: Confirmed Priv Pay liquidity pool allocation threshold of $250,000.',
          isAiNote: true,
        },
      ];
      if (Math.random() > 0.6) {
        setTranscripts(prev => [
          ...prev,
          {
            ...candidates[0],
            id: `tr-${Date.now()}`,
          },
        ]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isOpen, isAiNoteTakerActive, callDuration]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const copyCallLink = () => {
    navigator.clipboard?.writeText(meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionInput.trim()) return;
    setActionItems(prev => [
      ...prev,
      {
        id: `act-${Date.now()}`,
        text: newActionInput.trim(),
        assignee: currentUser.name,
        completed: false,
      },
    ]);
    setNewActionInput('');
  };

  const toggleActionItem = (id: string) => {
    setActionItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleSendInCallMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inCallChatInput.trim()) return;
    setInCallMessages(prev => [
      ...prev,
      {
        sender: currentUser.name,
        text: inCallChatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInCallChatInput('');
  };

  const exportNotesAsTxt = () => {
    const content = `MEETING TITLE: ${meetingTitle}\nDURATION: ${formatDuration(callDuration)}\nDATE: ${new Date().toLocaleDateString()}\nPARTICIPANTS: ${currentUser.name}, ${targetAttendeeNames.join(', ')}\n\nEXECUTIVE SUMMARY:\n${aiSummary}\n\nACTION ITEMS:\n${actionItems.map(a => `[${a.completed ? 'X' : ' '}] ${a.text} (Assignee: ${a.assignee})`).join('\n')}\n\nTRANSCRIPT LOGS:\n${transcripts.map(t => `[${t.time}] ${t.speaker}: ${t.text}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Meeting_Notes_${meetingTitle.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="smo-video-call-modal" 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl text-white"
      >
        {/* Top bar */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <VideoIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">{meetingTitle}</h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  REC {formatDuration(callDuration)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Encrypted Sovereign Stream · High-Definition WebRTC & Voice Relay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Note Taker Toggle */}
            <button
              type="button"
              onClick={() => setIsAiNoteTakerActive(!isAiNoteTakerActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isAiNoteTakerActive
                  ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200 ring-1 ring-indigo-500/40'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle AI Note Taker listening in background"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>AI Note Taker: {isAiNoteTakerActive ? 'Active' : 'Paused'}</span>
            </button>

            {/* Copy invite link */}
            <button
              type="button"
              onClick={copyCallLink}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
              title="Copy call link to share"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
            </button>

            {/* Close modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main call area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Video / Participants Grid */}
          <div className="flex-1 flex flex-col bg-slate-950 p-4 relative overflow-y-auto">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[300px]">
              {/* Local User Tile */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center group shadow-lg">
                {isVideoOn ? (
                  <div className="w-full h-full relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover filter contrast-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-800 mb-3"
                    />
                    <span className="text-xs font-bold text-slate-200">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Video Paused</span>
                  </div>
                )}

                {/* Bottom label */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-white font-medium border border-slate-700/50">
                    {currentUser.name} (You)
                  </span>
                  {isMuted && (
                    <span className="p-1 bg-rose-600/90 rounded text-white" title="Microphone muted">
                      <MicOff className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Remote Participant 1 */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                  alt="Christopher Maddison"
                  className="w-full h-full object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-white font-medium border border-slate-700/50">
                    Christopher Maddison (CBDO)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active voice stream" />
                </div>
              </div>

              {/* Remote Participant 2 */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80"
                  alt="Mohammed Kabir"
                  className="w-full h-full object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-white font-medium border border-slate-700/50">
                    Mohammed Kabir (Dev / Azure)
                  </span>
                </div>
              </div>

              {/* Remote Participant 3 */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
                  alt="Pascaline Khoza"
                  className="w-full h-full object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-white font-medium border border-slate-700/50">
                    Pascaline Khoza (Swell PR)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom In-Call Controls Bar */}
            <div className="mt-4 h-16 bg-slate-900/90 border border-slate-800 rounded-xl px-6 flex items-center justify-between backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full transition-colors ${
                    !isVideoOn ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Share Screen"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* End Call Button */}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg transition-colors"
                title="Disconnect call"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar: AI Note Taker, Live Transcript & In-call Chat */}
          <div className="w-full md:w-96 border-l border-slate-800 bg-slate-900 flex flex-col">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Notes</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'transcript' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Transcript</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>

            {/* Tab 1: AI Note Taker & Action Items */}
            {activeTab === 'notes' && (
              <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                    <Bot className="w-4 h-4" />
                    <span>Real-time AI Synthesis</span>
                  </div>
                  <button
                    type="button"
                    onClick={exportNotesAsTxt}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
                    title="Export notes as text"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                </div>

                {/* Executive Summary */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Live Executive Summary
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    {aiSummary}
                  </p>
                </div>

                {/* Action Items */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Extracted Action Items ({actionItems.length})</span>
                    <span className="text-[9px] text-indigo-400 font-semibold">Auto-detected</span>
                  </div>

                  <div className="space-y-1.5">
                    {actionItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleActionItem(item.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                          item.completed
                            ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:border-indigo-500/50'
                        }`}
                      >
                        <CheckSquare
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            item.completed ? 'text-emerald-500' : 'text-slate-400'
                          }`}
                        />
                        <div className="flex-1">
                          <div>{item.text}</div>
                          <div className="text-[10px] text-indigo-300 font-semibold mt-0.5">
                            Assignee: {item.assignee}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add action item form */}
                  <form onSubmit={handleAddActionItem} className="pt-2 flex gap-1.5">
                    <input
                      type="text"
                      value={newActionInput}
                      onChange={e => setNewActionInput(e.target.value)}
                      placeholder="Add an action item manually..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 2: Live Transcripts */}
            {activeTab === 'transcript' && (
              <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3 text-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                  Speaker Diarization Log
                </div>

                {transcripts.map(t => (
                  <div
                    key={t.id}
                    className={`p-2.5 rounded-xl border ${
                      t.isAiNote
                        ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <img src={t.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                        {t.speaker}
                      </span>
                      <span className="font-mono text-slate-500">{t.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{t.text}</p>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            )}

            {/* Tab 3: In-call Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-1">
                  {inCallMessages.map((msg, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-indigo-300">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-slate-200">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendInCallMessage} className="pt-3 border-t border-slate-800 flex gap-1.5">
                  <input
                    type="text"
                    value={inCallChatInput}
                    onChange={e => setInCallChatInput(e.target.value)}
                    placeholder="Send a message to attendees..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
