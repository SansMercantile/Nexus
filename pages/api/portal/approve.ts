import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { sendUserApprovedEmail } from '@/lib/mailer';

function getRedirectBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (!configured || configured.includes('localhost')) {
    return 'https://www.sansmercantile.com';
  }
  return configured.replace(/\/$/, '');
}

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
      return res.redirect(302, getRedirectBase() + '/portal?approveError=1');
    }

    await db.collection('portal_users').updateOne(
      { _id: user._id },
      { $set: { active: true, pending: false, approvedAt: new Date().toISOString() }, $unset: { approvalToken: 1 } }
    );

    try {
      await sendUserApprovedEmail(user.email, user.name);
    } catch (emailErr) {
      console.error('Approval confirmation email failed (non-fatal):', emailErr);
    }

    return res.redirect(302, getRedirectBase() + '/portal?approved=1');
  } catch (error: any) {
    console.error('Approval error:', error);
    return res.redirect(302, getRedirectBase() + '/portal?approveError=1');
  }
}
