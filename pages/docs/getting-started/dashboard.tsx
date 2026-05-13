import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function DashboardOverviewPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Dashboard Overview</h1>
            <p className="text-xl text-gray-300">Navigate and utilize your Nexus dashboard effectively</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Key dashboard areas</h2>
            <ul>
              <li><strong>System status:</strong> Track operational health for each deployed AI system.</li>
              <li><strong>API usage:</strong> Review your current request volumes, quota usage, and billing estimates.</li>
              <li><strong>Activity logs:</strong> See recent requests, responses, and audit events in one place.</li>
              <li><strong>Access management:</strong> Manage API keys, team members, and permission scopes.</li>
            </ul>

            <h2>Getting started quickly</h2>
            <p>Start with the onboarding checklist, generate a test API key, and launch a first query from the sample integration panel.</p>

            <h2>Monitoring and alerts</h2>
            <p>Set up notifications for quota thresholds, error spikes, or compliance events to stay proactive.</p>

            <h2>Optimization insights</h2>
            <p>Use the dashboard intelligence tools to identify high-cost requests, unused keys, and systems that need tuning.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}