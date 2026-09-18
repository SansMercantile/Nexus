import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { enforceRateLimit } from '@/lib/rate-limit';
import { mergeBoard, type BoardListing } from '@/lib/external-jobs';
import { getOpenJobs } from '@/lib/jobs';

/**
 * GET /api/jobs/board — public merged job board for the careers page.
 * Internal open jobs plus approved external listings (LinkedIn / Indeed)
 * mapped to open internal jobs. External cards carry the original posting
 * URL for transparency, but Apply always routes into our own journey.
 * Cached in-memory for 10 minutes; registry failures degrade to internal jobs.
 */

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { at: number; jobs: BoardListing[] } | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'jobs-board', 60, 60 * 60 * 1000)) return;

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return res.status(200).json({ success: true, jobs: cache.jobs, cached: true });
  }

  try {
    const db = await getDb();
    const external = await db
      .collection('external_job_listings')
      .find({ status: 'approved' })
      .limit(200)
      .toArray();
    const jobs = mergeBoard(
      getOpenJobs(),
      external.map((doc) => ({
        source: doc.source,
        sourceId: String(doc.sourceId),
        sourceUrl: String(doc.sourceUrl),
        title: String(doc.title || ''),
        location: typeof doc.location === 'string' ? doc.location : undefined,
        department: typeof doc.department === 'string' ? doc.department : undefined,
        postedAt: typeof doc.postedAt === 'string' ? doc.postedAt : undefined,
        status: 'approved' as const,
        mappedJobId: typeof doc.mappedJobId === 'string' ? doc.mappedJobId : undefined,
        createdAt: '',
        updatedAt: '',
      }))
    );
    cache = { at: now, jobs };
    return res.status(200).json({ success: true, jobs, cached: false });
  } catch (error) {
    // Registry unavailable (e.g. no MongoDB configured): internal jobs only.
    console.error('Jobs board registry error, serving internal jobs:', error);
    const jobs = mergeBoard(getOpenJobs(), []);
    return res.status(200).json({ success: true, jobs, cached: false, registry: 'unavailable' });
  }
}
