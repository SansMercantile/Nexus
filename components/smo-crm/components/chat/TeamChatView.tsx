import React, { useState, useRef, useEffect } from 'react';
import { 
  Hash, 
  Send, 
  Smile, 
  AtSign, 
  Paperclip, 
  Pin, 
  Users, 
  Terminal, 
  Radio, 
  TrendingUp, 
  UserCheck, 
  Megaphone,
  Search,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { ChatChannel, ChatMention, TeamMember, Department } from '../../types';
import { DEPARTMENTS } from '../../data/departmentsData';

const COMMON_EMOJIS = ['👍', '🚀', '❤️', '💡', '🔥', '👏', '✅', '⚡', '🎉', '💻', '📢', '🎯', '🤝', '📊', '🔍'];

export const TeamChatView: React.FC = () => {
  const { 
    chatChannels, 
    chatMessages, 
    activeChannelId, 
    setActiveChannelId, 
    sendChatMessage, 
    toggleMessageReaction,
    currentUser,
    teamMembers,
    setSelectedCandidate,
    candidateApplications,
    setSelectedDeal,
    deals
  } = useCrm();

  const [inputContent, setInputContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [mentionPosition, setMentionPosition] = useState<number | null>(null);
  const [chatSearch, setChatSearch] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeChannel = chatChannels.find(c => c.id === activeChannelId) || chatChannels[0];

  const channelMessages = chatMessages.filter(m => {
    if (m.channelId !== activeChannelId) return false;
    if (!chatSearch.trim()) return true;
    return (
      m.content.toLowerCase().includes(chatSearch.toLowerCase()) ||
      m.senderName.toLowerCase().includes(chatSearch.toLowerCase())
    );
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages.length, activeChannelId]);

  // Handle @mention detection when typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setInputContent(value);

    // Check if cursor is immediately after an '@'
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1 && (lastAtIndex === 0 || textBeforeCursor[lastAtIndex - 1] === ' ')) {
      const query = textBeforeCursor.slice(lastAtIndex + 1);
      if (!query.includes(' ')) {
        setShowMentionMenu(true);
        setMentionFilter(query.toLowerCase());
        setMentionPosition(lastAtIndex);
        return;
      }
    }
    setShowMentionMenu(false);
  };

  const insertMention = (member: TeamMember) => {
    if (mentionPosition === null) return;
    const before = inputContent.slice(0, mentionPosition);
    const after = inputContent.slice(inputRef.current?.selectionStart || mentionPosition + 1);
    const newText = `${before}@${member.name} ${after}`;
    setInputContent(newText);
    setShowMentionMenu(false);
    inputRef.current?.focus();
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) return;

    // Detect mentions in the submitted text
    const mentions: ChatMention[] = [];
    teamMembers.forEach(member => {
      if (inputContent.includes(`@${member.name}`)) {
        mentions.push({
          id: member.id,
          name: member.name,
          department: member.department,
        });
      }
    });

    sendChatMessage({
      channelId: activeChannelId,
      content: inputContent,
      mentions,
    });

    setInputContent('');
    setShowEmojiPicker(false);
    setShowMentionMenu(false);
  };

  const getChannelIcon = (name: string, isDm?: boolean) => {
    if (isDm) return Users;
    if (name.includes('announcements')) return Megaphone;
    if (name.includes('dev')) return Terminal;
    if (name.includes('pr') || name.includes('comms')) return Radio;
    if (name.includes('cbdo') || name.includes('deals')) return TrendingUp;
    if (name.includes('hr') || name.includes('talent')) return UserCheck;
    return Hash;
  };

  const renderFormattedContent = (content: string) => {
    // Regex replace @Name with highlighted badge
    const mentionRegex = /@([A-Za-z\s]+?)(?=\s|$|[.,!?])/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const mentionedName = match[1].trim();
      const matchedMember = teamMembers.find(m => m.name.toLowerCase() === mentionedName.toLowerCase());
      
      parts.push(
        <span
          key={match.index}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-100/80 text-indigo-900 font-semibold text-[11px] border border-indigo-200 mx-0.5"
        >
          <AtSign className="w-2.5 h-2.5 text-indigo-600" />
          {mentionedName}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  const companyChannels = chatChannels.filter(c => !c.isDirectMessage);
  const directMessages = chatChannels.filter(c => c.isDirectMessage);

  return (
    <div id="smo-team-chat-view" className="flex-1 flex overflow-hidden bg-slate-50 select-none">
      {/* Sidebar: Channels & DMs */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              Inter-Department Hub
            </h2>
            <div className="text-[10px] text-slate-500">Real-time team dispatch</div>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Live
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Company Department Channels */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Department Channels</span>
              <span className="text-[9px] font-medium text-slate-400">{companyChannels.length}</span>
            </div>
            {companyChannels.map(channel => {
              const Icon = getChannelIcon(channel.name);
              const isActive = channel.id === activeChannelId;
              const deptInfo = channel.departmentScope !== 'all' ? DEPARTMENTS[channel.departmentScope] : null;

              return (
                <button
                  key={channel.id}
                  id={`chat-channel-${channel.id}`}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-100'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {deptInfo && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-bold uppercase shrink-0 bg-slate-100 text-slate-500">
                      {channel.departmentScope}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Direct Messages */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Direct Messages</span>
              <span className="text-[9px] font-medium text-slate-400">{directMessages.length}</span>
            </div>
            {directMessages.map(dm => {
              const isActive = dm.id === activeChannelId;
              const member = teamMembers.find(m => m.id === dm.dmRecipientId);

              return (
                <button
                  key={dm.id}
                  id={`chat-dm-${dm.id}`}
                  onClick={() => setActiveChannelId(dm.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-100'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="relative shrink-0">
                      <img
                        src={member?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'}
                        alt={dm.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                    </div>
                    <span className="truncate">{dm.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current User Clearance Footer */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
            />
            <div className="truncate">
              <div className="font-bold text-slate-800 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{currentUser.department}</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Connected to SMO WebSockets" />
        </div>
      </aside>

      {/* Main Chat Stream */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Channel Header */}
        <div className="h-12 border-b border-slate-200 px-4 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              #
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>{activeChannel.name}</span>
                {activeChannel.departmentScope !== 'all' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Dept: {activeChannel.departmentScope}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-lg">
                {activeChannel.description}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                value={chatSearch}
                onChange={e => setChatSearch(e.target.value)}
                className="pl-7 pr-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channelMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <MessageSquare className="w-8 h-8 mb-2 stroke-1 text-slate-300" />
              <div className="text-xs font-medium text-slate-600">No messages yet in #{activeChannel.name}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Begin the inter-department conversation below. Use @mentions to tag teammates.
              </div>
            </div>
          ) : (
            channelMessages.map(msg => {
              const isOwnMessage = msg.senderId === currentUser.id;
              const senderDept = DEPARTMENTS[msg.senderDepartment];

              return (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className="group flex items-start gap-3 text-xs hover:bg-slate-50/70 p-2 rounded-xl transition-colors"
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 mt-0.5"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">{msg.senderName}</span>
                      
                      {senderDept && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                          {msg.senderDepartment}
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {msg.isPinned && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-600 bg-amber-50 px-1 py-0.2 rounded font-semibold">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>

                    <div className="text-slate-800 text-xs leading-relaxed font-normal whitespace-pre-wrap">
                      {renderFormattedContent(msg.content)}
                    </div>

                    {/* Attachment preview if present */}
                    {msg.attachment && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/90 max-w-sm flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                            {msg.attachment.type === 'candidate' ? <UserCheck className="w-3.5 h-3.5" /> : <Paperclip className="w-3.5 h-3.5" />}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-slate-800 text-[11px] truncate">
                              {msg.attachment.name}
                            </div>
                            <div className="text-[10px] text-slate-400 capitalize">
                              Linked {msg.attachment.type}
                            </div>
                          </div>
                        </div>

                        {msg.attachment.type === 'candidate' && msg.attachment.referenceId && (
                          <button
                            onClick={() => {
                              const cand = candidateApplications.find(c => c.id === msg.attachment?.referenceId);
                              if (cand) setSelectedCandidate(cand);
                            }}
                            className="p-1 rounded text-indigo-600 hover:bg-indigo-50 font-medium text-[10px] flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Reactions Bar */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {msg.reactions.map((reaction, i) => {
                        const hasReacted = reaction.users.includes(currentUser.id);
                        return (
                          <button
                            key={i}
                            onClick={() => toggleMessageReaction(msg.id, reaction.emoji)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors border ${
                              hasReacted
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-[10px]">{reaction.count}</span>
                          </button>
                        );
                      })}

                      {/* Quick Emoji Reaction adder */}
                      <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleMessageReaction(msg.id, '👍')}
                          className="px-1.5 py-0.5 rounded text-[11px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                          title="React with thumbs up"
                        >
                          +👍
                        </button>
                        <button
                          onClick={() => toggleMessageReaction(msg.id, '🚀')}
                          className="px-1.5 py-0.5 rounded text-[11px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                          title="React with rocket"
                        >
                          +🚀
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer & Mentions / Emoji Popovers */}
        <div className="p-3 border-t border-slate-200 bg-white relative">
          {/* @Mentions Auto-complete Dropdown */}
          {showMentionMenu && (
            <div 
              id="smo-chat-mention-menu"
              className="absolute bottom-16 left-4 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Mention Team Member
              </div>
              {teamMembers
                .filter(m => m.name.toLowerCase().includes(mentionFilter))
                .map(member => (
                  <button
                    key={member.id}
                    onClick={() => insertMention(member)}
                    className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-5 h-5 rounded-full object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">{member.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{member.department}</div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}

          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <div 
              id="smo-chat-emoji-picker"
              className="absolute bottom-16 right-4 bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100 w-64"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Reactions
              </div>
              <div className="grid grid-cols-5 gap-1 text-base">
                {COMMON_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInputContent(prev => prev + emoji);
                      setShowEmojiPicker(false);
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <input
                ref={inputRef}
                id="smo-chat-composer-input"
                type="text"
                placeholder={`Message #${activeChannel.name}... (type @ to mention)`}
                value={inputContent}
                onChange={handleInputChange}
                className="w-full pl-3 pr-20 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />

              {/* Action buttons inside input */}
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowMentionMenu(!showMentionMenu);
                    setMentionFilter('');
                    setMentionPosition(inputContent.length);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60"
                  title="Tag team member (@)"
                >
                  <AtSign className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 rounded text-slate-400 hover:text-amber-500 hover:bg-slate-200/60"
                  title="Add emoji"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold shadow-xs transition-colors shrink-0"
              title="Send dispatch"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
