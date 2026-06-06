import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { sendUserApprovedEmail } from '@/lib/mailer';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

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
      return res.status(404).json({ success: false, message: 'Invalid or expired approval token.' });
    }

    // ── Primary: MongoDB Atlas ──────────────────────────────────────────────
    await db.collection('portal_users').updateOne(
      { _id: user._id },
      { $set: { active: true, pending: false, approvedAt: new Date().toISOString() }, $unset: { approvalToken: 1 } }
    );

    // ── Redundancy: Supabase ────────────────────────────────────────────────
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase
          .from('portal_users')
          .update({ active: true, pending: false, approved_at: new Date().toISOString(), approval_token: null })
          .eq('email', user.email);
      } catch (supaErr) {
        console.error('Supabase sync failed on approve (non-fatal):', supaErr);
      }
    }

    // ── Email the user ──────────────────────────────────────────────────────
    try {
      await sendUserApprovedEmail(user.email, user.name);
    } catch (emailErr) {
      console.error('Approval confirmation email failed (non-fatal):', emailErr);
    }

    // Redirect to portal with success message
    const base = process.env.NEXT_PUBLIC_API_URL?.replace('http://localhost:3002', 'https://www.sansmercantile.com') || 'https://www.sansmercantile.com';
    return res.redirect(302, `${base}/portal?approved=1`);
  } catch (error: any) {
    console.error('Approval error:', error);
    return res.status(500).json({ success: false, message: 'Approval failed. Please try again.' });
  }
}
