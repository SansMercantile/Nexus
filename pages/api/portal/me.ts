import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { verifySessionToken, isAllowedAdminEmail } from '@/lib/auth';

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(name + '='));
  return match ? match.split('=')[1] : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = getCookieValue(req.headers.cookie, 'portal_session');
  if (!sessionToken) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }

  const payload = verifySessionToken(sessionToken);
  if (!payload || typeof payload.email !== 'string') {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }

  try {
    const db = await getDb();
    const user = await db.collection('portal_users').findOne({ email: payload.email.toLowerCase(), active: true });

    if (!user || !isAllowedAdminEmail(user.email)) {
      return res.status(401).json({ success: false, message: 'Session invalid or account inactive.' });
    }

    return res.status(200).json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Portal session error:', error);
    return res.status(500).json({ success: false, message: 'Unable to verify session.' });
  }
}
