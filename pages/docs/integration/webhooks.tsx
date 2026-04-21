import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function WebhooksPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Webhook Configuration</h1>
            <p className="text-xl text-gray-300">Set up real-time notifications for system events</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Webhook Setup</h2>
            <p>Configure webhooks to receive real-time notifications from our AI systems.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}