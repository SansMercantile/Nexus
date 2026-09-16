/**
 * Cloudflare Turnstile bot protection for public write endpoints.
 *
 * Enforcement is active only when TURNSTILE_SECRET_KEY is configured; when it
 * is absent, verification is skipped (logged server-side) so local development
 * keeps working. Set TURNSTILE_SECRET_KEY in production and embed the
 * Turnstile widget on public forms (apply, register) sending its token as
 * `turnstileToken` in the request body.
 */
export async function verifyTurnstile(token: unknown, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== 'string' || token.length === 0) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set('remoteip', remoteIp);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verification error:', err);
    return false;
  }
}
