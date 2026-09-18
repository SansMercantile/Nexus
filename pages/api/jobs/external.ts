import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { getPortalSessionUser } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { validateMapping, normalizeWhitespace, type ExternalJobSource } from '@/lib/external-jobs';

/**
 * Admin registry for external job listings (LinkedIn / Indeed).
 *
 * GET  /api/jobs/external?status=pending  — list (admin session required)
 * POST /api/jobs/external                 — { action: register|approve|dismiss, ... }
 *
 * A listing reaches the public careers board only when approved AND mapped
 * to an open internal job, so every application flows through our own
 * journey (/api/apply) instead of LinkedIn Easy Apply / Indeed Apply.
 */

function toObjectId(id: unknown) {
  if (typeof id !== 'string' || id.length === 0) return null;
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getPortalSessionUser(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (req.method === 'GET') {
    if (!enforceRateLimit(req, res, 'jobs-external-list', 60, 60 * 60 * 1000)) return;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    try {
      const db = await getDb();
      const filter = status && ['pending', 'approved', 'dismissed'].includes(status) ? { status } : {};
      const listings = await db
        .collection('external_job_listings')
        .find(filter)
        .sort({ updatedAt: -1 })
        .limit(200)
        .toArray();
      return res.status(200).json({ success: true, listings });
    } catch (error) {
      console.error('External jobs list error:', error);
      return res.status(500).json({ success: false, message: 'Unable to list external jobs.' });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'jobs-external-write', 60, 60 * 60 * 1000)) return;

  const { action } = (req.body || {}) as { action?: unknown };

  try {
    const db = await getDb();
    const collection = db.collection('external_job_listings');

    if (action === 'register') {
      const { source, sourceUrl, title, location, department, mappedJobId } = (req.body || {}) as Record<string, unknown>;
      if (source !== 'linkedin' && source !== 'indeed') {
        return res.status(400).json({ success: false, message: 'source must be linkedin or indeed.' });
      }
      if (typeof sourceUrl !== 'string' || !/^https?:\/\//i.test(sourceUrl)) {
        return res.status(400).json({ success: false, message: 'A valid sourceUrl is required.' });
      }
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'title is required.' });
      }
      if (mappedJobId !== undefined) {
        const check = validateMapping(mappedJobId);
        if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      }
      const sourceId =
        typeof (req.body as Record<string, unknown>).sourceId === 'string' &&
        ((req.body as Record<string, unknown>).sourceId as string).length > 0
          ? ((req.body as Record<string, unknown>).sourceId as string)
          : `manual:${crypto.createHash('sha256').update(sourceUrl).digest('hex').slice(0, 32)}`;
      const existing = await collection.findOne({ source, sourceId });
      if (existing) {
        return res.status(409).json({ success: false, message: 'This external posting is already registered.' });
      }
      const now = new Date().toISOString();
      const result = await collection.insertOne({
        source: source as ExternalJobSource,
        sourceId,
        sourceUrl,
        title: normalizeWhitespace(title, 200),
        location: normalizeWhitespace(location, 120),
        department: normalizeWhitespace(department, 120),
        status: 'pending',
        mappedJobId: typeof mappedJobId === 'string' ? mappedJobId.trim() : undefined,
        createdAt: now,
        updatedAt: now,
      });
      return res.status(201).json({ success: true, id: result.insertedId.toString() });
    }

    if (action === 'approve' || action === 'dismiss') {
      const { id, mappedJobId } = (req.body || {}) as { id?: unknown; mappedJobId?: unknown };
      const objectId = toObjectId(id);
      if (!objectId) {
        return res.status(400).json({ success: false, message: 'A valid listing id is required.' });
      }
      if (action === 'approve') {
        const check = validateMapping(mappedJobId);
        if (!check.ok) return res.status(400).json({ success: false, message: check.message });
        const result = await collection.updateOne(
          { _id: objectId },
          {
            $set: {
              status: 'approved',
              mappedJobId: (mappedJobId as string).trim(),
              updatedAt: new Date().toISOString(),
            },
          }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Listing not found.' });
        }
        return res.status(200).json({ success: true });
      }
      const result = await collection.updateOne(
        { _id: objectId },
        { $set: { status: 'dismissed', updatedAt: new Date().toISOString() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: 'Listing not found.' });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ success: false, message: 'action must be register, approve, or dismiss.' });
  } catch (error) {
    console.error('External jobs write error:', error);
    return res.status(500).json({ success: false, message: 'Unable to update external jobs.' });
  }
}
