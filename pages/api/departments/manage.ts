import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { requireStaffRole, type AdminRole } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { validateDepartment, SEED_DEPARTMENTS } from '@/lib/departments';

/**
 * Department management (roles hr, administrator, ceo).
 *
 * GET    /api/departments/manage  — every department incl. inactive
 * POST   /api/departments/manage  — create { id, name, description, tools[], active? }
 * PATCH  /api/departments/manage  — update { id, ...fields } (seed ids become DB overrides)
 * DELETE /api/departments/manage?id= — delete (blocked while users are assigned)
 */

const MANAGERIAL_ROLES: AdminRole[] = ['hr', 'administrator', 'ceo'];
const EDITABLE_FIELDS = ['name', 'description', 'tools', 'active'] as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireStaffRole(req, res, MANAGERIAL_ROLES);
  if (!session) return;

  if (!enforceRateLimit(req, res, 'departments-manage', 120, 60 * 60 * 1000)) return;

  try {
    const db = await getDb();
    const collection = db.collection('departments');

    if (req.method === 'GET') {
      const docs = await collection.find({}).limit(200).toArray();
      return res.status(200).json({ success: true, departments: docs });
    }

    if (req.method === 'POST') {
      const check = validateDepartment(req.body);
      if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      const body = req.body as Record<string, unknown>;
      const id = (body.id as string).trim();
      if (await collection.findOne({ id })) {
        return res.status(409).json({ success: false, message: 'A department with this id already exists.' });
      }
      const now = new Date().toISOString();
      await collection.insertOne({
        id,
        name: (body.name as string).trim(),
        description: (body.description as string).trim(),
        tools: body.tools,
        active: body.active !== false,
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
      const stored = await collection.findOne({ id });
      const seed = SEED_DEPARTMENTS.find((dept) => dept.id === id);
      const base = stored ?? seed ?? null;
      if (!base) {
        return res.status(404).json({ success: false, message: 'No such department.' });
      }
      const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };
      for (const field of EDITABLE_FIELDS) {
        if (body[field] !== undefined) merged[field] = body[field];
      }
      const check = validateDepartment({ ...merged, id });
      if (!check.ok) return res.status(400).json({ success: false, message: check.message });
      const { _id, ...writable } = merged;
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
      const assigned = await db.collection('portal_users').countDocuments({ department: id });
      if (assigned > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete: ${assigned} user(s) are assigned to this department. Reassign them first.`,
        });
      }
      const result = await collection.deleteOne({ id });
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'No such managed department. Seeded departments can only be archived (active: false).',
        });
      }
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  } catch (error) {
    console.error('Departments manage error:', error);
    return res.status(500).json({ success: false, message: 'Unable to manage departments.' });
  }
}
