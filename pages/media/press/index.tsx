import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

type PressItem = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

export default function MediaPressIndex() {
  const [releases, setReleases] = React.useState<PressItem[]>([]);

  React.useEffect(() => {
    fetch('/api/content/list?type=press')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.posts)) setReleases(data.posts);
      })
      .catch(() => {});
  }, []);
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Press Releases</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Company announcements and executive news</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Official press releases, market updates, and leadership announcements from Sans Mercantile.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Latest Release</h2>
            <p className="text-nexus-gray-300 leading-relaxed mb-8">
              March 2026: Sans Mercantile appoints Christopher Maddison as Chief Business Development Officer and Executive Partner.
            </p>
            <Link href="/media/press/christopher-maddison-cbdo-appointment" className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
              Read the Full Release
            </Link>
          </motion.div>

          {releases.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {releases.map((release) => (
                <Link
                  key={release.slug}
                  href={`/media/press/${release.slug}`}
                  className="block rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-8 hover:border-nexus-gold/40 transition"
                >
                  <p className="text-xs text-nexus-gray-500 mb-2">
                    {release.publishedAt ? new Date(release.publishedAt).toLocaleDateString() : ''}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-3">{release.title}</h3>
                  <p className="text-nexus-gray-300 leading-relaxed">{release.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
