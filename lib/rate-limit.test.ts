import { describe, it, expect } from 'vitest';
import { checkRateLimit, getClientIp } from './rate-limit';

describe('checkRateLimit', () => {
  it('allows up to the limit then blocks', () => {
    const key = `test-basic-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      const r = checkRateLimit(key, 3, 60_000);
      expect(r.allowed).toBe(true);
      expect(r.remaining).toBe(2 - i);
    }
    const blocked = checkRateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it('resets after the window passes', () => {
    const key = `test-window-${Date.now()}`;
    const now = 1_000_000;
    expect(checkRateLimit(key, 1, 1_000, now).allowed).toBe(true);
    expect(checkRateLimit(key, 1, 1_000, now + 500).allowed).toBe(false);
    expect(checkRateLimit(key, 1, 1_000, now + 1_001).allowed).toBe(true);
  });

  it('isolates different keys', () => {
    const a = `test-a-${Date.now()}`;
    const b = `test-b-${Date.now()}`;
    expect(checkRateLimit(a, 1, 60_000).allowed).toBe(true);
    expect(checkRateLimit(a, 1, 60_000).allowed).toBe(false);
    expect(checkRateLimit(b, 1, 60_000).allowed).toBe(true);
  });
});

describe('getClientIp', () => {
  it('prefers the first x-forwarded-for entry', () => {
    expect(getClientIp({ headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } } as any)).toBe('1.2.3.4');
  });

  it('falls back to the socket address', () => {
    expect(getClientIp({ headers: {}, socket: { remoteAddress: '9.9.9.9' } } as any)).toBe('9.9.9.9');
  });
});
