import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';
import { sendAdminApprovalRequest } from '@/lib/mailer';

type RegisterBody = {
  email: string;
  password: string;
  name: string;
  role?: string;
  approved?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { email, password, name, role, approved } = req.body as RegisterBody;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: email, password, and name.',
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
    const approvalToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const isAutoApproved = approved === true;

    const userDoc = {
      email: email.toLowerCase(),
      name,
      role: role || 'user',
      passwordHash,
      active: isAutoApproved,
      pending: !isAutoApproved,
      approvalToken: isAutoApproved ? null : approvalToken,
      createdAt,
    };

    // ── Primary: MongoDB Atlas ──────────────────────────────────────────────
    await db.collection('portal_users').insertOne(userDoc);

    // ── Email notification ──────────────────────────────────────────────────
    if (!isAutoApproved) {
      try {
        await sendAdminApprovalRequest({ name, email: email.toLowerCase(), approvalToken });
      } catch (emailErr) {
        // Email failure is non-fatal — account is already created
        console.error('Approval email failed (account still created):', emailErr);
      }
    }

    return res.status(201).json({
      success: true,
      message: isAutoApproved
        ? 'Account created and approved. You can now sign in.'
        : 'Account application submitted. You will receive an email once approved.',
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
