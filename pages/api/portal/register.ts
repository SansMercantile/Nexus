import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

type RegisterBody = {
  email: string;
  password: string;
  name: string;
  role?: string;
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

    const result = await db.collection('portal_users').insertOne({
      email: email.toLowerCase(),
      name,
      role: role || 'user',
      passwordHash,
      active: true,
      createdAt,
    });

    return res.status(201).json({ success: true, insertedId: result.insertedId.toString() });
  } catch (error) {
    console.error('Portal registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to create account. Check MongoDB configuration.',
    });
  }
}
