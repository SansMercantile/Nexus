import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { generateGemma } from '@/lib/gemma-client';
import { sendApplicationAssessmentResult } from '@/lib/mailer';

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

function parseDecisionResult(raw: string) {
  try {
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonText = raw.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonText);
      return {
        decision: parsed.decision === 'pass' || parsed.decision === 'reject' || parsed.decision === 'review' ? parsed.decision : 'review',
        feedback: typeof parsed.feedback === 'string' ? parsed.feedback.trim() : raw.trim(),
      };
    }
  } catch (error) {
    // ignore parse errors and fall back to raw text
  }

  return { decision: 'review' as const, feedback: raw.trim() };
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

  const normalizedToken = typeof token === 'string' ? token.trim() : '';
  const normalizedJobId = typeof jobId === 'string' ? jobId.trim() : '';
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedToken || !normalizedJobId || !normalizedEmail || !assessmentResponses || Object.keys(assessmentResponses).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: token, jobId, email, and assessmentResponses are required.',
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
    const aiResult = await generateGemma(prompt);
    const rawText = typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult);
    const { decision, feedback } = parseDecisionResult(rawText);

    const update = {
      status: decision === 'pass' ? 'passed' : decision === 'reject' ? 'rejected' : 'review',
      assessmentReview: {
        decision,
        feedback,
        rawResult: rawText,
        reviewedAt: new Date().toISOString(),
      },
    };

    await db.collection('job_applications').updateOne({ _id: application._id }, { $set: update });

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

    return res.status(200).json({ success: true, decision, feedback });
  } catch (error) {
    console.error('Assessment processing error:', error);
    return res.status(500).json({ success: false, message: 'Unable to review assessment. Please try again later.' });
  }
}
