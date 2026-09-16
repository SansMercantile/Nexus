export type PipelineStage = 
  | 'lead'        // Identified / Sourced
  | 'outreach'    // First Touch / Outreach
  | 'diligence'   // Due Diligence / Evaluation
  | 'pitch'       // Pitch / Meeting Scheduled
  | 'proposal'    // Term Sheet / Proposal
  | 'won'         // Closed Won / Committed
  | 'lost';       // Passed / Archived

export type DealPriority = 'urgent' | 'high' | 'normal' | 'low';

export type WorkspaceSpace = 
  | 'All Spaces'
  | 'Sovereign Command'
  | 'CBDO workspace'
  | 'PR & Comms'
  | 'Mpeti'
  | 'CrazyJam Records';

export type Department = 
  | 'executive'       // Sovereign Admin (Mezzoforte - all departments)
  | 'dev'             // Dev / Engineering & Infra (Mohammed Kabir)
  | 'communications'  // Communications & PR (Pascaline Khoza / Swell)
  | 'cbdo'            // Business Development (Christopher Maddison)
  | 'hr';             // People & Talent Operations

export interface DepartmentInfo {
  id: Department;
  name: string;
  leadName: string;
  leadRole: string;
  color: string;
  badgeBg: string;
  description: string;
  accessibleTabs: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  initials: string;
  color: string;
  department: Department;
  isAdmin?: boolean;
  isContractor?: boolean;
  contractedEntity?: string; // e.g. "Swell"
}

export interface ActivityNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  type: 'note' | 'call' | 'email' | 'sync' | 'stage_change';
}

export interface LeadScoreCriteria {
  strategicFit: number;   // 0-25
  fundingCapacity: number;// 0-25
  networkLeverage: number;// 0-25
  diligenceSpeed: number; // 0-25
}

export interface Deal {
  id: string;
  title: string;
  organization: string;
  contactPerson: string;
  contactEmail: string;
  value: number; // USD
  stage: PipelineStage;
  priority: DealPriority;
  space: WorkspaceSpace;
  assigneeId: string;
  expectedCloseDate: string;
  leadScore: LeadScoreCriteria;
  tags: string[];
  notes: ActivityNote[];
  updatedAt: string;
  createdAt: string;
}

export type ContactType = 'investor' | 'grant_sponsor' | 'strategic_partner' | 'enterprise_client' | 'advisor';
export type ContactStatus = 'active' | 'evaluating' | 'negotiating' | 'portfolio' | 'inactive';

export interface Contact {
  id: string;
  name: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
  type: ContactType;
  status: ContactStatus;
  location: string;
  space: WorkspaceSpace;
  assignedTo: string;
  totalDealsValue: number;
  lastContacted: string;
  notes: string;
  tags: string[];
  linkedinUrl?: string;
}

export type InboxCategory = 'primary' | 'other' | 'later' | 'cleared';

export interface InboxItem {
  id: string;
  category: InboxCategory;
  title: string;
  snippet: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  date: string;
  relatedSpace: WorkspaceSpace;
  unread: boolean;
  actionRequired: boolean;
  associatedDealId?: string;
  actionType?: 'review_lead' | 'sync_notes' | 'task_assigned' | 'reminder' | 'milestone';
}

export interface MeetingSync {
  id: string;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  attendees: string[]; // TeamMember IDs or Contact names
  space: WorkspaceSpace;
  locationOrLink: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  agendaNotes: string;
  keyActionItems: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  space: WorkspaceSpace;
  category: 'Investor List' | 'Rubric' | 'Memo' | 'Guide' | 'SyncUp';
  updatedAt: string;
  lastViewedAt: string;
  author: string;
  contentMarkdown: string;
  isStarred?: boolean;
}

// ----------------------------------------------------
// CROSS-DEPARTMENT CHAT & MESSAGING
// ----------------------------------------------------

export interface EmojiReaction {
  emoji: string;
  count: number;
  users: string[]; // member IDs
}

export interface ChatMention {
  id: string; // member ID
  name: string;
  department: Department;
}

export interface VoiceMemoRecord {
  id: string;
  audioBlobUrl?: string;
  durationSeconds: number;
  transcript: string;
  confidence?: number;
  keyTopics: string[];
  department?: Department | 'all';
  recordedAt: string;
  speakerId: string;
  speakerName: string;
  speakerAvatar?: string;
  indexedSummary?: string;
  actionItems?: string[];
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  senderDepartment: Department;
  content: string;
  timestamp: string;
  reactions: EmojiReaction[];
  mentions: ChatMention[];
  attachment?: {
    name: string;
    type: 'deal' | 'candidate' | 'doc' | 'file';
    referenceId?: string;
    url?: string;
    size?: string;
  };
  voiceMemo?: VoiceMemoRecord;
  isPinned?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  departmentScope: Department | 'all';
  iconName?: string;
  unreadCount?: number;
  isDirectMessage?: boolean;
  dmRecipientId?: string;
}

// ----------------------------------------------------
// DEPARTMENT OKRS & REPORT TEMPLATES
// ----------------------------------------------------

