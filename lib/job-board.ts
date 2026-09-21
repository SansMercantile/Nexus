import { getDb } from './mongodb';
import { jobPostings, isJobOpen, type JobPosting, type AssessmentType } from './jobs';
import { assessmentConfigs } from './jobs';

/**
 * Admin-managed job posts (`job_posts` collection) merged over the static
 * seed list in lib/jobs.ts. A DB document with the same id shadows the
 * static entry, so admins can edit — and archive (status closed) — any role
 * without a deploy. Careers, apply, assess, the jobs board, and the Indeed
 * feed all read through the merged source, so changes reflect immediately.
 */

export const JOB_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const LEVELS = ['junior', 'mid', 'senior', 'lead'] as const;
const TYPES = ['full-time', 'contract', 'internship'] as const;
const STATUSES = ['open', 'closed'] as const;

export function mergeJobSources(staticJobs: JobPosting[], adminDocs: JobPosting[]): JobPosting[] {
  const overrides = new Map(adminDocs.map((doc) => [doc.id, doc]));
  const merged = staticJobs.map((job) => overrides.get(job.id) ?? job);
  for (const doc of adminDocs) {
    if (!staticJobs.some((job) => job.id === doc.id)) {
      merged.push(doc);
    }
  }
  return merged;
}

async function fetchAdminJobs(): Promise<JobPosting[]> {
  const db = await getDb();
  const docs = await db.collection('job_posts').find({}).limit(500).toArray();
  return docs.map((doc) => ({
    id: String(doc.id ?? doc._id),
    title: String(doc.title ?? ''),
    department: String(doc.department ?? ''),
    level: doc.level,
    type: doc.type,
    location: String(doc.location ?? ''),
    status: doc.status,
    salary: doc.salary,
    description: String(doc.description ?? ''),
    responsibilities: Array.isArray(doc.responsibilities) ? doc.responsibilities.map(String) : [],
    qualifications: Array.isArray(doc.qualifications) ? doc.qualifications.map(String) : [],
    benefits: Array.isArray(doc.benefits) ? doc.benefits.map(String) : undefined,
    assessments: Array.isArray(doc.assessments) ? doc.assessments : [],
    posted_at: String(doc.posted_at ?? doc.createdAt ?? new Date().toISOString()),
    deadline: typeof doc.deadline === 'string' ? doc.deadline : undefined,
  })) as JobPosting[];
}

/** Merged admin + static jobs. Falls back to static when the DB is unreachable. */
export async function getMergedJobs(): Promise<JobPosting[]> {
  try {
    return mergeJobSources(jobPostings, await fetchAdminJobs());
  } catch (error) {
    console.error('Job board DB unavailable, serving static jobs:', error);
    return [...jobPostings];
  }
}

export async function findMergedJob(id: string): Promise<JobPosting | undefined> {
  return (await getMergedJobs()).find((job) => job.id === id);
}

export async function getMergedOpenJobs(): Promise<JobPosting[]> {
  return (await getMergedJobs()).filter((job) => isJobOpen(job));
}

export interface JobPayloadValidation {
  ok: boolean;
  message?: string;
}

/** Validate an admin-supplied job document (create or full-update). */
export function validateJobPayload(body: unknown): JobPayloadValidation {
  if (!body || typeof body !== 'object') {
    return { ok: false, message: 'A job object is required.' };
  }
  const payload = body as Record<string, unknown>;
  const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

  if (!str(payload.id).match(JOB_ID_PATTERN)) {
    return { ok: false, message: 'id must be a URL-safe slug (lowercase letters, numbers, hyphens).' };
  }
  for (const field of ['title', 'department', 'location', 'description'] as const) {
    if (!str(payload[field])) {
      return { ok: false, message: `${field} is required.` };
    }
    if ((payload[field] as string).length > 5000) {
      return { ok: false, message: `${field} exceeds the maximum length.` };
    }
  }
  if (!(LEVELS as readonly string[]).includes(str(payload.level)) || !(TYPES as readonly string[]).includes(str(payload.type))) {
    return { ok: false, message: 'level must be junior|mid|senior|lead and type full-time|contract|internship.' };
  }
  if (payload.status !== undefined && !(STATUSES as readonly string[]).includes(str(payload.status))) {
    return { ok: false, message: 'status must be open or closed.' };
  }
  for (const field of ['responsibilities', 'qualifications'] as const) {
    const value = payload[field];
    if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
      return { ok: false, message: `${field} must be a non-empty string array.` };
    }
  }
  const knownAssessments = new Set(Object.keys(assessmentConfigs));
  const assessments = payload.assessments;
  if (!Array.isArray(assessments) || assessments.length === 0 || assessments.some((a) => !knownAssessments.has(a as AssessmentType))) {
    return { ok: false, message: 'assessments must list at least one known assessment type.' };
  }
  if (payload.salary !== undefined) {
    const salary = payload.salary as Record<string, unknown>;
    if (
      typeof salary !== 'object' || salary === null ||
      typeof salary.min !== 'number' || typeof salary.max !== 'number' ||
      typeof salary.currency !== 'string' || salary.min < 0 || salary.max < salary.min
    ) {
      return { ok: false, message: 'salary must be { min, max, currency } with max >= min.' };
    }
  }
  for (const field of ['posted_at', 'deadline'] as const) {
    if (payload[field] !== undefined && Number.isNaN(Date.parse(String(payload[field])))) {
      return { ok: false, message: `${field} must be a valid date.` };
    }
  }
  return { ok: true };
}
