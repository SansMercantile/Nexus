import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { sendUserApprovedEmail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).json({
      success: false,
      message: 'Method not allowed. Use POST to approve/deny.',
    });
  }

  const { token } = req.body as { token: string };

  if (!token) {
    return res.status(400).json({ success: false, message: 'Approval token is required.' });
  }

  try {
    const db = await getDb();
    // Use scoped data to ensure the admin/user can only approve/deny within their scope
    // Note: In a real scenario, we'd extract the current user's context from the session.
    const user = await db.collection('portal_users').findOne({ 
      approvalToken: token, 
      pending: true 
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid or expired approval token.' });
    }

    if (req.body.approve === true) {
      await db.collection('portal_users').updateOne(
        { _id: user._id },
        { $set: { active: true, pending: false, approvalToken: null } }
      );
      return res.status(200).json({ success: true, message: 'Account approved successfully.' });
    } else if (req.body.approve === false) {
      await db.collection('portal_users').deleteOne({ _id: user._id });
      return res.status(200).json({ success: true, message: 'Application denied and account removed.' });
    }

    return res.status(400).json({ success: false, message: 'Invalid approval action.' });
  } catch (error) {
    console.error('Approval error:', error);
    return res.status(500).json({ success: false, message: 'Approval failed. Please try again.' });
  }
}
