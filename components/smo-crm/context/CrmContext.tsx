import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Deal, 
  Contact, 
  InboxItem, 
  MeetingSync, 
  DocumentItem, 
  TeamMember, 
  WorkspaceSpace, 
  PipelineStage,
  InboxCategory,
  ActivityNote,
  Department,
  ChatMessage,
  ChatChannel,
  ChatMention,
  VoiceMemoRecord,
  JobPosting,
  CandidateApplication,
  ApplicationStage,
  DepartmentCandidateReview
} from '../types';
import { 
  INITIAL_DEALS, 
  INITIAL_CONTACTS, 
  INITIAL_INBOX_ITEMS, 
  INITIAL_MEETINGS, 
  INITIAL_DOCUMENTS, 
  TEAM_MEMBERS, 
  CURRENT_USER 
} from '../data/initialData';
import { DEPARTMENTS } from '../data/departmentsData';
import { INITIAL_CHAT_CHANNELS, INITIAL_CHAT_MESSAGES } from '../data/chatData';
import { INITIAL_JOB_POSTINGS, INITIAL_CANDIDATE_APPLICATIONS } from '../data/careersData';

export type CrmTab = 'pipeline' | 'contacts' | 'inbox' | 'planner' | 'docs' | 'analytics' | 'chat' | 'careers';

interface CrmContextType {
  deals: Deal[];
  contacts: Contact[];
  inboxItems: InboxItem[];
  meetings: MeetingSync[];
  documents: DocumentItem[];
  teamMembers: TeamMember[];
  currentUser: TeamMember;
  switchUser: (userId: string) => void;
  canAccessTab: (tab: CrmTab) => boolean;
  
  // Navigation & Filtering
  activeTab: CrmTab;
  setActiveTab: (tab: CrmTab) => void;
  currentSpace: WorkspaceSpace;
  setCurrentSpace: (space: WorkspaceSpace) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & Drawers
  selectedDeal: Deal | null;
  setSelectedDeal: (deal: Deal | null) => void;
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  isDealModalOpen: boolean;
  setIsDealModalOpen: (open: boolean) => void;
  dealToEdit: Deal | null;
  setDealToEdit: (deal: Deal | null) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  isMeetingModalOpen: boolean;
  setIsMeetingModalOpen: (open: boolean) => void;
  isVideoCallModalOpen: boolean;
  setIsVideoCallModalOpen: (open: boolean) => void;
  activeVideoCallDetails: { title: string; mode: 'video' | 'voice'; attendeeNames?: string[] };
  startVideoCall: (title?: string, mode?: 'video' | 'voice', attendeeNames?: string[]) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Chat
  chatChannels: ChatChannel[];
  chatMessages: ChatMessage[];
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
  sendChatMessage: (params: { 
    channelId: string; 
    content: string; 
    mentions?: ChatMention[]; 
    attachment?: ChatMessage['attachment'];
    voiceMemo?: VoiceMemoRecord;
  }) => void;
  toggleMessageReaction: (messageId: string, emoji: string) => void;

  // Careers & Talent
  jobPostings: JobPosting[];
  candidateApplications: CandidateApplication[];
  selectedCandidate: CandidateApplication | null;
  setSelectedCandidate: (candidate: CandidateApplication | null) => void;
  isWebsitePortalOpen: boolean;
  setIsWebsitePortalOpen: (open: boolean) => void;
  submitWebsiteApplication: (data: {
    candidateName: string;
    email: string;
    phone: string;
    location: string;
    jobId: string;
    portfolioUrl?: string;
    linkedInUrl?: string;
    gitHubUrl?: string;
    resumeName: string;
    resumeTextContent: string;
    coverLetter?: string;
  }) => void;
  updateCandidateStage: (candidateId: string, stage: ApplicationStage) => void;
  dispatchAiTestBattery: (candidateId: string) => void;
  conductAiVideoInterview: (candidateId: string) => void;
  addDepartmentReview: (candidateId: string, review: {
    score: number;
    notes: string;
    decision: 'approve' | 'request_clarification' | 'reject';
  }) => void;
  runAiVetting: (candidateId: string) => void;

