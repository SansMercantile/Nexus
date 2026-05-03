import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import nodemailer from 'nodemailer';

const sendApprovalEmailToUser = async (email: string) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_SMTP_HOST,
    port: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Portal Access Approved',
    html: '<p>Your Sans Mercantile portal account has been approved. You can now log in at <a href="https://sansmercantile.com/portal">sansmercantile.com/portal</a>.</p>',
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid token.' });
  }

  try {
    const db = await getDb();
    const user = await db.collection('portal_users').findOne({ approvalToken: token, pending: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid or expired token.' });
    }

    await db.collection('portal_users').updateOne(
      { _id: user._id },
      { $set: { active: true, pending: false }, $unset: { approvalToken: 1 } }
    );

    await sendApprovalEmailToUser(user.email);

    return res.status(200).json({ success: true, message: 'Account approved.' });
  } catch (error) {
    console.error('Approval error:', error);
    return res.status(500).json({ success: false, message: 'Approval failed.' });
  }
}