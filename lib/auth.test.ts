import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  isAllowedAdminEmail,
  createSessionToken,
  verifySessionToken,
} from './auth';

const TEST_SECRET = 'unit-test-secret-do-not-use-in-prod';

describe('portal password hashing', () => {
  it('verifies a correct password', () => {
    const hash = hashPassword('correct-horse-123');
    expect(verifyPassword('correct-horse-123', hash)).toBe(true);
  });

  it('rejects a wrong password', () => {
    const hash = hashPassword('correct-horse-123');
    expect(verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('rejects malformed stored hashes', () => {
    expect(verifyPassword('x', '')).toBe(false);
    expect(verifyPassword('x', 'no-separator-here')).toBe(false);
  });

  it('produces unique salts per hash', () => {
    expect(hashPassword('same')).not.toBe(hashPassword('same'));
  });
});

describe('admin email allowlist', () => {
  it('allows listed addresses case-insensitively', () => {
    expect(isAllowedAdminEmail('Mezzoforte@SansMercantile.com')).toBe(true);
    expect(isAllowedAdminEmail('hello@sansmercantile.com')).toBe(true);
  });

  it('rejects everyone else', () => {
    expect(isAllowedAdminEmail('attacker@example.com')).toBe(false);
    expect(isAllowedAdminEmail('')).toBe(false);
    expect(isAllowedAdminEmail(undefined)).toBe(false);
  });
});

describe('portal session tokens', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, PORTAL_JWT_SECRET: TEST_SECRET };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('round-trips a session payload', () => {
    const token = createSessionToken({ email: 'hello@sansmercantile.com', name: 'Ops', role: 'admin' });
    const payload = verifySessionToken(token);
    expect(payload?.email).toBe('hello@sansmercantile.com');
    expect(payload?.role).toBe('admin');
  });

  it('rejects tampered payloads', () => {
    const token = createSessionToken({ email: 'hello@sansmercantile.com' });
    const [h, , s] = token.split('.');
    const forgedPayload = Buffer.from(JSON.stringify({ email: 'attacker@example.com' }))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(verifySessionToken(`${h}.${forgedPayload}.${s}`)).toBeNull();
  });

  it('rejects expired tokens', () => {
    const token = createSessionToken({ email: 'hello@sansmercantile.com' }, -10);
    expect(verifySessionToken(token)).toBeNull();
  });

  it('rejects tokens signed with a different secret', () => {
    const token = createSessionToken({ email: 'hello@sansmercantile.com' });
    process.env.PORTAL_JWT_SECRET = 'a-different-secret';
    expect(verifySessionToken(token)).toBeNull();
  });

  it('rejects malformed tokens', () => {
    expect(verifySessionToken('not-a-token')).toBeNull();
    expect(verifySessionToken('a.b')).toBeNull();
    expect(verifySessionToken('')).toBeNull();
  });
});
