import type { NextApiRequest, NextApiResponse } from 'next';
import { getPortalSessionUser, type PortalSessionUser } from './auth';
import { checkRateLimit, getClientIp } from './rate-limit';

/**
 * Shared gate for Bedrock-backed routes.
 *
 * - mode 'session': a valid portal session is required (operational routes
 *   with no public callers: SMO summaries, trading signals, analysis).
 * - mode 'open': anonymous callers allowed inside a strict per-IP quota
 *   (public chat surfaces); signed-in portal users get a generous quota.
 *
 * Set AI_REQUIRE_AUTH=1 to force session-only access on every guarded route.
 */

type GuardOptions = {
  mode: 'session' | 'open';
  /** Rate-limit scope, e.g. 'ai-bedrock'. */
  scope: string;
  /** Anonymous quota per window (open mode only). */
  anonLimit?: number;
  /** Authenticated quota per window. */
  authedLimit?: number;
  windowMs?: number;
};

const DEFAULT_WINDOW_MS = 60 * 60 * 1000;

function quotaExceeded(res: NextApiResponse, retryAfterMs: number) {
  res.setHeader('Retry-After', Math.max(1, Math.ceil(retryAfterMs / 1000)));
  res.status(429).json({ success: false, message: 'AI quota exceeded. Please try again later.' });
}

export async function guardAiRoute(
  req: NextApiRequest,
  res: NextApiResponse,
  opts: GuardOptions
): Promise<PortalSessionUser | 'anonymous' | null> {
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;
  const session = await getPortalSessionUser(req);

  if (process.env.AI_REQUIRE_AUTH === '1' && !session) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return null;
  }

  if (opts.mode === 'session') {
    if (!session) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return null;
    }
    const authed = checkRateLimit(
      `ai:${opts.scope}:user:${session.email}`,
      opts.authedLimit ?? 120,
      windowMs
    );
    if (!authed.allowed) {
      quotaExceeded(res, authed.retryAfterMs);
      return null;
    }
    return session;
  }

  if (session) {
    const authed = checkRateLimit(
      `ai:${opts.scope}:user:${session.email}`,
      opts.authedLimit ?? 300,
      windowMs
    );
    if (!authed.allowed) {
      quotaExceeded(res, authed.retryAfterMs);
      return null;
    }
    return session;
  }

  const anon = checkRateLimit(
    `ai:${opts.scope}:ip:${getClientIp(req)}`,
    opts.anonLimit ?? 30,
    windowMs
  );
  if (!anon.allowed) {
    quotaExceeded(res, anon.retryAfterMs);
    return null;
  }
  return 'anonymous';
}
