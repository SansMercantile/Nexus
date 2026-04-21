import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function ManufacturingPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Autonomous Manufacturing</h1>
            <p className="text-xl text-gray-300">AI-driven manufacturing optimization and automation systems</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Manufacturing AI</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Production line optimization</li>
              <li>• Quality control automation</li>
              <li>• Supply chain management</li>
              <li>• Predictive maintenance</li>
              <li>• Resource allocation optimization</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}