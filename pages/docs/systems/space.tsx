import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function SpacePage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Space Resource Management</h1>
            <p className="text-xl text-gray-300">Interplanetary resource allocation and space colonization planning</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Space Operations</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Planetary resource assessment</li>
              <li>• Space mission optimization</li>
              <li>• Interplanetary logistics</li>
              <li>• Habitat design and planning</li>
              <li>• Space colonization strategies</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}