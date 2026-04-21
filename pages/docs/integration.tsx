import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';

export default function IntegrationDocsPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Integration Guide</p>
            <h1 className="text-5xl font-bold text-white mb-6">Platform Integration</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Learn how to connect your systems to the Sans Mercantile platform, configure API credentials, and handle secure data flows.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-3xl border border-nexus-gold/20 bg-[#0c132b] p-12 prose prose-invert">
            <h2>Integration fundamentals</h2>
            <p>Our platform supports both direct API integration and SDK-enabled connectivity. Choose the approach that best fits your architecture.</p>
            <h3>API connection</h3>
            <p>Authenticate with your API key and use the endpoint for the system you want to integrate.</p>
            <pre className="bg-[#0a101f] rounded-xl p-6 text-sm overflow-x-auto">POST https://api.sansmercantile.com/v1/market/insight
Authorization: Bearer YOUR_API_KEY</pre>
            <h3>System orchestration</h3>
            <p>Link your internal business logic to our orchestration layer for monitoring, alerts, and workflow automation.</p>
            <h3>Security and data handling</h3>
            <p>Keep credentials secret, use TLS for all traffic, and log activity for audit readiness.</p>
            <h3>Developer experience</h3>
            <ul>
              <li>Start with the SDK for quick proof-of-concept work.</li>
              <li>Move to direct API calls for production workflows.</li>
              <li>Use webhooks for event-driven updates and realtime alerts.</li>
            </ul>
          </motion.div>
          <div className="mt-10 text-center">
            <Link href="/docs" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold hover:bg-nexus-gold/10 transition-colors">
              Back to Docs Overview
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
