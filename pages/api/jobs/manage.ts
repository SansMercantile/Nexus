import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { getPortalSessionUser } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { validateJobPayload, mergeJobSources } from '@/lib/job-board';
import { jobPostings, type JobPosting } from '@/lib/jobs';

/**
 * Admin job-post management (portal session required).
 *
 * GET    /api/jobs/manage          — merged static + admin posts with source flags
 * POST   /api/jobs/manage          — create { ...job } (id must be unused)
 * PATCH  /api/jobs/manage          — update { id, ...fields } (static ids become DB overrides)
 * DELETE /api/jobs/manage?id=<id>  — delete an admin post (static roles: archive instead)
 *
 * Archiving = PATCH { id, status: 'closed' }. Anything written here reflects
 * on the careers page, board, assessments, and Indeed feed immediately.
 */

const EDITABLE_FIELDS = [
  'title',
  'department',
  'location',
  'description',
  'responsibilities',
  'qualifications',
  'benefits',
  'assessments',
  'type',
  'level',
  'status',
  'salary',
  'posted_at',
  'deadline',
] as const;

function shapeForWrite(base: JobPosting, patch: Record<string, unknown>): JobPosting {
  const next: Record<string, unknown> = { ...base };
  for (const field of EDITABLE_FIELDS) {
    if (patch[field] !== undefined) next[field] = patch[field];
  }
  return next as unknown as JobPosting;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getPortalSessionUser(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (!enforceRateLimit(req, res, 'jobs-manage', 60, 60 * 60 * 1000)) return;

  try {
    const db = await getDb();
    const collection = db.collection('job_posts');

    if (req.method === 'GET') {
      const docs = await collection.find({}).limit(500).toArray();
      const adminIds = new Set(docs.map((d) => String(d.id ?? d._id)));
      const merged = mergeJobSources(
        jobPostings,
        docs.map((d) => ({ ...d, id: String(d.id ?? d._id) }) as unknown as JobPosting)
      );
      return res.status(200).json({
        success: true,
        jobs: merged.map((job) => ({ ...job, managed: adminIds.has(job.id) ? 'admin' : 'static' })),
      });
    }

    if (req.method === 'POST') {
      const check = validateJobPayload(req.body);
      if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      const body = req.body as Record<string, unknown>;
      const id = String(body.id).trim();
      const existing =
        (await collection.findOne({ id })) ?? jobPostings.find((job) => job.id === id);
      if (existing) {
        return res.status(409).json({ success: false, message: 'A post with this id already exists.' });
      }
      const now = new Date().toISOString();
      await collection.insertOne({
        ...(body as Record<string, unknown>),
        id,
        status: typeof body.status === 'string' ? body.status : 'open',
        posted_at: typeof body.posted_at === 'string' ? body.posted_at : now,
        createdAt: now,
        updatedAt: now,
      });
      return res.status(201).json({ success: true, id });
    }

    if (req.method === 'PATCH') {
      const body = (req.body || {}) as Record<string, unknown>;
      if (typeof body.id !== 'string' || body.id.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'id is required.' });
      }
      const id = body.id.trim();
      const stored = (await collection.findOne({ id })) as unknown as JobPosting | null;
      const base =
        (stored as JobPosting | null) ?? jobPostings.find((job) => job.id === id) ?? null;
      if (!base) {
        return res.status(404).json({ success: false, message: 'No such post.' });
      }
      const merged = shapeForWrite({ ...base, id }, body);
      const check = validateJobPayload(merged);
      if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      const { _id, ...writable } = merged as JobPosting & { _id?: unknown };
      await collection.updateOne(
        { id },
        { $set: { ...writable, id, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true, id });
    }

    if (req.method === 'DELETE') {
      const id = typeof req.query.id === 'string' ? req.query.id.trim() : '';
      if (!id) {
        return res.status(400).json({ success: false, message: 'id is required.' });
      }
      if (jobPostings.some((job) => job.id === id)) {
        return res.status(400).json({
          success: false,
          message: 'Seeded roles cannot be deleted — archive them with PATCH { status: closed } instead.',
        });
      }
      const result = await collection.deleteOne({ id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'No such admin post.' });
      }
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  } catch (error) {
    console.error('Jobs manage error:', error);
    return res.status(500).json({ success: false, message: 'Unable to manage job posts.' });
  }
}
