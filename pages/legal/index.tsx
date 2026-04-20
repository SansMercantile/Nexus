import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

const legalPages = [
  {
    title: 'Terms of Service',
    description: 'The terms and conditions for using Sans Mercantile Nexus',
    href: '/legal/terms',
    icon: '📋'
  },
  {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information',
    href: '/legal/privacy',
    icon: '🔒'
  },
  {
    title: 'Cookie Policy',
    description: 'Information about how we use cookies and similar technologies',
    href: '/legal/cookie',
    icon: '🍪'
  },
  {
    title: 'End User License Agreement',
    description: 'License terms for using our software and services',
    href: '/legal/eula',
    icon: '📄'
  },
  {
    title: 'Compliance',
    description: 'Our commitment to regulatory compliance and security standards',
    href: '/legal/compliance',
    icon: '⚖️'
  },
  {
    title: 'Frequently Asked Questions',
    description: 'Answers to common questions about our services',
    href: '/legal/faq',
    icon: '❓'
  }
];

export default function LegalIndexPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-6">Legal Information</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Important legal documents and policies that govern the use of Sans Mercantile Nexus.
              Please review these documents carefully.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {legalPages.map((page, index) => (
              <motion.div
                key={page.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group"
              >
                <Link href={page.href}>
                  <div className="bg-gradient-to-r from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-6 h-full hover:border-nexus-gold/40 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="text-4xl mb-4">{page.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nexus-gold transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-nexus-gray-300 text-sm leading-relaxed">
                      {page.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-nexus-gray-400 mb-6">
              Have questions about our legal policies?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-nexus-gold text-nexus-dark font-semibold hover:bg-nexus-gold/90 transition-colors"
            >
              Contact Legal Team
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}