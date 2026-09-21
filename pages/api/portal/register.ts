import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { hashPassword, isAllowedAdminEmail, getAdminRole } from '@/lib/auth';
import { sendAdminApprovalRequest } from '@/lib/mailer';
import { enforceRateLimit } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';

type RegisterBody = {
  email: string;
  password: string;
  name: string;
  role?: string;
  turnstileToken?: string;
  // Honeypot: legitimate clients leave this empty.
  website?: string;
};

export const APPROVAL_TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!enforceRateLimit(req, res, 'portal-register', 5, 60 * 60 * 1000)) return;

  const { email, password, name, turnstileToken, website } = req.body as RegisterBody;

  // Honeypot: silently accept bot submissions without creating an account.
  if (typeof website === 'string' && website.trim().length > 0) {
    return res.status(201).json({
      success: true,
      message: 'Account application submitted. You will receive an email once approved.',
    });
  }

  if (!(await verifyTurnstile(turnstileToken))) {
    return res.status(403).json({ success: false, message: 'Bot verification failed. Please try again.' });
  }

  const normalizedEmail = String(email || '').toLowerCase();

  if (!normalizedEmail || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: email, password, and name.',
    });
  }

  if (!isAllowedAdminEmail(normalizedEmail)) {
    return res.status(403).json({
      success: false,
      message: 'Portal registration is restricted. Contact hello@sansmercantile.com for access.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  try {
    const db = await getDb();
    const existing = await db.collection('portal_users').findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = hashPassword(password);
    const createdAt = new Date().toISOString();
    // NOTE: accounts always start pending. Activation happens exclusively
    // through the emailed approval link (approve.ts). The client can never
    // self-approve, and every account is created with the admin role pending
    // allowlist review.
    const approvalToken = crypto.randomBytes(32).toString('hex');

    const userDoc = {
      email: normalizedEmail,
      name,
      role: getAdminRole(normalizedEmail) ?? 'admin',
      passwordHash,
      active: false,
      pending: true,
      approvalToken,
      approvalExpiresAt: new Date(Date.now() + APPROVAL_TOKEN_TTL_MS).toISOString(),
      createdAt,
    };

    // ── Primary: MongoDB Atlas ──────────────────────────────────────────────
    await db.collection('portal_users').insertOne(userDoc);

    // ── Email notification ──────────────────────────────────────────────────
    try {
      await sendAdminApprovalRequest({ name, email: email.toLowerCase(), approvalToken });
    } catch (emailErr) {
      // Email failure is non-fatal — account is already created
      console.error('Approval email failed (account still created):', emailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Account application submitted. You will receive an email once approved.',
    });
  } catch (error: any) {
    console.error('Portal registration error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message?.includes('MONGODB_URI')
        ? 'Database not configured. Contact the administrator.'
        : 'Unable to submit application. Please try again later.',
      debug: process.env.DEBUG_API_ERRORS === '1' ? error.message : undefined,
    });
  }
}
