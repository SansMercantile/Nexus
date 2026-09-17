import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { generateAiText } from '@/lib/bedrock-client';
import { sendApplicationAssessmentResult } from '@/lib/mailer';
import { enforceRateLimit } from '@/lib/rate-limit';
import { parseDecisionResult, getMissingAnswers } from '@/lib/assessments';
import { getJobById } from '@/lib/jobs';
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

  const job = getJobById(normalizedJobId);
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

    const prompt = buildReviewPrompt(application, assessmentResponses);
    const aiResult = await generateAiText(prompt);
    const rawText = typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult);
    const { decision, feedback } = parseDecisionResult(rawText);

    // Attempt history: retakes stay visible to reviewers instead of silently
    // overwriting the previous verdict. Latest attempt drives the status.
    const priorAttempts = Array.isArray(application.assessmentAttempts)
      ? application.assessmentAttempts.length
      : application.assessmentReview
        ? 1
        : 0;
    const reviewedAt = new Date().toISOString();
    const attempt = {
      decision,
      feedback,
      rawResult: rawText,
      responseCount: Object.keys(assessmentResponses).length,
      reviewedAt,
    };

    const update = {
      status: decision === 'pass' ? 'passed' : decision === 'reject' ? 'rejected' : 'review',
      assessmentReview: {
        decision,
        feedback,
        rawResult: rawText,
        reviewedAt,
        attempt: priorAttempts + 1,
      },
    };

    await db.collection('job_applications').updateOne(
      { _id: application._id },
      {
        $set: update,
        $push: { assessmentAttempts: { $each: [attempt], $slice: -10 } },
      }
    );

    try {
      await sendApplicationAssessmentResult({
        name: application.applicantName,
        email: application.applicantEmail,
        jobTitle: application.jobTitle,
        decision,
        feedback,
      });
    } catch (emailError) {
      console.error('Sending assessment result email failed:', emailError);
    }

    return res.status(200).json({ success: true, decision, feedback, attempt: priorAttempts + 1 });
  } catch (error) {
    console.error('Assessment processing error:', error);
    return res.status(500).json({ success: false, message: 'Unable to review assessment. Please try again later.' });
  }
}
