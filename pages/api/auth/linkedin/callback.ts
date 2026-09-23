import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type ResponseData = {
  access_token?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, redirectUri } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  // The exchange redirect URI must byte-match the authorize-time one.
  // Rebuild it from the caller's origin (http(s) only) to avoid mismatch
  // between preview/production hosts.
  const originMatch =
    typeof redirectUri === 'string' ? redirectUri.match(/^(https?:\/\/[^/]+)/) : null;
  const safeRedirect = originMatch
    ? `${originMatch[1]}/auth/linkedin`
    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/auth/linkedin`;

  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'LinkedIn client credentials not configured' });
    }

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: safeRedirect,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return res.status(tokenResponse.status).json({ error: `Token exchange failed: ${errorText}` });
    }

    const tokenData = await tokenResponse.json();

    // Save token to .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update LINKEDIN_ACCESS_TOKEN
    const tokenRegex = /LINKEDIN_ACCESS_TOKEN=.*/;
    if (tokenRegex.test(envContent)) {
      envContent = envContent.replace(tokenRegex, `LINKEDIN_ACCESS_TOKEN=${tokenData.access_token}`);
    } else {
      envContent += `\nLINKEDIN_ACCESS_TOKEN=${tokenData.access_token}`;
    }

    fs.writeFileSync(envPath, envContent);

    return res.status(200).json({ access_token: tokenData.access_token });
  } catch (error) {
    console.error('LinkedIn Auth Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}