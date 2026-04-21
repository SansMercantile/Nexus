import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function EthicalPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Ethical AI Governance</h1>
            <p className="text-xl text-gray-300">AI ethics, governance, and responsible AI development framework</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Ethical Governance</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• AI ethics and bias assessment</li>
              <li>• Responsible AI development guidelines</li>
              <li>• Transparency and accountability frameworks</li>
              <li>• Human-AI interaction standards</li>
              <li>• Societal impact evaluation</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}