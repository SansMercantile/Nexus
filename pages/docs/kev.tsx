import { motion } from 'framer-motion';
import Layout from '../../components/Layout';

export default function KevPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">KEV Educational Vectors</h1>
            <p className="text-xl text-gray-300">Adaptive learning and educational optimization system</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Educational Features</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Personalized learning path optimization</li>
              <li>• Adaptive content delivery based on learning patterns</li>
              <li>• Multi-modal educational content generation</li>
              <li>• Progress tracking and predictive assessment</li>
              <li>• Integration with existing educational platforms</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Learning Optimization</h2>
            <p className="text-gray-300 mb-4">
              KEV employs advanced algorithms to analyze individual learning styles and optimize educational content delivery
              for maximum comprehension and retention.
            </p>
            <p className="text-gray-300">
              <strong>Note:</strong> Educational optimization algorithms and learning pattern analysis methods have been redacted.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}