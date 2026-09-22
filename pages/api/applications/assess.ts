import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { generateAiText } from '@/lib/bedrock-client';
import { sendApplicationAssessmentResult } from '@/lib/mailer';
import { enforceRateLimit } from '@/lib/rate-limit';
import {
  parseDecisionResult,
  getMissingAnswers,
  canSubmitFinal,
  RETAKE_DENIED_MESSAGE,
  evaluateIntegrity,
  evaluateProgression,
  countCheatEvents,
  MIN_EXAM_DURATION_MS,
} from '@/lib/assessments';
import { findMergedJob } from '@/lib/job-board';
import type { AssessmentType } from '@/lib/jobs';

function normalizeEmail(email: unknown) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function buildReviewPrompt(application: any, responses: Record<string, string>) {
  const responseEntries = Object.entries(responses)
    .map(([key, value]) => `- ${key}: ${value.trim()}`)
    .join('\n');

  return `You are an experienced talent reviewer at a high-growth AI infrastructure company. Review the candidate's application and assessment responses below.

Job title: ${application.jobTitle}
Applicant name: ${application.applicantName}
Applicant email: ${application.applicantEmail}
LinkedIn: ${application.linkedin || 'N/A'}
Social links: ${Array.isArray(application.socialLinks) ? application.socialLinks.join(', ') : 'N/A'}
Resume / CV: ${application.resume.slice(0, 512)}${application.resume.length > 512 ? '... [truncated]' : ''}

Assessment responses:
${responseEntries}

Provide a concise recommendation in the form of a JSON object with keys:
- decision: one of pass, reject, review
- feedback: a short paragraph explaining the rationale and any improvement suggestions

Only return valid JSON. Do not add any additional commentary outside the JSON object.`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { token, jobId, email, assessmentResponses } = req.body as {
    token?: string;
    jobId?: string;
    email?: string;
    assessmentResponses?: Record<string, string>;
  };

  // Candidate-facing but unauthenticated: strict quota (possession of the
  // emailed application token is the authorization factor).
  if (!enforceRateLimit(req, res, 'applications-assess', 10, 60 * 60 * 1000)) return;

  const normalizedToken = typeof token === 'string' ? token.trim() : '';
  const normalizedJobId = typeof jobId === 'string' ? jobId.trim() : '';
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedToken || !normalizedJobId || !normalizedEmail || !assessmentResponses || Object.keys(assessmentResponses).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: token, jobId, email, and assessmentResponses are required.',
    });
  }

  const job = await findMergedJob(normalizedJobId);
  if (!job) {
    return res.status(400).json({ success: false, message: 'Unknown position for these assessment responses.' });
  }

  // Server-side coverage gate: the client enforces per-section completion,
  // but the API must not trust it. Every required question key must be present.
  const missing = getMissingAnswers(job.assessments as AssessmentType[], assessmentResponses);
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Incomplete assessment submission. Missing answers for: ${missing.join(', ')}.`,
    });
  }

  try {
    const db = await getDb();
    const application = await db.collection('job_applications').findOne({ viewToken: normalizedToken });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or invalid token.' });
    }

    if (application.jobId !== normalizedJobId || application.applicantEmail !== normalizedEmail) {
      return res.status(403).json({ success: false, message: 'Application token does not match the provided job or email.' });
    }

    // Single-attempt policy: no retakes without an admin-granted allowance.
    // Checked here (fast path, saves the AI call) and again atomically at write time.
    const gate = canSubmitFinal(application);
    if (!gate.allowed) {
      return res.status(403).json({ success: false, message: RETAKE_DENIED_MESSAGE });
    }

    const prompt = buildReviewPrompt(application, assessmentResponses);
    const aiResult = await generateAiText(prompt);
    const rawText = typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult);
    const { decision, feedback } = parseDecisionResult(rawText);

    // Anti-cheat enforcement: re-verify everything observable server-side.
    // Client proctoring can be bypassed, so any integrity flag forces a
    // human 'review' verdict instead of an AI pass. The exam clock, section
    // order, and pacing all come from server-recorded state — client
    // timestamps are treated as untrusted evidence only.
    const bodyRecord = req.body as Record<string, unknown>;
    const rawProctoring = bodyRecord.proctoring;
    const proctoring =
      rawProctoring !== null && typeof rawProctoring === 'object'
        ? (rawProctoring as Record<string, unknown>)
        : null;
    const sessionRecord = (application.examSession || {}) as Record<string, unknown>;
    if (
      typeof bodyRecord.nonce !== 'string' ||
      typeof sessionRecord.nonce !== 'string' ||
      bodyRecord.nonce !== sessionRecord.nonce
    ) {
      return res.status(403).json({
        success: false,
        message: 'Exam session is invalid or expired. Re-open the assessment from your confirmation email link.',
      });
    }
    const cheatEventCount = countCheatEvents(application.assessmentEvents);
    const integrity = evaluateIntegrity({
      proctoring,
      cheatEventCount,
      answers: assessmentResponses,
      questionCount: Object.keys(assessmentResponses).length,
    });
    const flags = [...integrity.flags];
    // Server clock: duration measured from the session opened by
    // /api/applications/begin — immune to fabricated client timestamps.
    const serverStartedMs =
      typeof sessionRecord.startedAt === 'string' ? Date.parse(sessionRecord.startedAt) : NaN;
    if (Number.isNaN(serverStartedMs)) {
      flags.push('no-server-session-clock');
    } else if (Date.now() - serverStartedMs < MIN_EXAM_DURATION_MS) {
      flags.push('too-fast');
    }
    // Ordered progression from server-recorded section completions.
    const sectionEpochs: Record<string, number> = {};
    const storedSections = sessionRecord.sections;
    if (storedSections !== null && typeof storedSections === 'object') {
      Object.keys(storedSections as Record<string, unknown>).forEach((key) => {
        const value = (storedSections as Record<string, unknown>)[key];
        if (typeof value === 'string') {
          const epoch = Date.parse(value);
          if (!Number.isNaN(epoch)) sectionEpochs[key] = epoch;
        }
      });
    }
    const progression = evaluateProgression(job.assessments as AssessmentType[], sectionEpochs);
    if (progression.missing.length > 0) flags.push('unverified-progression');
    if (progression.rushed) flags.push('rushed-progression');
    const finalDecision = flags.length > 0 ? 'review' : decision;
    const finalFeedback =
      flags.length > 0
        ? `${feedback}\n\nIntegrity flags requiring human review: ${flags.join(', ')}.`
        : feedback;
    const integrityRecord = {
      flags,
      cheatEventCount,
      durationMs: Number.isNaN(serverStartedMs) ? integrity.durationMs : Date.now() - serverStartedMs,
      proctoring: {
        camera: proctoring?.camera === true,
        mic: proctoring?.mic === true,
        screen: proctoring?.screen === true,
        startedAt: typeof proctoring?.startedAt === 'string' ? proctoring.startedAt : null,
      },
    };

    // Attempt history: retakes stay visible to reviewers instead of silently
    // overwriting the previous verdict. Latest attempt drives the status.
    const priorAttempts = Array.isArray(application.assessmentAttempts)
      ? application.assessmentAttempts.length
      : application.assessmentReview
        ? 1
        : 0;
    const reviewedAt = new Date().toISOString();
    const attempt = {
      decision: finalDecision,
      feedback: finalFeedback,
      rawResult: rawText,
      responseCount: Object.keys(assessmentResponses).length,
      integrity: integrityRecord,
      reviewedAt,
    };

    const update = {
      status: finalDecision === 'pass' ? 'passed' : finalDecision === 'reject' ? 'rejected' : 'review',
      assessmentReview: {
        decision: finalDecision,
        feedback: finalFeedback,
        rawResult: rawText,
        integrity: integrityRecord,
        reviewedAt,
        attempt: priorAttempts + 1,
      },
      // Single-use nonce: the session cannot finalize twice.
      'examSession.nonce': null,
      'examSession.completedAt': reviewedAt,
    };

    // Atomic claim: the write only lands if no review exists yet or a retake
    // allowance is still available. This closes the double-submit race
    // (two tabs, retry storms) that the fast-path gate above cannot see.
    const claim = await db.collection('job_applications').updateOne(
      {
        _id: application._id,
        $or: [{ assessmentReview: { $exists: false } }, { retakesAllowed: { $gt: 0 } }],
      },
      {
        $set: update,
        ...(gate.consumesRetake ? { $inc: { retakesAllowed: -1 } } : {}),
        $push: { assessmentAttempts: { $each: [attempt], $slice: -10 } },
      }
    );

    if (claim.modifiedCount === 0) {
      return res.status(409).json({
        success: false,
        message: 'Another submission was just recorded for this application. Contact hello@sansmercantile.com if you need a retake.',
      });
    }

    try {
      await sendApplicationAssessmentResult({
        name: application.applicantName,
        email: application.applicantEmail,
        jobTitle: application.jobTitle,
        decision: finalDecision,
        feedback: finalFeedback,
      });
    } catch (emailError) {
      console.error('Sending assessment result email failed:', emailError);
    }

    return res.status(200).json({
      success: true,
      decision: finalDecision,
      feedback: finalFeedback,
      integrityFlags: integrityRecord.flags,
      attempt: priorAttempts + 1,
    });
  } catch (error) {
    console.error('Assessment processing error:', error);
    return res.status(500).json({ success: false, message: 'Unable to review assessment. Please try again later.' });
  }
}
