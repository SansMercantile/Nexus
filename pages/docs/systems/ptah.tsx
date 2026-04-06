import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function PtahPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Ptah - Building & Infrastructure Management</h1>
            <p className="text-xl text-gray-300">AI-driven construction with project management, safety, and optimization.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Capabilities</h2>
            <ul className="text-gray-300 space-y-3 text-lg">
              <li>✓ Project management and scheduling</li>
              <li>✓ Safety systems</li>
              <li>✓ Budget optimization</li>
              <li>✓ Quality assurance</li>
              <li>✓ Equipment tracking and maintenance</li>
              <li>✓ Building information management</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision</h2>
            <p className="text-gray-300 text-lg">Ptah revolutionizes construction through AI-powered project management and safety systems, delivering projects on time and within budget.</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