export interface KeyResult {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: '$' | '%' | 'count' | 'days';
  status: 'on_track' | 'needs_attention' | 'at_risk' | 'achieved';
}

export interface DepartmentOkr {
  id: string;
  department: Department;
  quarter: 'Q1 2026' | 'Q2 2026' | 'Q3 2026' | 'Q4 2026' | 'Q1 2027';
  objective: string;
  targetQuotaUsd: number; // Synchronizes with TargetVsActualWidget
  keyResults: KeyResult[];
  ownerName: string;
  updatedAt: string;
}

export type ReportWidgetChoice = 
  | 'ai_weekly_summary'
  | 'kpi_cards'
  | 'activity_heatmap'
  | 'weekly_velocity'
  | 'target_vs_actual'
  | 'executive_notes'
  | 'predictive_forecast'
  | 'stage_funnel'
  | 'team_sentiment'
  | 'distribution';

export interface CustomReportTemplate {
  id: string;
  name: string;
  description: string;
  format: 'pdf' | 'csv' | 'both';
  timeframe: '7d' | '30d' | 'qtd' | 'ytd';
  widgets: ReportWidgetChoice[];
  isRecurring: boolean;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    timeUtc: string;
    distributionEmails: string[];
    channelNotify?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// CAREERS, JOB APPLICATIONS & AI VETTING PIPELINE
// ----------------------------------------------------

export type ApplicationStage = 
  | 'applied'           // Received from website
  | 'vetted'            // AI parsed & scored
  | 'tests_dispatched'  // Technical tests dispatched
  | 'tests_completed'   // Tests completed and scored
  | 'interview_pending' // AI video interview invite sent
  | 'interview_done'    // AI video interview recorded & evaluated
  | 'shortlisted'       // Preliminary shortlisted by AI
  | 'offered'           // Hired / Offer extended
  | 'rejected';         // Not selected

export interface JobPosting {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: 'Full-time' | 'Contract' | 'Executive';
  experienceLevel: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isActive: boolean;
  openings: number;
  targetClosingDate: string;
}

export interface AiVettingBreakdown {
  score: number; // 0-100 overall match
  technicalSkillsScore: number; // 0-100
  domainAlignmentScore: number; // 0-100
  experienceDepthScore: number; // 0-100
  communicationScore: number;   // 0-100
  recommendation: 'Strongly Shortlist' | 'Shortlist for Technical Screen' | 'Consider Alternative Role' | 'Do Not Shortlist';
  keyStrengths: string[];
  considerationsAndGaps: string[];
  summary: string;
  vettedAt: string;
}

export interface AiTestQuestion {
  id: string;
  question: string;
  candidateAnswer: string;
  maxPoints: number;
  awardedPoints: number;
  aiGradingNotes: string;
}

export interface AiTestBattery {
  testId: string;
  testName: string;
  department: Department;
  status: 'pending' | 'dispatched' | 'in_progress' | 'completed';
  dispatchedAt: string;
  completedAt?: string;
  score?: number; // 0-100
  passingScore: number;
  questions: AiTestQuestion[];
  aiTestSummary?: string;
}

export interface AiInterviewQuestionRecord {
  id: string;
  prompt: string;
  durationSeconds: number;
  timestampStart: string;
  candidateTranscript: string;
  metricScore: number; // 0-100
  feedback: string;
}

export interface AiVideoInterviewRecord {
  interviewId: string;
  status: 'pending' | 'ready' | 'completed';
  scheduledAt: string;
  recordedAt?: string;
  durationMinutes: number;
  videoAvatarUrl: string;
  thumbnailUrl: string;
  overallScore: number; // 0-100
  metrics: {
    technicalPrecision: number;
    clarityAndArticulation: number;
    strategicThinking: number;
    executiveComposure: number;
  };
  questions: AiInterviewQuestionRecord[];
  aiExecutiveSummary: string;
  aiFlaggedHighlights: string[];
}

export interface DepartmentCandidateReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  department: Department;
  score: number; // 1-5
  notes: string;
  decision: 'approve' | 'request_clarification' | 'reject';
  reviewedAt: string;
}

export interface CandidateApplication {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  jobId: string;
  jobTitle: string;
  department: Department;
  stage: ApplicationStage;
  appliedDate: string;
  
  // Uploaded Documents
  documents: {
    resumeName: string;
    resumeUrl: string;
    resumeSize: string;
    resumeTextContent: string;
    coverLetter?: string;
    portfolioDocumentName?: string;
  };

  // AI Evaluation Modules
  aiVetting: AiVettingBreakdown;
  aiTestBattery: AiTestBattery;
  aiVideoInterview: AiVideoInterviewRecord;

  // Department Collaboration
  departmentReviews: DepartmentCandidateReview[];
  tags: string[];
}

export interface ExecutiveSummaryNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  department: Department;
  content: string;
  periodLabel: string;
  category: 'velocity' | 'capital' | 'risk' | 'forecast' | 'governance';
  isPinned?: boolean;
  createdAt: string;
  updatedAt?: string;
}

