import { describe, it, expect } from 'vitest';
import { validateDepartment, SEED_DEPARTMENTS } from './departments';

describe('validateDepartment', () => {
  const valid = {
    id: 'technical-support',
    name: 'Technical Support',
    description: 'Incident triage and debugging.',
    tools: [{ name: 'Diagnostics', description: 'Health checks.', route: '/api/diag' }],
    active: true,
  };

  it('accepts a complete department', () => {
    expect(validateDepartment(valid).ok).toBe(true);
  });

  it('rejects bad ids, names, and descriptions', () => {
    expect(validateDepartment({ ...valid, id: 'Bad ID!' }).ok).toBe(false);
    expect(validateDepartment({ ...valid, name: '' }).ok).toBe(false);
    expect(validateDepartment({ ...valid, description: '' }).ok).toBe(false);
    expect(validateDepartment(null).ok).toBe(false);
  });

  it('requires at least one well-formed tool', () => {
    expect(validateDepartment({ ...valid, tools: [] }).ok).toBe(false);
    expect(validateDepartment({ ...valid, tools: [{ name: '', description: 'x' }] }).ok).toBe(false);
    expect(validateDepartment({ ...valid, tools: [{ name: 'x', description: '' }] }).ok).toBe(false);
  });
});

describe('seed departments', () => {
  it('covers the baseline plus support and legal teams', () => {
    const ids = SEED_DEPARTMENTS.map((dept) => dept.id);
    for (const required of [
      'executive',
      'hr',
      'dev',
      'communications',
      'cbdo',
      'technical-support',
      'customer-support',
      'legal',
    ]) {
      expect(ids).toContain(required);
    }
  });

  it('gives every department at least one tool', () => {
    for (const dept of SEED_DEPARTMENTS) {
      expect(dept.tools.length).toBeGreaterThan(0);
      expect(validateDepartment(dept).ok).toBe(true);
    }
  });

  it('has unique ids', () => {
    const ids = SEED_DEPARTMENTS.map((dept) => dept.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
