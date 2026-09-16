import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  ChevronDown, 
  Download, 
  FileText, 
  Calendar, 
  UserPlus, 
  Layers,
  Sparkles,
  Command,
  CheckCircle2,
  SlidersHorizontal,
  ShieldAlert,
  ShieldCheck,
  Building,
  Globe,
  MessageSquare,
  Users,
  Video,
  PhoneCall
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { WorkspaceSpace } from '../types';
import { DEPARTMENTS } from '../data/departmentsData';

const SPACES: WorkspaceSpace[] = [
  'All Spaces',
  'Sovereign Command',
  'CBDO workspace',
  'PR & Comms',
  'Mpeti',
  'CrazyJam Records',
];

export const Header: React.FC = () => {
  const { 
    currentSpace, 
    setCurrentSpace, 
    searchQuery, 
    setSearchQuery, 
    currentUser,
    switchUser,
    teamMembers,
    inboxItems,
    setIsDealModalOpen,
    setDealToEdit,
    setIsContactModalOpen,
    setIsMeetingModalOpen,
    setIsCommandPaletteOpen,
    exportDataAsJson,
    exportDealsAsCsv,
    resetToDefaults,
    setActiveTab,
    setIsWebsitePortalOpen,
    startVideoCall
  } = useCrm();

  const [isSpaceMenuOpen, setIsSpaceMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const unreadInboxCount = inboxItems.filter(i => i.unread && i.category === 'primary').length;
  const currentDept = DEPARTMENTS[currentUser.department];

  return (
    <header id="smo-header" className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Brand & Space Switcher */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setActiveTab('pipeline')}
          className="flex items-center gap-2 cursor-pointer group"
          id="smo-logo-button"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-indigo-950 transition-colors">
            SMO
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
              Sans Mercantile <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">CRM</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight">Sovereign Command Hub</span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden md:block" />

        {/* Space Selector Dropdown */}
        <div className="relative">
          <button
            id="smo-space-selector-btn"
            onClick={() => setIsSpaceMenuOpen(!isSpaceMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span className="max-w-[130px] truncate">{currentSpace}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isSpaceMenuOpen && (
            <div 
              id="smo-space-dropdown"
              className="absolute left-0 mt-1.5 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Workspace Space
              </div>
              {SPACES.map(space => (
                <button
                  key={space}
                  onClick={() => {
                    setCurrentSpace(space);
                    setIsSpaceMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentSpace === space ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{space}</span>
                  {currentSpace === space && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Search & Command trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="smo-global-search-input"
            type="text"
            placeholder="Search deals, investors, candidates, chat..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200/70 text-slate-600 hover:bg-slate-200"
            title="Open Command Palette"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </button>
        </div>
      </div>

      {/* Right: Department Switcher, Website Simulator, Quick Add & User */}
      <div className="flex items-center gap-2">
        {/* Department / User Persona Switcher Pill */}
        <div className="relative">
          <button
            id="smo-persona-switcher-btn"
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs transition-colors"
            title="Switch Active Department Persona"
          >
            {currentUser.isAdmin ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Building className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                {currentUser.isAdmin ? 'Admin Clearance' : `${currentDept.name}`}
              </span>
              <span className="font-bold text-slate-800 text-[11px] truncate max-w-[110px]">
                {currentUser.name}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {isPersonaMenuOpen && (
            <div 
              id="smo-persona-dropdown"
              className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 pb-1.5 border-b border-slate-100">
                <div className="font-bold text-slate-900">Switch Department Persona</div>
                <div className="text-[10px] text-slate-500">
                  Verify role-gated access across Executive, Dev, Comms (Swell), CBDO, and HR.
                </div>
              </div>

              <div className="p-1 space-y-1">
                {teamMembers.map(member => {
                  const isCurrent = member.id === currentUser.id;
                  const dept = DEPARTMENTS[member.department];

                  return (
                    <button
                      key={member.id}
                      onClick={() => {
                        switchUser(member.id);
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div className="truncate">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="truncate">{member.name}</span>
                            {member.isAdmin && (
                              <span className="text-[9px] px-1 py-0.2 rounded font-extrabold bg-emerald-100 text-emerald-800">
                                ADMIN
                              </span>
                            )}
                            {member.isContractor && (
                              <span className="text-[9px] px-1 py-0.2 rounded font-semibold bg-pink-100 text-pink-800">
                                {member.contractedEntity}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 capitalize truncate">
                            {member.role} • {dept.name}
                          </div>
                        </div>
                      </div>

                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Website Careers Portal Link */}
        <button
          onClick={() => setIsWebsitePortalOpen(true)}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          title="Open Public Website Careers Application Portal"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <span>Website Careers</span>
        </button>

        {/* Quick Add Button & Menu */}
        <div className="relative">
          <button
            id="smo-quick-add-btn"
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New Record</span>
          </button>

          {isQuickAddOpen && (
            <div 
              id="smo-quick-add-menu"
              className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in duration-100"
            >
              <button
                onClick={() => {
                  setDealToEdit(null);
                  setIsDealModalOpen(true);
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
              >
                <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">New Deal / Grant</div>
                  <div className="text-[10px] text-slate-500">Add to investor pipeline</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsContactModalOpen(true);
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
              >
                <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">New Contact</div>
                  <div className="text-[10px] text-slate-500">Investor, partner or client</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMeetingModalOpen(true);
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
              >
                <div className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Schedule Sync</div>
                  <div className="text-[10px] text-slate-500">Weekly sync / investor pitch</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsWebsitePortalOpen(true);
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-t border-slate-100"
              >
                <div className="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Ingest Candidate CV</div>
                  <div className="text-[10px] text-slate-500">Open website careers flow</div>
                </div>
              </button>

              <button
                onClick={() => {
                  startVideoCall('Sovereign Command Executive Sync', 'video');
                  setIsQuickAddOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-t border-slate-100"
              >
                <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Launch Video Sync (Zoom / Skype)</div>
                  <div className="text-[10px] text-slate-500">Live call with AI note taker</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Zoom / Skype Video Sync shortcut button */}
        <button
          id="smo-video-call-header-btn"
          onClick={() => startVideoCall('Sovereign Command Live Sync', 'video')}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors relative"
          title="Launch Live Video / Audio Sync (Zoom & Skype Functions)"
        >
          <Video className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        {/* Chat shortcut button */}
        <button
          onClick={() => setActiveTab('chat')}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
          title="Open Inter-Department Chat"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Inbox notification trigger */}
        <button
          id="smo-inbox-header-btn"
          onClick={() => setActiveTab('inbox')}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Inbox & Communications"
        >
          <Bell className="w-4 h-4" />
          {unreadInboxCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative ml-1">
          <button
            id="smo-profile-menu-btn"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isProfileMenuOpen && (
            <div 
              id="smo-profile-dropdown"
              className="absolute right-0 mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in duration-100"
            >
              <div className="px-3 pb-2 border-b border-slate-100">
                <div className="font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${currentDept.badgeBg}`}>
                    {currentDept.name}
                  </span>
                  {currentUser.isAdmin && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Sovereign Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="py-1 border-b border-slate-100">
                <button
                  onClick={() => {
                    exportDealsAsCsv();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Export Pipeline Deals (.CSV)
                </button>
                <button
                  onClick={() => {
                    exportDataAsJson();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Export Full CRM State (.JSON)
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    resetToDefaults();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-rose-600 hover:bg-rose-50 font-medium"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Reset Sample Workspace Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
