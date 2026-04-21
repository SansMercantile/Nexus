import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function QuantumPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Quantum Financial Modeling</h1>
            <p className="text-xl text-gray-300">Advanced quantum computing for financial analysis and modeling</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Quantum Finance</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Quantum algorithm-based portfolio optimization</li>
              <li>• High-frequency trading analysis</li>
              <li>• Risk modeling with quantum precision</li>
              <li>• Market prediction using quantum computing</li>
              <li>• Cryptocurrency analysis and modeling</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}