import { getSession } from '@auth0/nextjs-auth0';
import crypto from 'crypto';

// Auth0 session check, used for SSO-protected admin routes separate from portal auth below.
export async function verifyAuth0Session(req: any, res: any) {
  const session = await getSession(req, res);
  if (!session || !session.user) return null;
  return session.user;
}

// --- Portal email/password auth used by /api/portal/register, login, me ---

const SCRYPT_KEYLEN = 64;

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plain, salt, SCRYPT_KEYLEN).toString('hex');
  return salt + ':' + hash;
}

const ADMIN_EMAIL_ALLOWLIST = new Set([
  'mezzoforte@sansmercantile.com',
  'hello@sansmercantile.com',
]);

export function isAllowedAdminEmail(email?: string): boolean {
  return typeof email === 'string' && ADMIN_EMAIL_ALLOWLIST.has(email.toLowerCase());
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

export function verifySessionToken(token: string): SessionPayload | null {
  try {
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
