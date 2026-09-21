import type { NextApiRequest, NextApiResponse } from 'next';
import { enforceRateLimit } from '@/lib/rate-limit';
import { getPublishedPosts, type ContentType } from '@/lib/content';

/**
 * GET /api/content/list?type=blog|press — published managed posts (slim).
 * Static seed content stays in the client bundle; this endpoint only serves
 * admin-created items. Cached in-memory for 10 minutes.
 */

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; posts: unknown[] }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'content-list', 120, 60 * 60 * 1000)) return;

  const type = req.query.type === 'press' ? 'press' : 'blog';
  const now = Date.now();
  const cached = cache.get(type);
  if (cached && now - cached.at < CACHE_TTL_MS) {
    return res.status(200).json({ success: true, posts: cached.posts, cached: true });
  }

  const posts = (await getPublishedPosts(type as ContentType)).map((post) => ({
    slug: post.slug,
    type: post.type,
    title: post.title,
    excerpt: post.excerpt,
    cover: post.cover || '',
    author: post.author || 'Sans Mercantile',
    publishedAt: post.publishedAt || post.updatedAt,
  }));
  cache.set(type, { at: now, posts });
  return res.status(200).json({ success: true, posts, cached: false });
}
