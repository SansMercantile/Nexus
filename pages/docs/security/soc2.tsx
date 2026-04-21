import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function Soc2Page() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">SOC 2 Certification</h1>
            <p className="text-xl text-gray-300">Security, availability, and confidentiality controls</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>SOC 2 Type II Certified</h2>
            <p>Regular third-party audits ensure compliance with SOC 2 standards.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}