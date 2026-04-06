import { motion } from 'framer-motion';
import Layout from '../../components/Layout';

export default function OmegaPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">Omega Medical AI</h1>
            <p className="text-xl text-gray-300">Advanced medical diagnostics and treatment optimization system</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">System Capabilities</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Advanced diagnostic analysis and pattern recognition</li>
              <li>• Treatment optimization and personalized medicine</li>
              <li>• Real-time health monitoring and predictive analytics</li>
              <li>• Integration with medical imaging systems</li>
              <li>• Compliance with HIPAA and international medical standards</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Technical Overview</h2>
            <p className="text-gray-300 mb-4">
              Omega represents a breakthrough in medical AI, combining multiple specialized neural networks trained on extensive medical datasets.
            </p>
            <p className="text-gray-300">
              <strong>Note:</strong> Specific algorithms, training methodologies, and implementation details have been redacted to protect intellectual property.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}