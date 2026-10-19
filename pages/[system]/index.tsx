import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { SystemHero } from '@/components/systems/SystemHero';
import { RestrictedSystemNotice } from '@/components/systems/RestrictedSystemNotice';
import { AnimatedIcon, featureIcons } from '@/components/AnimatedIcons';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { getSystemBySlug, getSystemValueDescription, getSystemSdgs, getAllSystems } from '@/lib/system-data';
import { fadeInUp, staggerContainer, itemVariants } from '@/lib/animations';
import { AppPlatform, type SystemData } from '@/lib/constants';

// Display label for each platform's download button. "notifyLabel" is what shows before
// a real platformUrl exists (routes to the app's waitlistUrl instead).
const PLATFORM_META: Record<AppPlatform, { label: string; notifyLabel: string }> = {
  web: { label: 'Open Web App', notifyLabel: 'Notify Me — Web' },
  ios: { label: 'Open on iPhone/iPad', notifyLabel: 'Notify me — iOS' },
  android: { label: 'Download for Android', notifyLabel: 'Notify Me — Android' },
  macos: { label: 'Download for macOS', notifyLabel: 'Notify Me — macOS' },
  windows: { label: 'Download for Windows', notifyLabel: 'Download for Windows' },
  linux: { label: 'Download for Linux', notifyLabel: 'Download for Linux' },
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sansmercantile.com';

// Full SEO metadata per system page: keyword-rich title/description for Priv,
// subtitle-based titles everywhere else, plus OG/Twitter tags and JSON-LD.
function generateSystemSeo(systemData: SystemData) {
  const isPriv = systemData.id === 'priv';
  const title = isPriv
    ? 'Priv — Wealth Intelligence, Priv Core, Priv Pay & Priv Philanthropy | Sans Mercantile'
    : `${systemData.name} — ${systemData.subtitle} | Sans Mercantile`;
  const description = isPriv
    ? 'Priv by Sans Mercantile: Priv Core autonomous trading desk, Priv Pay split payments and Priv Philanthropy giving. Start free, no card required.'
    : systemData.description;
  // Canonical URLs are lowercase: /ptah resolves the same as /Ptah (see
  // getSystemBySlug) and lowercase is the convention the sitemap emits.
  const url = `${BASE_URL}/${systemData.id.toLowerCase()}/`;
  // Per-system OG art (public/Faces/*, landscape 1376x748) — verified to
  // exist for every system in SYSTEMS.
  const image = `${BASE_URL}/Faces/${encodeURIComponent(systemData.face)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      image,
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      image,
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Sans Mercantile',
        url: `${BASE_URL}/`,
      },
      ...(isPriv
        ? {
            mainEntity: {
              '@type': 'Organization',
              name: 'Sans Mercantile',
              url: `${BASE_URL}/`,
              department: {
                '@type': 'Organization',
                name: 'Priv — Wealth Intelligence',
                url,
              },
            },
          }
        : {}),
    },
  };
}

export default function SystemPage({ system }: { system?: string }) {
  if (!system || typeof system !== 'string') {
    return null;
  }

  const systemData = getSystemBySlug(system);

  if (!systemData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold">System not found</h1>
        </div>
      </Layout>
    );
  }

  if (systemData.badge?.tone === 'danger') {
    return <RestrictedSystemNotice systemData={systemData} />;
  }

  const seo = generateSystemSeo(systemData);

  return (
    <Layout>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} key="description" />
        <link rel="canonical" href={seo.openGraph.url} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={seo.openGraph.title} key="og:title" />
        <meta property="og:description" content={seo.openGraph.description} key="og:description" />
        <meta property="og:type" content={seo.openGraph.type} key="og:type" />
        <meta property="og:url" content={seo.openGraph.url} key="og:url" />
        <meta property="og:image" content={seo.openGraph.image} key="og:image" />
        <meta property="og:site_name" content="Sans Mercantile" key="og:site_name" />

        {/* Twitter */}
        <meta name="twitter:card" content={seo.twitter.card} key="twitter:card" />
        <meta name="twitter:title" content={seo.twitter.title} key="twitter:title" />
        <meta name="twitter:description" content={seo.twitter.description} key="twitter:description" />
        <meta name="twitter:image" content={seo.twitter.image} key="twitter:image" />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema) }} />
      </Head>

      {/* Hero Section */}
      <SystemHero
        id={systemData.id}
        name={systemData.name}
        subtitle={systemData.subtitle}
        color={systemData.color}
        face={systemData.face}
      />

      {/* About Section */}

      {/* Hero Section */}
      <SystemHero
        id={systemData.id}
        name={systemData.name}
        subtitle={systemData.subtitle}
        color={systemData.color}
        face={systemData.face}
      />

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Vision & Mission */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: systemData.color }}>
              Vision
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              {systemData.vision}
            </p>

            <h2 className="text-3xl font-bold mb-4" style={{ color: systemData.color }}>
              Mission
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              {systemData.mission}
            </p>
          </motion.div>

          {/* Values */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-8" style={{ color: systemData.color }}>
              Core Values
            </h2>

            <motion.div
              variants={staggerContainer}
              className="space-y-4"
            >
              {systemData.values.map((value, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="p-4 rounded-lg border-l-4 bg-white/5"
                  style={{ borderColor: systemData.color }}
                >
                  <h3 className="font-semibold text-lg mb-1">{value}</h3>
                  <p className="text-white/60 text-sm">
                    {getSystemValueDescription(systemData.id, value) || `Core value driving ${systemData.name} operations`}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10">
              <h3 className="text-2xl font-semibold mb-5" style={{ color: systemData.color }}>
                Sustainable Development Goals
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {getSystemSdgs(systemData.id).map((sdg) => (
                  <div
                    key={sdg.goal}
                    className="p-4 rounded-lg border border-white/10 bg-white/5"
                    style={{ borderColor: systemData.color }}
                  >
                    <p className="text-nexus-gold font-semibold mb-2">SDG {sdg.goal}: {sdg.title}</p>
                    <p className="text-white/70 text-sm">{sdg.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20 border-t border-nexus-accent/20"
      >
        <h2 className="text-4xl font-bold mb-12 gradient-text">Features</h2>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: 'rocket' as const, title: 'Advanced Technology', desc: 'Cutting-edge AI and automation' },
            { icon: 'lock' as const, title: 'Enterprise Security', desc: 'Bank-grade security protocols' },
            { icon: 'lightning' as const, title: 'High Performance', desc: 'Lightning-fast response times' },
            { icon: 'globe' as const, title: 'Global Scale', desc: 'Operates across all markets' },
            { icon: 'chart' as const, title: 'Real-time Analytics', desc: 'Live data and insights' },
            { icon: 'handshake' as const, title: 'Full Integration', desc: 'Seamless constellation integration' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-6 rounded-lg card hover:card-hover group transition-all duration-300"
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110 inline-block">
                <AnimatedIcon type={feature.icon} size={48} className="text-nexus-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Applications Section — only renders for systems that have consumer apps
          (e.g. Priv has Priv Pay). Absent for systems with no `applications` entry. */}
      {systemData.applications && systemData.applications.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 py-20 border-t border-nexus-accent/20"
        >
          <h2 className="text-4xl font-bold mb-4 gradient-text">{systemData.name} Applications</h2>
          <p className="text-white/70 text-lg mb-12 max-w-3xl">
            Apps built on {systemData.name}&apos;s intelligence, available directly to you.
          </p>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {systemData.applications.map((app, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-8 rounded-lg card hover:card-hover transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-3" style={{ color: systemData.color }}>
                  {app.name}
                </h3>
                <p className="text-white/70 mb-6">{app.description}</p>

                {app.liveUrl && (
                  <a
                    href={app.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex items-center gap-2 mb-4"
                    style={{ backgroundColor: systemData.color, color: '#0a0e27' }}
                  >
                    <AnimatedIcon type="globe" size={18} />
                    Open {app.name}
                  </a>
                )}

                <div className="flex gap-3 flex-wrap">
                  {app.platforms.filter((platform) => platform !== 'web' || !app.liveUrl).map((platform) => {
                    const url = app.platformUrls?.[platform] ?? app.waitlistUrl ?? '#';
                    const isLive = Boolean(app.platformUrls?.[platform]);
                    const meta = PLATFORM_META[platform];
                    return (
                      <a
                        key={platform}
                        href={url}
                        target={isLive ? '_blank' : undefined}
                        rel={isLive ? 'noopener noreferrer' : undefined}
                        className="btn btn-secondary flex items-center gap-2 text-sm"
                      >
                        <AnimatedIcon type="rocket" size={16} />
                        {isLive ? meta.label : meta.notifyLabel}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 py-20 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-white/70 mb-8">
          Join thousands of organizations using {systemData.name}
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href={{
              pathname: '/contact',
              query: { subject: 'Free Trial', system: systemData.name },
            }}
          >
            <button
              className="btn btn-primary"
              style={{ backgroundColor: systemData.color, color: '#0a0e27' }}
            >
              Start Free Trial
            </button>
          </Link>
          <Link
            href={{
              pathname: '/contact',
              query: { subject: 'Schedule Demo', system: systemData.name },
            }}
          >
            <button className="btn btn-secondary">Schedule Demo</button>
          </Link>
        </div>
      </motion.section>
    </Layout>
  );
}

// SSG for every system page: prerendered HTML must contain the actual
// content (router.query is empty under automatic static optimization, which
// shipped empty/"System not found" shells to crawlers). Both the original id
// casing and the lowercase canonical form are generated so legacy /Ptah-style
// links keep resolving while /ptah matches the sitemap.
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllSystems().flatMap((system) =>
    Array.from(new Set([system.id, system.id.toLowerCase()])).map((id) => ({
      params: { system: id },
    }))
  );
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: { system: typeof params?.system === 'string' ? params.system : null },
});
