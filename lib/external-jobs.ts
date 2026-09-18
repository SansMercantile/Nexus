import { getJobById, getOpenJobs } from './jobs';
import type { JobPosting } from './jobs';

/**
 * External job board sync (LinkedIn + Indeed → website careers).
 *
 * LinkedIn and Indeed expose no public "list this company's jobs" API, so
 * this module works in two stages:
 *  1. DISCOVER: scan LinkedIn org posts for job announcements and parse an
 *     optional Indeed XML feed into candidate listings (status 'pending').
 *  2. CURATE: an admin approves a candidate and maps it to an internal job.
 *     Only approved, mapped listings appear on the public board — and their
 *     Apply buttons route into our own application journey (/api/apply),
 *     never LinkedIn Easy Apply / Indeed Apply.
 */

export type ExternalJobSource = 'linkedin' | 'indeed';
export type ExternalListingStatus = 'pending' | 'approved' | 'dismissed';

export interface ExternalListing {
  source: ExternalJobSource;
  /** Stable upstream id (LinkedIn post URN, Indeed guid/link hash). */
  sourceId: string;
  sourceUrl: string;
  title: string;
  location?: string;
  department?: string;
  postedAt?: string;
  rawText?: string;
  status: ExternalListingStatus;
  /** Internal job applications flow through. Required for 'approved'. */
  mappedJobId?: string;
  createdAt: string;
  updatedAt: string;
}

/** Public board card. `jobId` is always an internal job: apply stays on-site. */
export interface BoardListing {
  source: 'internal' | ExternalJobSource;
  jobId: string;
  title: string;
  department: string;
  location: string;
  type: string;
  sourceUrl?: string;
  postedAt?: string;
}

const HIRING_SIGNALS = [
  "we're hiring",
  'we are hiring',
  'now hiring',
  'join our team',
  'open role',
  'open roles',
  'open position',
  'open positions',
  'apply now',
  'job opening',
  'job openings',
  'career opportunity',
  'career opportunities',
  'looking for a ',
  'looking for an ',
  'we are looking for',
  "we're looking for",
  'now accepting applications',
  'hiring:',
  'hiring ',
];

/** Heuristic: does this org-post text read like a job announcement? */
export function isJobAnnouncement(text: unknown): boolean {
  if (typeof text !== 'string') return false;
  const lowered = text.toLowerCase();
  return HIRING_SIGNALS.some((signal) => lowered.includes(signal));
}

