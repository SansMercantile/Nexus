import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function ApiRateLimitingPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Rate Limiting</h1>
            <p className="text-xl text-gray-300">Understand usage limits, headers, and retry strategies for API rate limiting.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>How limits work</h2>
            <p>Requests are subject to rate limits based on your plan and the system being called. Each response may include headers that indicate remaining quota.</p>

            <h2>Retry guidance</h2>
            <p>If you receive a rate limit response, back off and retry after the specified interval. Avoid retry storms by using exponential backoff.</p>

            <h2>Important headers</h2>
            <pre><code>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 62
X-RateLimit-Reset: 1670000000`}</code></pre>

            <h2>Best practices</h2>
            <ul>
              <li>Batch related requests when possible.</li>
              <li>Cache responses for repeated queries.</li>
              <li>Monitor consumption and scale up if needed.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
