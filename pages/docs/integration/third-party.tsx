import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function ThirdPartyPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Third-party Services</h1>
            <p className="text-xl text-gray-300">Connect the Nexus platform with your existing third-party tools and external data sources.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Connector strategy</h2>
            <p>Use third-party integrations to bridge the AI platform with CRM, ERP, analytics, and workflow tools.</p>

            <h2>Authentication patterns</h2>
            <p>Support OAuth, API keys, and service accounts for secure connections. Refresh tokens automatically and store credentials in a secure vault.</p>

            <h2>Reliability</h2>
            <p>Monitor each external connector for rate limits and service interruptions. Implement fallback logic when downstream services are unavailable.</p>

            <h2>Vendor governance</h2>
            <p>Choose trusted vendors, document data flows, and audit third-party permissions regularly to reduce your compliance risk.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}