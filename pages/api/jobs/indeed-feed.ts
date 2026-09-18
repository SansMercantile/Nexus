import type { NextApiRequest, NextApiResponse } from 'next';
import { enforceRateLimit } from '@/lib/rate-limit';
import { buildIndeedFeed } from '@/lib/external-jobs';
import { getOpenJobs } from '@/lib/jobs';

/**
 * GET /api/jobs/indeed-feed — Indeed Job Sync XML feed.
 *
 * Publishes our open roles in Indeed's feed format so Indeed indexes them.
 * The <url> element points back to our careers page (with source=Indeed for
 * click tracking), so every application still flows through our own journey.
 * Give this URL to Indeed to crawl: https://www.sansmercantile.com/api/jobs/indeed-feed
 */

const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: { at: number; xml: string } | null = null;

function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (configured && !configured.includes('localhost')) return configured;
  return 'https://www.sansmercantile.com';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  // Indeed crawls ~4x/day; a generous quota still blocks abuse.
  if (!enforceRateLimit(req, res, 'jobs-indeed-feed', 200, 60 * 60 * 1000)) return;

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(cache.xml);
  }

  const xml = buildIndeedFeed(getOpenJobs(), {
    siteUrl: siteUrl(),
    contactEmail: process.env.INDEED_CONTACT_EMAIL || 'careers@sansmercantile.com',
  });
  cache = { at: now, xml };
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  return res.status(200).send(xml);
}
