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
            <h2>Webhook setup</h2>
            <p>Configure webhooks to receive real-time notifications from our AI systems whenever a task completes, an event triggers, or data changes.</p>

            <h2>Event model</h2>
            <p>Webhooks deliver structured JSON payloads for events such as query completion, workflow status changes, and compliance alerts.</p>

            <h2>Delivery reliability</h2>
            <p>Our webhook service retries failed deliveries automatically and provides delivery status so you can monitor endpoint health.</p>

            <h2>Security</h2>
            <p>Validate signatures using the shared secret provided when you register the webhook endpoint, and use HTTPS to protect web traffic.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}