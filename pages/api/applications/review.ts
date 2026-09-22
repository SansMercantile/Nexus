import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { getPortalSessionUser } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';

/**
 * GET /api/applications/review (portal admin session required)
 * Review queue for hiring: applications with verdicts, integrity flags,
 * attempts, and proctoring evidence.
 *
 * Query: jobId? flagged=1 (only integrity-flagged) | limit? (default 50, max 200)
 *        token=<viewToken> for one full record incl. answers and events.
 */

function summarize(doc: Record<string, unknown>) {
  const review = (doc.assessmentReview || {}) as Record<string, unknown>;
  const integrity = (review.integrity || {}) as Record<string, unknown>;
  const attempts = Array.isArray(doc.assessmentAttempts) ? doc.assessmentAttempts.length : 0;
  return {
    applicantName: doc.applicantName,
    applicantEmail: doc.applicantEmail,
    jobId: doc.jobId,
    jobTitle: doc.jobTitle,
    status: doc.status,
    appliedAt: doc.appliedAt,
    decision: review.decision ?? null,
    reviewedAt: review.reviewedAt ?? null,
    integrityFlags: Array.isArray(integrity.flags) ? integrity.flags : [],
    attempts,
    retakesAllowed: typeof doc.retakesAllowed === 'number' ? doc.retakesAllowed : 0,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const session = await getPortalSessionUser(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (!enforceRateLimit(req, res, 'applications-review', 60, 60 * 60 * 1000)) return;

  try {
    const db = await getDb();
    const collection = db.collection('job_applications');

    if (typeof req.query.token === 'string' && req.query.token.length > 0) {
      const doc = await collection.findOne({ viewToken: req.query.token });
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }
      const record = doc as unknown as Record<string, unknown>;
      const events = Array.isArray(record.assessmentEvents) ? record.assessmentEvents : [];
      const attempts = Array.isArray(record.assessmentAttempts) ? record.assessmentAttempts : [];
      return res.status(200).json({
        success: true,
        application: {
          ...summarize(record),
          answers: record.assessmentResponses ?? null,
          attempts,
          events: events.slice(-100),
          examSession: record.examSession ?? null,
        },
      });
    }

    const filter: Record<string, unknown> = {};
    if (typeof req.query.jobId === 'string' && req.query.jobId.length > 0) {
      filter.jobId = req.query.jobId;
    }
    const limit = Math.min(
      200,
      Math.max(1, parseInt(typeof req.query.limit === 'string' ? req.query.limit : '50', 10) || 50)
    );
    const docs = await collection.find(filter).sort({ updatedAt: -1, appliedAt: -1 }).limit(limit).toArray();
    let applications = docs.map((doc) => summarize(doc as unknown as Record<string, unknown>));
    if (req.query.flagged === '1') {
      applications = applications.filter((app) => app.integrityFlags.length > 0);
    }
    return res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('Application review error:', error);
    return res.status(500).json({ success: false, message: 'Unable to load review queue.' });
  }
}
