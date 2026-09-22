import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { requireStaffRole, hashPassword, type AdminRole } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { isValidEmail } from '@/lib/validation';
import { departmentExists } from '@/lib/departments';

/**
 * HR team management (roles hr, administrator, ceo).
 *
 * GET    /api/users/manage          — roster (password hashes never leave the server)
 * POST   /api/users/manage          — create { email, name, role, department?, password? }
 * PATCH  /api/users/manage          — update { email, name?, role?, department?, active? }
 * DELETE /api/users/manage?email=   — hard delete (never yourself)
 */

const MANAGERIAL_ROLES: AdminRole[] = ['hr', 'administrator', 'ceo'];
const ASSIGNABLE_ROLES: AdminRole[] = ['hr', 'administrator', 'ceo', 'member'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireStaffRole(req, res, MANAGERIAL_ROLES);
  if (!session) return;

  if (!enforceRateLimit(req, res, 'users-manage', 120, 60 * 60 * 1000)) return;

  try {
    const db = await getDb();
    const collection = db.collection('portal_users');

    if (req.method === 'GET') {
      const users = await collection
        .find({}, { projection: { passwordHash: 0, approvalToken: 0 } })
        .sort({ createdAt: -1 })
        .limit(500)
        .toArray();
      return res.status(200).json({ success: true, users });
    }

    if (req.method === 'POST') {
      const { email, name, password, role, department } = (req.body || {}) as Record<string, unknown>;
      const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'A valid email is required.' });
      }
      if (typeof name !== 'string' || name.trim().length === 0 || name.length > 120) {
        return res.status(400).json({ success: false, message: 'A name (max 120 chars) is required.' });
      }
      if (!ASSIGNABLE_ROLES.includes(role as AdminRole)) {
        return res.status(400).json({ success: false, message: 'role must be hr, administrator, ceo, or member.' });
      }
      if (department !== undefined && department !== null && department !== '') {
        if (typeof department !== 'string' || !(await departmentExists(department))) {
          return res.status(400).json({ success: false, message: 'Unknown or inactive department.' });
        }
      }
      if (password !== undefined && (typeof password !== 'string' || password.length < 8)) {
        return res.status(400).json({ success: false, message: 'Provided passwords must be at least 8 characters.' });
      }
      if (await collection.findOne({ email: normalizedEmail })) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      // Auto-generate when HR does not set one; returned ONCE for distribution.
      const tempPassword =
        typeof password === 'string' && password.length > 0
          ? password
          : crypto.randomBytes(12).toString('base64url');
      const now = new Date().toISOString();
      await collection.insertOne({
        email: normalizedEmail,
        name: (name as string).trim(),
        role,
        department: typeof department === 'string' && department ? department : undefined,
        passwordHash: hashPassword(tempPassword),
        active: true,
        pending: false,
        createdAt: now,
      });
      return res.status(201).json({
        success: true,
        email: normalizedEmail,
        generatedPassword: typeof password === 'string' && password.length > 0 ? undefined : tempPassword,
      });
    }

    if (req.method === 'PATCH') {
      const { email, name, role, department, active } = (req.body || {}) as Record<string, unknown>;
      if (typeof email !== 'string' || !isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'A valid account email is required.' });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const isSelf = normalizedEmail === session.email.toLowerCase();
      const updates: Record<string, unknown> = {};
      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0 || name.length > 120) {
          return res.status(400).json({ success: false, message: 'Invalid name.' });
        }
        updates.name = name.trim();
      }
      if (role !== undefined) {
        if (!ASSIGNABLE_ROLES.includes(role as AdminRole)) {
          return res.status(400).json({ success: false, message: 'Invalid role.' });
        }
        if (isSelf) {
          return res.status(400).json({ success: false, message: 'You cannot change your own role.' });
        }
        updates.role = role;
      }
      if (department !== undefined) {
        if (department !== null && department !== '' && (typeof department !== 'string' || !(await departmentExists(department)))) {
          return res.status(400).json({ success: false, message: 'Unknown or inactive department.' });
        }
        updates.department = department || null;
      }
      if (active !== undefined) {
        if (typeof active !== 'boolean') {
          return res.status(400).json({ success: false, message: 'active must be a boolean.' });
        }
        if (isSelf && !active) {
          return res.status(400).json({ success: false, message: 'You cannot deactivate your own account.' });
        }
        updates.active = active;
      }
      const result = await collection.updateOne({ email: normalizedEmail }, { $set: updates });
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: 'No such account.' });
      }
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const email = typeof req.query.email === 'string' ? req.query.email.toLowerCase().trim() : '';
      if (!email) {
        return res.status(400).json({ success: false, message: 'email is required.' });
      }
      if (email === session.email.toLowerCase()) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
      }
      const result = await collection.deleteOne({ email });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'No such account.' });
      }
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  } catch (error) {
    console.error('Users manage error:', error);
    return res.status(500).json({ success: false, message: 'Unable to manage users.' });
  }
}
