import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const JWT_SECRET = process.env.PORTAL_JWT_SECRET;

function assertJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error('Missing PORTAL_JWT_SECRET environment variable.');
  }
  return JWT_SECRET;
}

function base64UrlEncode(buffer: Buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) {
    return false;
  }
  const derived = scryptSync(password, salt, 64);
  const stored = Buffer.from(key, 'hex');
  return timingSafeEqual(derived, stored);
}

/**
 * Auth0 Session Verification
 * Replaces the manual JWT verification with Auth0's secure session handling.
 */
export async function verifyAuth0Session(req: any) {
  const session = await require('@auth0/nextjs-auth0').getSession(req, res);
  if (!session || !session.user) {
    return null;
  }
  return session.user;
}

export function createSessionToken(payload: Record<string, any>, expiresInSeconds = 60 * 60 * 24) {
  const secret = assertJwtSecret();
  const header = base64UrlEncode(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const now = Math.floor(Date.now() / 1000);
  const claims = base64UrlEncode(Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds })));
  const signature = base64UrlEncode(
    createHmac('sha256', secret).update(`${header}.${claims}`).digest()
  );
  return `${header}.${claims}.${signature}`;
}

export function verifySessionToken(token: string) {
  const secret = assertJwtSecret();
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expected = base64UrlEncode(
    createHmac('sha256', secret).update(`${header}.${payload}`).digest()
  );

  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) {
    return null;
  }

  const valid = timingSafeEqual(signatureBuf, expectedBuf);
  if (!valid) return null;

  try {
    const payloadJson = JSON.parse(base64UrlDecode(payload).toString('utf8')) as {
      exp: number;
    };
    if (payloadJson.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payloadJson;
  } catch {
    return null;
  }
}
