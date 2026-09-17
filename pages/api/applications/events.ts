import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { enforceRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/applications/events
 * Records candidate-side exam integrity signals (tab switches, pastes,
 * proctoring milestones) against the application record. The viewToken
 * proves the caller owns the application; events are append-only and
 * capped so a chatty client cannot grow the document unboundedly.
 */

const MAX_EVENTS = 200;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'applications-events', 60, 60 * 60 * 1000)) return;

  const { token, jobId, email, event, props } = (req.body || {}) as {
    token?: unknown;
    jobId?: unknown;
    email?: unknown;
    event?: unknown;
    props?: unknown;
  };

  if (typeof token !== 'string' || token.length === 0 || typeof event !== 'string' || event.length === 0) {
    return res.status(400).json({ success: false, message: 'token and event are required.' });
  }
  if (event.length > 80 || (jobId !== undefined && typeof jobId !== 'string')) {
    return res.status(400).json({ success: false, message: 'Invalid event payload.' });
  }

  try {
    const db = await getDb();
    const application = await db.collection('job_applications').findOne({ viewToken: token });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or invalid token.' });
    }

    const record = {
      event,
      jobId: typeof jobId === 'string' ? jobId : application.jobId,
      email: typeof email === 'string' ? email.slice(0, 254) : application.applicantEmail,
      props: props && typeof props === 'object' ? props : {},
      at: new Date().toISOString(),
    };

    await db
      .collection('job_applications')
      .updateOne({ _id: application._id }, { $push: { assessmentEvents: { $each: [record], $slice: -MAX_EVENTS } } });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Application event error:', error);
    return res.status(500).json({ success: false, message: 'Unable to record event.' });
  }
}
