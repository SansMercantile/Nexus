import { TeamMember, Deal, Contact, InboxItem, MeetingSync, DocumentItem } from '../types';
import { INITIAL_TEAM_MEMBERS } from './departmentsData';

export const CURRENT_USER: TeamMember = INITIAL_TEAM_MEMBERS[0];
export const TEAM_MEMBERS: TeamMember[] = INITIAL_TEAM_MEMBERS;


export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-palladium-award',
    title: 'Palladium Global Science Award 2026',
    organization: 'Global Science & Innovation Council',
    contactPerson: 'Dr. Aris Thorne',
    contactEmail: 'awards@palladium-foundation.org',
    value: 350000,
    stage: 'diligence',
    priority: 'urgent',
    space: 'CBDO workspace',
    assigneeId: 'user-mezzoforte',
    expectedCloseDate: '2026-10-15',
    leadScore: {
      strategicFit: 24,
      fundingCapacity: 25,
      networkLeverage: 23,
      diligenceSpeed: 21,
    },
    tags: ['Grant', 'Science Award', 'Prestige', '$350K Prize'],
    notes: [
      {
        id: 'note-1',
        authorId: 'user-christopher',
        authorName: 'Christopher Maddison',
        content: 'Flagged from Inbox: @Mezzoforte Privilege i think you should do this application, its more about you than Sans from what i can see, they require your CV etc.',
        createdAt: '2026-07-30T14:22:00Z',
        type: 'note',
      },
      {
        id: 'note-2',
        authorId: 'user-mezzoforte',
        authorName: 'Mezzoforte Privilege',
        content: 'Drafted Sovereign Command technical memo and personal track record summary. Application dossier ready for stage 2 evaluation.',
        createdAt: '2026-08-15T11:00:00Z',
        type: 'sync',
      },
    ],
    updatedAt: '2026-09-12T09:30:00Z',
    createdAt: '2026-07-30T10:00:00Z',
  },
  {
    id: 'deal-series-a-meridian',
    title: 'Series A Sovereign Growth Syndicate',
    organization: 'Meridian Apex Capital',
    contactPerson: 'Vivienne De Vries',
    contactEmail: 'v.devries@meridianapex.com',
    value: 1200000,
    stage: 'proposal',
    priority: 'urgent',
    space: 'CBDO workspace',
    assigneeId: 'user-christopher',
    expectedCloseDate: '2026-11-01',
    leadScore: {
      strategicFit: 23,
      fundingCapacity: 25,
      networkLeverage: 24,
      diligenceSpeed: 20,
    },
    tags: ['Equity', 'Series A', 'Lead Investor'],
    notes: [
      {
        id: 'note-3',
        authorId: 'user-christopher',
        authorName: 'Christopher Maddison',
        content: 'Term sheet under legal review. Valuation cap and board observer seat aligned with Sans Mercantile bylaws.',
        createdAt: '2026-08-28T16:00:00Z',
        type: 'stage_change',
      },
    ],
    updatedAt: '2026-09-14T15:20:00Z',
    createdAt: '2026-06-10T12:00:00Z',
  },
  {
    id: 'deal-priv-pay-commercial',
    title: 'Priv Pay Merchant Settlement Rail Expansion',
    organization: 'Trans-Atlantic Settlement Consortium',
    contactPerson: 'Marcus Sterling',
    contactEmail: 'm.sterling@tas-consortium.com',
    value: 480000,
    stage: 'pitch',
    priority: 'high',
    space: 'Sovereign Command',
    assigneeId: 'user-pascaline',
    expectedCloseDate: '2026-09-30',
    leadScore: {
      strategicFit: 25,
      fundingCapacity: 22,
      networkLeverage: 21,
      diligenceSpeed: 19,
    },
    tags: ['Fintech', 'Priv Pay', 'Enterprise SLA'],
    notes: [
      {
        id: 'note-4',
        authorId: 'user-pascaline',
        authorName: 'Pascaline Khoza',
        content: 'Targeting live pilot concurrently with the Sep 4 Priv Pay platform rollout. Merchant contracts prepared.',
        createdAt: '2026-09-02T10:15:00Z',
        type: 'sync',
      },
    ],
    updatedAt: '2026-09-15T08:45:00Z',
    createdAt: '2026-08-01T14:30:00Z',
  },
  {
    id: 'deal-azure-mqtt',
    title: 'Azure Cloud MQTT Enterprise Telemetry Rail',
    organization: 'Helios Industrial IoT',
    contactPerson: 'Klaus Lindner',
    contactEmail: 'k.lindner@helios-iot.de',
    value: 260000,
    stage: 'outreach',
    priority: 'normal',
    space: 'Sovereign Command',
    assigneeId: 'user-mohammed',
    expectedCloseDate: '2026-11-15',
    leadScore: {
      strategicFit: 20,
      fundingCapacity: 22,
      networkLeverage: 18,
      diligenceSpeed: 17,
    },
    tags: ['Azure Cloud', 'MQTT', 'Infrastructure'],
    notes: [
      {
        id: 'note-5',
        authorId: 'user-mohammed',
        authorName: 'Mohammed Kabir',
        content: 'Completed broker deployment POC on Azure VM cluster. Validated throughput of 250k msgs/sec for telemetry tests.',
        createdAt: '2026-07-30T18:00:00Z',
        type: 'note',
      },
    ],
    updatedAt: '2026-09-08T11:10:00Z',
    createdAt: '2026-07-28T09:00:00Z',
  },
  {
    id: 'deal-swell-pr',
    title: 'Swell PR & Media Syndication Strategy',
    organization: 'Swell Comms Global',
    contactPerson: 'Nadia El-Sayed',
    contactEmail: 'nadia@swellprcomms.com',
    value: 125000,
    stage: 'pitch',
    priority: 'normal',
    space: 'PR & Comms',
    assigneeId: 'user-mezzoforte',
    expectedCloseDate: '2026-10-05',
    leadScore: {
      strategicFit: 22,
      fundingCapacity: 18,
      networkLeverage: 25,
      diligenceSpeed: 20,
    },
    tags: ['PR & Comms', 'Brand Kit', 'Media'],
    notes: [
      {
        id: 'note-6',
        authorId: 'user-pascaline',
        authorName: 'Pascaline Khoza',
        content: 'Brand kit drafted. Need final sign-off before Swell distributes press releases for Priv Pay launch.',
        createdAt: '2026-08-24T13:30:00Z',
        type: 'note',
      },
    ],
    updatedAt: '2026-09-10T16:00:00Z',
    createdAt: '2026-08-10T11:20:00Z',
  },
  {
    id: 'deal-crazyjam',
    title: 'CrazyJam Records Royalty Micro-Distribution',
    organization: 'CrazyJam Entertainment Ltd',
    contactPerson: 'Jamaine Brooks',
    contactEmail: 'jamaine@crazyjam.fm',
    value: 310000,
    stage: 'lead',
    priority: 'normal',
    space: 'CrazyJam Records',
    assigneeId: 'user-christopher',
    expectedCloseDate: '2026-12-01',
    leadScore: {
      strategicFit: 21,
      fundingCapacity: 19,
      networkLeverage: 22,
      diligenceSpeed: 16,
    },
    tags: ['Media Rail', 'Royalties', 'Streaming'],
    notes: [
      {
        id: 'note-7',
        authorId: 'user-christopher',
        authorName: 'Christopher Maddison',
        content: 'Initial discovery call conducted. Jamaine confirmed 45 artist catalogs waiting for automated settlement routing.',
        createdAt: '2026-08-18T10:00:00Z',
        type: 'call',
      },
    ],
    updatedAt: '2026-09-05T14:15:00Z',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'deal-mpeti',
    title: 'Mpeti Group Hospitality & Lodging POS Integration',
    organization: 'Mpeti Safari & Luxury Holdings',
    contactPerson: 'Tendai Ndlovu',
    contactEmail: 'tendai.n@mpetiholdings.co.za',
    value: 190000,
    stage: 'diligence',
    priority: 'high',
    space: 'Mpeti',
    assigneeId: 'user-pascaline',
    expectedCloseDate: '2026-10-20',
    leadScore: {
      strategicFit: 24,
      fundingCapacity: 21,
      networkLeverage: 19,
      diligenceSpeed: 22,
    },
    tags: ['POS', 'Hospitality', 'Foreign Exchange'],
    notes: [
      {
        id: 'note-8',
        authorId: 'user-pascaline',
        authorName: 'Pascaline Khoza',
        content: 'Completed onsite requirements gathering. Mpeti finance team requested custom multi-currency settlement ledger.',
        createdAt: '2026-08-20T15:45:00Z',
        type: 'sync',
      },
    ],
    updatedAt: '2026-09-11T12:30:00Z',
    createdAt: '2026-07-15T08:30:00Z',
  },
  {
    id: 'deal-african-tech-grant',
    title: 'Pan-African Sovereign Tech Infrastructure Grant',
    organization: 'African Innovation Catalyst Fund',
    contactPerson: 'Amina Mansour',
    contactEmail: 'a.mansour@africancatalyst.org',
    value: 150000,
    stage: 'won',
    priority: 'high',
    space: 'Sovereign Command',
    assigneeId: 'user-mezzoforte',
    expectedCloseDate: '2026-08-01',
    leadScore: {
      strategicFit: 25,
      fundingCapacity: 25,
      networkLeverage: 24,
      diligenceSpeed: 25,
    },
    tags: ['Grant', 'Completed', 'Disbursed'],
    notes: [
      {
        id: 'note-9',
        authorId: 'user-mezzoforte',
        authorName: 'Mezzoforte Privilege',
        content: 'Grant contract executed and initial $150k tranche confirmed in commercial custody account. Milestones submitted.',
        createdAt: '2026-08-01T17:00:00Z',
        type: 'stage_change',
      },
    ],
    updatedAt: '2026-08-05T10:00:00Z',
    createdAt: '2026-05-10T11:00:00Z',
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact-aris-thorne',
    name: 'Dr. Aris Thorne',
    title: 'Chief Jury Evaluator',
    organization: 'Global Science & Innovation Council',
    email: 'awards@palladium-foundation.org',
    phone: '+44 20 7946 0912',
    type: 'grant_sponsor',
    status: 'evaluating',
    location: 'London, UK',
    space: 'CBDO workspace',
    assignedTo: 'user-mezzoforte',
    totalDealsValue: 350000,
    lastContacted: '2026-09-08',
    notes: 'Overseeing the $350k Palladium Science Award evaluation committee. Emphasized applicant founder pedigree and systemic infrastructure resilience.',
    tags: ['Science Award', 'Evaluator', 'High Prestige'],
    linkedinUrl: 'https://linkedin.com/in/aris-thorne-science',
  },
  {
    id: 'contact-vivienne',
    name: 'Vivienne De Vries',
    title: 'General Partner',
    organization: 'Meridian Apex Capital',
    email: 'v.devries@meridianapex.com',
    phone: '+1 (415) 890-3412',
    type: 'investor',
    status: 'negotiating',
    location: 'San Francisco, CA',
    space: 'CBDO workspace',
    assignedTo: 'user-christopher',
    totalDealsValue: 1200000,
    lastContacted: '2026-09-14',
    notes: 'Lead institutional partner for Series A. Strong conviction on sovereign digital payment corridors.',
    tags: ['Series A', 'Lead Partner', 'Master Investor List'],
    linkedinUrl: 'https://linkedin.com/in/vivienne-devries-vc',
  },
  {
    id: 'contact-marcus',
    name: 'Marcus Sterling',
    title: 'Executive VP Fintech Strategy',
    organization: 'Trans-Atlantic Settlement Consortium',
    email: 'm.sterling@tas-consortium.com',
    phone: '+1 (212) 555-0198',
    type: 'enterprise_client',
    status: 'evaluating',
    location: 'New York, NY',
    space: 'Sovereign Command',
    assignedTo: 'user-pascaline',
    totalDealsValue: 480000,
    lastContacted: '2026-09-10',
    notes: 'Primary counterparty for Priv Pay enterprise commercial licensing. Reviewed testnet throughput with Mohammed Kabir.',
    tags: ['Priv Pay', 'Fintech', 'Enterprise'],
    linkedinUrl: 'https://linkedin.com/in/marcus-sterling-fintech',
  },
  {
    id: 'contact-nadia',
    name: 'Nadia El-Sayed',
    title: 'Managing Director',
    organization: 'Swell Comms Global',
    email: 'nadia@swellprcomms.com',
    phone: '+971 4 392 1100',
    type: 'strategic_partner',
    status: 'active',
    location: 'Dubai, UAE',
    space: 'PR & Comms',
    assignedTo: 'user-mezzoforte',
    totalDealsValue: 125000,
    lastContacted: '2026-09-11',
    notes: 'Strategic PR & corporate narrative agency. Coordinating international distribution for Sans Mercantile Sovereign announcements.',
    tags: ['PR Agency', 'Media Syndication'],
  },
  {
    id: 'contact-tendai',
    name: 'Tendai Ndlovu',
    title: 'Group Chief Financial Officer',
    organization: 'Mpeti Safari & Luxury Holdings',
    email: 'tendai.n@mpetiholdings.co.za',
    phone: '+27 11 883 4000',
    type: 'enterprise_client',
    status: 'negotiating',
    location: 'Johannesburg, South Africa',
    space: 'Mpeti',
    assignedTo: 'user-pascaline',
    totalDealsValue: 190000,
    lastContacted: '2026-09-07',
    notes: 'Direct sponsor for Mpeti estate POS upgrade. Requires custom API endpoints for real-time forex recon.',
    tags: ['Hospitality', 'South Africa', 'Mpeti Space'],
  },
  {
    id: 'contact-jamaine',
    name: 'Jamaine Brooks',
    title: 'Founder & Head of A&R',
    organization: 'CrazyJam Entertainment Ltd',
    email: 'jamaine@crazyjam.fm',
    phone: '+1 (310) 998-2130',
    type: 'strategic_partner',
    status: 'active',
    location: 'Los Angeles, CA',
    space: 'CrazyJam Records',
    assignedTo: 'user-christopher',
    totalDealsValue: 310000,
    lastContacted: '2026-08-29',
    notes: 'Managing partner for independent music catalogs on CrazyJam. Seeking automated split disbursement rail.',
    tags: ['Music Tech', 'CrazyJam', 'Royalty Engine'],
  },
  {
    id: 'contact-amina',
    name: 'Amina Mansour',
    title: 'Portfolio Director',
    organization: 'African Innovation Catalyst Fund',
    email: 'a.mansour@africancatalyst.org',
    phone: '+254 20 762 1234',
    type: 'grant_sponsor',
    status: 'portfolio',
    location: 'Nairobi, Kenya',
    space: 'Sovereign Command',
    assignedTo: 'user-mezzoforte',
    totalDealsValue: 150000,
    lastContacted: '2026-08-25',
    notes: 'Awarded Sans Mercantile $150K sovereign tech infrastructure grant. Interested in follow-on matching funding.',
    tags: ['Grant Completed', 'Sovereign Command'],
  },
];

