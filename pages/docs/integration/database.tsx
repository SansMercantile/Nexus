import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function DatabasePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Database Integration</h1>
            <p className="text-xl text-gray-300">Connect your databases to Nexus AI systems</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}