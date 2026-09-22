# Production checklist (Vercel)

## Login returns 500 on www.sansmercantile.com

The portal login fails fast (≤5s) with a JSON 500 when MongoDB is
unreachable. Work through this list in order:

1. **Vercel env vars** — Project → Settings → Environment Variables.
   Required for login:
   - `MONGODB_URI` (full Atlas connection string, including password)
   - `PORTAL_JWT_SECRET` (long random string; anyone with it can forge sessions)
2. **Atlas Network Access** — the #1 cause. Vercel uses dynamic egress IPs,
   so either allow `0.0.0.0/0` (simplest; auth still enforced by DB user +
   TLS) or peer via AWS PrivateLink / set up Vercel's static egress IPs.
3. **Atlas DB user** — confirm the username/password in `MONGODB_URI` exists
   and has readWrite on the target database.
4. **Redeploy** after changing env vars (env is baked at deploy time).

Verify locally against production values without the UI:

```bash
# 401 = backend + DB reachable (bad password correctly rejected)
# 500 = still a DB/network problem (see above)
curl -X POST https://www.sansmercantile.com/api/portal/login/ \
  -H 'Content-Type: application/json' \
  -d '{"email":"nobody@example.com","password":"wrongpassword1"}'
```

## Console noise that is NOT our bug

`worker-content-script-base.js ... Message emit failed: The message port
closed` comes from a browser extension (password manager / ad blocker),
not from this site. Disable extensions if it bothers you.

## Other production env vars

Copy `.env.local.example` — every key the app needs is documented there.
`DIAG_KEY` unlocks `/api/diag?key=...` for Mongo/SMTP health checks
(no key configured → the endpoint 404s by design).
