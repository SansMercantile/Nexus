import type { NextApiRequest, NextApiResponse } from 'next';
import { enforceRateLimit } from '@/lib/rate-limit';
import { getActiveDepartments } from '@/lib/departments';

/**
 * GET /api/departments/list — public active departments with their toolsets.
 * Cached in-memory for 10 minutes.
 */

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { at: number; departments: unknown[] } | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'departments-list', 120, 60 * 60 * 1000)) return;

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return res.status(200).json({ success: true, departments: cache.departments, cached: true });
  }

  const departments = await getActiveDepartments();
  cache = { at: now, departments };
  return res.status(200).json({ success: true, departments, cached: false });
}
