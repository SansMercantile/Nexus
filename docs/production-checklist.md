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

## Login 401s with correct credentials

Set `DIAG_KEY` in Vercel env, redeploy, then query diagnostics
(replace the key and email):

```bash
curl 'https://www.sansmercantile.com/api/diag?key=YOUR_DIAG_KEY&email=hello@sansmercantile.com'
```

Read the `portal` block:
- `users: 0` → production is pointing at an empty/different database than
  the one holding the accounts. Fix `MONGODB_URI` / `MONGODB_DB` and redeploy.
- `accountExists: false` → that address was never provisioned here.
- `accountActive: false` → reactivate it via `/admin/team` or Mongo directly.
- `accountExists: true, accountActive: true` → the address is fine; the
  password is being mistyped (copy-paste it, don't retype).
- `jwtConfigured: false` → logins that pass the password check still 500;
  set `PORTAL_JWT_SECRET` and redeploy.

## Console noise that is NOT our bug

`worker-content-script-base.js ... Message emit failed: The message port
closed` comes from a browser extension (password manager / ad blocker),
not from this site. Disable extensions if it bothers you.

## Other production env vars

Copy `.env.local.example` — every key the app needs is documented there.
`DIAG_KEY` unlocks `/api/diag?key=...` for Mongo/SMTP health checks
(no key configured → the endpoint 404s by design).