export const INITIAL_INBOX_ITEMS: InboxItem[] = [
  {
    id: 'inbox-1',
    category: 'primary',
    title: 'Priv Pay Launch Milestone Update',
    snippet: 'Pascaline Khoza set start date to Sep 4. Target release validation for live merchant settlement.',
    senderName: 'Pascaline Khoza',
    senderRole: 'VP Operations',
    date: 'Sep 2',
    relatedSpace: 'Sovereign Command',
    unread: true,
    actionRequired: true,
    actionType: 'milestone',
    associatedDealId: 'deal-priv-pay-commercial',
  },
  {
    id: 'inbox-2',
    category: 'primary',
    title: 'Lead: Palladium Global Science Award 2026 — $350K Prize',
    snippet: '@Mezzoforte Privilege i think you should do this application, its more about you than Sans from what i can see, they require your CV etc.',
    senderName: 'Christopher Maddison',
    senderRole: 'CBDO',
    date: 'Jul 30',
    relatedSpace: 'CBDO workspace',
    unread: false,
    actionRequired: true,
    actionType: 'review_lead',
    associatedDealId: 'deal-palladium-award',
  },
  {
    id: 'inbox-3',
    category: 'primary',
    title: 'Create brand kit task assignment',
    snippet: 'Pascaline Khoza assigned this task to you: Finalize typography, hex palette, and vector emblems for Swell PR comms.',
    senderName: 'Pascaline Khoza',
    senderRole: 'VP Operations',
    date: 'Aug 24',
    relatedSpace: 'PR & Comms',
    unread: false,
    actionRequired: true,
    actionType: 'task_assigned',
    associatedDealId: 'deal-swell-pr',
  },
  {
    id: 'inbox-4',
    category: 'primary',
    title: 'Weekly sync - 08/13/2026 Notes Generated',
    snippet: 'Meeting notes for Weekly sync - 08/13/2026 have been created and attached to CBDO Dealflow ledger.',
    senderName: 'Mezzoforte Privilege',
    senderRole: 'Executive Command',
    date: 'Aug 13',
    relatedSpace: 'CBDO workspace',
    unread: false,
    actionRequired: false,
    actionType: 'sync_notes',
  },
  {
    id: 'inbox-5',
    category: 'primary',
    title: 'Weekly Sync — Mohammed Kabir - 08/06/2026',
    snippet: 'Meeting notes for Weekly Sync — Mohammed Kabir - 08/06/2026: Azure MQTT testnet passed with 99.98% uptime.',
    senderName: 'Mohammed Kabir',
    senderRole: 'Head of Infra',
    date: 'Aug 6',
    relatedSpace: 'Sovereign Command',
    unread: false,
    actionRequired: false,
    actionType: 'sync_notes',
    associatedDealId: 'deal-azure-mqtt',
  },
  {
    id: 'inbox-6',
    category: 'primary',
    title: 'Reminder: Azure priv-infra-testing migration',
    snippet: 'Check if Mohammed confirmed the priv-infra-testing migration (repo move + cert regen + Nexus fork cleanup).',
    senderName: 'System Bot',
    senderRole: 'Automation',
    date: 'Jul 31',
    relatedSpace: 'Sovereign Command',
    unread: false,
    actionRequired: true,
    actionType: 'reminder',
  },
  {
    id: 'inbox-7',
    category: 'other',
    title: '[PRACTICAL] Deploy a live MQTT broker on Azure and validate PRIV com...',
    snippet: 'Mohammed Kabir reacted to your comment: TASK COMPLETE — PRIV Live MQTT Broker Deployment verified on EMEA West.',
    senderName: 'Mohammed Kabir',
    senderRole: 'Head of Infra',
    date: 'Jul 30',
    relatedSpace: 'Sovereign Command',
    unread: false,
    actionRequired: false,
    actionType: 'reminder',
  },
  {
    id: 'inbox-8',
    category: 'other',
    title: 'Weekly Sync — Christopher Maddison - 07/09/2026',
    snippet: 'Meeting notes for Weekly Sync — Christopher Maddison - 07/09/2026: Master Investor List reviewed for Series A syndicate.',
    senderName: 'Christopher Maddison',
    senderRole: 'CBDO',
    date: 'Jul 9',
    relatedSpace: 'CBDO workspace',
    unread: false,
    actionRequired: false,
    actionType: 'sync_notes',
    associatedDealId: 'deal-series-a-meridian',
  },
];

