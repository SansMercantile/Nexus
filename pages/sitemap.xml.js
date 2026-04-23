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

  // System pages
  const systemPages = SYSTEMS.map(system => `/systems/${system.slug}`);

  // System detail pages
  const systemDetailPages = SYSTEMS.flatMap(system => [
    `/systems/${system.slug}/about`,
    `/systems/${system.slug}/features`,
    `/systems/${system.slug}/pricing`,
  ]);

  // Doc system pages
  const docSystemPages = SYSTEMS.map(system => `/docs/systems/${system.slug}`);

  // Blog posts
  const blogPosts = getAllBlogPosts();
  const blogPages = blogPosts.map(post => `/media/blog/${post.slug}`);

  // Combine all URLs
  const allPages = [
    ...staticPages,
    ...systemPages,
    ...systemDetailPages,
    ...docSystemPages,
    ...blogPages,
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(page => {
    const url = `${baseUrl}${page}`;
    const lastmod = new Date().toISOString().split('T')[0]; // Today's date
    const priority = page === '' ? '1.0' : page.startsWith('/media/blog/') ? '0.8' : '0.9';
    const changefreq = page.startsWith('/media/blog/') ? 'monthly' : 'weekly';

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