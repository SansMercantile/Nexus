import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const isSecure = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `portal_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;${isSecure ? ' Secure;' : ''}`
  );
  return res.status(200).json({ success: true, message: 'Logged out.' });
}
