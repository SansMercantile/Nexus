import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function AnubisPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Anubis Verification</h1>
            <p className="text-xl text-gray-300">Advanced identity verification and security</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Verification Systems</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Biometric authentication</li>
              <li>• Document verification</li>
              <li>• Fraud detection</li>
              <li>• Identity validation</li>
              <li>• Security threat analysis</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}