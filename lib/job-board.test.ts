import { describe, it, expect } from 'vitest';
import { mergeJobSources, validateJobPayload } from './job-board';
import { jobPostings, type JobPosting } from './jobs';

const base: JobPosting = {
  ...jobPostings[0],
  id: 'test-role',
  title: 'Test Role',
};

describe('mergeJobSources', () => {
  it('unions static and admin posts', () => {
    const merged = mergeJobSources(jobPostings, [base]);
    expect(merged.some((j) => j.id === 'test-role')).toBe(true);
    expect(merged.length).toBe(jobPostings.length + 1);
  });

  it('lets admin docs shadow static entries by id', () => {
    const overridden = { ...jobPostings[0], title: 'Edited Title', status: 'closed' as const };
    const merged = mergeJobSources(jobPostings, [overridden]);
    expect(merged.filter((j) => j.id === jobPostings[0].id)).toHaveLength(1);
    expect(merged.find((j) => j.id === jobPostings[0].id)?.title).toBe('Edited Title');
  });
});

describe('validateJobPayload', () => {
  const valid = {
    id: 'new-role',
    title: 'New Role',
    department: 'Engineering',
    level: 'mid',
    type: 'full-time',
    location: 'Remote',
    status: 'open',
    description: 'Do things.',
    responsibilities: ['Build'],
    qualifications: ['Experience'],
    assessments: ['technical'],
    posted_at: '2026-01-01',
  };

  it('accepts a complete valid post', () => {
    expect(validateJobPayload(valid).ok).toBe(true);
  });

  it('rejects bad ids', () => {
    expect(validateJobPayload({ ...valid, id: 'Bad ID!' }).ok).toBe(false);
    expect(validateJobPayload({ ...valid, id: '' }).ok).toBe(false);
  });

  it('rejects missing fields and enums', () => {
    expect(validateJobPayload({ ...valid, title: '' }).ok).toBe(false);
    expect(validateJobPayload({ ...valid, level: 'intern' }).ok).toBe(false);
    expect(validateJobPayload({ ...valid, type: 'part-time' }).ok).toBe(false);
    expect(validateJobPayload({ ...valid, assessments: ['telepathy'] }).ok).toBe(false);
    expect(validateJobPayload({ ...valid, assessments: [] }).ok).toBe(false);
    expect(validateJobPayload({ ...valid, responsibilities: [] }).ok).toBe(false);
  });

  it('rejects bad salary and dates', () => {
    expect(validateJobPayload({ ...valid, salary: { min: 5, max: 1, currency: 'USD' } }).ok).toBe(false);
    expect(validateJobPayload({ ...valid, deadline: 'not-a-date' }).ok).toBe(false);
  });
});
