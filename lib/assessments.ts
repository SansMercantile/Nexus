import type { AssessmentType } from './jobs';
import { assessmentConfigs } from './jobs';

/**
 * Canonical assessment content + review helpers shared by the onboarding
 * page (/onboarding), the review endpoint (/api/applications/assess),
 * and unit tests. Single source of truth so client prompts, server-side
 * coverage checks, and tests can never drift apart.
 */

export const assessmentQuestions: Record<AssessmentType, string[]> = {
  'culture-fit': [
    'Describe a time you had to adapt quickly to a significant change at work. What did you do and what was the outcome?',
    'What does working in a sovereign AI infrastructure company mean to you, and how does it align with your personal values?',
    'How do you approach disagreements with teammates or leadership when you strongly believe a different direction is better?',
  ],
  communication: [
    'Describe how you would communicate a complex technical decision to a non-technical executive stakeholder.',
    'Tell us about a time your written or verbal communication directly influenced a major business outcome.',
    'How do you ensure alignment across cross-functional teams who have competing priorities?',
  ],
  'system-design': [
    'Design a high-availability job application processing system that can handle 10,000 concurrent submissions per hour. Describe the architecture.',
    'How would you design a real-time notification system that reliably delivers approval emails even during infrastructure failures?',
    'Describe the trade-offs you would make when choosing between a microservices and monolithic architecture for an AI platform with 25+ agents.',
  ],
  technical: [
    'Walk us through how you would debug a production API endpoint that intermittently returns 500 errors with no consistent pattern.',
    'Explain the difference between horizontal and vertical scaling and when you would use each for a ML inference workload.',
    'What strategies do you use to ensure database performance does not degrade as collections grow from thousands to millions of documents?',
  ],
  algorithm: [
    'Given an unsorted list of job application timestamps, describe an efficient algorithm to find all applications submitted within the same 60-minute window.',
    'How would you detect and remove duplicate job applications where the same person applied multiple times with slight email variations?',
    'Design a priority queue for processing onboarding assessments that weighs completion time, role seniority, and application date.',
  ],
  creativity: [
    'Propose a novel way Sans Mercantile could use AI to improve the candidate experience for high-volume recruiting across open positions.',
    'If you had to redesign the onboarding assessment process from scratch with no constraints, what would it look like?',
    'Describe a creative solution you implemented to a problem that initially seemed to have no good answer.',
  ],
  'systems-thinking': [
    'How would you map the interdependencies between a multi-platform AI constellation to identify single points of failure?',
    'Describe a situation where optimising one part of a system unexpectedly degraded another. How did you identify and resolve it?',
    'How do you approach capacity planning for a system where demand patterns are driven by unpredictable AI model usage?',
  ],
};

export type AssessmentDecision = 'pass' | 'reject' | 'review';

export function parseDecisionResult(raw: string): { decision: AssessmentDecision; feedback: string } {
  try {
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonText = raw.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonText);
      return {
        decision:
          parsed.decision === 'pass' || parsed.decision === 'reject' || parsed.decision === 'review'
            ? parsed.decision
            : 'review',
        feedback: typeof parsed.feedback === 'string' ? parsed.feedback.trim() : raw.trim(),
      };
    }
  } catch {
    // ignore parse errors and fall back to raw text
  }

  return { decision: 'review', feedback: raw.trim() };
}

/**
 * Returns the required answer keys (`<assessment>-q<index>`) that are
 * missing or blank. Empty array means full coverage.
 */
export function getMissingAnswers(
  jobAssessments: AssessmentType[],
  responses: Record<string, unknown>
): string[] {
  const missing: string[] = [];
  for (const assessmentId of jobAssessments) {
    const questions = assessmentQuestions[assessmentId] || [];
    questions.forEach((_, i) => {
      const key = `${assessmentId}-q${i}`;
      const value = responses[key];
      if (typeof value !== 'string' || value.trim().length === 0) {
        missing.push(key);
      }
    });
  }
  return missing;
}

/**
 * Retake policy: assessments are single-attempt. Once `assessmentReview`
 * exists, further finals are rejected unless the hiring administrator has
 * granted retake allowances (`retakesAllowed`, consumed one per final).
 */
export const RETAKE_ADMIN_EMAIL = 'hello@sansmercantile.com';

export const RETAKE_DENIED_MESSAGE =
  'This assessment has already been submitted. To request a retake, contact hello@sansmercantile.com.';

export function canSubmitFinal(application: {
  assessmentReview?: unknown;
  retakesAllowed?: unknown;
  [key: string]: unknown;
}): { allowed: boolean; consumesRetake: boolean } {
  if (!application.assessmentReview) return { allowed: true, consumesRetake: false };
  if (typeof application.retakesAllowed === 'number' && application.retakesAllowed > 0) {
    return { allowed: true, consumesRetake: true };
  }
  return { allowed: false, consumesRetake: false };
}

/** Every assessment type must have questions and a config entry. */
export function validateAssessmentCatalog(): string[] {
  const problems: string[] = [];
  const types = Object.keys(assessmentConfigs) as AssessmentType[];
  for (const t of types) {
    const questions = assessmentQuestions[t];
    if (!questions || questions.length === 0) {
      problems.push(`Assessment '${t}' has no questions.`);
    } else {
      questions.forEach((q, i) => {
        if (!q || q.trim().length === 0) problems.push(`Assessment '${t}' question ${i} is empty.`);
      });
    }
  }
  return problems;
}
