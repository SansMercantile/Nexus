import crypto from 'crypto';

// --- Portal email/password auth used by /api/portal/register, login, me ---

const SCRYPT_KEYLEN = 64;

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plain, salt, SCRYPT_KEYLEN).toString('hex');
  return salt + ':' + hash;
}

export type AdminRole = 'hr' | 'administrator' | 'ceo' | 'member';

const ADMIN_USERS: Record<string, AdminRole> = {
  'resources@sansmercantile.com': 'hr',
  'hello@sansmercantile.com': 'administrator',
  'mezzoforte@sansmercantile.com': 'ceo',
  'careers@sansmercantile.com': 'hr',
};

export function getAdminRole(email?: string): AdminRole | null {
  if (typeof email !== 'string') return null;
  return ADMIN_USERS[email.toLowerCase()] ?? null;
}

export function isAllowedAdminEmail(email?: string): boolean {
  return getAdminRole(email) !== null;
}

export function verifyPassword(plain: string, storedHash: string): boolean {
  if (!storedHash || storedHash.indexOf(':') === -1) return false;
  const parts = storedHash.split(':');
  const salt = parts[0];
  const hash = parts[1];
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, 'hex');
  const candidateBuffer = crypto.scryptSync(plain, salt, SCRYPT_KEYLEN);
  if (hashBuffer.length !== candidateBuffer.length) return false;
  return crypto.timingSafeEqual(hashBuffer, candidateBuffer);
}

function getJwtSecret(): string {
  const secret = process.env.PORTAL_JWT_SECRET;
  if (!secret) throw new Error('Missing PORTAL_JWT_SECRET environment variable.');
  return secret;
}

function base64urlEncode(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(input: string): Buffer {
  const pad = 4 - (input.length % 4 || 4);
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/') + (pad < 4 ? '='.repeat(pad) : '');
  return Buffer.from(normalized, 'base64');
}

type SessionPayload = {
  email: string;
  name?: string;
  role?: string;
  sub?: string;
  iat?: number;
  exp?: number;
};

export function createSessionToken(payload: Omit<SessionPayload, 'iat' | 'exp'>, expiresInSeconds = 60 * 60 * 24): string {
  const header = { alg: 'HS256', type: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: SessionPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));
  const data = encodedHeader + '.' + encodedPayload;

  const signature = crypto.createHmac('sha256', getJwtSecret()).update(data).digest();
  const encodedSignature = base64urlEncode(signature);

  return data + '.' + encodedSignature;
}

export function verifySessionToken(token: string): SessionPayload | null {  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const encodedHeader = parts[0];
    const encodedPayload = parts[1];
    const encodedSignature = parts[2];

    const data = encodedHeader + '.' + encodedPayload;
    const expectedSignature = crypto.createHmac('sha256', getJwtSecret()).update(data).digest();
    const actualSignature = base64urlDecode(encodedSignature);

    if (expectedSignature.length !== actualSignature.length) return null;
    if (!crypto.timingSafeEqual(expectedSignature, actualSignature)) return null;

    const payload: SessionPayload = JSON.parse(base64urlDecode(encodedPayload).toString('utf8'));

    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

// --- Shared server-side session helpers (single place for cookie auth) ---

export function getCookieValue(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(name + '='));
  if (!match) return null;
  return match.slice(name.length + 1) || null;
}

export type PortalSessionUser = { email: string; name?: string; role?: string };

/**
 * Validates the portal_session cookie. Any ACTIVE portal user yields a
 * session (HR-created members included); the founding-team allowlist
 * (isAllowedAdminEmail) separately gates admin pages and self-registration.
 */
export async function getPortalSessionUser(req: {
  headers: { cookie?: string };
}): Promise<PortalSessionUser | null> {
  const token = getCookieValue(req.headers.cookie, 'portal_session');
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload || typeof payload.email !== 'string') return null;

  try {
    const { getDb } = await import('@/lib/mongodb');
    const db = await getDb();
    const user = await db
      .collection('portal_users')
      .findOne({ email: payload.email.toLowerCase(), active: true });
    if (!user) return null;
    return { email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
}

/**
 * Enforces one of the given staff roles (HR workflows). Sends 401/403 and
 * returns null when the caller lacks access, otherwise the session user.
 */
export async function requireStaffRole(
  req: { headers: { cookie?: string } },
  res: { status: (code: number) => { json: (body: unknown) => void } },
  allowed: AdminRole[]
): Promise<PortalSessionUser | null> {
  const session = await getPortalSessionUser(req);
  if (!session) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return null;
  }
  if (!allowed.includes(session.role as AdminRole)) {
    res.status(403).json({ success: false, message: 'Insufficient permissions for this operation.' });
    return null;
  }
  return session;
}