  // CRUD Actions
  addDeal: (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  moveDealStage: (id: string, stage: PipelineStage) => void;
  addDealNote: (dealId: string, content: string, type?: ActivityNote['type']) => void;
  
  addContact: (contactData: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  markInboxCategory: (id: string, category: InboxCategory) => void;
  markInboxRead: (id: string, unread: boolean) => void;
  convertInboxToDeal: (inboxId: string) => void;
  
  addMeeting: (meetingData: Omit<MeetingSync, 'id'>) => void;
  updateMeetingStatus: (id: string, status: MeetingSync['status']) => void;
  
  // Utility
  exportDataAsJson: () => void;
  exportDealsAsCsv: () => void;
  resetToDefaults: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const STORAGE_KEY = 'SMO_CRM_STATE_V3';

export const CrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_DEALS`);
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
    } catch {
      return INITIAL_DEALS;
    }
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CONTACTS`);
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  const [inboxItems, setInboxItems] = useState<InboxItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_INBOX`);
      return saved ? JSON.parse(saved) : INITIAL_INBOX_ITEMS;
    } catch {
      return INITIAL_INBOX_ITEMS;
    }
  });

  const [meetings, setMeetings] = useState<MeetingSync[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_MEETINGS`);
      return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
    } catch {
      return INITIAL_MEETINGS;
    }
  });

  const [documents] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const teamMembers = TEAM_MEMBERS;

  // Active User / Department Persona Switcher
  const [currentUser, setCurrentUser] = useState<TeamMember>(() => {
    try {
      const savedUserId = localStorage.getItem(`${STORAGE_KEY}_CURRENT_USER_ID`);
      const found = TEAM_MEMBERS.find(m => m.id === savedUserId);
      return found || CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });

  const switchUser = (userId: string) => {
    const found = TEAM_MEMBERS.find(m => m.id === userId);
    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem(`${STORAGE_KEY}_CURRENT_USER_ID`, found.id);
      } catch (e) {
        console.warn('Could not save user', e);
      }
    }
  };

  const canAccessTab = (tab: CrmTab): boolean => {
    // Admin (Mezzoforte Privilege) has omniscient access to all departments
    if (currentUser.isAdmin || currentUser.department === 'executive') {
      return true;
    }
    const deptInfo = DEPARTMENTS[currentUser.department];
    if (!deptInfo) return true;
    return deptInfo.accessibleTabs.includes(tab);
  };

  // Chat State
  const [chatChannels] = useState<ChatChannel[]>(INITIAL_CHAT_CHANNELS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CHAT`);
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-all-hands');

  // Careers & Talent State
  const [jobPostings] = useState<JobPosting[]>(INITIAL_JOB_POSTINGS);
  const [candidateApplications, setCandidateApplications] = useState<CandidateApplication[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CANDIDATES`);
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_APPLICATIONS;
    } catch {
      return INITIAL_CANDIDATE_APPLICATIONS;
    }
  });
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(null);
  const [isWebsitePortalOpen, setIsWebsitePortalOpen] = useState<boolean>(false);

  // General App Navigation
  const [activeTab, setActiveTab] = useState<CrmTab>('pipeline');
  const [currentSpace, setCurrentSpace] = useState<WorkspaceSpace>('All Spaces');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [activeVideoCallDetails, setActiveVideoCallDetails] = useState<{
    title: string;
    mode: 'video' | 'voice';
    attendeeNames?: string[];
  }>({
    title: 'Sovereign Command Executive Sync',
    mode: 'video',
    attendeeNames: ['Christopher Maddison', 'Mohammed Kabir', 'Pascaline Khoza'],
  });

  const startVideoCall = (
    title: string = 'Sovereign Command Executive Sync',
    mode: 'video' | 'voice' = 'video',
    attendeeNames: string[] = ['Christopher Maddison', 'Mohammed Kabir', 'Pascaline Khoza']
  ) => {
    setActiveVideoCallDetails({ title, mode, attendeeNames });
    setIsVideoCallModalOpen(true);
  };

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_DEALS`, JSON.stringify(deals));
    } catch (e) {
      console.warn('Failed to save deals to localStorage', e);
    }
  }, [deals]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_CONTACTS`, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Failed to save contacts to localStorage', e);
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_INBOX`, JSON.stringify(inboxItems));
    } catch (e) {
      console.warn('Failed to save inbox to localStorage', e);
    }
  }, [inboxItems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_MEETINGS`, JSON.stringify(meetings));
    } catch (e) {
      console.warn('Failed to save meetings to localStorage', e);
    }
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_CHAT`, JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('Failed to save chat to localStorage', e);
    }
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_CANDIDATES`, JSON.stringify(candidateApplications));
    } catch (e) {
      console.warn('Failed to save candidates to localStorage', e);
    }
  }, [candidateApplications]);

  // Keep selected candidate updated
  useEffect(() => {
    if (selectedCandidate) {
      const fresh = candidateApplications.find(c => c.id === selectedCandidate.id);
      if (fresh && fresh !== selectedCandidate) {
        setSelectedCandidate(fresh);
      }
    }
  }, [candidateApplications, selectedCandidate]);

  // Keep selected deal updated
  useEffect(() => {
    if (selectedDeal) {
      const updated = deals.find(d => d.id === selectedDeal.id);
      if (updated && updated !== selectedDeal) {
        setSelectedDeal(updated);
      }
    }
  }, [deals, selectedDeal]);

  // Chat Actions
  const sendChatMessage = ({
    channelId,
    content,
    mentions = [],
    attachment,
    voiceMemo,
  }: {
    channelId: string;
    content: string;
    mentions?: ChatMention[];
    attachment?: ChatMessage['attachment'];
    voiceMemo?: VoiceMemoRecord;
  }) => {
    if (!content.trim() && !attachment && !voiceMemo) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      senderDepartment: currentUser.department,
      content,
      timestamp: new Date().toISOString(),
      reactions: [],
      mentions,
      attachment,
      voiceMemo,
    };

    setChatMessages(prev => [...prev, newMsg]);

    // If there are mentions, generate an Inbox notice for recipients
    if (mentions.length > 0) {
      mentions.forEach(mention => {
        const inboxAlert: InboxItem = {
          id: `inbox-mention-${Date.now()}-${mention.id}`,
          category: 'primary',
          title: `@${currentUser.name} mentioned you in #${chatChannels.find(c => c.id === channelId)?.name || 'chat'}`,
          snippet: content.length > 90 ? `${content.substring(0, 90)}...` : content,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          senderRole: currentUser.role,
          date: new Date().toISOString(),
          relatedSpace: 'Sovereign Command',
          unread: true,
          actionRequired: true,
          actionType: 'task_assigned',
        };
        setInboxItems(prev => [inboxAlert, ...prev]);
      });
    }
  };

  const toggleMessageReaction = (messageId: string, emoji: string) => {
    setChatMessages(prev =>
      prev.map(msg => {
        if (msg.id !== messageId) return msg;

        const existingReactionIndex = msg.reactions.findIndex(r => r.emoji === emoji);
        let updatedReactions = [...msg.reactions];

        if (existingReactionIndex > -1) {
          const current = updatedReactions[existingReactionIndex];
          const hasReacted = current.users.includes(currentUser.id);

          if (hasReacted) {
            // Remove reaction
            const newUsers = current.users.filter(u => u !== currentUser.id);
            if (newUsers.length === 0) {
              updatedReactions.splice(existingReactionIndex, 1);
            } else {
              updatedReactions[existingReactionIndex] = {
                ...current,
                count: newUsers.length,
                users: newUsers,
              };
            }
          } else {
            // Add user to reaction
            updatedReactions[existingReactionIndex] = {
              ...current,
              count: current.count + 1,
              users: [...current.users, currentUser.id],
            };
          }
        } else {
          // New reaction emoji
          updatedReactions.push({
            emoji,
            count: 1,
            users: [currentUser.id],
          });
        }

        return {
          ...msg,
          reactions: updatedReactions,
        };
      })
    );
  };

  // Careers & AI Candidate Actions
  const submitWebsiteApplication = (data: {
    candidateName: string;
    email: string;
    phone: string;
    location: string;
    jobId: string;
    portfolioUrl?: string;
    linkedInUrl?: string;
    gitHubUrl?: string;
    resumeName: string;
    resumeTextContent: string;
    coverLetter?: string;
  }) => {
    const job = jobPostings.find(j => j.id === data.jobId) || jobPostings[0];
    const candidateId = `cand-${Date.now()}`;

    // AI automated scoring heuristic simulation
    const resumeWords = data.resumeTextContent.toLowerCase();
    const hasCloud = resumeWords.includes('azure') || resumeWords.includes('cloud') || resumeWords.includes('kubernetes') || resumeWords.includes('infra');
    const hasFintech = resumeWords.includes('fintech') || resumeWords.includes('bank') || resumeWords.includes('payment') || resumeWords.includes('financial');
    const hasComms = resumeWords.includes('pr') || resumeWords.includes('media') || resumeWords.includes('press') || resumeWords.includes('communications');
    
    let techScore = 80;
    if (job.department === 'dev' && hasCloud) techScore += 14;
    if (job.department === 'communications' && hasComms) techScore += 15;
    if (hasFintech) techScore += 4;
    techScore = Math.min(97, Math.max(72, techScore));

    const overallScore = Math.round(techScore * 0.4 + 86 * 0.3 + 88 * 0.3);

    const newCandidate: CandidateApplication = {
      id: candidateId,
      candidateName: data.candidateName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      portfolioUrl: data.portfolioUrl,
      linkedInUrl: data.linkedInUrl,
      gitHubUrl: data.gitHubUrl,
      jobId: job.id,
      jobTitle: job.title,
      department: job.department,
      stage: 'vetted',
      appliedDate: new Date().toISOString().split('T')[0],
      tags: ['Website Ingestion', 'AI Parsed', `${overallScore}% Match`],
      documents: {
        resumeName: data.resumeName || 'Uploaded_Resume.pdf',
        resumeUrl: '#',
        resumeSize: '1.9 MB',
        resumeTextContent: data.resumeTextContent,
        coverLetter: data.coverLetter,
      },
      aiVetting: {
        score: overallScore,
        technicalSkillsScore: techScore,
        domainAlignmentScore: 88,
        experienceDepthScore: 85,
        communicationScore: 90,
        recommendation: overallScore >= 88 ? 'Strongly Shortlist' : 'Shortlist for Technical Screen',
        keyStrengths: [
          `Strong profile ingestion matching ${job.title} requirements.`,
          `Verified background in ${job.department.toUpperCase()} domain principles.`,
          'Direct submission through Sans Mercantile website careers portal.'
        ],
        considerationsAndGaps: [
          'Awaiting completion of automated AI skill battery and interactive video interview.'
        ],
        summary: `Automated AI analysis: ${data.candidateName} exhibits strong credentials for ${job.title} with a ${overallScore}% fit score. Ready for test battery dispatch.`,
        vettedAt: new Date().toISOString(),
      },
      aiTestBattery: {
        testId: `test-${Date.now()}`,
        testName: `${job.title} Technical & Domain Evaluation Battery`,
        department: job.department,
        status: 'pending',
        dispatchedAt: '',
        passingScore: 80,
        questions: [],
      },
      aiVideoInterview: {
        interviewId: `int-${Date.now()}`,
        status: 'pending',
        scheduledAt: '',
        durationMinutes: 15,
        videoAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        overallScore: 0,
        metrics: {
          technicalPrecision: 0,
          clarityAndArticulation: 0,
          strategicThinking: 0,
          executiveComposure: 0,
        },
        questions: [],
        aiExecutiveSummary: 'Pending candidate interview scheduling and submission.',
        aiFlaggedHighlights: [],
      },
      departmentReviews: [],
    };

    setCandidateApplications(prev => [newCandidate, ...prev]);

    // Send cross-department chat notice to #hr-talent-hiring
    const announcement: ChatMessage = {
      id: `msg-${Date.now()}-portal`,
      channelId: 'chan-hr-talent',
      senderId: 'user-amara',
      senderName: 'Amara Chen',
      senderRole: 'Head of Talent & People Operations',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      senderDepartment: 'hr',
      content: `⚡ New candidate application ingested from website: **${data.candidateName}** applied for **${job.title}** (${job.department.toUpperCase()}). AI Vetting Match: **${overallScore}%**.`,
      timestamp: new Date().toISOString(),
      reactions: [{ emoji: '🎉', count: 1, users: ['user-amara'] }],
      mentions: [],
      attachment: {
        name: `${data.candidateName} - Application Dossier`,
        type: 'candidate',
        referenceId: candidateId,
      },
    };
    setChatMessages(prev => [...prev, announcement]);
  };

  const updateCandidateStage = (candidateId: string, stage: ApplicationStage) => {
    setCandidateApplications(prev =>
      prev.map(c => (c.id === candidateId ? { ...c, stage } : c))
    );
  };

  const dispatchAiTestBattery = (candidateId: string) => {
    setCandidateApplications(prev =>
      prev.map(c => {
        if (c.id !== candidateId) return c;

        return {
          ...c,
          stage: 'tests_dispatched',
          aiTestBattery: {
            ...c.aiTestBattery,
            status: 'in_progress',
            dispatchedAt: new Date().toISOString(),
            testName: `${c.jobTitle} Standardized AI Proficiency Battery`,
          },
        };
      })
    );
  };

  const conductAiVideoInterview = (candidateId: string) => {
    setCandidateApplications(prev =>
      prev.map(c => {
        if (c.id !== candidateId) return c;

        return {
          ...c,
          stage: 'interview_done',
          aiVideoInterview: {
            interviewId: `int-ai-${Date.now()}`,
            status: 'completed',
            scheduledAt: new Date().toISOString(),
            recordedAt: new Date().toISOString(),
            durationMinutes: 16,
            videoAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
            thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
            overallScore: 92,
            metrics: {
              technicalPrecision: 93,
              clarityAndArticulation: 95,
              strategicThinking: 90,
              executiveComposure: 92,
            },
            questions: [
              {
                id: 'vq-gen-1',
                prompt: `Describe your core approach to scaling ${c.department.toUpperCase()} deliverables under high-stakes deadlines.`,
                durationSeconds: 140,
                timestampStart: '00:00',
                candidateTranscript: 'I focus on clear architectural decoupling and continuous feedback loops. By establishing automated verification and clear cross-departmental documentation, our velocity stays high while preventing regressions.',
                metricScore: 94,
                feedback: 'Exceptional executive presence, lucid articulation, and concrete methodology.',
              },
            ],
            aiExecutiveSummary: `Candidate completed the AI video interview with distinction (92/100). Demonstrates strong communication clarity and deep domain alignment with ${c.jobTitle}.`,
            aiFlaggedHighlights: [
              'Top 5% articulation score in automated voice & gesture telemetry.',
              'Recommended for preliminary shortlisting and department head sign-off.'
            ],
          },
        };
      })
    );
  };

  const addDepartmentReview = (candidateId: string, review: {
    score: number;
    notes: string;
    decision: 'approve' | 'request_clarification' | 'reject';
  }) => {
    const newRev: DepartmentCandidateReview = {
      id: `rev-${Date.now()}`,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerRole: currentUser.role,
      department: currentUser.department,
      score: review.score,
      notes: review.notes,
      decision: review.decision,
      reviewedAt: new Date().toISOString(),
    };

    setCandidateApplications(prev =>
      prev.map(c => {
        if (c.id !== candidateId) return c;
        const nextStage: ApplicationStage = review.decision === 'approve' ? 'shortlisted' : c.stage;
        return {
          ...c,
          stage: nextStage,
          departmentReviews: [newRev, ...c.departmentReviews],
        };
      })
    );
  };

  const runAiVetting = (candidateId: string) => {
    setCandidateApplications(prev =>
      prev.map(c => {
        if (c.id !== candidateId) return c;
        const bumpedScore = Math.min(98, c.aiVetting.score + 2);
        return {
          ...c,
          aiVetting: {
            ...c.aiVetting,
            score: bumpedScore,
            summary: `Re-evaluated via AWS Bedrock reasoning: Candidate demonstrates validated credentials and alignment with Sans Mercantile sovereign standards. Overall match index: ${bumpedScore}%.`,
            vettedAt: new Date().toISOString(),
          },
        };
      })
    );
  };

  // Deal actions
  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [
        {
          id: `note-${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          content: 'Deal initialized in SMO CRM.',
          createdAt: new Date().toISOString(),
          type: 'note',
        },
      ],
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals(prev =>
      prev.map(deal => {
        if (deal.id === id) {
          return {
            ...deal,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return deal;
      })
    );
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    if (selectedDeal?.id === id) {
      setSelectedDeal(null);
    }
  };

  const moveDealStage = (id: string, newStage: PipelineStage) => {
    setDeals(prev =>
      prev.map(deal => {
        if (deal.id === id && deal.stage !== newStage) {
          const stageNote: ActivityNote = {
            id: `note-${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            content: `Stage transitioned from ${deal.stage.toUpperCase()} to ${newStage.toUpperCase()}`,
            createdAt: new Date().toISOString(),
            type: 'stage_change',
          };
          return {
            ...deal,
            stage: newStage,
            updatedAt: new Date().toISOString(),
            notes: [stageNote, ...deal.notes],
          };
        }
        return deal;
      })
    );
  };

  const addDealNote = (dealId: string, content: string, type: ActivityNote['type'] = 'note') => {
    const newNote: ActivityNote = {
      id: `note-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      content,
      createdAt: new Date().toISOString(),
      type,
    };

    setDeals(prev =>
      prev.map(deal => {
        if (deal.id === dealId) {
          return {
            ...deal,
            updatedAt: new Date().toISOString(),
            notes: [newNote, ...deal.notes],
          };
        }
        return deal;
      })
    );
  };

  // Contact actions
  const addContact = (contactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `contact-${Date.now()}`,
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev =>
      prev.map(contact => {
        if (contact.id === id) {
          return { ...contact, ...updates };
        }
        return contact;
      })
    );
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    if (selectedContact?.id === id) {
      setSelectedContact(null);
    }
  };

  // Inbox actions
  const markInboxCategory = (id: string, category: InboxCategory) => {
    setInboxItems(prev =>
      prev.map(item => (item.id === id ? { ...item, category } : item))
    );
  };

  const markInboxRead = (id: string, unread: boolean) => {
    setInboxItems(prev =>
      prev.map(item => (item.id === id ? { ...item, unread } : item))
    );
  };

  const convertInboxToDeal = (inboxId: string) => {
    const item = inboxItems.find(i => i.id === inboxId);
    if (!item) return;

    addDeal({
      title: item.title,
      organization: item.senderName,
      contactPerson: item.senderName,
      contactEmail: `${item.senderName.toLowerCase().replace(/\s+/g, '.')}@partner.com`,
      value: item.title.includes('$350K') ? 350000 : 150000,
      stage: 'lead',
      priority: 'urgent',
      space: item.relatedSpace,
      assigneeId: currentUser.id,
      expectedCloseDate: '2026-11-30',
      leadScore: {
        strategicFit: 22,
        fundingCapacity: 20,
        networkLeverage: 21,
        diligenceSpeed: 19,
      },
      tags: ['Converted from Inbox', 'High Priority'],
    });

    markInboxCategory(inboxId, 'cleared');
    markInboxRead(inboxId, false);
    setActiveTab('pipeline');
  };

  // Meeting actions
  const addMeeting = (meetingData: Omit<MeetingSync, 'id'>) => {
    const newMeeting: MeetingSync = {
      ...meetingData,
      id: `meeting-${Date.now()}`,
    };
    setMeetings(prev => [newMeeting, ...prev]);
  };

  const updateMeetingStatus = (id: string, status: MeetingSync['status']) => {
    setMeetings(prev =>
      prev.map(m => (m.id === id ? { ...m, status } : m))
    );
  };

  // Export utilities
  const exportDataAsJson = () => {
    const dataStr = JSON.stringify({ deals, contacts, inboxItems, meetings, candidateApplications }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SMO_CRM_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDealsAsCsv = () => {
    const headers = ['Title', 'Organization', 'Contact Person', 'Email', 'Value (USD)', 'Stage', 'Priority', 'Space', 'Score'];
    const rows = deals.map(d => [
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.organization.replace(/"/g, '""')}"`,
      `"${d.contactPerson.replace(/"/g, '""')}"`,
      `"${d.contactEmail.replace(/"/g, '""')}"`,
      d.value,
      d.stage,
      d.priority,
      `"${d.space}"`,
      (d.leadScore.strategicFit + d.leadScore.fundingCapacity + d.leadScore.networkLeverage + d.leadScore.diligenceSpeed)
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SMO_Pipeline_Deals_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all SMO CRM records back to defaults?')) {
      setDeals(INITIAL_DEALS);
      setContacts(INITIAL_CONTACTS);
      setInboxItems(INITIAL_INBOX_ITEMS);
      setMeetings(INITIAL_MEETINGS);
      setChatMessages(INITIAL_CHAT_MESSAGES);
      setCandidateApplications(INITIAL_CANDIDATE_APPLICATIONS);
      localStorage.removeItem(`${STORAGE_KEY}_DEALS`);
      localStorage.removeItem(`${STORAGE_KEY}_CONTACTS`);
      localStorage.removeItem(`${STORAGE_KEY}_INBOX`);
      localStorage.removeItem(`${STORAGE_KEY}_MEETINGS`);
      localStorage.removeItem(`${STORAGE_KEY}_CHAT`);
      localStorage.removeItem(`${STORAGE_KEY}_CANDIDATES`);
    }
  };

  const value = useMemo(
    () => ({
      deals,
      contacts,
      inboxItems,
      meetings,
      documents,
      teamMembers,
      currentUser,
      switchUser,
      canAccessTab,
      activeTab,
      setActiveTab,
      currentSpace,
      setCurrentSpace,
      searchQuery,
      setSearchQuery,
      selectedDeal,
      setSelectedDeal,
      selectedContact,
      setSelectedContact,
      isDealModalOpen,
      setIsDealModalOpen,
      dealToEdit,
      setDealToEdit,
      isContactModalOpen,
      setIsContactModalOpen,
      isMeetingModalOpen,
      setIsMeetingModalOpen,
      isVideoCallModalOpen,
      setIsVideoCallModalOpen,
      activeVideoCallDetails,
      startVideoCall,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      chatChannels,
      chatMessages,
      activeChannelId,
      setActiveChannelId,
      sendChatMessage,
      toggleMessageReaction,
      jobPostings,
      candidateApplications,
      selectedCandidate,
      setSelectedCandidate,
      isWebsitePortalOpen,
      setIsWebsitePortalOpen,
      submitWebsiteApplication,
      updateCandidateStage,
      dispatchAiTestBattery,
      conductAiVideoInterview,
      addDepartmentReview,
      runAiVetting,
      addDeal,
      updateDeal,
      deleteDeal,
      moveDealStage,
      addDealNote,
      addContact,
      updateContact,
      deleteContact,
      markInboxCategory,
      markInboxRead,
      convertInboxToDeal,
      addMeeting,
      updateMeetingStatus,
      exportDataAsJson,
      exportDealsAsCsv,
      resetToDefaults,
    }),
    [
      deals,
      contacts,
      inboxItems,
      meetings,
      documents,
      teamMembers,
      currentUser,
      activeTab,
      currentSpace,
      searchQuery,
      selectedDeal,
      selectedContact,
      isDealModalOpen,
      dealToEdit,
      isContactModalOpen,
      isMeetingModalOpen,
      isCommandPaletteOpen,
      chatChannels,
      chatMessages,
      activeChannelId,
      jobPostings,
      candidateApplications,
      selectedCandidate,
      isWebsitePortalOpen,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
