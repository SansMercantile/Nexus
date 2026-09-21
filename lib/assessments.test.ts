import { describe, it, expect } from 'vitest';
import {
  assessmentQuestions,
  parseDecisionResult,
  getMissingAnswers,
  validateAssessmentCatalog,
  canSubmitFinal,
  evaluateIntegrity,
  countCheatEvents,
  RETAKE_ADMIN_EMAIL,
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

describe('assessment catalog integrity', () => {  it('has no catalog problems', () => {
    expect(validateAssessmentCatalog()).toEqual([]);
  });

  it('covers exactly the configured assessment types', () => {
    expect(new Set(Object.keys(assessmentQuestions))).toEqual(new Set(Object.keys(assessmentConfigs)));
  });
});

describe('retake policy', () => {
  it('names the hiring administrator', () => {
    expect(RETAKE_ADMIN_EMAIL).toBe('hello@sansmercantile.com');
  });

  it('allows a first submission', () => {
    expect(canSubmitFinal({})).toEqual({ allowed: true, consumesRetake: false });
  });

  it('denies a repeat submission without an allowance', () => {
    expect(canSubmitFinal({ assessmentReview: { decision: 'pass' } })).toEqual({
      allowed: false,
      consumesRetake: false,
    });
    expect(canSubmitFinal({ assessmentReview: { decision: 'pass' }, retakesAllowed: 0 })).toEqual({
      allowed: false,
      consumesRetake: false,
    });
  });

  it('allows a repeat submission while consuming an allowance', () => {
    expect(canSubmitFinal({ assessmentReview: { decision: 'reject' }, retakesAllowed: 2 })).toEqual({
      allowed: true,
      consumesRetake: true,
    });
  });

  it('ignores non-numeric allowances', () => {
    expect(canSubmitFinal({ assessmentReview: {}, retakesAllowed: 'yes' })).toEqual({
      allowed: false,
      consumesRetake: false,
    });
  });
});

describe('evaluateIntegrity', () => {
  const fullAnswers = { 'technical-q0': 'a'.repeat(50), 'technical-q1': 'b'.repeat(50) };
  const attestation = (startedAt: string) => ({ camera: true, mic: true, screen: true, startedAt });

  it('flags nothing for a clean supervised session', () => {
    const now = Date.now();
    const result = evaluateIntegrity({
      proctoring: attestation(new Date(now - 30 * 60 * 1000).toISOString()),
      submittedAt: now,
      cheatEventCount: 0,
      answers: fullAnswers,
      questionCount: 2,
    });
    expect(result.flags).toEqual([]);
    expect(result.durationMs).toBeGreaterThan(0);
  });

  it('flags missing proctoring attestation', () => {
    const result = evaluateIntegrity({
      proctoring: { camera: true, mic: false, screen: true, startedAt: new Date().toISOString() },
      cheatEventCount: 0,
      answers: fullAnswers,
      questionCount: 2,
    });
    expect(result.flags).toContain('no-proctoring-attestation');
  });

  it('flags absent or future timing', () => {
    expect(
      evaluateIntegrity({ cheatEventCount: 0, answers: fullAnswers, questionCount: 2 }).flags
    ).toContain('invalid-timing');
    const future = evaluateIntegrity({
      proctoring: attestation(new Date(Date.now() + 60_000).toISOString()),
      cheatEventCount: 0,
      answers: fullAnswers,
      questionCount: 2,
    });
    expect(future.flags).toContain('invalid-timing');
  });

  it('flags script-speed submissions', () => {
    const now = Date.now();
    const result = evaluateIntegrity({
      proctoring: attestation(new Date(now - 30_000).toISOString()),
      submittedAt: now,
      cheatEventCount: 0,
      answers: fullAnswers,
      questionCount: 2,
    });
    expect(result.flags).toContain('too-fast');
  });

  it('flags excessive violations', () => {
    const now = Date.now();
    const result = evaluateIntegrity({
      proctoring: attestation(new Date(now - 30 * 60 * 1000).toISOString()),
      submittedAt: now,
      cheatEventCount: 11,
      answers: fullAnswers,
      questionCount: 2,
    });
    expect(result.flags).toContain('excessive-violations');
  });

  it('flags thin answers', () => {
    const now = Date.now();
    const result = evaluateIntegrity({
      proctoring: attestation(new Date(now - 30 * 60 * 1000).toISOString()),
      submittedAt: now,
      cheatEventCount: 0,
      answers: { 'technical-q0': 'ok', 'technical-q1': 'fine' },
      questionCount: 2,
    });
    expect(result.flags).toContain('thin-answers');
  });
});

describe('countCheatEvents', () => {
  it('counts violation-type events only', () => {
    expect(
      countCheatEvents([
        { event: 'cheat_alert' },
        { event: 'exam_copy_paste_blocked' },
        { event: 'exam_window_blur' },
        { event: 'onboarding_completed' },
        { event: 'assessment_completed' },
        { event: 'exam_proctoring_ready' },
        { nope: true },
        null,
      ])
    ).toBe(3);
  });

  it('handles non-arrays', () => {
    expect(countCheatEvents(undefined)).toBe(0);
    expect(countCheatEvents('cheat_alert')).toBe(0);
  });
});
