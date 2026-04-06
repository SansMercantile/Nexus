import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function MontuPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Montu - Nuclear Energy & Power Generation</h1>
            <p className="text-xl text-gray-300">Advanced nuclear energy system with reactor optimization, safety, and autonomous power generation.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Capabilities</h2>
            <ul className="text-gray-300 space-y-3 text-lg">
              <li>✓ Reactor optimization</li>
              <li>✓ Safety monitoring</li>
              <li>✓ Power generation</li>
              <li>✓ Fuel management</li>
              <li>✓ Waste processing</li>
              <li>✓ Autonomous operations</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision</h2>
            <p className="text-gray-300 text-lg">Montu maximizes clean nuclear energy and establishes safe, efficient atomic power systems for the future.</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
