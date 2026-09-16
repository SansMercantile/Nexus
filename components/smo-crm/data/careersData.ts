import { JobPosting, CandidateApplication } from '../types';

export const INITIAL_JOB_POSTINGS: JobPosting[] = [
  {
    id: 'job-azure-architect',
    title: 'Senior Azure Cloud & Rails Architect',
    department: 'dev',
    location: 'Remote / London / Dubai (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Staff / Principal (7+ years)',
    description: 'Lead the architecture, automated deployment, and high-throughput security of Sans Mercantile sovereign payment rails and Azure Kubernetes clusters.',
    responsibilities: [
      'Architect resilient Azure infrastructure supporting 20,000+ TPS for Priv Pay settlement.',
      'Maintain automated Terraform / Bicep IaC modules, Azure Key Vault HSM keys, and zero-trust policies.',
      'Work alongside Head of Dev Mohammed Kabir on core microservices and telemetry observability.',
      'Lead technical vetting for junior engineering squads.'
    ],
    requirements: [
      '7+ years experience in high-availability cloud architecture (Azure preferred, AWS considered).',
      'Deep mastery of Kubernetes (AKS), Docker, Terraform, Azure Service Bus, and Event Grid.',
      'Hands-on experience with financial-grade security (PCI-DSS, SOC2, cryptographic key management).',
      'Solid command of Go, TypeScript, or C# for low-latency backend microservices.'
    ],
    isActive: true,
    openings: 2,
    targetClosingDate: '2026-10-30',
  },
  {
    id: 'job-pr-comms-head',
    title: 'Head of PR & Global Media Strategy (Swell Agency)',
    department: 'communications',
    location: 'Remote / Cape Town / London',
    type: 'Full-time',
    experienceLevel: 'Director / Lead (6+ years)',
    description: 'Spearhead institutional PR syndication, global media relationships, and sovereign narrative positioning in partnership with Pascaline Khoza and Swell Agency.',
    responsibilities: [
      'Design and execute tier-1 press rollout for Priv Pay Commercial Launch and $350K Palladium Science Award.',
      'Direct Swell Agency creative contractors on brand messaging, executive ghostwriting, and keynote briefs.',
      'Maintain active syndication lines with Bloomberg, Financial Times, TechCrunch, and Semafor.',
      'Manage crisis communications protocols and reactive press engagements.'
    ],
    requirements: [
      'Proven track record leading media campaigns for sovereign funds, fintechs, or tier-1 tech ventures.',
      'Direct personal relationships with leading business, financial, and tech journalists globally.',
      'Exceptional narrative synthesis and executive-level written & verbal presentation skills.',
      'Experience managing PR agency retainers and cross-functional brand roadmaps.'
    ],
    isActive: true,
    openings: 1,
    targetClosingDate: '2026-10-15',
  },
  {
    id: 'job-fintech-crypto-engineer',
    title: 'Fintech Cryptographic Protocol Engineer',
    department: 'dev',
    location: 'Remote / Zurich / London',
    type: 'Full-time',
    experienceLevel: 'Senior (5+ years)',
    description: 'Design and implement cryptographic verification layers, secure multi-party computation protocols, and sovereign audit pipelines.',
    responsibilities: [
      'Implement zero-knowledge cryptographic verification routines for Priv Pay private rails.',
      'Audit cryptographic primitives and coordinate external smart contract & protocol audits.',
      'Optimize transaction verification speed and client-side encryption modules.'
    ],
    requirements: [
      '5+ years experience in applied cryptography, blockchain protocols, or high-security banking rails.',
      'Mastery of Rust, C++, or Go with formal verification experience.',
      'Deep understanding of elliptic curve cryptography, zk-SNARKs, and MPC.'
    ],
    isActive: true,
    openings: 1,
    targetClosingDate: '2026-11-15',
  },
  {
    id: 'job-deal-sourcing-analyst',
    title: 'Sovereign Deal Sourcing & Investor Relations Associate',
    department: 'cbdo',
    location: 'London / Dubai / New York',
    type: 'Full-time',
    experienceLevel: 'Mid-Senior (3-5 years)',
    description: 'Partner with CBDO Christopher Maddison to manage institutional syndicate relationships, conduct quantitative due diligence, and evaluate sovereign coinvestment.',
    responsibilities: [
      'Screen prospective sovereign wealth funds, family offices, and tech VC syndicates.',
      'Build comprehensive financial valuation models and due diligence dossiers.',
      'Coordinate investor pitch briefings and quarterly syndicate reporting.'
    ],
    requirements: [
      '3-5 years experience in investment banking, venture capital, or private equity.',
      'Financial modeling proficiency (DCF, LBO, venture cap tables).',
      'Outstanding stakeholder presentation skills and cross-border deal execution.'
    ],
    isActive: true,
    openings: 2,
    targetClosingDate: '2026-10-25',
  },
];

