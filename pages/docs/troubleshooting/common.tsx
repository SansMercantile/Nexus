import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function CommonPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Common Issues</h1>
            <p className="text-xl text-gray-300">Solutions to frequently encountered problems</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>API Connection Issues</h2>
            <p>Check your API key and network connectivity.</p>

            <h2>Rate Limiting</h2>
            <p>Monitor your request frequency and implement backoff strategies.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}