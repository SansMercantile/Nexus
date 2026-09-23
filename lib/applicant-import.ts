import { isValidEmail } from './validation';
import type { JobPosting } from './jobs';

/**
 * Bulk applicant import (e.g. LinkedIn Recruiter CSV exports).
 * HR pastes applicant rows; each valid row becomes a job application and
 * triggers the standard assessment invitation email. Pure functions so the
 * parsing/matching is unit-testable without a database.
 */

export const MAX_IMPORT_ROWS = 200;

export interface ImportRow {
  name: string;
  email: string;
  phone?: string;
  jobId?: string;
  jobTitle?: string;
  postUrl?: string;
  postDate?: string;
  location?: string;
  coverLetter?: string;
}

const HEADER_ALIASES: Record<string, keyof ImportRow> = {
  name: 'name',
  fullname: 'name',
  'full name': 'name',
  candidate: 'name',
  applicant: 'name',
  email: 'email',
  'email address': 'email',
  phone: 'phone',
  telephone: 'phone',
  mobile: 'phone',
  jobid: 'jobId',
  'job id': 'jobId',
  requisitionid: 'jobId',
  jobtitle: 'jobTitle',
  'job title': 'jobTitle',
  title: 'jobTitle',
  position: 'jobTitle',
  role: 'jobTitle',
  posturl: 'postUrl',
  'post url': 'postUrl',
  linkedin_url: 'postUrl',
  linkedinurl: 'postUrl',
  url: 'postUrl',
  link: 'postUrl',
  postdate: 'postDate',
  'post date': 'postDate',
  advertised: 'postDate',
  date: 'postDate',
  location: 'location',
  coverletter: 'coverLetter',
  'cover letter': 'coverLetter',
};

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quoted) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

/** Parse CSV text (with header row) into raw row objects. Throws on misuse. */
export function parseApplicantsCsv(text: string): Array<Record<string, string>> {
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('CSV text is required.');
  }
  // Join wrapped lines: a newline inside quotes belongs to the cell.
  const lines: string[] = [];
  let buffer = '';
  const rawLines = text.split(/\r?\n/);
  for (const rawLine of rawLines) {
    buffer += (buffer ? '\n' : '') + rawLine;
    // Count unescaped quotes to detect wrapped lines.
    let toggles = 0;
    for (let i = 0; i < rawLine.length; i++) {
      if (rawLine[i] === '"') {
        if (rawLine[i + 1] === '"') i++;
        else toggles++;
      }
    }
    if (toggles % 2 === 0) {
      if (buffer.trim().length > 0) lines.push(buffer);
      buffer = '';
    }
  }
  if (buffer.trim().length > 0) lines.push(buffer);
  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row.');
  }
  if (lines.length - 1 > MAX_IMPORT_ROWS) {
    throw new Error(`Too many rows (max ${MAX_IMPORT_ROWS} per import).`);
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const mapped = headers.map((h) => HEADER_ALIASES[h]);
  if (!mapped.includes('name') || !mapped.includes('email')) {
    throw new Error('CSV must include name and email columns.');
  }

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    mapped.forEach((key, idx) => {
      if (key && idx < cells.length && cells[idx]) {
        row[key] = cells[idx];
      }
    });
    return row;
  });
}

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');

/**
 * Resolve a row to an internal job: explicit jobId first, then title match
 * (exact normalized, then containment either way).
 */
export function matchInternalJob(
  jobs: JobPosting[],
  row: { jobId?: string; jobTitle?: string }
): JobPosting | undefined {
  if (row.jobId) {
    const direct = jobs.find((job) => job.id === row.jobId);
    if (direct) return direct;
  }
  if (!row.jobTitle) return undefined;
  const wanted = normalize(row.jobTitle);
  if (!wanted) return undefined;
  const exact = jobs.find((job) => normalize(job.title) === wanted);
  if (exact) return exact;
  return jobs.find((job) => {
    const title = normalize(job.title);
    return title.includes(wanted) || wanted.includes(title);
  });
}

export interface ValidatedImportRow {
  ok: boolean;
  message?: string;
  name?: string;
  email?: string;
  job?: JobPosting;
  postUrl?: string;
  postDate?: string;
}

/** Validate one row against open jobs (no database needed). */
export function validateImportRow(
  row: Record<string, unknown>,
  openJobs: JobPosting[]
): ValidatedImportRow {
  const name = typeof row.name === 'string' ? row.name.trim() : '';
  const email = typeof row.email === 'string' ? row.email.trim().toLowerCase() : '';
  if (!name || name.length > 120) {
    return { ok: false, message: 'name is required (max 120 chars).' };
  }
  if (!isValidEmail(email)) {
    return { ok: false, message: 'A valid email is required.' };
  }
  const jobId = typeof row.jobId === 'string' && row.jobId.trim() ? row.jobId.trim() : undefined;
  const jobTitle = typeof row.jobTitle === 'string' && row.jobTitle.trim() ? row.jobTitle.trim() : undefined;
  if (!jobId && !jobTitle) {
    return { ok: false, message: 'jobId or jobTitle is required.' };
  }
  const job = matchInternalJob(openJobs, { jobId, jobTitle });
  if (!job) {
    return { ok: false, message: `No open role matches "${jobId || jobTitle}".` };
  }
  let postDate: string | undefined;
  if (row.postDate !== undefined && row.postDate !== '') {
    if (typeof row.postDate !== 'string' || Number.isNaN(Date.parse(row.postDate))) {
      return { ok: false, message: 'postDate must be a valid date.' };
    }
    postDate = new Date(row.postDate).toISOString();
  }
  return {
    ok: true,
    name,
    email,
    job,
    postUrl: typeof row.postUrl === 'string' && row.postUrl ? row.postUrl.slice(0, 500) : undefined,
    postDate,
  };
}
