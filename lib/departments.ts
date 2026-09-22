import { getDb } from './mongodb';

/**
 * Company departments (`departments` collection) with the toolset each
 * department needs for its job description. HR can add departments
 * (technical support, customer support, legal, ...) and curate tools;
 * the seed below guarantees the baseline set exists.
 */

export interface DepartmentTool {
  name: string;
  description: string;
  route?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  tools: DepartmentTool[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DEPARTMENT_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const SEED_DEPARTMENTS: Array<Omit<Department, 'createdAt' | 'updatedAt'>> = [
  {
    id: 'executive',
    name: 'Executive Command',
    description: 'Sovereign leadership, treasury oversight, and strategic governance.',
    active: true,
    tools: [
      { name: 'Admin Dashboard', description: 'Portal activity, users, and applications.', route: '/admin' },
      { name: 'Content Studio', description: 'Publish blogs and press releases.', route: '/admin/content' },
      { name: 'SMO Operations CRM', description: 'Pipeline, contacts, analytics, talent.', route: '/crm' },
      { name: 'Team Management', description: 'Users, roles, and departments.', route: '/admin/team' },
      { name: 'Agent Operations', description: 'Live multi-agent activity simulation.', route: '/admin/agents' },
    ],
  },
  {
    id: 'hr',
    name: 'People & Talent Operations',
    description: 'Hiring, onboarding, assessments, and people operations.',
    active: true,
    tools: [
      { name: 'Team Management', description: 'Create users, assign roles and departments.', route: '/admin/team' },
      { name: 'Job Posts', description: 'Create and archive open roles via the jobs API.', route: '/careers' },
      { name: 'Application Review', description: 'Verdicts, integrity flags, and retakes.', route: '/admin' },
      { name: 'SMO Careers Engine', description: 'AI vetting pipeline and talent chat.', route: '/crm' },
    ],
  },
  {
    id: 'dev',
    name: 'Engineering & Infrastructure',
    description: 'Cloud rails, APIs, telemetry, and the AI backend.',
    active: true,
    tools: [
      { name: 'Diagnostics', description: 'MongoDB and SMTP health checks.', route: '/api/diag' },
      { name: 'AI Bedrock Proxy', description: 'Prompt endpoint for engineering tools.', route: '/api/bedrock' },
      { name: 'SMO Operations CRM', description: 'Engineering workspace and docs.', route: '/crm' },
    ],
  },
  {
    id: 'communications',
    name: 'Communications & PR',
    description: 'Brand, press syndication, and public narrative.',
    active: true,
    tools: [
      { name: 'Content Studio', description: 'Publish blogs and press releases.', route: '/admin/content' },
      { name: 'Media & Blog', description: 'Public media surfaces.', route: '/media/blog' },
    ],
  },
  {
    id: 'cbdo',
    name: 'Business Development & Deals',
    description: 'Investor syndicates, pipelines, grants, and term sheets.',
    active: true,
    tools: [
      { name: 'Deals & Pipeline', description: 'Investor pipeline and allocations.', route: '/crm' },
      { name: 'Contacts & Investor Relations', description: 'Investor CRM.', route: '/crm' },
    ],
  },
  {
    id: 'technical-support',
    name: 'Technical Support',
    description: 'Incident triage, debugging, and infrastructure assistance for customers and teams.',
    active: true,
    tools: [
      { name: 'Diagnostics', description: 'Service health checks and triage.', route: '/api/diag' },
      { name: 'SMO Operations CRM', description: 'Shared inbox, planner, and docs.', route: '/crm' },
      { name: 'Voice Bridge Status', description: 'Twilio/Deepgram bridge operations.', route: '/admin' },
    ],
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Frontline customer care, onboarding help, and success management.',
    active: true,
    tools: [
      { name: 'Support Chat API', description: 'Customer-facing support conversations.', route: '/api/llm-support' },
      { name: 'SMO Operations CRM', description: 'Contacts, inbox, and team chat.', route: '/crm' },
      { name: 'Knowledge Base', description: 'Help articles and guides.', route: '/knowledge-base' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    description: 'Contracts, regulatory compliance, risk, and governance.',
    active: true,
    tools: [
      { name: 'Compliance Dashboard', description: 'Audit events and security logs.', route: '/admin/compliance' },
      { name: 'Legal Library', description: 'Terms, privacy, EULA, and policies.', route: '/legal' },
      { name: 'Content Review', description: 'Approve public statements before release.', route: '/admin/content' },
    ],
  },
];

export function validateDepartment(body: unknown): { ok: boolean; message?: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, message: 'A department object is required.' };
  }
  const dept = body as Record<string, unknown>;
  const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  if (!DEPARTMENT_ID_PATTERN.test(str(dept.id))) {
    return { ok: false, message: 'id must be a URL-safe slug (lowercase, numbers, hyphens).' };
  }
  if (!str(dept.name) || (dept.name as string).length > 120) {
    return { ok: false, message: 'name is required (max 120 chars).' };
  }
  if (!str(dept.description) || (dept.description as string).length > 2000) {
    return { ok: false, message: 'description is required (max 2000 chars).' };
  }
  if (!Array.isArray(dept.tools) || dept.tools.length === 0 || dept.tools.length > 30) {
    return { ok: false, message: 'tools must be a non-empty array (max 30).' };
  }
  for (const tool of dept.tools) {
    if (
      !tool ||
      typeof tool !== 'object' ||
      !str((tool as Record<string, unknown>).name) ||
      !str((tool as Record<string, unknown>).description) ||
      ((tool as Record<string, unknown>).name as string).length > 120 ||
      ((tool as Record<string, unknown>).description as string).length > 500
    ) {
      return { ok: false, message: 'Each tool needs a name (max 120) and description (max 500).' };
    }
  }
  if (dept.active !== undefined && typeof dept.active !== 'boolean') {
    return { ok: false, message: 'active must be a boolean.' };
  }
  return { ok: true };
}

/** All departments, seeding defaults on first run. Falls back to seeds without a DB. */
export async function getDepartments(): Promise<Department[]> {
  try {
    const db = await getDb();
    const collection = db.collection('departments');
    if ((await collection.countDocuments()) === 0) {
      const now = new Date().toISOString();
      await collection.insertMany(SEED_DEPARTMENTS.map((dept) => ({ ...dept, createdAt: now, updatedAt: now })));
    }
    const docs = await collection.find({}).limit(200).toArray();
    return docs.map((doc) => ({
      id: String(doc.id ?? doc._id),
      name: String(doc.name ?? ''),
      description: String(doc.description ?? ''),
      tools: Array.isArray(doc.tools) ? (doc.tools as DepartmentTool[]) : [],
      active: doc.active !== false,
      createdAt: String(doc.createdAt ?? ''),
      updatedAt: String(doc.updatedAt ?? ''),
    }));
  } catch (error) {
    console.error('Departments DB unavailable, serving seeds:', error);
    const now = new Date().toISOString();
    return SEED_DEPARTMENTS.map((dept) => ({ ...dept, createdAt: now, updatedAt: now }));
  }
}

export async function getActiveDepartments(): Promise<Department[]> {
  return (await getDepartments()).filter((dept) => dept.active);
}

export async function departmentExists(id: string): Promise<boolean> {
  return (await getDepartments()).some((dept) => dept.id === id && dept.active);
}
