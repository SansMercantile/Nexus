import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Minimal in-memory sliding-window rate limiter for API routes.
 *
 * Stops casual brute-force, spam, and Bedrock budget-burn. Note: state is
 * per server instance, so on multi-instance/serverless deployments use a
 * shared store (e.g. Upstash Redis) instead. The interface below is kept
 * narrow so it can be swapped without touching call sites.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

function prune(bucket: Bucket, now: number, windowMs: number) {
  const cutoff = now - windowMs;
  while (bucket.hits.length > 0 && bucket.hits[0] <= cutoff) {
    bucket.hits.shift();
  }
}

export function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  prune(bucket, now, windowMs);
  if (bucket.hits.length >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.hits[0] + windowMs - now };
  }
  bucket.hits.push(now);
  // Opportunistic memory hygiene.
  if (buckets.size > 20000 && Math.random() < 0.01) {
    buckets.forEach((b, k) => {
      prune(b, now, windowMs);
      if (b.hits.length === 0) buckets.delete(k);
    });
  }
  return { allowed: true, remaining: limit - bucket.hits.length, retryAfterMs: 0 };
}

/**
 * Enforces `limit` requests per `windowMs` for the caller's IP under the
 * given scope. Sends HTTP 429 and returns false when exceeded.
 */
export function enforceRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  scope: string,
  limit: number,
  windowMs: number
): boolean {
  const key = `${scope}:${getClientIp(req)}`;
  const result = checkRateLimit(key, limit, windowMs);
  if (!result.allowed) {
    res.setHeader('Retry-After', Math.max(1, Math.ceil(result.retryAfterMs / 1000)));
    res.status(429).json({ success: false, message: 'Too many requests. Please slow down and try again later.' });
    return false;
  }
  return true;
}
