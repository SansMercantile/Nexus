import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { sendUserDeniedEmail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).json({
      success: false,
      message: 'Method not allowed. Use POST to deny.',
    });
  }

  const { token } = req.body as { token: string };

  if (!token) {
    return res.status(400).json({ success: false, message: 'Approval token is required.' });
  }

  try {
    const db = await getDb();
    // Use scoped data to ensure the admin/user can only deny within their scope
    const user = await db.collection('portal_users').findOne({ 
      approvalToken: token, 
      pending: true 
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid or expired approval token.' });
    }

    await db.collection('portal_users').deleteOne({ _id: user._id });
    return res.status(200).json({ success: true, message: 'Application denied and account removed.' });
  } catch (error) {
    console.error('Denial error:', error);
    return res.status(500).json({ success: false, message: 'Denial failed. Please try again.' });
  }
}
