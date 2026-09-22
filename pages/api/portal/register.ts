import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Public self-registration is DISABLED. Accounts are created exclusively by
 * HR/administrators via /admin/team (POST /api/users/manage).
 *
 * This route intentionally remains as a stub so automated scanners and old
 * links receive an explicit answer instead of probing for behavior.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  return res.status(410).json({
    success: false,
    message: 'Public registration is closed. Accounts are created by an administrator — contact hello@sansmercantile.com for access.',
  });
}
