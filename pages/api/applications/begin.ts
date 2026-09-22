import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { enforceRateLimit } from '@/lib/rate-limit';
import { findMergedJob } from '@/lib/job-board';

/**
 * POST /api/applications/begin — open (or resume) a server-timed exam session.
 *
 * The server records the exam clock: `startedAt` is set once and never reset,
 * and a fresh single-purpose `nonce` is issued per call. The final review
 * requires the nonce and measures duration from the server timestamp, so
 * fabricated client timelines and instant script submissions are observable.
 * Safe to call again after a refresh (same clock, new nonce).
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'applications-begin', 30, 60 * 60 * 1000)) return;

  const { token, jobId, email } = (req.body || {}) as {
    token?: unknown;
    jobId?: unknown;
    email?: unknown;
  };

  if (typeof token !== 'string' || token.length === 0) {
    return res.status(400).json({ success: false, message: 'token is required.' });
  }
  if (typeof jobId !== 'string' || jobId.length === 0 || typeof email !== 'string' || email.length === 0) {
    return res.status(400).json({ success: false, message: 'jobId and email are required.' });
  }

  const job = await findMergedJob(jobId);
  if (!job) {
    return res.status(400).json({ success: false, message: 'Unknown position for this exam session.' });
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

    const now = new Date().toISOString();
    const nonce = crypto.randomBytes(24).toString('hex');
    const session = (application.examSession || {}) as Record<string, unknown>;
    const startedAt = typeof session.startedAt === 'string' ? (session.startedAt as string) : now;

    await db.collection('job_applications').updateOne(
      { _id: application._id },
      { $set: { 'examSession.nonce': nonce, 'examSession.startedAt': startedAt } }
    );

    const sections =
      session.sections !== null && typeof session.sections === 'object'
        ? Object.keys(session.sections as Record<string, unknown>)
        : [];

    return res.status(200).json({ success: true, nonce, startedAt, sections });
  } catch (error) {
    console.error('Exam begin error:', error);
    return res.status(500).json({ success: false, message: 'Unable to open an exam session.' });
  }
}
