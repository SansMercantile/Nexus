import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

export default function CompliancePage() {
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
            <h1 className="text-5xl font-bold text-white mb-6">Compliance</h1>
            <p className="text-xl text-nexus-gray-300">
              Our commitment to regulatory compliance and security standards
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
              <h2 className="text-2xl font-bold text-white mb-4">Regulatory Compliance</h2>
              <p className="text-nexus-gray-300 mb-6">
                Sans Mercantile Nexus is designed to comply with applicable laws and regulations, including data protection and privacy requirements.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Security Standards</h2>
              <p className="text-nexus-gray-300 mb-6">
                We implement industry-standard security measures to protect your data and ensure the integrity of our services.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Audit and Reporting</h2>
              <p className="text-nexus-gray-300 mb-6">
                We maintain comprehensive audit logs and provide reporting capabilities to support compliance requirements.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Contact Our Compliance Team</h2>
              <p className="text-nexus-gray-300">
                For compliance-related inquiries, please contact our compliance team at compliance@sansmercantile.com.
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