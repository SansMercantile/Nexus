import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { verifySessionToken } from '@/lib/auth';

/**
 * Scoped database query helper to enforce multi-tenancy and RBAC.
 */
export async function getScopedData(collectionName: string, filter: Record<string, any>, context: { tenantId?: string; userId?: string; role?: string }) {
  const db = await getDb();
  const collection = db.collection(collectionName);

  let scopedFilter = { ...filter };

  // Admin bypass
  if (context.role === 'admin') {
    return await collection.find(scopedFilter).toArray();
  }

  // Tenant isolation: Users/Partners only see data for their organization
  if (context.tenantId) {
    scopedFilter.tenantId = context.tenantId;
  }

  // Candidate isolation: Candidates only see their own profile/applications
  if (context.userId && context.role === 'candidate') {
    // If the query is for a specific document by ID, ensure it belongs to them
    if (filter._id || filter.id) {
      scopedFilter.userId = context.userId;
    } else {
      // Otherwise, append userId to the general filter
      scopedFilter.userId = context.userId;
    }
  }

  return await collection.find(scopedFilter).toArray();
}

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
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
    // Use the new scoped data helper to fetch the user profile
    const users = await getScopedData('portal_users', { 
      email: payload.email.toLowerCase(), 
      active: true 
    }, {
      tenantId: payload.tenantId, // Assuming tenantId is in the JWT/Session
      userId: payload.sub,        // Auth0 sub or internal ID
      role: payload.role           // Role from Auth0 claims
    });

    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Session invalid or account inactive.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Portal session error:', error);
    return res.status(500).json({ success: false, message: 'Unable to verify session.' });
  }
}
