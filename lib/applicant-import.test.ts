import { describe, it, expect } from 'vitest';
import { parseApplicantsCsv, matchInternalJob, validateImportRow } from './applicant-import';
import { getOpenJobs } from './jobs';

describe('parseApplicantsCsv', () => {
  it('parses headers case-insensitively with aliases', () => {
    const rows = parseApplicantsCsv(
      'Full Name,EMAIL ADDRESS,job title,Post URL\nJane Doe,jane@example.com,Director,https://x.example/p1'
    );
    expect(rows).toEqual([
      { name: 'Jane Doe', email: 'jane@example.com', jobTitle: 'Director', postUrl: 'https://x.example/p1' },
    ]);
  });

  it('handles quoted commas and wrapped lines', () => {
    const rows = parseApplicantsCsv(
      'name,email,coverLetter\n"Doe, Jane",jane@example.com,"Line one\nLine two, still same cell"'
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].coverLetter).toBe('Line one\nLine two, still same cell');
  });

  it('rejects missing headers, empty input, and oversized batches', () => {
    expect(() => parseApplicantsCsv('name,phone\nJane,123')).toThrow(/name and email/);
    expect(() => parseApplicantsCsv('   ')).toThrow();
    expect(() => parseApplicantsCsv('name,email')).toThrow(/at least one data row/);
    const big = 'name,email\n' + Array.from({ length: 201 }, (_, i) => `A${i},a${i}@x.com`).join('\n');
    expect(() => parseApplicantsCsv(big)).toThrow(/max 200/);
  });
});

describe('matchInternalJob', () => {
  const jobs = getOpenJobs();

  it('prefers explicit jobId', () => {
    expect(matchInternalJob(jobs, { jobId: jobs[0].id })?.id).toBe(jobs[0].id);
  });

  it('matches titles exactly and fuzzily', () => {
    expect(matchInternalJob(jobs, { jobTitle: jobs[0].title })?.id).toBe(jobs[0].id);
    expect(matchInternalJob(jobs, { jobTitle: jobs[0].title.toLowerCase() })?.id).toBe(jobs[0].id);
    expect(matchInternalJob(jobs, { jobTitle: 'Astronaut Janitor' })).toBeUndefined();
    expect(matchInternalJob(jobs, {})).toBeUndefined();
  });
});

describe('validateImportRow', () => {
  const jobs = getOpenJobs();

  it('accepts a complete valid row', () => {
    const result = validateImportRow(
      { name: 'Jane', email: 'jane@example.com', jobId: jobs[0].id, postDate: '2026-09-01' },
      jobs
    );
    expect(result.ok).toBe(true);
    expect(result.job?.id).toBe(jobs[0].id);
    expect(result.postDate).toContain('2026-09-01');
  });

  it('rejects bad emails, unknown jobs, and bad dates', () => {
    expect(validateImportRow({ name: 'J', email: 'nope', jobId: jobs[0].id }, jobs).ok).toBe(false);
    expect(validateImportRow({ name: 'J', email: 'j@x.com', jobId: 'missing' }, jobs).ok).toBe(false);
    expect(
      validateImportRow({ name: 'J', email: 'j@x.com', jobId: jobs[0].id, postDate: 'someday' }, jobs).ok
    ).toBe(false);
    expect(validateImportRow({ name: '', email: 'j@x.com', jobId: jobs[0].id }, jobs).ok).toBe(false);
  });
});
