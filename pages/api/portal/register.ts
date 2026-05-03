import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';
import nodemailer from 'nodemailer';

type RegisterBody = {
  email: string;
  password: string;
  name: string;
  role?: string;
};

const sendApprovalEmail = async (user: any) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_SMTP_HOST,
    port: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });

  const approvalUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portal/approve?token=${encodeURIComponent(user.approvalToken)}`;
  const denyUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portal/deny?token=${encodeURIComponent(user.approvalToken)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: 'hello@sansmercantile.com',
    subject: 'New Portal Account Application',
    html: `
      <p>New account application:</p>
      <p>Name: ${user.name}</p>
      <p>Email: ${user.email}</p>
      <p><a href="${approvalUrl}">Approve</a> | <a href="${denyUrl}">Deny</a></p>
    `,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { email, password, name, role } = req.body as RegisterBody;

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
      return res.status(409).json({ success: false, message: 'Account already exists.' });
    }

    const passwordHash = hashPassword(password);
    const createdAt = new Date().toISOString();
    const approvalToken = Math.random().toString(36).substring(2);

    const result = await db.collection('portal_users').insertOne({
      email: email.toLowerCase(),
      name,
      role: role || 'user',
      passwordHash,
      active: false,
      pending: true,
      approvalToken,
      createdAt,
    });

    await sendApprovalEmail({ email: email.toLowerCase(), name, approvalToken });

    return res.status(201).json({ success: true, message: 'Account application submitted. You will receive an email once approved.' });
  } catch (error) {
    console.error('Portal registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit application. Please try again later.',
    });
  }
}
