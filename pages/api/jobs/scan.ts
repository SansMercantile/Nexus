import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { getPortalSessionUser } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import {
  isJobAnnouncement,
  extractJobTitle,
  normalizeWhitespace,
  parseIndeedFeed,
  dedupeListings,
  type ExternalListing,
} from '@/lib/external-jobs';

/**
 * POST /api/jobs/scan (admin session required)
 * Discovers job announcements on LinkedIn org posts and an optional Indeed
 * XML feed, storing new candidates as 'pending' external listings for
 * admin review. Nothing reaches the public board until approved + mapped.
 */

function linkedInOrg(): string {
  const orgIdEnv = process.env.LINKEDIN_ORG_ID;
  if (orgIdEnv) return orgIdEnv;
  const orgUrl = process.env.LINKEDIN_ORG_URL || 'https://www.linkedin.com/company/sans-mercantile';
  return (orgUrl.match(/linkedin\.com\/company\/(.+)$/) || [])[1] || '';
}

async function scanLinkedIn(): Promise<{ scanned: number; candidates: ExternalListing[] }> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) return { scanned: 0, candidates: [] };
  const orgId = linkedInOrg();
  if (!orgId) return { scanned: 0, candidates: [] };

  const response = await fetch(
    `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:organization:${orgId})&count=20`,
    { headers: { Authorization: `Bearer ${token}`, 'X-Restli-Protocol-Version': '2.0.0' } }
  );
  if (!response.ok) {
    throw new Error(`LinkedIn posts fetch failed: HTTP ${response.status}`);
  }
  const data = await response.json();
  const posts: any[] = data.elements || [];
  const now = new Date().toISOString();
  const candidates: ExternalListing[] = [];

  for (const post of posts) {
    const text: string = post.specificContent?.shareContent?.shareCommentary?.text || '';
    if (!isJobAnnouncement(text)) continue;
    const share = post.specificContent?.shareContent || {};
    candidates.push({
      source: 'linkedin',
      sourceId: String(post.id),
      sourceUrl: share.shareUrl || `https://www.linkedin.com/company/sans-mercantile`,
      title: extractJobTitle(text),
      postedAt: post.created?.time ? new Date(post.created.time).toISOString() : now,
      rawText: normalizeWhitespace(text, 2000),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
  }
  return { scanned: posts.length, candidates };
}

async function scanIndeed(): Promise<{ scanned: number; candidates: ExternalListing[] }> {
  const feedUrl = process.env.INDEED_FEED_URL;
  if (!feedUrl) return { scanned: 0, candidates: [] };

  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`Indeed feed fetch failed: HTTP ${response.status}`);
  }
  const items = parseIndeedFeed(await response.text());
  const now = new Date().toISOString();
  return {
    scanned: items.length,
    candidates: items.map((item) => ({
      source: 'indeed' as const,
      sourceId: item.guid || item.link,
      sourceUrl: item.link,
      title: normalizeWhitespace(item.title, 200),
      postedAt: item.pubDate ? new Date(item.pubDate).toISOString() : now,
      rawText: '',
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    })),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'jobs-scan', 30, 60 * 60 * 1000)) return;

  const session = await getPortalSessionUser(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const db = await getDb();
    const collection = db.collection('external_job_listings');
    const summary: Record<string, { scanned: number; added: number; skipped?: string }> = {};

    for (const [name, scan] of [
      ['linkedin', scanLinkedIn],
      ['indeed', scanIndeed],
    ] as const) {
      try {
        const { scanned, candidates } = await scan();
        if (candidates.length === 0) {
          summary[name] = { scanned, added: 0 };
          continue;
        }
        const keys = candidates.map((c) => c.sourceId);
        const existing = await collection
          .find({ source: name, sourceId: { $in: keys } })
          .project({ source: 1, sourceId: 1 })
          .toArray();
        const fresh = dedupeListings(
          existing.map((e) => ({ source: String(e.source), sourceId: String(e.sourceId) })),
          candidates
        );
        if (fresh.length > 0) {
          await collection.insertMany(fresh);
        }
        summary[name] = { scanned, added: fresh.length };
      } catch (err: any) {
        summary[name] = { scanned: 0, added: 0, skipped: err?.message || 'scan failed' };
      }
    }

    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error('Job scan error:', error);
    return res.status(500).json({ success: false, message: 'Unable to run job scan.' });
  }
}
