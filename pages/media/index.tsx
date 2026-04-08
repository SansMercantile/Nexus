import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { useState, useEffect } from 'react';

const networkPlaceholders = [
  {
    id: 'youtube-1',
    platform: 'YouTube',
    title: 'Constellation Launch Webinar: AI in Infrastructure',
    content: 'Watch our newest product launch webinar where we unveil the next-gen, regulated autonomous market infrastructure.',
    postedDate: new Date().toLocaleDateString(),
    url: 'https://www.youtube.com/watch?v=placeholder',
  },
  {
    id: 'facebook-1',
    platform: 'Facebook',
    title: 'Sant Mercantile wins Best AI Trust Award',
    content: 'We are excited to share our latest recognition in autonomous systems governance and transparency.',
    postedDate: new Date().toLocaleDateString(),
    url: 'https://www.facebook.com/sansmercantile/posts/placeholder',
  },
  {
    id: 'twitter-1',
    platform: 'Twitter',
    title: 'New integration: Constellation SDK now supports event streaming',
    content: 'Check out how to connect to real-time telemetry with 5 lines of code.',
    postedDate: new Date().toLocaleDateString(),
    url: 'https://twitter.com/sansmercantile/status/placeholder',
  },
  {
    id: 'instagram-1',
    platform: 'Instagram',
    title: 'Behind the scenes of the media hub redesign',
    content: 'Visual story from the design team on the new platform aesthetics.',
    postedDate: new Date().toLocaleDateString(),
    url: 'https://www.instagram.com/p/placeholder',
  },
];

function mergeFeeds(linkedInPosts: any[], otherPosts: any[]) {
  const merged: any[] = [];
  const maxLength = Math.max(linkedInPosts.length, otherPosts.length);
  for (let i = 0; i < maxLength; i += 1) {
    if (i < linkedInPosts.length) merged.push({ ...linkedInPosts[i], platform: 'LinkedIn' });
    if (i < otherPosts.length) merged.push(otherPosts[i]);
  }
  return merged;
}

export default function MediaHubPage() {
  const [linkedinPosts, setLinkedinPosts] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/linkedin-sync')
      .then(res => res.json())
      .then(data => {
        const linkedData = Array.isArray(data.posts) ? data.posts.slice(0, 3) : [];
        setLinkedinPosts(linkedData);

        const merged = mergeFeeds(linkedData, networkPlaceholders);
        setSocialPosts(merged);

        setLoading(false);
      })
      .catch(() => {
        setSocialPosts(mergeFeeds([], networkPlaceholders));
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Media Center</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">News, insights, and announcements from Sans Mercantile</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Access our blog, press releases, social updates, and company media from one central hub.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            <motion.div variants={fadeInUp} className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10">
              <span className="text-sm uppercase text-nexus-gold tracking-[0.3em] mb-4 inline-block">Blog</span>
              <h2 className="text-3xl font-bold text-white mb-4">Insights for enterprises, operators, and investors</h2>
              <p className="text-nexus-gray-300 leading-relaxed mb-8">
                Explore commentary on autonomous systems, financial intelligence, governance, and the future of intelligent commerce.
              </p>
              <Link href="/media/blog" className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                Browse the Blog
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10">
              <span className="text-sm uppercase text-nexus-gold tracking-[0.3em] mb-4 inline-block">Press</span>
              <h2 className="text-3xl font-bold text-white mb-4">Official announcements and company milestones</h2>
              <p className="text-nexus-gray-300 leading-relaxed mb-8">
                Read the latest press releases and executive communications from Sans Mercantile leadership.
              </p>
              <Link href="/media/press" className="inline-flex items-center gap-3 px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors">
                View Press Releases
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-20 rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Media & Social Channel Access</h2>
            <p className="text-nexus-gray-300 leading-relaxed mb-6">
              The Media hub provides a central access point for our press announcements, editorial storytelling, and official social channels. Each channel is managed with a consistent editorial workflow and premium brand presentation.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {loading ? (
                <div className="text-center p-10 rounded-2xl border border-nexus-gold/20 bg-[#0b1125]">
                  <p className="text-nexus-gray-300">Loading latest social feed...</p>
                </div>
              ) : socialPosts.length > 0 ? (
                socialPosts.map((post, index) => {
                  const platformColors: Record<string, string> = {
                    LinkedIn: 'bg-[#0077b5]',
                    YouTube: 'bg-[#ff0000]',
                    Facebook: 'bg-[#1877f2]',
                    Twitter: 'bg-[#1da1f2]',
                    Instagram: 'bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4]',
                  };

                  const bColor = platformColors[post.platform] || 'bg-nexus-gold';

                  return (
                    <motion.div
                      key={`${post.id}-${index}`}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${bColor}`}>{post.platform}</span>
                        <span className="text-xs text-nexus-gray-500">{post.postedDate}</span>
                      </div>
                      <h3 className="text-lg text-white font-semibold mb-2 line-clamp-2">{post.title || 'Latest update'}</h3>
                      <p className="text-nexus-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">{post.content}</p>
                      {post.url && (
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-nexus-gold hover:text-white text-sm font-semibold">
                          Read more →
                        </a>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-8 text-center">
                  <p className="text-nexus-gray-300">No social posts found yet. Configure LinkedIn + other feeds to populate the stream.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'YouTube'].map((network) => (
                <div key={network} className="rounded-2xl border border-nexus-gold/10 p-6 bg-gradient-to-br from-[#0f1425] to-[#0a0f22]">
                  <h3 className="text-lg font-semibold text-white mb-2">{network}</h3>
                  <p className="text-nexus-gray-400 text-sm">
                    Official channel updates, executive announcements, and brand storytelling curated for {network}.
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
