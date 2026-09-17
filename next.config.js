/** @type {import('next').NextConfig} */
const isVercelBuild = process.env.VERCEL === '1';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // For GitHub Pages static export
    formats: ['image/avif', 'image/webp'],
  },
  // For GitHub Pages deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  ...(isVercelBuild || !process.env.NEXT_OUTPUT
    ? {}
    : { output: process.env.NEXT_OUTPUT }),
  trailingSlash: true,
  async redirects() {
    return [
      // Legacy fake login page removed; the portal is the single sign-in.
      { source: '/login', destination: '/portal', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // HTTPS enforcement (no includeSubDomains: apex + www + customer subdomains vary).
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Camera/mic stay available to first-party (SMO voice memos, video calls).
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=()',
          },
          // Report-only while the policy is tuned; promote to enforced CSP later.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us.i.posthog.com https://*.vercel-insights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              'img-src \'self\' data: blob: https:',
              'media-src \'self\' blob: https:',
              'connect-src \'self\' https: wss:',
              "frame-ancestors 'self'",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
  typescript: {
    // Type errors fail the build. Keep `npm run typecheck` green.
    ignoreBuildErrors: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
