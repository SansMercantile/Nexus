import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function ApiErrorsPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Error Handling</h1>
            <p className="text-xl text-gray-300">Learn how to interpret API errors and build robust handling logic.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Error response structure</h2>
            <pre><code>{`{
  "status": "error",
  "code": "invalid_request",
  "message": "Missing required field: prompt",
  "details": {
    "field": "prompt"
  }
}`}</code></pre>

            <h2>Common error codes</h2>
            <ul>
              <li><strong>400</strong> — <code>invalid_request</code>: invalid payload or missing fields</li>
              <li><strong>401</strong> — <code>unauthorized</code>: invalid or missing API key</li>
              <li><strong>403</strong> — <code>forbidden</code>: insufficient permissions or blocked access</li>
              <li><strong>429</strong> — <code>rate_limit_exceeded</code>: request volume exceeded</li>
              <li><strong>500</strong> — <code>server_error</code>: unexpected system failure</li>
            </ul>

            <h2>Handling retries</h2>
            <p>Retry only idempotent requests and use a delay that increases with each attempt. Do not retry on client-side validation errors.</p>

            <h2>Logging and troubleshooting</h2>
            <p>Log the error code, message, request payload, and timestamps to make support requests easier to resolve.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
