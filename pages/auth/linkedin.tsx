import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function LinkedInAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const { code, state } = router.query;
    if (!router.isReady) return;

    if (code) {
      // Exchange code for token. The redirect URI must be identical to the
      // one used at authorize time, so the frontend sends back the exact
      // origin it used.
      const redirectUri = `${window.location.origin}/auth/linkedin`;
      fetch('/api/auth/linkedin/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state, redirectUri }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            setToken(data.access_token);
          } else {
            setError('Authentication failed: ' + data.error);
          }
        })
        .catch(err => setError('Error: ' + err.message));
    } else {
      // Redirect to LinkedIn
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '866yfwyrx81h2d';
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/linkedin`);
      const scope = encodeURIComponent('r_organization_social w_organization_social openid profile email');
      const state = 'linkedin_auth_' + Date.now();

      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    }
  }, [router.query, router.isReady]);

  return (
    <div className="min-h-screen bg-nexus-dark flex items-center justify-center px-6">
      <div className="text-center max-w-xl w-full">
        <h1 className="text-2xl text-white mb-4">Authenticating with LinkedIn...</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {!error && !token && (
          <p className="text-nexus-gray-300">Please wait while we connect to your LinkedIn account.</p>
        )}
        {token && (
          <div className="mt-6 rounded-2xl border border-nexus-gold/30 bg-[#0b1125] p-6 text-left">
            <p className="text-emerald-400 font-semibold mb-2">LinkedIn connected.</p>
            <p className="text-nexus-gray-300 text-sm mb-4">
              Serverless deployments cannot keep the saved token — copy it into Vercel as{' '}
              <span className="font-mono">LINKEDIN_ACCESS_TOKEN</span>, then redeploy.
            </p>
            <textarea
              readOnly
              value={token}
              rows={3}
              onFocus={(e) => e.target.select()}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-nexus-accent/20 text-white font-mono text-xs break-all"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(token);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2500);
              }}
              className="mt-4 px-6 py-2 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90"
            >
              {copied ? 'Copied!' : 'Copy Token'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}