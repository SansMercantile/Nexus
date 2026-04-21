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
            <h2>Main Dashboard Features</h2>
            <ul>
              <li><strong>System Status:</strong> Real-time status of all AI systems</li>
              <li><strong>API Usage:</strong> Monitor your API consumption and limits</li>
              <li><strong>Recent Activity:</strong> View recent API calls and results</li>
              <li><strong>System Access:</strong> Quick links to individual AI systems</li>
            </ul>

            <h2>Navigation</h2>
            <p>Use the sidebar to access different sections of the platform.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}