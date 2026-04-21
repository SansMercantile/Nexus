import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function HapiPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Hapi - Supply Chain & Logistics Intelligence</h1>
            <p className="text-xl text-gray-300">Global logistics optimization with 500+ supply chain agents and real-time tracking.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Capabilities</h2>
            <ul className="text-gray-300 space-y-3 text-lg">
              <li>✓ Route optimization</li>
              <li>✓ Real-time tracking</li>
              <li>✓ Demand forecasting</li>
              <li>✓ Driver optimization</li>
              <li>✓ Cost reduction</li>
              <li>✓ Sustainability tracking</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision</h2>
            <p className="text-gray-300 text-lg">Hapi optimizes global logistics and enables frictionless supply chains through intelligent routing and real-time coordination.</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
