import { motion } from 'framer-motion';
import Layout from '../../components/Layout';

export default function SiaPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">SIA Archetypal Intelligence</h1>
            <p className="text-xl text-gray-300">Pattern recognition and archetypal analysis system</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Functions</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Archetypal pattern identification across multiple domains</li>
              <li>• Cross-cultural symbolic analysis</li>
              <li>• Predictive modeling based on historical patterns</li>
              <li>• Integration with cultural and historical databases</li>
              <li>• Real-time pattern recognition in complex systems</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Applications</h2>
            <p className="text-gray-300 mb-4">
              SIA is designed to identify and analyze archetypal patterns that transcend cultural and temporal boundaries,
              providing insights into human behavior, cultural evolution, and systemic patterns.
            </p>
            <p className="text-gray-300">
              <strong>Note:</strong> Proprietary analysis methodologies and pattern recognition algorithms have been redacted.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}