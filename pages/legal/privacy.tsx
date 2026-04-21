import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

export default function PrivacyPage() {
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
            <h1 className="text-5xl font-bold text-white mb-6">Privacy Policy</h1>
            <p className="text-xl text-nexus-gray-300">
              How we collect, use, and protect your data
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
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="text-nexus-gray-300 mb-6">
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="text-nexus-gray-300 mb-6">
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p className="text-nexus-gray-300 mb-6">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-nexus-gray-300">
                If you have questions about this Privacy Policy, please contact us at privacy@sansmercantile.com.
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