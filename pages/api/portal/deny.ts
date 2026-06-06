import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { sendUserDeniedEmail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid or missing token.' });
  }

  try {
    const db = await getDb();
    const user = await db.collection('portal_users').findOne({ approvalToken: token, pending: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid or expired denial token.' });
    }

    // ── MongoDB Atlas ───────────────────────────────────────────────────────
    await db.collection('portal_users').deleteOne({ _id: user._id });

    // ── Email the user ──────────────────────────────────────────────────────
    try {
      await sendUserDeniedEmail(user.email);
    } catch (emailErr) {
      console.error('Denial email failed (non-fatal):', emailErr);
    }

    const base = process.env.NEXT_PUBLIC_API_URL?.replace('http://localhost:3002', 'https://www.sansmercantile.com') || 'https://www.sansmercantile.com';
    return res.redirect(302, `${base}/portal?denied=1`);
  } catch (error: any) {
    console.error('Denial error:', error);
    return res.status(500).json({ success: false, message: 'Denial failed. Please try again.' });
  }
}
