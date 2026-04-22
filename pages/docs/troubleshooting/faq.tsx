import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function FaqPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">FAQ</h1>
            <p className="text-xl text-gray-300">Frequently asked questions about Sans Mercantile Constellation</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>General Questions</h2>
            <h3>What is Sans Mercantile Constellation?</h3>
            <p>A comprehensive platform of AI systems for various industries.</p>

            <h3>How do I get started?</h3>
            <p>Follow our Quick Start Guide to set up your account and first integration.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}