import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { verifyPassword, createSessionToken } from '@/lib/auth';

type LoginBody = {
  email: string;
  password: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const db = await getDb();
    const user = await db.collection('portal_users').findOne({
      email: email.toLowerCase(),
      active: true,
    });

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = createSessionToken({
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const isSecure = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', `portal_session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax;${isSecure ? ' Secure;' : ''}`);

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Portal login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to authenticate. Check MongoDB configuration.',
    });
  }
}
