import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function RaPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Ra - Solar Energy & Power Optimization</h1>
            <p className="text-xl text-gray-300">AI-optimized solar energy systems with grid integration and perfect power forecasting.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Capabilities</h2>
            <ul className="text-gray-300 space-y-3 text-lg">
              <li>✓ Solar panel angle optimization</li>
              <li>✓ Power forecasting (99% accuracy)</li>
              <li>✓ Grid integration</li>
              <li>✓ Energy storage optimization</li>
              <li>✓ Maintenance scheduling</li>
              <li>✓ Sustainability tracking</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision</h2>
            <p className="text-gray-300 text-lg">Ra maximizes clean energy adoption through intelligent solar optimization, enabling sustainable power generation at global scale.</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
