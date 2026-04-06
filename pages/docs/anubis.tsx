import { motion } from 'framer-motion';
import Layout from '../../components/Layout';

export default function AnubisPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">Anubis Space Colonization</h1>
            <p className="text-xl text-gray-300">Interplanetary resource management and colonization planning system</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Space Operations</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Planetary resource assessment and utilization</li>
              <li>• Habitat design and life support optimization</li>
              <li>• Mission planning and risk assessment</li>
              <li>• Interplanetary logistics and supply chain management</li>
              <li>• Environmental adaptation strategies</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Colonization Framework</h2>
            <p className="text-gray-300 mb-4">
              Anubis provides comprehensive planning and execution capabilities for sustainable space colonization,
              integrating multiple scientific disciplines and engineering considerations.
            </p>
            <p className="text-gray-300">
              <strong>Note:</strong> Advanced colonization algorithms and resource optimization methods have been redacted.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}