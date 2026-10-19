import fs from 'fs';
import path from 'path';
import { getAllBlogPosts } from '@/lib/blog-data';
import { SYSTEMS } from '@/lib/constants';

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  // The apex domain 307-redirects to www — emit canonical www URLs so no
  // sitemap entry starts with a redirect hop.
  const baseUrl = 'https://www.sansmercantile.com';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/careers',
    '/contact',
    '/platform',
    '/services',
    '/systems',
    '/knowledge-base',
    '/media',
    '/media/blog',
    '/media/press',
    '/press',
    '/legal',
    '/legal/privacy',
    '/legal/terms',
    '/legal/compliance',
    '/legal/cookie',
    '/legal/eula',
    '/legal/faq',
    '/admin/compliance',
    '/admin/smo',
    '/docs',
    '/docs/integration',
    '/docs/security',
    '/docs/troubleshooting',
    '/docs/getting-started/account-setup',
    '/docs/getting-started/dashboard',
    '/docs/integration/database',
    '/docs/integration/payments',
    '/docs/integration/third-party',
    '/docs/integration/webhooks',
    '/docs/integration/workflows',
    '/docs/security/encryption',
    '/docs/security/hipaa',
    '/docs/security/privacy',
    '/docs/security/regulatory',
    '/docs/security/soc2',
  ];

  // System pages — served by pages/[system]/index.tsx. The lookup
  // (getSystemBySlug) is case-insensitive but URLs are conventionally
  // lowercase, so emit lowercase ids to match the canonical tags.
  const systemPages = SYSTEMS.map((system) => `/${system.id.toLowerCase()}`);

  // System detail pages — pages/[system]/{about,features,pricing}.tsx
  const systemDetailPages = SYSTEMS.flatMap((system) => [
    `/${system.id.toLowerCase()}/about`,
    `/${system.id.toLowerCase()}/features`,
    `/${system.id.toLowerCase()}/pricing`,
  ]);

  // Priv product landing pages (each has its own canonical + JSON-LD)
  const privProductPages = ['/priv/core', '/priv/pay', '/priv/philanthropy'];

  // Press releases
  const pressPages = ['/media/press/priv-core-launch'];

  // Doc system pages — read the filesystem instead of deriving from ids:
  // source files are lowercase (ptah.tsx, hathor.tsx) while ids are mixed
  // case (Ptah, Hathor), and some ids have no file at all. Emitting anything
  // else would ship 404s to Google.
  const docSystemPages = fs
    .readdirSync(path.join(process.cwd(), 'pages', 'docs', 'systems'))
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => `/docs/systems/${file.replace(/\.tsx$/, '')}`);

  // Blog posts
  const blogPosts = getAllBlogPosts();
  const blogPages = blogPosts.map((post) => `/media/blog/${post.slug}`);

  // Combine all URLs (deduplicated: system pages may collide with static ones)
  const allPages = Array.from(
    new Set([
      ...staticPages,
      ...systemPages,
      ...systemDetailPages,
      ...privProductPages,
      ...pressPages,
      ...docSystemPages,
      ...blogPages,
    ])
  );

  // Generate sitemap XML. trailingSlash is enabled in next.config.js, so every
  // canonical URL ends with a slash — emit them that way to avoid redirect hops.
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => {
    const path = page === '' ? '/' : `${page}/`;
    const url = `${baseUrl}${path}`;
    const lastmod = new Date().toISOString().split('T')[0];
    const isPriv = path.startsWith('/priv');
    const isBlog = path.startsWith('/media/blog/');
    const isPress = path.startsWith('/media/press/');
    const priority = path === '/' ? '1.0' : isPriv ? '0.9' : isBlog || isPress ? '0.8' : '0.7';
    const changefreq = isBlog ? 'monthly' : isPriv || isPress ? 'weekly' : 'monthly';

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
