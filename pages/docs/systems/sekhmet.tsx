import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function SekhmetPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Sekhmet - Defense & Strategic Intelligence</h1>
            <p className="text-xl text-gray-300">Strategic defense operations with AI-powered military intelligence and coordination.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Capabilities</h2>
            <ul className="text-gray-300 space-y-3 text-lg">
              <li>✓ Threat intelligence monitoring</li>
              <li>✓ Strategic planning optimization</li>
              <li>✓ Logistics coordination</li>
              <li>✓ Advanced surveillance systems</li>
              <li>✓ Decision support systems</li>
              <li>✓ Network defense (Sobek)</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision</h2>
            <p className="text-gray-300 text-lg">Sekhmet enables advanced defense capabilities through strategic military intelligence and autonomous coordination systems.</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
