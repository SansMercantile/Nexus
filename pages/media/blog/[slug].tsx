import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';
import { getBlogPost } from '@/lib/blog-data';

export default function MediaBlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug || typeof slug !== 'string') {
    return <Layout><div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div></Layout>;
  }

  const post = getBlogPost(slug);

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-nexus-gray-300 mb-8">The blog post you are looking for could not be found.</p>
            <Link href="/media/blog">
              <button className="px-8 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                Back to Blog
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'technology':
        return 'bg-gradient-to-br from-[#1a2140]/30 to-nexus-dark/30 border-nexus-gold/20';
      case 'governance':
        return 'bg-gradient-to-br from-[#1f1a2e]/30 to-nexus-dark/30 border-nexus-accent/20';
      case 'markets':
        return 'bg-gradient-to-br from-[#1a2140]/30 to-nexus-dark/30 border-nexus-gold/20';
      case 'insights':
        return 'bg-gradient-to-br from-[#1f1a2e]/30 to-nexus-dark/30 border-nexus-accent/20';
      default:
        return 'bg-gradient-to-br from-[#1a2140]/30 to-nexus-dark/30 border-nexus-gold/20';
    }
  };

  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link href="/media/blog">
              <span className="text-nexus-gold hover:text-white transition-colors cursor-pointer mb-6 inline-block">← Back to Blog</span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <span className="px-3 py-1 rounded-full bg-nexus-gold/10 text-nexus-gold text-xs uppercase tracking-[0.3em]">{post.category}</span>
              <span className="text-xs text-nexus-gray-500">{post.postedDate}</span>
              <span className="text-xs text-nexus-gray-500">• {post.readTime} min read</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{post.title}</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">{post.subtitle}</p>
          </motion.div>

          {post.featuredImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative mb-12 overflow-hidden rounded-3xl border border-nexus-gold/20 h-96"
            >
              <img src={post.featuredImage} alt={post.featuredImageAlt ?? post.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark/80 via-transparent to-transparent" />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className={`prose prose-invert max-w-none text-nexus-gray-200 rounded-2xl p-8 ${getCategoryStyles(post.category)} border`}>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Follow our editorial team</h2>
                <p className="text-nexus-gray-300">Stay updated with the latest strategy announcements, leadership news, and product insights.</p>
              </div>
              <a href="https://linkedin.com/company/sans-mercantile" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                Follow on LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
