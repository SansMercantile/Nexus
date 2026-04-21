import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

export default function TermsPage() {
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
            <h1 className="text-5xl font-bold text-white mb-6">Terms of Service</h1>
            <p className="text-xl text-nexus-gray-300">
              Please read these terms carefully before using Sans Mercantile Nexus
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-nexus-gray-300 mb-6">
                By accessing and using Sans Mercantile Nexus, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
              <p className="text-nexus-gray-300 mb-6">
                Permission is granted to temporarily use Sans Mercantile Nexus for personal and business use, subject to restrictions set in these terms and conditions.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">3. Service Availability</h2>
              <p className="text-nexus-gray-300 mb-6">
                We strive to provide continuous service but do not guarantee uninterrupted access. Service maintenance and updates may cause temporary interruptions.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">4. Data Privacy</h2>
              <p className="text-nexus-gray-300 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of Sans Mercantile Nexus, to understand our practices.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
              <p className="text-nexus-gray-300">
                If you have any questions about these Terms of Service, please contact us at legal@sansmercantile.com.
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