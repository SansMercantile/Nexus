export type AssessmentType = 'technical' | 'culture-fit' | 'system-design' | 'algorithm' | 'communication' | 'creativity' | 'systems-thinking';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  level: 'junior' | 'mid' | 'senior' | 'lead';
  type: 'full-time' | 'contract' | 'internship';
  location: string;
  status?: 'open' | 'closed';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits?: string[];
  assessments: AssessmentType[];
  posted_at: string;
  deadline?: string;
}

export const assessmentConfigs: Record<AssessmentType, { title: string; description: string }> = {
  technical: {
    title: 'Technical Assessment',
    description: 'Test your technical knowledge and problem-solving skills'
  },
  'culture-fit': {
    title: 'Culture Fit Assessment',
    description: 'Evaluate alignment with our values and culture'
  },
  'system-design': {
    title: 'System Design',
    description: 'Design scalable and robust systems'
  },
  algorithm: {
    title: 'Algorithm Challenge',
    description: 'Solve algorithmic problems efficiently'
  },
  communication: {
    title: 'Communication Skills',
    description: 'Evaluate your communication abilities'
  },
  creativity: {
    title: 'Creativity Challenge',
    description: 'Demonstrate creative problem-solving'
  },
  'systems-thinking': {
    title: 'Systems Thinking Assessment',
    description: 'Evaluate ability to understand complex systems and architectural design'
  }
};

