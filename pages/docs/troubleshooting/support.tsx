import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function SupportPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Support Resources</h1>
            <p className="text-xl text-gray-300">Get help from our support team and community.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Self-service resources</h2>
            <p>Use the documentation site to troubleshoot common scenarios, learn integration patterns, and verify platform behavior.</p>

            <h2>Support channels</h2>
            <p>Contact our team through the dashboard support link, email, or your assigned customer success representative.</p>

            <h2>Incident reporting</h2>
            <p>Report production issues with request details, system names, and timestamps to accelerate resolution.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}