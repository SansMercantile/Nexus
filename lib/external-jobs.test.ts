import { describe, it, expect } from 'vitest';
import {
  isJobAnnouncement,
  extractJobTitle,
  dedupeListings,
  parseIndeedFeed,
  mergeBoard,
  validateMapping,
  buildIndeedFeed,
  cdata,
  type ExternalListing,
} from './external-jobs';
import { getOpenJobs } from './jobs';

const pending = (overrides: Partial<ExternalListing> = {}): ExternalListing => ({
  source: 'linkedin',
  sourceId: `post-${Math.random()}`,
  sourceUrl: 'https://www.linkedin.com/company/sans-mercantile',
  title: 'Senior Engineer',
  status: 'pending',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('isJobAnnouncement', () => {
  it('detects hiring posts', () => {
    expect(isJobAnnouncement("We're hiring a Senior Engineer! Apply now.")).toBe(true);
    expect(isJobAnnouncement('NOW HIRING: join our team of builders')).toBe(true);
    expect(isJobAnnouncement('Open role: DevOps lead. DM to apply.')).toBe(true);
  });

  it('ignores ordinary updates', () => {
    expect(isJobAnnouncement('Q3 results are out. Read our report.')).toBe(false);
    expect(isJobAnnouncement('')).toBe(false);
    expect(isJobAnnouncement(undefined)).toBe(false);
  });
});

describe('extractJobTitle', () => {
  it('takes the first substantive line', () => {
    expect(extractJobTitle('\n\nSenior Engineer\nWe are hiring...')).toBe('Senior Engineer');
  });

  it('strips leading emoji, hashtags and URLs', () => {
    expect(extractJobTitle('🚀 #hiring Senior Engineer https://example.com/x')).toBe('Senior Engineer');
  });

  it('falls back when empty', () => {
    expect(extractJobTitle('   \n  ')).toBe('Opportunity at Sans Mercantile');
  });
});

describe('dedupeListings', () => {
  it('drops already-registered and intra-batch duplicates', () => {
    const existing = [pending({ sourceId: 'a' })];
    const candidates = [
      pending({ sourceId: 'a' }),
      pending({ sourceId: 'b' }),
      pending({ sourceId: 'b' }),
      pending({ source: 'indeed', sourceId: 'a' }),
    ];
    const fresh = dedupeListings(existing, candidates);
    expect(fresh.map((c) => `${c.source}:${c.sourceId}`)).toEqual(['linkedin:b', 'indeed:a']);
  });
});

describe('parseIndeedFeed', () => {
  it('parses RSS items', () => {
    const xml = `<rss><channel>
      <item><title>Dev A</title><link>https://indeed.com/a</link><guid>ga</guid><pubDate>Mon, 01 Jan 2026 00:00:00 GMT</pubDate></item>
      <item><title><![CDATA[Dev B]]></title><link>https://indeed.com/b</link><pubDate>Tue, 02 Jan 2026 00:00:00 GMT</pubDate></item>
      <item><title></title><link>https://indeed.com/c</link></item>
    </channel></rss>`;
    const items = parseIndeedFeed(xml);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ title: 'Dev A', link: 'https://indeed.com/a', guid: 'ga' });
    expect(items[1].title).toBe('Dev B');
    expect(items[1].guid).toBe('https://indeed.com/b');
  });

  it('returns empty for garbage', () => {
    expect(parseIndeedFeed('')).toEqual([]);
    expect(parseIndeedFeed('<html>nope</html>')).toEqual([]);
  });
});

describe('mergeBoard', () => {
  const internal = getOpenJobs();
  const firstJob = internal[0];

  it('always includes open internal jobs', () => {
    const board = mergeBoard(internal, []);
    expect(board.length).toBe(internal.length);
    expect(board.every((b) => b.source === 'internal')).toBe(true);
  });

  it('shows approved listings mapped to open jobs, routing apply on-site', () => {
    const board = mergeBoard(internal, [
      pending({ status: 'approved', mappedJobId: firstJob.id, title: 'LI: Senior Engineer' }),
    ]);
    const external = board.find((b) => b.source === 'linkedin');
    expect(external).toMatchObject({ jobId: firstJob.id, title: 'LI: Senior Engineer' });
    expect(external?.sourceUrl).toContain('linkedin.com');
  });

  it('hides pending, dismissed, unmapped, and closed-job listings', () => {
    const board = mergeBoard(internal, [
      pending({ sourceId: 'p1', status: 'pending', mappedJobId: firstJob.id }),
      pending({ sourceId: 'd1', status: 'dismissed', mappedJobId: firstJob.id }),
      pending({ sourceId: 'u1', status: 'approved' }),
      pending({ sourceId: 'c1', status: 'approved', mappedJobId: 'no-such-job' }),
    ]);
    expect(board.some((b) => b.source !== 'internal')).toBe(false);
  });
});

describe('validateMapping', () => {
  it('requires a mapped open job', async () => {
    expect((await validateMapping(undefined)).ok).toBe(false);
    expect((await validateMapping('no-such-job')).ok).toBe(false);
    const firstJob = getOpenJobs()[0];
    expect(await validateMapping(firstJob.id)).toEqual({ ok: true });
  });
});

describe('cdata', () => {
  it('wraps text and neutralizes embedded terminators', () => {
    expect(cdata('a]]>b')).toBe('<![CDATA[a]]]]><![CDATA[>b]]>');
    expect(cdata('plain')).toBe('<![CDATA[plain]]>');
  });
});

describe('buildIndeedFeed', () => {
  const sampleJob = {
    id: 'test-engineer',
    title: 'Test Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'full-time',
    description: 'Build things.',
    responsibilities: ['Write code'],
    qualifications: ['3+ years'],
    benefits: ['Remote-first'],
    salary: { min: 100000, max: 140000, currency: 'USD' },
    posted_at: '2026-01-15',
    deadline: '2026-12-31',
  };

  it('emits required Job Sync elements per job', () => {
    const xml = buildIndeedFeed([sampleJob], {
      siteUrl: 'https://www.sansmercantile.com',
      contactEmail: 'careers@sansmercantile.com',
    });
    expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(xml).toContain('<referencenumber><![CDATA[test-engineer]]></referencenumber>');
    expect(xml).toContain('<title><![CDATA[Test Engineer]]></title>');
    expect(xml).toContain('careers@sansmercantile.com');
    expect(xml).toContain('/careers?apply=test-engineer&source=Indeed');
    expect(xml).toContain('<remotetype><![CDATA[Fully remote]]></remotetype>');
    expect(xml).toContain('$100,000 - $140,000 per year');
    expect(xml).toContain('<expirationdate><![CDATA[2026-12-31]]></expirationdate>');
  });

  it('omits optional elements when absent', () => {
    const { salary: _salary, deadline: _deadline, benefits: _benefits, ...minimal } = sampleJob;
    const xml = buildIndeedFeed([{ ...minimal, location: 'Cape Town' }], {
      siteUrl: 'https://www.sansmercantile.com/',
      contactEmail: 'careers@sansmercantile.com',
    });
    expect(xml).not.toContain('<remotetype>');
    expect(xml).not.toContain('<expirationdate>');
    expect(xml).toContain('<city><![CDATA[Cape Town]]></city>');
  });
});
