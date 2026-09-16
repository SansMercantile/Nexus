/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CrmProvider, useCrm, CrmTab } from './context/CrmContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PipelineView } from './components/pipeline/PipelineView';
import { DealDetailDrawer } from './components/pipeline/DealDetailDrawer';
import { DealModal } from './components/pipeline/DealModal';
import { ContactsView } from './components/contacts/ContactsView';
import { ContactModal } from './components/contacts/ContactModal';
import { InboxView } from './components/inbox/InboxView';
import { PlannerView } from './components/planner/PlannerView';
import { MeetingModal } from './components/planner/MeetingModal';
import { DocsView } from './components/docs/DocsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CommandPalette } from './components/CommandPalette';
import { TeamChatView } from './components/chat/TeamChatView';
import { CareersView } from './components/careers/CareersView';
import { GatedAccessBanner } from './components/department/GatedAccessBanner';
import { VideoCallModal } from './components/video/VideoCallModal';

const TAB_METADATA: Record<CrmTab, { name: string; requiredDepts: string[] }> = {
  pipeline: { name: 'Deals & Pipeline Allocation', requiredDepts: ['Executive Command', 'CBDO'] },
  contacts: { name: 'Contacts & Investor Relations', requiredDepts: ['Executive Command', 'CBDO'] },
  inbox: { name: 'Inbox & Activity', requiredDepts: ['All Departments'] },
  planner: { name: 'Planner & Syncs', requiredDepts: ['All Departments'] },
  docs: { name: 'Documentation & Rubrics', requiredDepts: ['All Departments'] },
  analytics: { name: 'Executive Analytics & Capital Metrics', requiredDepts: ['Executive Command', 'CBDO'] },
  chat: { name: 'Inter-Department Live Chat', requiredDepts: ['All Departments'] },
  careers: { name: 'Careers & AI Talent Ingestion Engine', requiredDepts: ['HR & Talent', 'Executive Command', 'Department Technical Evaluators'] },
};

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    canAccessTab,
    isVideoCallModalOpen,
    setIsVideoCallModalOpen,
    activeVideoCallDetails
  } = useCrm();

  const isAccessible = canAccessTab(activeTab);

  if (!isAccessible) {
    const meta = TAB_METADATA[activeTab];
    return (
      <GatedAccessBanner
        moduleName={meta.name}
        requiredDepartments={meta.requiredDepts}
      />
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {activeTab === 'pipeline' && <PipelineView />}
      {activeTab === 'chat' && <TeamChatView />}
      {activeTab === 'careers' && <CareersView />}
      {activeTab === 'contacts' && <ContactsView />}
      {activeTab === 'inbox' && <InboxView />}
      {activeTab === 'planner' && <PlannerView />}
      {activeTab === 'docs' && <DocsView />}
      {activeTab === 'analytics' && <AnalyticsView />}

      {/* Global Modals & Drawers */}
      <DealDetailDrawer />
      <DealModal />
      <ContactModal />
      <MeetingModal />
      <CommandPalette />
      <VideoCallModal
        isOpen={isVideoCallModalOpen}
        onClose={() => setIsVideoCallModalOpen(false)}
        meetingTitle={activeVideoCallDetails.title}
        initialMode={activeVideoCallDetails.mode}
        targetAttendeeNames={activeVideoCallDetails.attendeeNames}
      />
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased select-none">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </CrmProvider>
  );
}
