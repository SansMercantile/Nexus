import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { getAllBlogPosts } from '@/lib/blog-data';

const BlogCard = ({ post }: any) => {
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'technology':
        return 'border-nexus-gold/20 hover:border-nexus-gold/40 bg-[#0b1125]';
      case 'governance':
        return 'border-nexus-accent/20 hover:border-nexus-accent/40 bg-[#0b1125]';
      case 'markets':
        return 'border-nexus-gold/20 hover:border-nexus-gold/40 bg-[#0b1125]';
      case 'insights':
        return 'border-nexus-accent/20 hover:border-nexus-accent/40 bg-[#0b1125]';
      default:
        return 'border-nexus-gold/20 hover:border-nexus-gold/40 bg-[#0b1125]';
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      className={`group rounded-3xl overflow-hidden border ${getCategoryStyles(post.category)} transition-all duration-300`}
    >
    <Link href={`/media/blog/${post.slug}`}>
      <div className="relative h-56 overflow-hidden bg-nexus-dark">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark/90 via-transparent to-transparent" />
      </div>
    </Link>

    <div className="p-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs px-3 py-1 rounded-full bg-nexus-gold/10 text-nexus-gold font-semibold">{post.category}</span>
        <span className="text-xs text-nexus-gray-500">{post.postedDate}</span>
      </div>

      <Link href={`/media/blog/${post.slug}`}>
        <h3 className="text-2xl font-semibold text-white mb-3 hover:text-nexus-gold transition-colors cursor-pointer">
          {post.title}
        </h3>
      </Link>

      <p className="text-nexus-gray-300 mb-6 line-clamp-5">{post.excerpt}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-nexus-gray-500">By {post.author}</span>
        <Link href={`/media/blog/${post.slug}`}>
          <span className="text-nexus-gold text-sm font-semibold hover:underline cursor-pointer">Read More →</span>
        </Link>
      </div>
    </div>
  </motion.div>
  );
};

export default function MediaBlogPage() {
  const posts = getAllBlogPosts('published');
  const [filteredPosts, setFilteredPosts] = React.useState(posts);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const featuredPost = filteredPosts[0];

  const categories = [
    { id: 'all', label: 'All Posts', color: 'text-nexus-gray-300' },
    { id: 'technology', label: 'Technology', color: 'text-nexus-gold' },
    { id: 'governance', label: 'Governance', color: 'text-nexus-accent' },
    { id: 'markets', label: 'Markets', color: 'text-nexus-gold' },
    { id: 'insights', label: 'Insights', color: 'text-nexus-accent' },
  ];

  React.useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Media</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Sans Mercantile Blog</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Insights on autonomous commerce, governance, global markets, and the future of intelligent systems.
            </p>
          </motion.div>

          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-20 rounded-3xl overflow-hidden border border-nexus-gold/20 bg-[#0b1125]"
            >
              <Link href={`/media/blog/${featuredPost.slug}`}>
                <div className="relative h-96 overflow-hidden bg-nexus-dark">
                  <img src={featuredPost.featuredImage} alt={featuredPost.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark/90 via-transparent to-transparent" />
                </div>
              </Link>
              <div className="p-12">
                <span className="inline-block text-xs uppercase tracking-[0.3em] text-nexus-gold mb-4">Featured</span>
                <Link href={`/media/blog/${featuredPost.slug}`}>
                  <h2 className="text-4xl font-bold text-white mb-6 hover:text-nexus-gold transition-colors cursor-pointer">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="text-lg text-nexus-gray-300 mb-8">{featuredPost.excerpt}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-sm text-nexus-gray-500">By {featuredPost.author} • {featuredPost.readTime} min read</p>
                  <div className="flex flex-wrap gap-4 items-center justify-center">
                    <a href="mailto:hello@sansmercantile.com" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                      Contact Editorial
                    </a>
                    <Link href={`/media/blog/${featuredPost.slug}`} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors">
                      Read Featured Post
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 flex flex-wrap gap-3 justify-center"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-nexus-gold text-black'
                    : `border border-nexus-gold/20 ${cat.color} hover:border-nexus-gold/40 hover:bg-nexus-gold/5`
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Want to work with our team?</h2>
            <p className="text-nexus-gray-300 mb-6">
              Learn how Sans Mercantile is bringing together systems architecture, cloud engineering, and market intelligence to build the next generation of sovereign digital infrastructure.
            </p>
            <a href="mailto:hello@sansmercantile.com" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
              Contact Media Team
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
