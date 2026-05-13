import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function PaymentsPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Payment Processing</h1>
            <p className="text-xl text-gray-300">Connect payment workflows to AI-driven insights for fraud detection, reconciliation, and automation.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Payment orchestration</h2>
            <p>Connect payment gateways and transaction services to bring AI-powered risk signals, fraud scoring, and reconciliation insights into your payment workflows.</p>

            <h2>PCI and security</h2>
            <p>We recommend tokenizing payment data and keeping cardholder information outside of our platform whenever possible. Use PCI-compliant payment processors and secure webhook callbacks.</p>

            <h2>Integration patterns</h2>
            <p>Use payment events to trigger system analysis or workflow automation, such as fraud review, approval checks, and customer outreach.</p>

            <h2>Operational best practices</h2>
            <ul>
              <li>Keep transaction IDs and metadata in sync across systems.</li>
              <li>Use idempotency keys for retry-safe payment requests.</li>
              <li>Maintain clear audit logs for every payment-related event.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}