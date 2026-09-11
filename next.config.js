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
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