export const INITIAL_CANDIDATE_APPLICATIONS: CandidateApplication[] = [
  {
    id: 'cand-tariq-almansoor',
    candidateName: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@almansoor-cloud.io',
    phone: '+44 7700 900821',
    location: 'London, United Kingdom',
    portfolioUrl: 'https://github.com/tariq-almansoor/azure-distributed-core',
    linkedInUrl: 'https://linkedin.com/in/tariq-almansoor-cloud',
    gitHubUrl: 'https://github.com/tariq-almansoor',
    jobId: 'job-azure-architect',
    jobTitle: 'Senior Azure Cloud & Rails Architect',
    department: 'dev',
    stage: 'shortlisted',
    appliedDate: '2026-09-08',
    tags: ['Top 2%', 'Azure Certified Principal', 'High Scale 25k TPS', 'Dev Recommended'],
    documents: {
      resumeName: 'Tariq_AlMansoor_Principal_Cloud_Architect_CV.pdf',
      resumeUrl: '#',
      resumeSize: '2.4 MB',
      resumeTextContent: `TARIQ AL-MANSOOR - PRINCIPAL CLOUD & DEVOPS ARCHITECT
Email: tariq.mansoor@almansoor-cloud.io | Phone: +44 7700 900821 | London, UK
GitHub: github.com/tariq-almansoor | LinkedIn: linkedin.com/in/tariq-almansoor-cloud

EXECUTIVE SUMMARY
Distinguished Infrastructure Architect with 9+ years architecting enterprise-grade cloud systems across Azure, AWS, and bare-metal HPC clusters. Led infrastructure transformations for Tier-1 FinTechs handling $4.2B in annualized transactional volume. Specialized in zero-trust Azure architecture, AKS hardening, and event-driven microservices.

PROFESSIONAL EXPERIENCE
• Lead Azure Infrastructure Architect | Revolut Wealth Services (2022 - Present)
  - Architected multi-region active-active AKS clusters across UK South & North Europe with 99.995% uptime SLA.
  - Reduced cold failover recovery time from 4.5 minutes to under 8 seconds using Azure Traffic Manager & Event Hub.
  - Automated 100% of infrastructure provisioning via modular Terraform and Azure DevOps CI/CD pipelines.

• Senior Cloud Systems Engineer | Barclays International Banking (2018 - 2022)
  - Built PCI-DSS Level 1 compliant financial settlement gateway processing 18,000 TPS.
  - Configured Azure Key Vault Hardware Security Modules (HSMs) for automated symmetric key rotation.

EDUCATION & CERTIFICATIONS
• M.Sc. in Distributed Systems & Cyber Security - Imperial College London (First Class Hons)
• Microsoft Certified: Azure Solutions Architect Expert (AZ-305)
• HashiCorp Certified: Terraform Associate`,
      coverLetter: 'I have followed the sovereign architecture and Priv Pay rails developed by Sans Mercantile with great admiration. Having engineered resilient multi-region Azure fabrics processing tens of thousands of transactions per second, I am eager to partner with Mohammed Kabir and sovereign leadership to establish the most secure and performant rail in the industry.',
    },
    aiVetting: {
      score: 96,
      technicalSkillsScore: 98,
      domainAlignmentScore: 95,
      experienceDepthScore: 96,
      communicationScore: 94,
      recommendation: 'Strongly Shortlist',
      keyStrengths: [
        'Demonstrated hands-on experience scaling Azure Kubernetes (AKS) to 18,000+ TPS under strict PCI-DSS constraints.',
        'Imperial College M.Sc. in Distributed Systems with verified Microsoft Azure Solutions Architect Expert certification.',
        'Extensive expertise in Azure Key Vault HSM rotation matching Mohammed Kabir’s security spec.'
      ],
      considerationsAndGaps: [
        'Notice period is 30 days; recommend expedited founder conversation with Mezzoforte Privilege to secure early start date.'
      ],
      summary: 'Candidate Tariq Al-Mansoor is an exceptional match (96/100) for the Senior Azure Cloud & Rails Architect position. His deep domain knowledge in financial-grade Azure infrastructure, automated Terraform modules, and active-active clustering directly addresses Mohammed Kabir’s immediate infrastructure scaling roadmap.',
      vettedAt: '2026-09-08T14:15:00Z',
    },
    aiTestBattery: {
      testId: 'test-dev-azure-01',
      testName: 'Azure Priv Pay Infrastructure, AKS & High-TPS Resilience Battery',
      department: 'dev',
      status: 'completed',
      dispatchedAt: '2026-09-09T09:00:00Z',
      completedAt: '2026-09-09T11:45:00Z',
      score: 95,
      passingScore: 80,
      aiTestSummary: 'Flawless architectural rationale. Candidate demonstrated production-level code in Terraform configuration and accurately diagnosed an orchestrated network partition scenario.',
      questions: [
        {
          id: 'q1',
          question: 'Design a zero-downtime multi-region active-active settlement rail on Azure connecting EMEA West and North Europe.',
          candidateAnswer: 'I would deploy dual AKS clusters backed by Azure Cosmos DB multi-region writes with Session consistency or Azure SQL Hyperscale geo-replicas. Ingress routing handled via Azure Front Door with health probes checking endpoint TCP latency. For telemetry and event messaging, an Azure Event Hubs geo-pair with auto-inflate and partition affinity guarantees ordered transaction delivery without message loss during regional outages.',
          maxPoints: 50,
          awardedPoints: 48,
          aiGradingNotes: 'Exceptional clarity. Correctly addresses geo-replication latency vs consistency trade-offs, health probe tuning, and Event Hub partitioning.',
        },
        {
          id: 'q2',
          question: 'Provide a secure strategy for automated HSM key rotation in Azure Key Vault without invalidating in-flight payment signatures.',
          candidateAnswer: 'Implement key versioning: when a new key is minted via Azure Managed HSM, update the cryptographic service config with both KeyVersion_Current and KeyVersion_Previous. In-flight settlement batches decode with the previous version until an epoch acknowledgement is received from all worker nodes, after which the previous key is demoted to verify-only mode.',
          maxPoints: 50,
          awardedPoints: 47,
          aiGradingNotes: 'Superb dual-key epoch retirement pattern. Exactly matches banking-grade protocol specifications.',
        },
      ],
    },
    aiVideoInterview: {
      interviewId: 'ai-int-tariq-01',
      status: 'completed',
      scheduledAt: '2026-09-10T14:00:00Z',
      recordedAt: '2026-09-10T14:30:00Z',
      durationMinutes: 18,
      videoAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      overallScore: 94,
      metrics: {
        technicalPrecision: 97,
        clarityAndArticulation: 95,
        strategicThinking: 92,
        executiveComposure: 94,
      },
      questions: [
        {
          id: 'v-q1',
          prompt: 'Walk us through how you would architect the Azure Priv Pay cluster to withstand DDoS attacks while maintaining sub-50ms latency.',
          durationSeconds: 195,
          timestampStart: '00:00',
          candidateTranscript: 'In high-throughput sovereign rails, edge filtering is paramount. I place Azure DDoS Network Protection at the virtual network level paired with Azure Front Door Web Application Firewall rules enforcing token rate limiting. Inside the cluster, Istio service mesh enforces mutual TLS (mTLS) with strict cipher suites, eliminating lateral vulnerability if an outer pod is probed.',
          metricScore: 96,
          feedback: 'Laser-focused response with concrete technical nomenclature (mTLS, Istio, rate-limiting policies).',
        },
        {
          id: 'v-q2',
          prompt: 'How do you coordinate with non-technical departments like PR/Communications (Swell) and Business Development when technical milestones shift?',
          durationSeconds: 160,
          timestampStart: '03:15',
          candidateTranscript: 'Clear transparency is non-negotiable. I convert technical benchmarks into functional readiness criteria. If an integration takes 48 hours longer to satisfy SOC2 compliance, I brief Comms early so press embargoes are calibrated without friction, and provide CBDO with accurate partner onboarding schedules.',
          metricScore: 93,
          feedback: 'High emotional intelligence; understands cross-departmental impact on PR and investor relations.',
        },
      ],
      aiExecutiveSummary: 'Tariq Al-Mansoor demonstrated commanding technical poise throughout the AI video interview. His answers exhibited deep architectural fluency, natural leadership presence, and clear cross-departmental coordination awareness.',
      aiFlaggedHighlights: [
        'Spontaneous architectural diagramming explanation was crisp and rigorous.',
        'High linguistic clarity, zero hedging on distributed consensus principles.',
        'Ready for immediate hire recommendation.'
      ],
    },
    departmentReviews: [
      {
        id: 'rev-1',
        reviewerId: 'user-mohammed',
        reviewerName: 'Mohammed Kabir',
        reviewerRole: 'Head of Dev & Infrastructure (Azure Cloud)',
        department: 'dev',
        score: 5,
        notes: 'I reviewed Tariq’s test answers and his video interview clip on AKS failover. His approach to dual HSM key rotation is exactly what we need for Priv Pay. We should offer him the Senior Cloud Architect role immediately.',
        decision: 'approve',
        reviewedAt: '2026-09-11T16:20:00Z',
      },
    ],
  },
  {
    id: 'cand-elena-vance',
    candidateName: 'Elena Vance',
    email: 'elena.vance@vancemedia.co.uk',
    phone: '+44 7911 123456',
    location: 'Cape Town / London (Remote)',
    portfolioUrl: 'https://vancemedia.co.uk/portfolio-sovereign-pr',
    linkedInUrl: 'https://linkedin.com/in/elena-vance-pr',
    jobId: 'job-pr-comms-head',
    jobTitle: 'Head of PR & Global Media Strategy (Swell Agency)',
    department: 'communications',
    stage: 'shortlisted',
    appliedDate: '2026-09-10',
    tags: ['Tier-1 Media Rolodex', 'Ex-Edelman VP', 'Fintech Narrative Lead', 'Swell Approved'],
    documents: {
      resumeName: 'Elena_Vance_Director_Comms_Strategy_2026.pdf',
      resumeUrl: '#',
      resumeSize: '1.8 MB',
      resumeTextContent: `ELENA VANCE - HEAD OF GLOBAL COMMUNICATIONS & MEDIA STRATEGY
Email: elena.vance@vancemedia.co.uk | London & Cape Town | LinkedIn: linkedin.com/in/elena-vance-pr

CAREER HIGHLIGHTS
Strategic communications leader with 8+ years steering brand positioning, press strategy, and media syndication for high-growth fintechs and sovereign asset management firms. Extensive track record securing front-page features across Financial Times, Bloomberg Markets, WSJ, and CoinDesk.

EXPERIENCE
• Director of Strategic Communications | Apex Global Fintech (2021 - 2026)
  - Designed and led the global announcement of Apex’s $250M cross-border liquidity facility.
  - Managed 14 PR agency partners across EMEA, APAC, and North America.
  - Delivered 320+ earned media placements in 18 months with 84% positive sentiment score.

• Associate Vice President | Edelman Corporate & Tech Practice (2018 - 2021)
  - Led media relations and executive profiling for premier sovereign wealth entities and venture capital funds.
  - Drafted keynote speeches and op-eds published in World Economic Forum Agenda and Forbes.

EDUCATION
• B.A. (Hons) in Media & International Relations - University of Oxford`,
      coverLetter: 'Having followed the sovereign launch of Sans Mercantile and the distinctive positioning crafted by Pascaline Khoza at Swell Agency, I am enthusiastic about applying my global media network to elevate Priv Pay and the $350K Palladium Science Award into international headlines.',
    },
    aiVetting: {
      score: 94,
      technicalSkillsScore: 92,
      domainAlignmentScore: 96,
      experienceDepthScore: 95,
      communicationScore: 98,
      recommendation: 'Strongly Shortlist',
      keyStrengths: [
        'Extensive personal relationships with senior editors at Bloomberg, Financial Times, and TechCrunch.',
        'Direct experience collaborating with creative agency teams like Swell on multi-channel narratives.',
        'Elite written articulation with proven experience managing crisis communications for high-profile financial launches.'
      ],
      considerationsAndGaps: [
        'Split time between London and Cape Town; fully comfortable with remote asynchronous workflows.'
      ],
      summary: 'Elena Vance is an ideal candidate (94/100) for Head of PR & Global Media Strategy. Her elite media rolodex and executive ghostwriting ability align seamlessly with Pascaline Khoza’s Swell Agency roadmap.',
      vettedAt: '2026-09-10T16:00:00Z',
    },
    aiTestBattery: {
      testId: 'test-comms-01',
      testName: 'Swell Agency Brand Synthesis & Tier-1 Media Pitch Test',
      department: 'communications',
      status: 'completed',
      dispatchedAt: '2026-09-11T10:00:00Z',
      completedAt: '2026-09-11T12:30:00Z',
      score: 96,
      passingScore: 80,
      aiTestSummary: 'Brilliant press wire composition and sharp strategic intuition regarding embargo sequencing and sovereign messaging.',
      questions: [
        {
          id: 'q1',
          question: 'Draft a 150-word embargoed pitch to a Senior Financial Times technology editor for the Sans Mercantile Priv Pay rollout.',
          candidateAnswer: 'Subject: Embargoed / Exclusive: Sovereign rail Sans Mercantile uncloaks Priv Pay commercial settlement\n\nDear [Editor Name], Ahead of public release on Sep 4, I want to offer the FT an exclusive first look at Sans Mercantile’s sovereign Priv Pay commercial rail. Built on enterprise Azure architecture, Priv Pay is bridging sovereign capital and commercial settlement with zero third-party custodial risk. Managing Principal Mezzoforte Privilege and Head of Infrastructure Mohammed Kabir are available for an exclusive preview this Thursday under embargo. Would you like to review the technical briefing memo?',
          maxPoints: 50,
          awardedPoints: 49,
          aiGradingNotes: 'Punchy, executive, respect of journalistic norms, clear value proposition with zero corporate jargon.',
        },
      ],
    },
    aiVideoInterview: {
      interviewId: 'ai-int-elena-01',
      status: 'completed',
      scheduledAt: '2026-09-12T11:00:00Z',
      recordedAt: '2026-09-12T11:25:00Z',
      durationMinutes: 15,
      videoAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      overallScore: 96,
      metrics: {
        technicalPrecision: 92,
        clarityAndArticulation: 99,
        strategicThinking: 97,
        executiveComposure: 98,
      },
      questions: [
        {
          id: 'v-q1',
          prompt: 'How would you position Sans Mercantile in contrast to legacy venture-backed fintechs?',
          durationSeconds: 180,
          timestampStart: '00:00',
          candidateTranscript: 'Sans Mercantile is not chasing speculative retail hype; it is a sovereign infrastructure enterprise built on enduring institutional resilience. We position the company as the premier private clearing house where sovereign capital meets industrial execution. This framing protects pricing power and commands respect with tier-1 financial press.',
          metricScore: 98,
          feedback: 'Inspiring strategic poise, pristine tone, and profound grasp of sovereign brand identity.',
        },
      ],
      aiExecutiveSummary: 'Elena Vance exhibited master-class verbal eloquence and strategic sharpness throughout her AI video assessment. Her ability to synthesize complex sovereign rails into compelling headlines is world-class.',
      aiFlaggedHighlights: [
        'Top 1% score in clarity and articulation.',
        'Directly aligned with Swell Agency narrative standards.',
        'Recommended for final founder chat.'
      ],
    },
    departmentReviews: [
      {
        id: 'rev-2',
        reviewerId: 'user-pascaline',
        reviewerName: 'Pascaline Khoza',
        reviewerRole: 'Head of Communications (Contracted: Swell)',
        department: 'communications',
        score: 5,
        notes: 'Elena is stellar. She understands Swell’s visual and linguistic ethos, has real relationships with FT and Bloomberg, and passed the test with 96%. I fully approve bringing her onboard.',
        decision: 'approve',
        reviewedAt: '2026-09-13T09:15:00Z',
      },
    ],
  },
  {
    id: 'cand-marcus-zhao',
    candidateName: 'Marcus Zhao',
    email: 'marcus.zhao@quantrail.tech',
    phone: '+65 9123 4567',
    location: 'Singapore (Remote / Relocation ok)',
    portfolioUrl: 'https://github.com/marcuszhao-crypto',
    linkedInUrl: 'https://linkedin.com/in/marcus-zhao-fintech',
    jobId: 'job-fintech-crypto-engineer',
    jobTitle: 'Fintech Cryptographic Protocol Engineer',
    department: 'dev',
    stage: 'interview_done',
    appliedDate: '2026-09-11',
    tags: ['Rust / C++', 'Zero-Knowledge Proofs', 'MPC Specialist'],
    documents: {
      resumeName: 'Marcus_Zhao_Cryptographic_Engineer.pdf',
      resumeUrl: '#',
      resumeSize: '1.2 MB',
      resumeTextContent: `MARCUS ZHAO - SENIOR CRYPTOGRAPHIC PROTOCOL ENGINEER
Email: marcus.zhao@quantrail.tech | Singapore | GitHub: github.com/marcuszhao-crypto

SUMMARY
Senior Cryptographic Engineer with 6 years developing zero-knowledge proof verifiers, threshold signature schemes, and ultra-low latency settlement engines in Rust and C++.

EXPERIENCE
• Senior Protocol Engineer | QuantRail Protocol Singapore (2022 - Present)
  - Implemented BLS threshold signature scheme processing 12,000 tx/sec with 12ms signature validation.
  - Authored formal verification proofs in Coq for cross-chain atomic settlement.

• Core Developer | ChainGuard Security (2019 - 2022)
  - Audited 24 cryptographic smart contracts securing over $800M in digital assets.`,
      coverLetter: 'I am excited by Sans Mercantile’s cryptographic sovereign settlement vision. My background in low-latency verification in Rust and multi-party computation fits directly with your high-throughput Priv Pay architecture.',
    },
    aiVetting: {
      score: 89,
      technicalSkillsScore: 94,
      domainAlignmentScore: 88,
      experienceDepthScore: 87,
      communicationScore: 86,
      recommendation: 'Shortlist for Technical Screen',
      keyStrengths: [
        'Deep Rust proficiency and formal cryptographic protocol verification.',
        'Extensive experience with threshold signatures and zero-knowledge primitives.',
        'Solid background in cryptographic security auditing.'
      ],
      considerationsAndGaps: [
        'Primary experience has been public blockchain protocols; will need onboarding to Azure enterprise hybrid architectures.'
      ],
      summary: 'Candidate Marcus Zhao is a strong technical candidate (89/100) with robust cryptographic verification skills. Recommended for technical interview review by Mohammed Kabir.',
      vettedAt: '2026-09-11T18:30:00Z',
    },
    aiTestBattery: {
      testId: 'test-crypto-01',
      testName: 'Cryptographic Primitives, MPC & Threshold Signatures Battery',
      department: 'dev',
      status: 'completed',
      dispatchedAt: '2026-09-12T08:00:00Z',
      completedAt: '2026-09-12T10:15:00Z',
      score: 91,
      passingScore: 80,
      aiTestSummary: 'Solid understanding of threshold signature mechanics and side-channel attack mitigations.',
      questions: [
        {
          id: 'q1',
          question: 'Explain how to prevent timing side-channel attacks during constant-time elliptic curve scalar multiplication.',
          candidateAnswer: 'Use constant-time arithmetic primitives such as Montgomery ladder or fixed-window scalar multiplication without data-dependent branches or secret-dependent table lookups. Ensure cache lines are pre-loaded to mitigate cache-timing leakage.',
          maxPoints: 50,
          awardedPoints: 46,
          aiGradingNotes: 'Accurate and comprehensive response covering constant-time execution and cache line pre-fetching.',
        },
      ],
    },
    aiVideoInterview: {
      interviewId: 'ai-int-marcus-01',
      status: 'completed',
      scheduledAt: '2026-09-13T10:00:00Z',
      recordedAt: '2026-09-13T10:20:00Z',
      durationMinutes: 14,
      videoAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      overallScore: 88,
      metrics: {
        technicalPrecision: 94,
        clarityAndArticulation: 86,
        strategicThinking: 85,
        executiveComposure: 88,
      },
      questions: [
        {
          id: 'v-q1',
          prompt: 'How do you balance cryptographic security margins with millisecond transaction confirmation constraints?',
          durationSeconds: 150,
          timestampStart: '00:00',
          candidateTranscript: 'We separate verification from settlement state finality. Signatures are verified asynchronously on dedicated worker pools with SIMD vector extensions, allowing the primary consensus sequencer to operate without cryptographic bottleneck.',
          metricScore: 89,
          feedback: 'Crisp technical solution utilizing SIMD vectorization.',
        },
      ],
      aiExecutiveSummary: 'Marcus demonstrated deep mathematical and protocol engineering capability. Highly competent in low-level Rust systems.',
      aiFlaggedHighlights: [
        'Strong cryptographic math foundation.',
        'Ready for final decision by Dev Head Mohammed Kabir.'
      ],
    },
    departmentReviews: [],
  },
  {
    id: 'cand-sophie-laurent',
    candidateName: 'Sophie Laurent',
    email: 'sophie.laurent@paris-invest.fr',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    portfolioUrl: 'https://linkedin.com/in/sophie-laurent-investor',
    linkedInUrl: 'https://linkedin.com/in/sophie-laurent-investor',
    jobId: 'job-deal-sourcing-analyst',
    jobTitle: 'Sovereign Deal Sourcing & Investor Relations Associate',
    department: 'cbdo',
    stage: 'tests_dispatched',
    appliedDate: '2026-09-13',
    tags: ['LBO & Venture Valuation', 'Paris / London Network', 'Ex-BNP Paribas'],
    documents: {
      resumeName: 'Sophie_Laurent_Investment_Banking_CV.pdf',
      resumeUrl: '#',
      resumeSize: '1.5 MB',
      resumeTextContent: `SOPHIE LAURENT - INVESTMENT ANALYST & DEAL SOURCING
Paris, France | sophie.laurent@paris-invest.fr | HEC Paris Graduate

EXPERIENCE
• Investment Banking Analyst (Tech M&A) | BNP Paribas CIB (2023 - Present)
  - Executed financial modeling and investor presentations for 5 cross-border European tech transactions.
  - Maintained syndicate investor mapping across 80+ sovereign wealth and private equity funds.

EDUCATION
• M.Sc. in International Finance - HEC Paris (Summa Cum Laude)`,
      coverLetter: 'I am drawn to Sans Mercantile’s innovative sovereign investor pipeline. My experience at BNP Paribas in tech syndicate transactions will allow me to directly support Christopher Maddison with investor term sheets and due diligence.',
    },
    aiVetting: {
      score: 87,
      technicalSkillsScore: 88,
      domainAlignmentScore: 90,
      experienceDepthScore: 84,
      communicationScore: 89,
      recommendation: 'Shortlist for Technical Screen',
      keyStrengths: [
        'Rigorous quantitative modeling background from BNP Paribas CIB.',
        'Fluency in English, French, and German for European sovereign syndicate outreach.',
        'HEC Paris Summa Cum Laude in International Finance.'
      ],
      considerationsAndGaps: [
        'Early in career (3 years experience); highly energetic and technically adept.'
      ],
      summary: 'Sophie Laurent is a high-potential deal analyst (87/100). Test battery dispatched to evaluate cap table structuring and valuation methodology.',
      vettedAt: '2026-09-13T19:00:00Z',
    },
    aiTestBattery: {
      testId: 'test-cbdo-01',
      testName: 'Sovereign Deal Valuation & Syndicate Cap Table Modeling Test',
      department: 'cbdo',
      status: 'in_progress',
      dispatchedAt: '2026-09-14T10:00:00Z',
      passingScore: 80,
      questions: [],
    },
    aiVideoInterview: {
      interviewId: 'ai-int-sophie-01',
      status: 'pending',
      scheduledAt: '2026-09-16T14:00:00Z',
      durationMinutes: 15,
      videoAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      overallScore: 0,
      metrics: {
        technicalPrecision: 0,
        clarityAndArticulation: 0,
        strategicThinking: 0,
        executiveComposure: 0,
      },
      questions: [],
      aiExecutiveSummary: 'Awaiting completion of candidate test battery prior to video interview recording.',
      aiFlaggedHighlights: [],
    },
    departmentReviews: [],
  },
  {
    id: 'cand-david-oconnor',
    candidateName: 'David O\'Connor',
    email: 'david.oconnor@dublincloud.ie',
    phone: '+353 87 123 4567',
    location: 'Dublin, Ireland',
    portfolioUrl: 'https://github.com/doconnor-infra',
    linkedInUrl: 'https://linkedin.com/in/david-oconnor-azure',
    jobId: 'job-azure-architect',
    jobTitle: 'Senior Azure Cloud & Rails Architect',
    department: 'dev',
    stage: 'applied',
    appliedDate: '2026-09-15',
    tags: ['Fresh Website Applicant', 'Azure DevOps', 'Terraform'],
    documents: {
      resumeName: 'David_OConnor_Azure_Engineer_Resume.pdf',
      resumeUrl: '#',
      resumeSize: '1.4 MB',
      resumeTextContent: `DAVID O'CONNOR - CLOUD DEVOPS ENGINEER
Dublin, Ireland | david.oconnor@dublincloud.ie

EXPERIENCE
• Senior DevOps Engineer | AIB Technology Ireland (2021 - Present)
  - Managed Azure Kubernetes Clusters and Bicep deployment scripts for online banking apps.
  - Implemented GitHub Actions workflows for continuous automated deployment.

EDUCATION
• B.Sc. Computer Science - Trinity College Dublin`,
      coverLetter: 'I am applying for the Senior Azure Architect role. I have 6 years in cloud infrastructure and want to contribute to Sans Mercantile’s high-throughput payment rails.',
    },
    aiVetting: {
      score: 79,
      technicalSkillsScore: 81,
      domainAlignmentScore: 78,
      experienceDepthScore: 77,
      communicationScore: 80,
      recommendation: 'Consider Alternative Role',
      keyStrengths: [
        'Solid Azure fundamentals and CI/CD automation in banking sector.',
        'Good foundation with Terraform and Azure Bicep.'
      ],
      considerationsAndGaps: [
        'Less experience with extreme scale (sub-50ms 20k TPS) or zero-trust HSM key rotation compared to candidate Tariq Al-Mansoor.'
      ],
      summary: 'Candidate David O\'Connor shows solid mid-to-senior cloud devops skills (79/100). Ready for AI test dispatch.',
      vettedAt: '2026-09-15T22:00:00Z',
    },
    aiTestBattery: {
      testId: 'test-dev-02',
      testName: 'Azure Priv Pay Infrastructure, AKS & High-TPS Resilience Battery',
      department: 'dev',
      status: 'pending',
      dispatchedAt: '',
      passingScore: 80,
      questions: [],
    },
    aiVideoInterview: {
      interviewId: 'ai-int-david-01',
      status: 'pending',
      scheduledAt: '',
      durationMinutes: 15,
      videoAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      overallScore: 0,
      metrics: {
        technicalPrecision: 0,
        clarityAndArticulation: 0,
        strategicThinking: 0,
        executiveComposure: 0,
      },
      questions: [],
      aiExecutiveSummary: 'New application received via website. Ready for automated test dispatch.',
      aiFlaggedHighlights: [],
    },
    departmentReviews: [],
  },
];
