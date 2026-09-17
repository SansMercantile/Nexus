import { describe, it, expect } from 'vitest';
import {
  assessmentQuestions,
  parseDecisionResult,
  getMissingAnswers,
  validateAssessmentCatalog,
} from './assessments';
import { assessmentConfigs, type AssessmentType } from './jobs';

describe('parseDecisionResult', () => {
  it('parses clean JSON verdicts', () => {
    expect(parseDecisionResult('{"decision":"pass","feedback":"Strong fit."}')).toEqual({
      decision: 'pass',
      feedback: 'Strong fit.',
    });
  });

  it('extracts JSON embedded in prose', () => {
    expect(parseDecisionResult('Analysis complete.\n{"decision": "reject", "feedback": "Lacks depth."}\nDone.')).toEqual({
      decision: 'reject',
      feedback: 'Lacks depth.',
    });
  });

  it('defaults unknown decisions to review', () => {
    const result = parseDecisionResult('{"decision":"maybe","feedback":"Unclear."}');
    expect(result.decision).toBe('review');
    expect(result.feedback).toBe('Unclear.');
  });

  it('falls back to raw text when no JSON is present', () => {
    const result = parseDecisionResult('The candidate shows promise across all areas.');
    expect(result).toEqual({ decision: 'review', feedback: 'The candidate shows promise across all areas.' });
  });
});

describe('getMissingAnswers', () => {
  const assessments: AssessmentType[] = ['technical', 'communication'];

  it('returns empty for full coverage', () => {
    const responses: Record<string, string> = {};
    for (const id of assessments) {
      assessmentQuestions[id].forEach((_, i) => {
        responses[`${id}-q${i}`] = 'an answer';
      });
    }
    expect(getMissingAnswers(assessments, responses)).toEqual([]);
  });

  it('flags blank and absent answers', () => {
    const responses: Record<string, string> = { 'technical-q0': 'x', 'technical-q1': '   ' };
    const missing = getMissingAnswers(assessments, responses);
    expect(missing).toContain('technical-q1');
    expect(missing).toContain('technical-q2');
    expect(missing).toContain('communication-q0');
    expect(missing).not.toContain('technical-q0');
  });

  it('ignores non-string values', () => {
    const missing = getMissingAnswers(['technical'], { 'technical-q0': 42 } as unknown as Record<string, string> );
    expect(missing).toContain('technical-q0');
  });
});

describe('assessment catalog integrity', () => {
  it('has no catalog problems', () => {
    expect(validateAssessmentCatalog()).toEqual([]);
  });

  it('covers exactly the configured assessment types', () => {
    expect(new Set(Object.keys(assessmentQuestions))).toEqual(new Set(Object.keys(assessmentConfigs)));
  });
});
