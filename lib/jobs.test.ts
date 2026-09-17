import { describe, it, expect } from 'vitest';
import {
  jobPostings,
  assessmentConfigs,
  getOpenJobs,
  getJobById,
  isJobOpen,
  type AssessmentType,
} from './jobs';

describe('job postings integrity', () => {
  it('has unique non-empty ids and titles', () => {
    const ids = jobPostings.map((j) => j.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    for (const job of jobPostings) {
      expect(job.id.trim().length).toBeGreaterThan(0);
      expect(job.title.trim().length).toBeGreaterThan(0);
      expect(job.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('references only known assessment types', () => {
    const known = new Set(Object.keys(assessmentConfigs));
    for (const job of jobPostings) {
      expect(job.assessments.length).toBeGreaterThan(0);
      for (const a of job.assessments) {
        expect(known.has(a as AssessmentType)).toBe(true);
      }
    }
  });

  it('has parseable deadlines', () => {
    for (const job of jobPostings) {
      if (job.deadline) {
        expect(Number.isNaN(Date.parse(job.deadline))).toBe(false);
      }
    }
  });
});

describe('job lookups', () => {
  it('getJobById round-trips', () => {
    const first = jobPostings[0];
    expect(getJobById(first.id)?.title).toBe(first.title);
    expect(getJobById('no-such-job')).toBeUndefined();
  });

  it('getOpenJobs excludes closed jobs', () => {
    const closed = { ...jobPostings[0], id: 'closed-test', status: 'closed' as const };
    expect(isJobOpen(closed)).toBe(false);
    expect(getOpenJobs().every((j) => j.id !== 'closed-test')).toBe(true);
  });

  it('getOpenJobs excludes past-deadline jobs', () => {
    const expired = { ...jobPostings[0], id: 'expired-test', status: 'open' as const, deadline: '2000-01-01' };
    expect(isJobOpen(expired)).toBe(false);
  });

  it('isJobOpen accepts open jobs without deadlines', () => {
    expect(isJobOpen({ ...jobPostings[0], status: 'open', deadline: undefined })).toBe(true);
  });
});
