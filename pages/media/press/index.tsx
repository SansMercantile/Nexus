import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';

const PAGE_URL = 'https://www.sansmercantile.com/media/press/';
const PAGE_TITLE = 'Press Releases | Sans Mercantile News and Announcements';
const PAGE_DESCRIPTION =
  'Official press releases from Sans Mercantile, including the launch of Priv Core, an autonomous trading desk and AI trading terminal in South Africa.';

type PressItem = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  href?: string;
  external?: boolean;
  cta?: string;
};

const STATIC_RELEASES: PressItem[] = [
  {
    slug: 'priv-core-launch',
    title: 'Sans Mercantile launches Priv Core, an autonomous trading desk, in South Africa',
    excerpt:
      'Start free, no card required. Strategy backtesting, 24/7 market watch and full custody control in one app.',
    publishedAt: '2026-10-19',
    href: '/media/press/priv-core-launch',
    cta: 'Read the Full Release',
  },
];

export default function MediaPressIndex() {
  const [cmsReleases, setCmsReleases] = React.useState<PressItem[]>([]);

  React.useEffect(() => {
    fetch('/api/content/list?type=press')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.posts)) setCmsReleases(data.posts);
      })
      .catch(() => {});
  }, []);

  const staticSlugs = new Set(STATIC_RELEASES.map((release) => release.slug));
  const releases = [...STATIC_RELEASES, ...cmsReleases.filter((release) => !staticSlugs.has(release.slug))];

  return (
    <Layout>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} key="description" />
        <meta
          name="keywords"
          content="Sans Mercantile press releases, Priv Core launch, autonomous trading desk South Africa, AI trading terminal, company announcements"
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} key="og:title" />
        <meta property="og:description" content={PAGE_DESCRIPTION} key="og:description" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:url" content={PAGE_URL} key="og:url" />
        <meta property="og:site_name" content="Sans Mercantile" key="og:site_name" />
        <meta name="twitter:card" content="summary" key="twitter:card" />
        <meta name="twitter:title" content={PAGE_TITLE} key="twitter:title" />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} key="twitter:description" />
      </Head>
      <div className=" pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Press Releases</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Company announcements and executive news</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Official press releases, market updates, and leadership announcements from Sans Mercantile.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {releases.map((release, index) => {
              const inner = (
                <>
                  <p className="text-xs uppercase tracking-[0.3em] text-nexus-gold mb-3">
                    {release.publishedAt
                      ? new Date(release.publishedAt).toLocaleDateString('en-ZA', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''}
                    {release.external ? ' · External' : ''}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{release.title}</h2>
                  <p className="text-nexus-gray-300 leading-relaxed mb-8">{release.excerpt}</p>
                  <span className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold group-hover:opacity-90 transition-opacity">
                    {release.cta || 'Read the Full Release'}
                  </span>
                </>
              );

              const cardClasses =
                'group block rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10 hover:border-nexus-gold/50 transition-colors h-full';

              return (
                <motion.div
                  key={release.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
                >
                  {release.external ? (
                    <a
                      href={release.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClasses}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link href={release.href || `/media/press/${release.slug}`} className={cardClasses}>
                      {inner}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-nexus-gray-500 mb-3">
              Media contacts
            </p>
            <p className="text-nexus-gray-300 leading-relaxed">
              For interview requests and press materials, contact{' '}
              <a
                href="mailto:hello@swellprcomm.com
                className="text-nexus-gold hover:text-nexus-accent transition-colors"
              >
                hello@swellprcomm.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
