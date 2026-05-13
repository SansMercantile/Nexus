import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function PerformancePage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Performance Optimization</h1>
            <p className="text-xl text-gray-300">Tips for maximizing API performance and efficiency.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Payload efficiency</h2>
            <p>Keep request payloads concise and include only required context. Avoid sending large datasets unnecessarily.</p>

            <h2>Batch and cache</h2>
            <p>Batch related requests and cache stable responses to reduce repeated API calls and improve throughput.</p>

            <h2>Concurrency control</h2>
            <p>Limit simultaneous requests based on your plan and target endpoint latency. Use request queues for large workloads.</p>

            <h2>Monitoring</h2>
            <p>Track response times, error rates, and quota usage in the dashboard to identify bottlenecks and optimize across systems.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}