import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function NeuralPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Neural Interface Technology</h1>
            <p className="text-xl text-gray-300">Brain-computer interface and neural enhancement systems</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Neural Technology</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Brain-computer interface design</li>
              <li>• Neural signal processing</li>
              <li>• Cognitive enhancement algorithms</li>
              <li>• Neural data analysis</li>
              <li>• Human-AI integration protocols</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}