import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { AnimatedIcon, type IconType } from '@/components/AnimatedIcons';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const iconMap: Record<string, IconType> = {
  '🚀': 'rocket',
  '🧩': 'globe',
  '⚙️': 'lock',
  '🔒': 'lock',
  '🔗': 'handshake',
  '📚': 'chart',
};

const KnowledgeCategory = ({ title, icon, articles }: any) => {
  const [expanded, setExpanded] = useState(false);
  const iconType = iconMap[icon] || 'globe';

  return (
    <motion.div
      variants={fadeInUp}
      className="border border-nexus-gold/20 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1f3a] to-nexus-dark hover:border-nexus-gold/40 transition-all duration-300"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-nexus-gold/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-nexus-gold">
            <AnimatedIcon type={iconType} size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ⋀
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-nexus-gold/20"
          >
            <div className="p-6 space-y-4">
              {articles.map((article: any, idx: number) => (
                <Link
                  key={idx}
                  href={article.href}
                  className="block p-4 rounded-lg bg-gradient-to-r from-nexus-dark to-[#0f1425] border border-nexus-gold/10 hover:border-nexus-gold/40 hover:bg-nexus-gold/5 transition-all group"
                >
                  <h4 className="font-semibold text-white group-hover:text-nexus-gold transition-colors mb-1">
                    {article.title}
                  </h4>
                  <p className="text-xs text-nexus-gray-400">{article.readTime}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      articles: [
        { title: 'Quick Start Guide', href: '/docs/getting-started/account-setup', readTime: '4 min read' },
        { title: 'Account Setup', href: '/docs/getting-started/account-setup', readTime: '3 min read' },
        { title: 'Dashboard Overview', href: '/docs/getting-started/dashboard', readTime: '4 min read' },
        { title: 'First Integration', href: '/docs/integration/database', readTime: '5 min read' },
      ],
    },
    {
      title: 'System Guides',
      icon: '🧩',
      articles: [
        { title: 'Priv Wealth Intelligence', href: '/docs/systems/analytics', readTime: '5 min read' },
        { title: 'KEL Agricultural Systems', href: '/docs/systems/analytics', readTime: '5 min read' },
        { title: 'Mezzo Governance Framework', href: '/docs/compliance', readTime: '5 min read' },
        { title: 'Brigit Legal Solutions', href: '/docs/compliance', readTime: '5 min read' },
        { title: 'Anubis Verification', href: '/docs/anubis', readTime: '5 min read' },
        { title: 'Omega Medical AI', href: '/docs/omega', readTime: '5 min read' },
      ],
    },
    {
      title: 'API Documentation',
      icon: '⚙️',
      articles: [
        { title: 'Authentication & Keys', href: '/docs/sdk', readTime: '4 min read' },
        { title: 'REST API Reference', href: '/docs/integration/database', readTime: '4 min read' },
        { title: 'WebSocket Connections', href: '/docs/integration/webhooks', readTime: '4 min read' },
        { title: 'Rate Limiting', href: '/docs/integration/webhooks', readTime: '4 min read' },
        { title: 'Error Handling', href: '/docs/integration/webhooks', readTime: '4 min read' },
      ],
    },
    {
      title: 'Security & Compliance',
      icon: '🔒',
      articles: [
        { title: 'Data Encryption', href: '/docs/security/encryption', readTime: '4 min read' },
        { title: 'HIPAA Compliance', href: '/docs/security/hipaa', readTime: '4 min read' },
        { title: 'SOC 2 Certification', href: '/docs/security/soc2', readTime: '4 min read' },
        { title: 'Privacy Policy', href: '/docs/security/privacy', readTime: '4 min read' },
        { title: 'Regulatory Updates', href: '/docs/security/regulatory', readTime: '4 min read' },
      ],
    },
    {
      title: 'Integration Guides',
      icon: '🔗',
      articles: [
        { title: 'Webhook Configuration', href: '/docs/integration/webhooks', readTime: '4 min read' },
        { title: 'Database Integration', href: '/docs/integration/database', readTime: '4 min read' },
        { title: 'Payment Processing', href: '/docs/integration/payments', readTime: '4 min read' },
        { title: 'Third-party Services', href: '/docs/integration/third-party', readTime: '4 min read' },
        { title: 'Custom Workflows', href: '/docs/integration/workflows', readTime: '4 min read' },
      ],
    },
    {
      title: 'Troubleshooting',
      icon: '🔧',
      articles: [
        { title: 'Common Issues', href: '/docs/troubleshooting', readTime: '3 min read' },
        { title: 'Performance Optimization', href: '/docs/troubleshooting', readTime: '4 min read' },
        { title: 'Debugging Guide', href: '/docs/troubleshooting', readTime: '4 min read' },
        { title: 'Support Resources', href: 'mailto:support@sansmercantile.com', readTime: '3 min read' },
        { title: 'FAQ', href: '/legal/faq', readTime: '3 min read' },
      ],
    },
  ];

  const filteredCategories = useMemo(
    () =>
      categories.map(category => ({
        ...category,
        articles: category.articles.filter((article: any) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter(category => category.articles.length > 0),
    [searchQuery]
  );

  return (
    <Layout>
      <div className=" pt-32 pb-20">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Knowledge Base
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-2xl mx-auto mb-12">
              Comprehensive guides, API documentation, and resources to help you get the most from Sans Mercantile.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-[#1a1f3a] border border-nexus-gold/30 text-white placeholder-nexus-gray-400 focus:outline-none focus:border-nexus-gold/60 transition-colors"
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-nexus-gold hover:opacity-70 transition-opacity">
                🔍
              </button>
            </div>
          </motion.div>
        </div>

        {/* Categories */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCategories.map((category, idx) => (
              <KnowledgeCategory key={idx} {...category} />
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mt-20"
        >
          <div className="border border-nexus-gold/20 rounded-2xl p-12 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h2 className="text-3xl font-bold text-white mb-8">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'API Status', description: 'Check system health and status', href: 'https://status.sansmercantile.com' },
                { title: 'Release Notes', description: 'Latest updates and features', href: '/media/blog' },
                { title: 'Changelog', description: 'Detailed change history', href: '/media/blog' },
                { title: 'Code Examples', description: 'Implementation samples', href: '/docs/sdk' },
                { title: 'Video Tutorials', description: 'Step-by-step walkthroughs', href: '/docs' },
                { title: 'Community Forum', description: 'Connect with other users', href: 'mailto:support@sansmercantile.com' },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="p-6 rounded-lg bg-gradient-to-r from-nexus-dark to-[#0f1425] border border-nexus-gold/10 hover:border-nexus-gold/40 hover:bg-nexus-gold/5 transition-all group"
                >
                  <h3 className="font-semibold text-white group-hover:text-nexus-gold transition-colors mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm text-nexus-gray-400">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 mt-20 text-center"
        >
          <div className="rounded-2xl p-12 border border-nexus-gold/30 bg-gradient-to-r from-nexus-gold/10 to-nexus-accent/10">
            <h2 className="text-3xl font-bold text-white mb-4">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="text-nexus-gray-300 mb-8">Contact our support team and we&apos;ll help you get answers fast.</p>
            <Link href="mailto:support@sansmercantile.com" className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
