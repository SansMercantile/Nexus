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
    id: 'ai-engineer-001',
    title: 'AI Systems Engineer',
    department: 'Engineering',
    level: 'senior',
    type: 'full-time',
    status: 'open',
    location: 'San Francisco, CA',
    salary: {
      min: 180000,
      max: 250000,
      currency: 'USD'
    },
    description: 'Build next-generation autonomous AI systems that drive innovation',
    responsibilities: [
      'Design and implement complex AI systems',
      'Lead technical initiatives across teams',
      'Mentor junior engineers',
      'Drive architectural decisions'
    ],
    qualifications: [
      '5+ years of AI/ML experience',
      'Strong systems design background',
      'Experience with distributed systems',
      'PhD or equivalent experience in CS'
    ],
    assessments: ['technical', 'system-design', 'communication'],
    posted_at: '2026-03-15'
  },
  {
    id: 'frontend-engineer-001',
    title: 'Frontend Engineer',
    department: 'Engineering',
    level: 'mid',
    type: 'full-time',
    status: 'open',
    location: 'Remote',
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    description: 'Create beautiful and performant user interfaces for our constellation platform',
    responsibilities: [
      'Build responsive web interfaces',
      'Optimize performance and accessibility',
      'Collaborate with design team',
      'Implement best practices'
    ],
    qualifications: [
      '3+ years of React/TypeScript experience',
      'Strong CSS and design knowledge',
      'Experience with Next.js or similar frameworks',
      'Understanding of accessibility standards'
    ],
    assessments: ['technical', 'creativity'],
    posted_at: '2026-03-20'
  },
  {
    id: 'product-manager-001',
    title: 'Senior Product Manager',
    department: 'Product',
    level: 'senior',
    type: 'full-time',
    status: 'open',
    location: 'New York, NY',
    salary: {
      min: 160000,
      max: 220000,
      currency: 'USD'
    },
    description: 'Shape the future of autonomous systems and drive product vision',
    responsibilities: [
      'Define product strategy and roadmap',
      'Lead cross-functional teams',
      'Conduct market research',
      'Drive user adoption and growth'
    ],
    qualifications: [
      '7+ years of product management experience',
      'Experience in AI/ML products',
      'Strong analytical and communication skills',
      'Track record of successful product launches'
    ],
    assessments: ['culture-fit', 'communication'],
    posted_at: '2026-03-18'
  },
  {
    id: 'internship-001',
    title: 'Systems Architecture & Cloud Engineering Intern',
    department: 'Engineering',
    level: 'junior',
    type: 'internship',
    status: 'open',
    location: 'Cape Town + London + Tokyo',
    salary: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    description: 'Join our technical team as a Systems Architecture & Cloud Engineering Intern. This is a high-level infrastructure deployment role tasked with integrating cutting-edge computing paradigms into our complex constellation ecosystem. Direct pathway to specialist position upon successful completion.',
    responsibilities: [
      'Architect and deploy primary cloud environment to host active constellation of 18 functional systems',
      'Research and execute applications for cloud credits and innovation funding (AWS Activate, Google for Startups, Azure for Startups)',
      'Implement and manage robust data flows using Pub/Sub architectures, BigQuery, and Big Data frameworks',
      'Maintain and optimize IoT data layer utilizing SQL, MongoDB, and Hive',
      'Bridge building between current architecture and neuromorphic and quantum computing modules'
    ],
    qualifications: [
      'Currently pursuing or recently completed degree in Computer Science or related field with exceptional academic record',
      'Foundational knowledge of Cloud Service Providers (GCP, AWS, or Azure)',
      'Practical experience or strong academic projects with SQL and NoSQL databases (MongoDB)',
      'Exposure to Hive or similar data warehousing tools for IoT applications',
      'Systems thinking mindset - comfortable moving between high-level architectural theory and hands-on deployment',
      'Strong ambition to specialize in next-generation computing (Quantum/Neuromorphic)'
    ],
    benefits: [
      'Hands-on experience securing venture-level cloud funding',
      'Multi-system AI constellation deployment experience',
      'Direct mentorship in deep tech and neuromorphic/quantum integration',
      'Clear pathway to permanent specialist role post-internship',
      'Access to leading-edge AI, blockchain, and distributed systems',
      'Global team collaboration across EMEA and APAC regions'
    ],
    assessments: ['technical', 'systems-thinking'],
    posted_at: '2026-04-02'
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
