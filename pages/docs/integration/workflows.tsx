import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function WorkflowsPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Custom Workflows</h1>
            <p className="text-xl text-gray-300">Build complex automation workflows with multiple AI systems and business triggers.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Workflow design</h2>
            <p>Compose multi-step processes that combine data ingestion, AI analysis, decision rules, and action triggers.</p>

            <h2>Trigger types</h2>
            <p>Use scheduled runs, event-driven hooks, or manual initiation to start your workflows depending on business needs.</p>

            <h2>Error handling</h2>
            <p>Define recovery paths for failed steps, such as retry policies, alert notifications, and fallback operations.</p>

            <h2>Scalable automation</h2>
            <p>Design workflows for reuse with parameterized inputs, shared templates, and clear handoff points between systems.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}