export const INITIAL_MEETINGS: MeetingSync[] = [
  {
    id: 'meeting-priv-pay-launch',
    title: 'Priv Pay Launch Operations Go/No-Go',
    date: '2026-09-18',
    time: '09:00 AM',
    durationMinutes: 60,
    attendees: ['user-mezzoforte', 'user-pascaline', 'user-mohammed'],
    space: 'Sovereign Command',
    locationOrLink: 'https://app.chime.aws/meetings/smo-privpay-ops',
    status: 'upcoming',
    agendaNotes: 'Review payment processor gateway cutover, liquidity balancing reserve, and fallback SMS alerts.',
    keyActionItems: [
      'Final verification of Azure MQTT transaction listener',
      'Confirm customer support escalation routing with Pascaline',
    ],
  },
  {
    id: 'meeting-weekly-christopher',
    title: 'Weekly Sync — Christopher Maddison (CBDO)',
    date: '2026-09-17',
    time: '12:00 PM',
    durationMinutes: 45,
    attendees: ['user-mezzoforte', 'user-christopher'],
    space: 'CBDO workspace',
    locationOrLink: 'https://app.chime.aws/meetings/smo-cbdo-sync',
    status: 'upcoming',
    agendaNotes: 'Palladium Global Science Award ($350k) stage 2 submission check + Series A Meridian Apex term sheet commentary.',
    keyActionItems: [
      'Review revised CV and technical prospectus for Palladium Jury',
      'Address Meridian valuation cap clause',
    ],
  },
  {
    id: 'meeting-weekly-mohammed',
    title: 'Weekly Sync — Mohammed Kabir (Infra & Azure)',
    date: '2026-09-18',
    time: '10:00 AM',
    durationMinutes: 45,
    attendees: ['user-mezzoforte', 'user-mohammed'],
    space: 'Sovereign Command',
    locationOrLink: 'https://app.chime.aws/meetings/smo-infra-azure',
    status: 'upcoming',
    agendaNotes: 'priv-infra-testing migration verification, cert regen, and Nexus fork cleanup status.',
    keyActionItems: [
      'Confirm TLS 1.3 cert expiration window',
      'Benchmark load test at 500k telemetry events/min',
    ],
  },
  {
    id: 'meeting-syncup-pascaline',
    title: 'SyncUp: Brand Kit & Swell PR Rollout',
    date: '2026-09-19',
    time: '02:00 PM',
    durationMinutes: 30,
    attendees: ['user-mezzoforte', 'user-pascaline'],
    space: 'PR & Comms',
    locationOrLink: 'https://app.chime.aws/meetings/smo-pr-brand',
    status: 'upcoming',
    agendaNotes: 'Final approval of Sans Mercantile brand kit, typography standards, and press release distribution to Swell PR.',
    keyActionItems: [
      'Sign off on brand assets package',
      'Authorize Nadia El-Sayed to schedule embargoed release',
    ],
  },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-master-investor-list',
    title: 'Sans Mercantile — Master Investor List',
    space: 'CBDO workspace',
    category: 'Investor List',
    updatedAt: '2026-08-07',
    lastViewedAt: '2026-09-11',
    author: 'Christopher Maddison',
    isStarred: true,
    contentMarkdown: `# Sans Mercantile — Master Investor List
**Workspace:** CBDO workspace  
**Maintained by:** Christopher Maddison (CBDO) & Mezzoforte Privilege  
**Status:** Active Q3-Q4 2026 Syndicate Outreach

---

## 1. Top Tier Institutional Leads

### Meridian Apex Capital (San Francisco / London)
- **Primary Contact:** Vivienne De Vries (General Partner)
- **Target Allocation:** $1,200,000 (Lead Investor)
- **Focus:** Sovereign settlement rails, decentralized cross-border liquidity
- **Current Stage:** Term Sheet in negotiation
- **Notes:** High diligence score (87/100). Approved data room access.

### African Innovation Catalyst Fund (Nairobi)
- **Primary Contact:** Amina Mansour (Portfolio Director)
- **Status:** Closed / Disbursed ($150,000 non-dilutive grant)
- **Follow-on Appetite:** Up to $500,000 co-investment alongside lead VC.

---

## 2. Strategic Corporate & Grant Opportunities

### Palladium Global Science Award 2026
- **Grant Value:** $350,000 Cash Prize
- **Evaluation Jury Lead:** Dr. Aris Thorne
- **Deadline:** Mid-October 2026
- **Strategic Angle:** Highlight Mezzoforte Privilege leadership, architectural resilience of Sans Mercantile Sovereign Command platform.

---

## 3. High Net-Worth & Strategic Angels
- **Marcus Sterling** (Fintech Consortium VP) - Commercial pilot integration
- **Jamaine Brooks** (CrazyJam Records) - Media & entertainment royalty disbursement`,
  },
  {
    id: 'doc-lead-scoring-rubric',
    title: 'Lead Scoring Rubric (Series A & Global Grants)',
    space: 'CBDO workspace',
    category: 'Rubric',
    updatedAt: '2026-08-15',
    lastViewedAt: '2026-09-12',
    author: 'Christopher Maddison',
    isStarred: true,
    contentMarkdown: `# Lead Scoring Rubric — Sans Mercantile Operations

This rubric standardizes how the CBDO workspace and Sovereign Command evaluate venture partners, grants, and enterprise contracts.

| Dimension | Max Score | Key Criteria |
| :--- | :--- | :--- |
| **Strategic Alignment** | 25 pts | Does the partner accelerate our sovereign settlement rail or Priv Pay rollout? |
| **Financial Scale** | 25 pts | Check size > $250k, clear valuation tolerance, speed of capital disbursement. |
| **Network Leverage** | 25 pts | Direct access to tier-1 banking rails, institutional regulatory coverage. |
| **Diligence Speed** | 25 pts | Fast-track diligence pipeline, minimal bureaucratic friction (< 45 days). |

### Composite Tier Classification:
- **Tier 1 (90 - 100):** Immediate priority execution (Assign to Mezzoforte Privilege / Christopher Maddison).
- **Tier 2 (75 - 89):** High probability deal flow (Active pipeline, weekly sync reviews).
- **Tier 3 (50 - 74):** Standard evaluation queue.
- **Tier 4 (< 50):** Pass / Defer to newsletter or automated updates.`,
  },
  {
    id: 'doc-priv-pay-memo',
    title: 'Investor Memo Master — Priv Pay Fintech Rail',
    space: 'Sovereign Command',
    category: 'Memo',
    updatedAt: '2026-09-02',
    lastViewedAt: '2026-09-14',
    author: 'Pascaline Khoza',
    isStarred: false,
    contentMarkdown: `# Investor Memo: Priv Pay Architecture & Market Opportunity

**Author:** Pascaline Khoza & Mohammed Kabir  
**Executive Sponsor:** Mezzoforte Privilege  
**Date:** September 2026  

---

### Executive Summary
Priv Pay is Sans Mercantile's proprietary sovereign settlement protocol designed to eliminate 3-5 day cross-border clearing delays for high-value commerce and enterprise royalties.

### Key Metrics:
- **Azure MQTT Broker Throughput:** 250,000 msgs/sec at 14ms latency.
- **Initial Launch Date:** September 4, 2026.
- **Launch Partners:** Trans-Atlantic Settlement Consortium, Mpeti Luxury Group, CrazyJam Entertainment.`,
  },
  {
    id: 'doc-swell-pr-guide',
    title: 'Swell PR & Comms — ClickUp Onboarding & Media Guide',
    space: 'PR & Comms',
    category: 'Guide',
    updatedAt: '2026-07-20',
    lastViewedAt: '2026-08-09',
    author: 'Pascaline Khoza',
    isStarred: false,
    contentMarkdown: `# Swell PR & Comms — Media Syndication Standard

Guidelines for coordinating external press releases and executive messaging across Sans Mercantile Sovereign Command:
1. **Brand Kit Adherence:** Ensure all media advisories use official Sans Mercantile typography, deep obsidian & emerald accents.
2. **Approval Chain:** All press releases require sign-off from Mezzoforte Privilege and Pascaline Khoza.
3. **Embargo Protocols:** 48-hour embargo notice for institutional tech outlets.`,
  },
];
