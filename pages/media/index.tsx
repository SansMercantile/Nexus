import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { useState, useEffect } from 'react';

// Social media posts data - can be updated manually or via CMS
const socialPosts = [
  {
    id: 'linkedin-1',
    platform: 'LinkedIn',
    title: 'Mpeti Offline Mode Active',
    content: 'Constellation is running in complete offline mode. All Mpeti operations rely on local Ollama (gemma:2b) model.',
    postedDate: '4/23/2026',
    url: 'https://www.linkedin.com/company/sans-mercantile',
    embedType: 'link',
  },
  {
    id: 'youtube-1',
    platform: 'YouTube',
    title: 'Constellation Launch Webinar: AI in Infrastructure',
    content: 'Watch our newest product launch webinar where we unveil the next-gen, regulated autonomous market infrastructure.',
    postedDate: '2026/04/23',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with actual video URL
    embedType: 'youtube',
    videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
  },
  {
    id: 'facebook-1',
    platform: 'Facebook',
    title: 'Sant Mercantile wins Best AI Trust Award',
    content: 'We are excited to share our latest recognition in autonomous systems governance and transparency.',
    postedDate: '2026/04/23',
    url: 'https://www.facebook.com/sansmercantile/posts/placeholder',
    embedType: 'link',
  },
  {
    id: 'twitter-1',
    platform: 'Twitter',
    title: 'New integration: Constellation SDK now supports event streaming',
    content: 'Check out how to connect to real-time telemetry with 5 lines of code.',
    postedDate: '2026/04/23',
    url: 'https://twitter.com/sansmercantile/status/1234567890', // Replace with actual tweet URL
    embedType: 'twitter',
    tweetId: '1234567890', // Replace with actual tweet ID
  },
  {
    id: 'instagram-1',
    platform: 'Instagram',
    title: 'Behind the scenes of the media hub redesign',
    content: 'Visual story from the design team on the new platform aesthetics.',
    postedDate: '2026/04/23',
    url: 'https://www.instagram.com/p/ABC123/', // Replace with actual Instagram post URL
    embedType: 'instagram',
    postId: 'ABC123', // Replace with actual Instagram post ID
  },
];

const platformColors = {
  LinkedIn: '#0077b5',
  YouTube: '#ff0000',
  Facebook: '#1877f2',
  Twitter: '#1da1f2',
  Instagram: '#e4405f',
};

function SocialPostCard({ post }: { post: typeof socialPosts[0] }) {
  const [embedLoaded, setEmbedLoaded] = useState(false);

  useEffect(() => {
    // Load embed scripts when component mounts
    if (post.embedType === 'twitter' && !document.querySelector('script[src*="platform.twitter.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.head.appendChild(script);
    }

    if (post.embedType === 'instagram' && !document.querySelector('script[src*="instagram.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [post.embedType]);

  const renderEmbed = () => {
    switch (post.embedType) {
      case 'youtube':
        return (
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${post.videoId}`}
              title={post.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setEmbedLoaded(true)}
            />
          </div>
        );
      case 'twitter':
        return (
          <div className="mb-4">
            <blockquote className="twitter-tweet" data-theme="dark">
              <a href={post.url}></a>
            </blockquote>
          </div>
        );
      case 'instagram':
        return (
          <div className="mb-4">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={post.url}
              data-instgrm-version="14"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-6 hover:border-nexus-gold/40 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: platformColors[post.platform as keyof typeof platformColors] }}
        />
        <span className="text-sm font-semibold text-nexus-gold">{post.platform}</span>
        <span className="text-xs text-nexus-gray-400 ml-auto">{post.postedDate}</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-3">{post.title}</h3>
      <p className="text-nexus-gray-300 mb-4 leading-relaxed">{post.content}</p>

      {renderEmbed()}

      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-nexus-gold hover:text-white transition-colors font-semibold"
      >
        Read more →
      </a>
    </motion.div>
  );
}

export default function MediaHubPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for embeds
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = selectedPlatform === 'all'
    ? socialPosts
    : socialPosts.filter(post => post.platform.toLowerCase() === selectedPlatform.toLowerCase());

  const platforms = ['all', ...Array.from(new Set(socialPosts.map(post => post.platform)))];

  return (
    <Layout>
      <div className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Media Center</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              News, insights, and announcements from Sans Mercantile
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Access our blog, press releases, social updates, and company media from one central hub.
            </p>
          </motion.div>

          {/* Platform Filter */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedPlatform === platform
                    ? 'bg-nexus-gold text-black'
                    : 'bg-nexus-gold/10 text-nexus-gold hover:bg-nexus-gold/20'
                }`}
              >
                {platform === 'all' ? 'All Platforms' : platform}
              </button>
            ))}
          </motion.div>

          {/* Social Posts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-nexus-gold">Loading social content...</div>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post) => (
                <SocialPostCard key={post.id} post={post} />
              ))}
            </motion.div>
          )}

          {/* Platform Channels Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mt-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Follow Our Channels</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Stay connected with our latest updates, insights, and announcements across all platforms.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  platform: 'LinkedIn',
                  description: 'Official channel updates, executive announcements, and brand storytelling curated for LinkedIn.',
                  url: 'https://www.linkedin.com/company/sans-mercantile',
                  color: '#0077b5',
                },
                {
                  platform: 'YouTube',
                  description: 'Official channel updates, executive announcements, and brand storytelling curated for YouTube.',
                  url: 'https://www.youtube.com/@sansmercantile',
                  color: '#ff0000',
                },
                {
                  platform: 'Facebook',
                  description: 'Official channel updates, executive announcements, and brand storytelling curated for Facebook.',
                  url: 'https://www.facebook.com/sansmercantile',
                  color: '#1877f2',
                },
                {
                  platform: 'Twitter',
                  description: 'Official channel updates, executive announcements, and brand storytelling curated for Twitter.',
                  url: 'https://twitter.com/sansmercantile',
                  color: '#1da1f2',
                },
                {
                  platform: 'Instagram',
                  description: 'Official channel updates, executive announcements, and brand storytelling curated for Instagram.',
                  url: 'https://www.instagram.com/sansmercantile',
                  color: '#e4405f',
                },
              ].map((channel, index) => (
                <motion.div
                  key={channel.platform}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-6 hover:border-nexus-gold/40 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: channel.color }}
                    />
                    <h3 className="text-xl font-bold text-white group-hover:text-nexus-gold transition-colors">
                      {channel.platform}
                    </h3>
                  </div>
                  <p className="text-nexus-gray-300 mb-4 leading-relaxed">{channel.description}</p>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-nexus-gold hover:text-white transition-colors font-semibold"
                  >
                    Follow us →
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
