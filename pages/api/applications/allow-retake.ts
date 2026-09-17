import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { getPortalSessionUser } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { isValidEmail } from '@/lib/validation';
import { RETAKE_ADMIN_EMAIL } from '@/lib/assessments';

/**
 * POST /api/applications/allow-retake
 * Grants a candidate additional assessment attempts. Restricted to the
 * hiring administrator session (hello@sansmercantile.com).
 *
 * Body: { email, jobId, count? } — count defaults to 1, clamped to 1..5.
 *
 * Example (signed in as the hiring admin):
 *   curl -X POST https://www.sansmercantile.com/api/applications/allow-retake/ \
 *     -H 'Content-Type: application/json' \
 *     -b 'portal_session=<session-cookie>' \
 *     -d '{"email":"candidate@example.com","jobId":"director-ai-product-strategy","count":1}'
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'applications-allow-retake', 30, 60 * 60 * 1000)) return;

  const session = await getPortalSessionUser(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  if (session.email.toLowerCase() !== RETAKE_ADMIN_EMAIL) {
    return res.status(403).json({ success: false, message: 'Only the hiring administrator can permit retakes.' });
  }

  const { email, jobId, count } = (req.body || {}) as {
    email?: unknown;
    jobId?: unknown;
    count?: unknown;
  };

  if (typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'A valid candidate email is required.' });
  }
  if (typeof jobId !== 'string' || jobId.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'jobId is required.' });
  }
  const grants = typeof count === 'number' && Number.isInteger(count) ? Math.min(5, Math.max(1, count)) : 1;

  try {
    const db = await getDb();
    const application = await db.collection('job_applications').findOne({
      applicantEmail: email.toLowerCase(),
      jobId: jobId.trim(),
    });
    if (!application) {
      return res.status(404).json({ success: false, message: 'No application found for that email and position.' });
    }

    await db
      .collection('job_applications')
      .updateOne({ _id: application._id }, { $inc: { retakesAllowed: grants } });

    const current = typeof application.retakesAllowed === 'number' ? application.retakesAllowed : 0;
    return res.status(200).json({
      success: true,
      retakesAllowed: current + grants,
      status: application.status,
      attempts: Array.isArray(application.assessmentAttempts) ? application.assessmentAttempts.length : 0,
    });
  } catch (error) {
    console.error('Allow-retake error:', error);
    return res.status(500).json({ success: false, message: 'Unable to grant retake.' });
  }
}
