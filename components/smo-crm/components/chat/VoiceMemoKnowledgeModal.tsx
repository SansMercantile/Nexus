import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Radio, 
  Tag, 
  Sparkles, 
  Play, 
  Pause, 
  Calendar, 
  ExternalLink, 
  CheckSquare, 
  Square,
  FileText,
  Volume2,
  SlidersHorizontal,
  Layers,
  MessageSquare
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { ChatMessage, Department } from '../../types';
import { VoiceMemoPlayerCard } from './VoiceMemoPlayerCard';

interface VoiceMemoKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMessage?: (channelId: string, messageId: string) => void;
}

export const VoiceMemoKnowledgeModal: React.FC<VoiceMemoKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMessage,
}) => {
  const { chatMessages, chatChannels, setActiveChannelId } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Extract all chat messages that have voice memos
  const voiceMemoMessages = useMemo(() => {
    return chatMessages.filter(m => !!m.voiceMemo);
  }, [chatMessages]);

  // Aggregate all unique topics across all voice memos
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    voiceMemoMessages.forEach(m => {
      if (m.voiceMemo?.keyTopics) {
        m.voiceMemo.keyTopics.forEach(t => set.add(t.replace(/^#/, '')));
      }
    });
    return Array.from(set);
  }, [voiceMemoMessages]);

  // Filtered voice memos
  const filteredMemos = useMemo(() => {
    return voiceMemoMessages.filter(msg => {
      const memo = msg.voiceMemo!;
      
      // Department filter
      if (selectedDepartment !== 'all' && memo.department !== selectedDepartment && msg.senderDepartment !== selectedDepartment) {
        return false;
      }

      // Topic filter
      if (selectedTopic) {
        const matchesTopic = memo.keyTopics?.some(t => t.toLowerCase() === selectedTopic.toLowerCase());
        if (!matchesTopic) return false;
      }

      // Text search query across transcript, summary, topics, speaker, and action items
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTranscript = memo.transcript.toLowerCase().includes(q);
        const matchesSummary = memo.indexedSummary?.toLowerCase().includes(q);
        const matchesSpeaker = memo.speakerName.toLowerCase().includes(q);
        const matchesTopics = memo.keyTopics?.some(t => t.toLowerCase().includes(q));
        const matchesActions = memo.actionItems?.some(a => a.toLowerCase().includes(q));

        if (!matchesTranscript && !matchesSummary && !matchesSpeaker && !matchesTopics && !matchesActions) {
          return false;
        }
      }

      return true;
    });
  }, [voiceMemoMessages, selectedDepartment, selectedTopic, searchQuery]);

  if (!isOpen) return null;

  const handleJumpToChat = (channelId: string, messageId: string) => {
    setActiveChannelId(channelId);
    onNavigateToMessage?.(channelId, messageId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-2xs">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Voice Memo & Audio Knowledge Management Archive
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                  {filteredMemos.length} Indexed Memos
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Searchable repository of recorded voice memos, transcribed conversations, topic tags, and action items across sovereign departments.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcripts, AI summaries, speakers, topics, or action items..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-400">Department:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Departments</option>
                <option value="cbdo">CBDO / Deal Flow</option>
                <option value="dev">Software & Infra</option>
                <option value="communications">Swell PR & Media</option>
                <option value="hr">Talent & People Ops</option>
              </select>
            </div>
          </div>

          {/* Topic Hashtags Pills */}
          {allTopics.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" /> Topics:
              </span>
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                  selectedTopic === null
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Topics
              </button>
              {allTopics.map(topic => {
                const isSelected = selectedTopic?.toLowerCase() === topic.toLowerCase();
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(isSelected ? null : topic)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
                    }`}
                  >
                    #{topic}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Memos List Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40">
          {filteredMemos.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <Radio className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <div className="text-sm font-bold text-slate-700">No matching voice memos found</div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Try adjusting your search query or filter tags, or record a new voice memo in TeamChat.
              </p>
            </div>
          ) : (
            filteredMemos.map(msg => {
              const memo = msg.voiceMemo!;
              const channel = chatChannels.find(c => c.id === msg.channelId);

              return (
                <div
                  key={msg.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
                >
                  {/* Channel & Timestamp Top Line */}
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        #{channel?.name || 'chat'}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-slate-600 font-semibold">
                        {memo.speakerName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase bg-slate-100 text-slate-600">
                        {memo.department || msg.senderDepartment}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleJumpToChat(msg.channelId, msg.id)}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Jump to Thread</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Voice Memo Player Card */}
                  <VoiceMemoPlayerCard
                    voiceMemo={memo}
                    searchTerm={searchQuery}
                    onTopicClick={(t) => setSelectedTopic(t.replace(/^#/, ''))}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Indexed using AWS Bedrock Knowledge Intelligence</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
