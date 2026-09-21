import type { NextApiRequest, NextApiResponse } from 'next';
import { enforceRateLimit } from '@/lib/rate-limit';
import { getMergedOpenJobs } from '@/lib/job-board';
import type { JobPosting } from '@/lib/jobs';

/**
 * GET /api/jobs/list — public merged open roles (admin posts + static seed)
 * as full job objects. The careers page renders from this endpoint, so
 * admin changes reflect immediately. Cached in-memory for 10 minutes.
 */

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { at: number; jobs: JobPosting[] } | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'jobs-list', 120, 60 * 60 * 1000)) return;

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return res.status(200).json({ success: true, jobs: cache.jobs, cached: true });
  }

  const jobs = await getMergedOpenJobs();
  cache = { at: now, jobs };
  return res.status(200).json({ success: true, jobs, cached: false });
}
