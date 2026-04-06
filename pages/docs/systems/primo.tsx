import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function PrimoPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Primo Temporal Manipulation</h1>
            <p className="text-xl text-gray-300">Time-series analysis and temporal prediction system</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Temporal Analysis</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Advanced time-series forecasting and prediction</li>
              <li>• Temporal pattern recognition across multiple scales</li>
              <li>• Historical data reconstruction and analysis</li>
              <li>• Real-time temporal event processing</li>
              <li>• Multi-dimensional temporal modeling</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}