export const jobPostings: JobPosting[] = [
  {
    id: 'director-ai-product-strategy',
    title: 'Director of AI Product Strategy',
    department: 'Product',
    level: 'lead',
    type: 'full-time',
    status: 'open',
    location: 'Remote',
    salary: {
      min: 220000,
      max: 280000,
      currency: 'USD'
    },
    description: 'Lead the product vision for autonomous AI systems across finance, healthcare, and operations.',
    responsibilities: [
      'Define product strategy for the AI systems portfolio',
      'Align roadmaps with business objectives and customer requirements',
      'Partner with engineering, design, and go-to-market teams',
      'Measure product outcomes and optimize adoption'
    ],
    qualifications: [
      '10+ years of product leadership experience',
      'Proven track record with AI/ML or enterprise SaaS products',
      'Strong stakeholder management and communication skills',
      'Experience leading cross-functional teams through complex launches'
    ],
    benefits: ['Executive leadership coaching', 'Equity participation', 'Flexible remote work', 'Comprehensive healthcare'],
    assessments: ['culture-fit', 'communication', 'system-design'],
    posted_at: '2026-05-01'
  },
  {
    id: 'principal-ml-infrastructure-engineer',
    title: 'Principal ML Infrastructure Engineer',
    department: 'Engineering',
    level: 'lead',
    type: 'full-time',
    status: 'open',
    location: 'Remote',
    salary: {
      min: 200000,
      max: 260000,
      currency: 'USD'
    },
    description: 'Build and scale the infrastructure that powers our autonomous AI systems and real-time workflows.',
    responsibilities: [
      'Architect ML infrastructure for production deployment',
      'Optimize reliability, cost, and performance across clusters',
      'Mentor engineering teams on observability and automation',
      'Drive infrastructure strategy for multi-system orchestration'
    ],
    qualifications: [
      '8+ years of infrastructure or SRE experience',
      'Deep knowledge of cloud-native ML platforms and distributed systems',
      'Hands-on experience with Kubernetes, CI/CD, and monitoring',
      'Strong systems thinking and operational excellence mindset'
    ],
    assessments: ['technical', 'systems-thinking', 'communication'],
    posted_at: '2026-05-03'
  },
  {
    id: 'customer-success-engineer',
    title: 'Senior Customer Success Engineer',
    department: 'Customer Success',
    level: 'senior',
    type: 'full-time',
    status: 'open',
    location: 'Remote',
    salary: {
      min: 140000,
      max: 180000,
      currency: 'USD'
    },
    description: 'Serve as the technical partner for customers deploying our AI solutions and ensure successful integrations.',
    responsibilities: [
      'Support onboarding and technical enablement for enterprise customers',
      'Troubleshoot integration issues and optimize platform usage',
      'Collaborate with product and engineering to improve customer outcomes',
      'Create technical guidance and best-practice documentation'
    ],
    qualifications: [
      '5+ years in customer success, solutions engineering, or technical support',
      'Experience with APIs, data integrations, and SaaS platforms',
      'Strong communication skills with technical and non-technical audiences',
      'Customer-focused mindset and proactive problem solving'
    ],
    assessments: ['communication', 'technical', 'culture-fit'],
    posted_at: '2026-05-05'
  },
  {
    id: 'ai-governance-compliance-lead',
    title: 'AI Governance & Compliance Lead',
    department: 'Compliance',
    level: 'senior',
    type: 'full-time',
    status: 'open',
    location: 'Remote',
    salary: {
      min: 155000,
      max: 200000,
      currency: 'USD'
    },
    description: 'Drive governance, risk, and compliance for our AI platform and regulated customer deployments.',
    responsibilities: [
      'Define AI governance policies and controls',
      'Manage regulatory readiness for HIPAA, SOC 2, and privacy frameworks',
      'Partner with product teams on ethical AI practices',
      'Conduct risk assessments and compliance audits'
    ],
    qualifications: [
      '7+ years in compliance, risk management, or AI governance',
      'Experience with regulated AI or data-driven products',
      'Strong knowledge of security, privacy, and audit frameworks',
      'Excellent stakeholder engagement and advisory skills'
    ],
    assessments: ['culture-fit', 'communication'],
    posted_at: '2026-05-06'
  },
  {
    id: 'ux-design-systems-lead',
    title: 'UX & Design Systems Lead',
    department: 'Design',
    level: 'mid',
    type: 'full-time',
    status: 'open',
    location: 'Remote',
    salary: {
      min: 125000,
      max: 165000,
      currency: 'USD'
    },
    description: 'Lead design systems and user experience for our SaaS platform and customer-facing tools.',
    responsibilities: [
      'Create cohesive design systems and component libraries',
      'Partner with product and engineering on UI/UX delivery',
      'Run user research and iterate on workflow designs',
      'Ensure consistency across web and dashboard experiences'
    ],
    qualifications: [
      '5+ years of UX design or design systems experience',
      'Strong visual, interaction, and accessibility design skills',
      'Experience working with React-based component libraries',
      'Excellent collaboration skills with cross-functional teams'
    ],
    assessments: ['creativity', 'communication'],
    posted_at: '2026-05-07'
  },
  {
    id: 'growth-marketing-manager',
    title: 'Growth Marketing Manager, AI Platforms',
    department: 'Marketing',
    level: 'mid',
    type: 'full-time',
    status: 'open',
    location: 'Remote',
    salary: {
      min: 130000,
      max: 170000,
      currency: 'USD'
    },
    description: 'Design and execute growth marketing programs that expand adoption of our AI systems portfolio.',
    responsibilities: [
      'Plan and launch demand generation campaigns',
      'Optimize digital acquisition funnels and customer lifecycle programs',
      'Define messaging for AI products and use cases',
      'Collaborate with sales and product teams to measure impact'
    ],
    qualifications: [
      '5+ years of B2B growth marketing experience',
      'Strong analytics and performance marketing skills',
      'Experience marketing enterprise SaaS or AI products',
      'Excellent collaboration across marketing and revenue teams'
    ],
    assessments: ['communication', 'creativity'],
    posted_at: '2026-05-08'
  },
  {
    id: 'data-operations-reliability-engineer',
    title: 'Data Operations & Reliability Engineer',
    department: 'Engineering',
    level: 'mid',
    type: 'full-time',
    status: 'open',
    location: 'Remote',
    salary: {
      min: 135000,
      max: 175000,
      currency: 'USD'
    },
    description: 'Ensure data pipelines and platform reliability for our mission-critical AI services.',
    responsibilities: [
      'Build and operate data pipelines for real-time and batch workloads',
      'Improve platform observability and incident response',
      'Implement SLOs, monitoring, and alerting for data services',
      'Collaborate with engineering teams on reliability engineering best practices'
    ],
    qualifications: [
      '4+ years in data engineering, SRE, or reliability roles',
      'Experience with ETL/ELT pipelines, streaming, and monitoring tools',
      'Strong problem-solving skills and operational discipline',
      'Comfort working across cross-functional teams to improve reliability'
    ],
    assessments: ['technical', 'systems-thinking'],
    posted_at: '2026-05-09'
  }
];

export const getOpenJobs = (): JobPosting[] => {
  return jobPostings.filter(job => {
    if (!job.deadline) return true;
    return new Date(job.deadline) > new Date();
  });
};

export const getJobById = (id: string): JobPosting | undefined => {
  return jobPostings.find(job => job.id === id);
};

export const getJobsByDepartment = (department: string): JobPosting[] => {
  return jobPostings.filter(job => job.department === department);
};

export const getJobsByLevel = (level: JobPosting['level']): JobPosting[] => {
  return jobPostings.filter(job => job.level === level);
};
