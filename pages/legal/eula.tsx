import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

export default function EULAPage() {
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
            <h1 className="text-5xl font-bold text-white mb-6">End User License Agreement</h1>
            <p className="text-xl text-nexus-gray-300">
              Terms and conditions for using Sans Mercantile Nexus
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
              <h2 className="text-2xl font-bold text-white mb-4">License Grant</h2>
              <p className="text-nexus-gray-300 mb-6">
                Sans Mercantile grants you a limited, non-exclusive, non-transferable license to use Sans Mercantile Nexus in accordance with this EULA.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Restrictions</h2>
              <p className="text-nexus-gray-300 mb-6">
                You may not reverse engineer, decompile, or disassemble the software, or attempt to derive the source code.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <p className="text-nexus-gray-300 mb-6">
                All intellectual property rights in Sans Mercantile Nexus remain with Sans Mercantile and its licensors.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <p className="text-nexus-gray-300">
                This license is effective until terminated. Your rights under this license will terminate automatically without notice if you fail to comply with any term(s) of this EULA.
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