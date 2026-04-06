import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LinkedInAuth() {
  const router = useRouter();

  useEffect(() => {
    const { code, state } = router.query;

    if (code) {
      // Exchange code for token
      fetch('/api/auth/linkedin/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            alert('LinkedIn authenticated! Token saved.');
            router.push('/media');
          } else {
            alert('Authentication failed: ' + data.error);
          }
        })
        .catch(err => alert('Error: ' + err.message));
    } else {
      // Redirect to LinkedIn
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '866yfwyrx81h2d';
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/linkedin`);
      const scope = encodeURIComponent('r_organization_social w_organization_social openid profile email');
      const state = 'linkedin_auth_' + Date.now();

      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    }
  }, [router.query]);

  return (
    <div className="min-h-screen bg-nexus-dark flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl text-white mb-4">Authenticating with LinkedIn...</h1>
        <p className="text-nexus-gray-300">Please wait while we connect to your LinkedIn account.</p>
      </div>
    </div>
  );
}