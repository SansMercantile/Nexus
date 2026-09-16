import React from 'react';
import { 
  Kanban, 
  Users, 
  Inbox, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Layers,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Lock,
  Building,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useCrm, CrmTab } from '../context/CrmContext';
import { WorkspaceSpace } from '../types';
import { DEPARTMENTS } from '../data/departmentsData';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    deals, 
    contacts, 
    inboxItems, 
    meetings, 
    currentSpace, 
    setCurrentSpace,
    teamMembers,
    currentUser,
    switchUser,
    candidateApplications,
    canAccessTab
  } = useCrm();

  const unreadInboxCount = inboxItems.filter(i => i.unread && i.category === 'primary').length;
  const currentDept = DEPARTMENTS[currentUser.department];

  const navItems: {
    id: CrmTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    countHighlight?: boolean;
    isAi?: boolean;
  }[] = [
    {
      id: 'pipeline',
      label: 'Deals & Pipeline',
      icon: Kanban,
      count: deals.length,
    },
    {
      id: 'chat',
      label: 'Inter-Dept Chat',
      icon: MessageSquare,
      countHighlight: true,
      count: 3, // active team conversations
    },
    {
      id: 'careers',
      label: 'Careers & AI Vetting',
      icon: UserCheck,
      count: candidateApplications.length,
      isAi: true,
    },
    {
      id: 'contacts',
      label: 'Contacts & Investors',
      icon: Users,
      count: contacts.length,
    },
    {
      id: 'inbox',
      label: 'Inbox & Activity',
      icon: Inbox,
      count: unreadInboxCount > 0 ? unreadInboxCount : undefined,
      countHighlight: unreadInboxCount > 0,
    },
    {
      id: 'planner',
      label: 'Planner & Syncs',
      icon: Calendar,
      count: meetings.filter(m => m.status === 'upcoming').length,
    },
    {
      id: 'docs',
      label: 'Docs & Rubrics',
      icon: BookOpen,
    },
    {
      id: 'analytics',
      label: 'Executive Analytics',
      icon: BarChart3,
    },
  ];

  const spaces: { name: WorkspaceSpace; color: string }[] = [
    { name: 'All Spaces', color: 'bg-slate-400' },
    { name: 'Sovereign Command', color: 'bg-indigo-500' },
    { name: 'CBDO workspace', color: 'bg-purple-500' },
    { name: 'PR & Comms', color: 'bg-pink-500' },
    { name: 'Mpeti', color: 'bg-emerald-500' },
    { name: 'CrazyJam Records', color: 'bg-amber-500' },
  ];

  return (
    <aside 
      id="smo-sidebar"
      className="w-64 border-r border-slate-200 bg-slate-50/80 flex flex-col justify-between h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto select-none"
    >
      <div className="p-3 space-y-5">
        {/* Active Department Persona Badge Card */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Active Persona</span>
            {currentUser.isAdmin && (
              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                Sovereign Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="truncate min-w-0">
              <div className="font-bold text-slate-900 text-xs truncate leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                <span>{currentDept.name}</span>
                {currentUser.isContractor && (
                  <span className="text-[9px] text-pink-700 bg-pink-50 px-1 rounded font-semibold">
                    ({currentUser.contractedEntity})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Core */}
        <div className="space-y-1">
          <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>CRM Modules</span>
            {!currentUser.isAdmin && (
              <span className="text-[9px] font-semibold text-amber-600 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Gated Dept
              </span>
            )}
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAccessible = canAccessTab(item.id);

            return (
              <button
                key={item.id}
                id={`smo-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90'
                    : isAccessible
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : isAccessible ? 'text-slate-400' : 'text-slate-300'}`} />
                  <span className="truncate">{item.label}</span>
                  {!isAccessible && (
                    <span title="Restricted to other departments" className="inline-flex shrink-0">
                      <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.isAi && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        item.countHighlight
                          ? 'bg-indigo-600 text-white font-bold'
                          : isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'bg-slate-200/70 text-slate-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Spaces Filter */}
        <div className="space-y-1">
          <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Workspace Spaces</span>
            <Layers className="w-3 h-3 text-slate-400" />
          </div>
          {spaces.map(s => {
            const isSelected = currentSpace === s.name;
            return (
              <button
                key={s.name}
                onClick={() => setCurrentSpace(s.name)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  isSelected
                    ? 'bg-indigo-50/70 text-indigo-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${s.color} shrink-0`} />
                  <span className="truncate">{s.name}</span>
                </div>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </button>
            );
          })}
        </div>

        {/* Quick Switch Team Members Presence */}
        <div className="space-y-1.5">
          <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Department Leads</span>
            <span className="text-[10px] text-slate-400">Click to Switch</span>
          </div>
          {teamMembers.map(member => {
            const isSelected = member.id === currentUser.id;
            return (
              <button
                key={member.id}
                onClick={() => switchUser(member.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200'
                    : 'hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="relative shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                  <div className="truncate">
                    <div className="truncate font-semibold text-slate-900">{member.name}</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">{member.department}</div>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100/80 px-1 py-0.2 rounded">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Banner */}
      <div className="p-3 border-t border-slate-200/80 bg-white/50">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Azure PRIV Rail</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">99.98%</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Connected: Website & CRM sync</div>
      </div>
    </aside>
  );
};
