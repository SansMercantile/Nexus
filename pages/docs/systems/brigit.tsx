import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function BrigitPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Brigit Legal Solutions</h1>
            <p className="text-xl text-gray-300">AI-powered legal analysis and compliance</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Legal Intelligence</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Contract analysis and review</li>
              <li>• Legal research automation</li>
              <li>• Compliance monitoring</li>
              <li>• Risk assessment</li>
              <li>• Regulatory updates tracking</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}