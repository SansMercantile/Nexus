import { getAllBlogPosts } from '@/lib/blog-data';
import { SYSTEMS } from '@/lib/constants';

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://sansmercantile.com';

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

  // System pages — served by pages/[system]/index.tsx, so the real path is /{id},
  // NOT /systems/{id}. The SystemData type exposes `id` (there is no `slug` field).
  const systemPages = SYSTEMS.map((system) => `/${system.id}`);

  // System detail pages — pages/[system]/{about,features,pricing}.tsx
  const systemDetailPages = SYSTEMS.flatMap((system) => [
    `/${system.id}/about`,
    `/${system.id}/features`,
    `/${system.id}/pricing`,
  ]);

  // Priv product landing pages (each has its own canonical + JSON-LD)
  const privProductPages = ['/priv/core', '/priv/pay', '/priv/philanthropy'];

  // Press releases
  const pressPages = ['/media/press/priv-core-launch'];

  // Doc system pages (static files under pages/docs/systems/)
  const docSystemPages = SYSTEMS.map((system) => `/docs/systems/${system.id}`);

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
