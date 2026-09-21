import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { getPortalSessionUser } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { validateContentPost, slugify } from '@/lib/content';

/**
 * Admin editorial management (portal session required).
 *
 * GET    /api/content/manage?type=&status=  — all posts, newest first
 * POST   /api/content/manage               — create { type, title, excerpt, body, ... }
 * PATCH  /api/content/manage               — update { slug, type, ...fields }
 * DELETE /api/content/manage?slug=&type=   — hard delete
 */

const EDITABLE_FIELDS = ['title', 'excerpt', 'body', 'cover', 'author', 'status', 'publishedAt'] as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getPortalSessionUser(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (!enforceRateLimit(req, res, 'content-manage', 120, 60 * 60 * 1000)) return;

  try {
    const db = await getDb();
    const collection = db.collection('content_posts');

    if (req.method === 'GET') {
      const type = typeof req.query.type === 'string' ? req.query.type : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const filter: Record<string, string> = {};
      if (type === 'blog' || type === 'press') filter.type = type;
      if (status === 'draft' || status === 'published') filter.status = status;
      const posts = await collection.find(filter).sort({ updatedAt: -1 }).limit(500).toArray();
      return res.status(200).json({ success: true, posts });
    }

    if (req.method === 'POST') {
      const check = validateContentPost(req.body);
      if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      const body = req.body as Record<string, unknown>;
      const slug =
        typeof body.slug === 'string' && body.slug.trim().length > 0
          ? body.slug.trim()
          : slugify(String(body.title));
      const type = body.type as string;
      if (await collection.findOne({ type, slug })) {
        return res.status(409).json({ success: false, message: 'A post with this slug already exists.' });
      }
      const now = new Date().toISOString();
      const status = body.status === 'published' ? 'published' : 'draft';
      await collection.insertOne({
        slug,
        type,
        title: (body.title as string).trim(),
        excerpt: (body.excerpt as string).trim(),
        body: body.body as string,
        cover: typeof body.cover === 'string' ? body.cover.trim() : '',
        author: typeof body.author === 'string' && body.author.trim() ? body.author.trim() : session.name || session.email,
        status,
        publishedAt: status === 'published' ? (typeof body.publishedAt === 'string' && body.publishedAt ? body.publishedAt : now) : undefined,
        createdAt: now,
        updatedAt: now,
      });
      return res.status(201).json({ success: true, slug });
    }

    if (req.method === 'PATCH') {
      const body = (req.body || {}) as Record<string, unknown>;
      if (typeof body.slug !== 'string' || typeof body.type !== 'string') {
        return res.status(400).json({ success: false, message: 'slug and type are required.' });
      }
      const existing = await collection.findOne({ slug: body.slug, type: body.type });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'No such post.' });
      }
      const merged: Record<string, unknown> = { ...(existing as Record<string, unknown>) };
      for (const field of EDITABLE_FIELDS) {
        if (body[field] !== undefined) merged[field] = body[field];
      }
      if (merged.status === 'published' && !merged.publishedAt) {
        merged.publishedAt = new Date().toISOString();
      }
      const check = validateContentPost({ ...merged, slug: merged.slug, type: merged.type });
      if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      const { _id, ...writable } = merged;
      await collection.updateOne(
        { slug: body.slug, type: body.type },
        { $set: { ...writable, updatedAt: new Date().toISOString() } }
      );
      return res.status(200).json({ success: true, slug: body.slug });
    }

    if (req.method === 'DELETE') {
      const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
      const type = typeof req.query.type === 'string' ? req.query.type : '';
      if (!slug || (type !== 'blog' && type !== 'press')) {
        return res.status(400).json({ success: false, message: 'slug and a valid type are required.' });
      }
      const result = await collection.deleteOne({ slug, type });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'No such post.' });
      }
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  } catch (error) {
    console.error('Content manage error:', error);
    return res.status(500).json({ success: false, message: 'Unable to manage content.' });
  }
}
