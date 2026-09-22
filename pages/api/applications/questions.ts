import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { enforceRateLimit } from '@/lib/rate-limit';
import { findMergedJob } from '@/lib/job-board';
import { assessmentQuestions } from '@/lib/assessments';
import type { AssessmentType } from '@/lib/jobs';

/**
 * GET /api/applications/questions?token=&jobId=&email=&assessmentId=
 * Releases one section's questions at a time. Requires a live exam session
 * and completion of all earlier sections, so questions cannot be pre-read
 * or answered out of order.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'applications-questions', 120, 60 * 60 * 1000)) return;

  const token = typeof req.query.token === 'string' ? req.query.token : '';
  const jobId = typeof req.query.jobId === 'string' ? req.query.jobId : '';
  const email = typeof req.query.email === 'string' ? req.query.email : '';
  const assessmentId = typeof req.query.assessmentId === 'string' ? req.query.assessmentId : '';

  if (!token) {
    return res.status(400).json({ success: false, message: 'token is required.' });
  }
  if (!jobId || !email || !assessmentId) {
    return res.status(400).json({ success: false, message: 'jobId, email, and assessmentId are required.' });
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
    if (typeof session.startedAt !== 'string') {
      return res.status(403).json({
        success: false,
        message: 'No exam session. Begin the assessment from your confirmation email link.',
      });
    }

    const order = job.assessments as AssessmentType[];
    const sections = (session.sections || {}) as Record<string, unknown>;
    const missingEarlier = order.slice(0, order.indexOf(assessmentId as AssessmentType)).filter((id) => !sections[id]);
    if (missingEarlier.length > 0) {
      return res.status(403).json({
        success: false,
        message: `Complete previous sections first: ${missingEarlier.join(', ')}.`,
      });
    }

    return res.status(200).json({
      success: true,
      assessmentId,
      questions: assessmentQuestions[assessmentId as AssessmentType] || [],
    });
  } catch (error) {
    console.error('Exam questions error:', error);
    return res.status(500).json({ success: false, message: 'Unable to load questions.' });
  }
}
