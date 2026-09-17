import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';
import { guardAiRoute } from './ai-guard';

function mockReq(cookie?: string): NextApiRequest {
  return {
    headers: { ...(cookie ? { cookie } : {}) },
    socket: { remoteAddress: '10.0.0.99' },
  } as unknown as NextApiRequest;
}

function mockRes() {
  const res = {
    statusCode: 0,
    body: null as unknown,
    headers: {} as Record<string, string | number>,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
    setHeader(name: string, value: string | number) {
      res.headers[name] = value;
    },
  };
  return res as unknown as NextApiResponse & { statusCode: number; body: unknown };
}

describe('guardAiRoute', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.AI_REQUIRE_AUTH;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('denies session routes without a session', async () => {
    const res = mockRes();
    const result = await guardAiRoute(mockReq(), res, { mode: 'session', scope: `t-session-${Date.now()}` });
    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
  });

  it('allows anonymous callers in open mode within quota', async () => {
    const res = mockRes();
    const result = await guardAiRoute(mockReq(), res, { mode: 'open', scope: `t-open-${Date.now()}` });
    expect(result).toBe('anonymous');
    expect(res.statusCode).toBe(0);
  });

  it('rate-limits anonymous callers in open mode', async () => {
    const scope = `t-quota-${Date.now()}`;
    let lastStatus = 0;
    for (let i = 0; i < 3; i++) {
      const res = mockRes();
      await guardAiRoute(mockReq(), res, { mode: 'open', scope, anonLimit: 2 });
      lastStatus = res.statusCode;
    }
    // First two pass (status untouched), third is rejected with 429.
    expect(lastStatus).toBe(429);
  });

  it('forces auth everywhere when AI_REQUIRE_AUTH=1', async () => {
    process.env.AI_REQUIRE_AUTH = '1';
    const res = mockRes();
    const result = await guardAiRoute(mockReq(), res, { mode: 'open', scope: `t-kill-${Date.now()}` });
    expect(result).toBeNull();
    expect(res.statusCode).toBe(401);
  });
});
