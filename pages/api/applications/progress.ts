import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { enforceRateLimit } from '@/lib/rate-limit';
import { findMergedJob } from '@/lib/job-board';
import type { AssessmentType } from '@/lib/jobs';

/**
 * POST /api/applications/progress — record a completed section with a
 * server timestamp. Idempotent (earliest completion wins) and order-checked:
 * sections must be completed in job order. The final review verifies the
 * recorded order and pacing; missing or rushed sections force human review.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'applications-progress', 120, 60 * 60 * 1000)) return;

  const { token, jobId, email, nonce, assessmentId } = (req.body || {}) as {
    token?: unknown;
    jobId?: unknown;
    email?: unknown;
    nonce?: unknown;
    assessmentId?: unknown;
  };

  if (typeof token !== 'string' || token.length === 0) {
    return res.status(400).json({ success: false, message: 'token is required.' });
  }
  if (typeof jobId !== 'string' || jobId.length === 0 || typeof email !== 'string' || email.length === 0) {
    return res.status(400).json({ success: false, message: 'jobId and email are required.' });
  }
  if (typeof nonce !== 'string' || nonce.length === 0 || typeof assessmentId !== 'string' || assessmentId.length === 0) {
    return res.status(400).json({ success: false, message: 'nonce and assessmentId are required.' });
  }

  const job = await findMergedJob(jobId);
  if (!job) {
    return res.status(400).json({ success: false, message: 'Unknown position for this exam session.' });
  }
  if (!(job.assessments as string[]).includes(assessmentId)) {
    return res.status(400).json({ success: false, message: 'Unknown assessment for this position.' });
  }

  try {
    const db = await getDb();
    const application = await db.collection('job_applications').findOne({ viewToken: token });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or invalid token.' });
    }
    if (application.jobId !== jobId || application.applicantEmail !== email) {
      return res.status(403).json({ success: false, message: 'Application token does not match this session.' });
    }
    const session = (application.examSession || {}) as Record<string, unknown>;
    if (typeof session.nonce !== 'string' || session.nonce !== nonce) {
      return res.status(403).json({
        success: false,
        message: 'Exam session is invalid or expired. Re-open the assessment from your confirmation email link.',
      });
    }

    // Order check: every earlier section in job order must already be recorded.
    const order = job.assessments as AssessmentType[];
    const sections = (session.sections || {}) as Record<string, unknown>;
    const missingEarlier = order.slice(0, order.indexOf(assessmentId as AssessmentType)).filter((id) => !sections[id]);
    if (missingEarlier.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Complete previous sections first: ${missingEarlier.join(', ')}.`,
      });
    }

    const key = `examSession.sections.${assessmentId}`;
    const already = sections[assessmentId];
    if (typeof already !== 'string') {
      await db.collection('job_applications').updateOne(
        { _id: application._id },
        { $set: { [key]: new Date().toISOString() } }
      );
    }
    return res.status(200).json({ success: true, recorded: typeof already !== 'string' });
  } catch (error) {
    console.error('Exam progress error:', error);
    return res.status(500).json({ success: false, message: 'Unable to record progress.' });
  }
}