/** Best-effort title: first substantive line, cleaned and truncated. */
export function extractJobTitle(text: string, fallback = 'Opportunity at Sans Mercantile'): string {
  const firstLine = (text || '')
    .split('\n')
    // Keep word chars, '#' (hashtag rule below handles a leading tag) and '('.
    .map((line) => line.replace(/^[^\w(#]+/, '').trim())
    .find((line) => line.length > 0);
  if (!firstLine) return fallback;
  // Drop a leading hashtag token common on social announcements (#hiring …).
  const withoutTag = firstLine.replace(/^#[A-Za-z0-9_-]+\s+/, '');
  const cleaned = (withoutTag.length > 0 ? withoutTag : firstLine).replace(/\s*https?:\/\/\S+/g, '').trim();
  if (cleaned.length === 0) return fallback;
  return cleaned.length > 120 ? `${cleaned.slice(0, 117).trim()}…` : cleaned;
}

export function normalizeWhitespace(value: unknown, max = 500): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Drop candidates already present in the registry (same source + sourceId). */
export function dedupeListings<T extends { source: string; sourceId: string }>(
  existing: T[],
  candidates: T[]
): T[] {
  const seen = new Set(existing.map((e) => `${e.source}:${e.sourceId}`));
  return candidates.filter((c) => {
    const key = `${c.source}:${c.sourceId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface IndeedFeedItem {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
}

/**
 * Minimal RSS/Atom item parser for employer XML feeds (no dependencies).
 * Extracts title/link/guid/pubDate per <item> or <entry> block.
 */
export function parseIndeedFeed(xml: string): IndeedFeedItem[] {
  if (typeof xml !== 'string' || xml.length === 0) return [];
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  const items: IndeedFeedItem[] = [];

  const pick = (block: string, tags: string[]): string => {
    for (const tag of tags) {
      const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      if (match) {
        return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
      }
    }
    return '';
  };

  for (const block of blocks) {
    const title = pick(block, ['title']);
    const link = pick(block, ['link']);
    const guid = pick(block, ['guid', 'id']) || link;
    const pubDate = pick(block, ['pubDate', 'published', 'updated']);
    if (!title || !link) continue;
    items.push({ title, link, guid, pubDate });
  }
  return items;
}

/**
 * Merge internal open jobs with approved external listings into the public
 * board. An external listing appears only when it maps to a currently open
 * internal job — applications always flow through our own journey.
 */
export function mergeBoard(
  internalJobs: JobPosting[],
  external: ExternalListing[]
): BoardListing[] {
  const openIds = new Set(getOpenJobs().map((j) => j.id));
  const board: BoardListing[] = internalJobs
    .filter((job) => openIds.has(job.id))
    .map((job) => ({
      source: 'internal' as const,
      jobId: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
    }));

  for (const listing of external) {
    if (listing.status !== 'approved' || !listing.mappedJobId) continue;
    const job = getJobById(listing.mappedJobId);
    if (!job || !openIds.has(job.id)) continue;
    board.push({
      source: listing.source,
      jobId: job.id,
      title: listing.title || job.title,
      department: listing.department || job.department,
      location: listing.location || job.location,
      type: job.type,
      sourceUrl: listing.sourceUrl,
      postedAt: listing.postedAt,
    });
  }
  return board;
}

/** Validate an admin-supplied mapping before an external listing goes live. */
export function validateMapping(mappedJobId: unknown): { ok: boolean; message?: string } {
  if (typeof mappedJobId !== 'string' || mappedJobId.trim().length === 0) {
    return { ok: false, message: 'mappedJobId is required to approve a listing.' };
  }
  const job = getJobById(mappedJobId.trim());
  if (!job) return { ok: false, message: 'Unknown internal job for mappedJobId.' };
  if (!getOpenJobs().some((j) => j.id === job.id)) {
    return { ok: false, message: 'Mapped job is not currently open.' };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Outbound: publish our open jobs TO Indeed (Job Sync XML feed).
// Indeed crawls the feed and lists the roles; the <url> element points back
// to our careers page so every application still flows through our journey
// (no Indeed Apply siphoning).
// ---------------------------------------------------------------------------

export interface IndeedFeedOptions {
  /** Public site origin, e.g. https://www.sansmercantile.com */
  siteUrl: string;
  /** Verification contact (Indeed Search Quality uses it to verify the entity). */
  contactEmail: string;
  company?: string;
}

/** Wrap free text in CDATA, splitting any embedded terminator safely. */
export function cdata(value: string): string {
  return `<![CDATA[${String(value || '').replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

const INDEED_JOBTYPE: Record<string, string> = {
  'full-time': 'fulltime',
  contract: 'contract',
  internship: 'internship',
};

function indeedDescription(job: {
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits?: string[];
}): string {
  const list = (items: string[]) =>
    items.map((item) => `<li>${item}</li>`).join('');
  return (
    `<p>${job.description}</p>` +
    `<h2>Responsibilities</h2><ul>${list(job.responsibilities)}</ul>` +
    `<h2>Qualifications</h2><ul>${list(job.qualifications)}</ul>` +
    (job.benefits && job.benefits.length > 0
      ? `<h2>Benefits</h2><ul>${list(job.benefits)}</ul>`
      : '')
  );
}

/**
 * Build an Indeed Job Sync XML feed for the given (open) jobs.
 * Follows https://docs.indeed.com/job-sync-xml/xml-feed required elements.
 */
export function buildIndeedFeed(
  jobs: Array<{
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    benefits?: string[];
    salary?: { min: number; max: number; currency: string };
    posted_at: string;
    deadline?: string;
  }>,
  opts: IndeedFeedOptions
): string {
  const siteUrl = opts.siteUrl.replace(/\/$/, '');
  const company = opts.company || 'Sans Mercantile';

  const entries = jobs
    .map((job) => {
      const remote = job.location.trim().toLowerCase() === 'remote';
      const salary = job.salary
        ? `$${job.salary.min.toLocaleString('en-US')} - $${job.salary.max.toLocaleString('en-US')} per year`
        : '';
      const posted = new Date(job.posted_at).toISOString();
      const expires = job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '';
      return (
        `  <job>\n` +
        `    <title>${cdata(job.title)}</title>\n` +
        `    <date>${cdata(posted)}</date>\n` +
        `    <referencenumber>${cdata(job.id)}</referencenumber>\n` +
        `    <requisitionid>${cdata(job.id)}</requisitionid>\n` +
        `    <url>${cdata(`${siteUrl}/careers?apply=${encodeURIComponent(job.id)}&source=Indeed`)}</url>\n` +
        `    <company>${cdata(company)}</company>\n` +
        `    <city>${cdata(remote ? 'Remote' : job.location)}</city>\n` +
        `    <state>${cdata('')}</state>\n` +
        `    <country>${cdata('ZA')}</country>\n` +
        `    <email>${cdata(opts.contactEmail)}</email>\n` +
        `    <description>${cdata(indeedDescription(job))}</description>\n` +
        `    <salary>${cdata(salary)}</salary>\n` +
        `    <jobtype>${cdata(INDEED_JOBTYPE[job.type] || job.type)}</jobtype>\n` +
        `    <category>${cdata(job.department)}</category>\n` +
        (expires ? `    <expirationdate>${cdata(expires)}</expirationdate>\n` : '') +
        (remote ? `    <remotetype>${cdata('Fully remote')}</remotetype>\n` : '')
      );
    })
    .join('');

  return `<?xml version="1.0" encoding="utf-8"?>\n<source>\n${entries}</source>\n`;
}
