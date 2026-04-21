import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

export default function CookiesPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-6">Cookie Policy</h1>
            <p className="text-xl text-nexus-gray-300">
              How we use cookies and similar technologies
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8"
          >
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies</h2>
              <p className="text-nexus-gray-300 mb-6">
                Cookies are small text files that are stored on your computer or mobile device when you visit our website.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">How We Use Cookies</h2>
              <p className="text-nexus-gray-300 mb-6">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Managing Cookies</h2>
              <p className="text-nexus-gray-300 mb-6">
                You can control and manage cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-nexus-gray-300">
                For questions about our cookie policy, please contact us at privacy@sansmercantile.com.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold hover:bg-nexus-gold/10 transition-colors"
            >
              Back to Legal
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}