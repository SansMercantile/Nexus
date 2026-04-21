import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-300">How we collect, use, and protect your data</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Data Collection</h2>
            <p>We collect only the data necessary to provide our AI services.</p>

            <h2>Data Usage</h2>
            <p>Data is used solely for processing AI requests and improving our systems.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}