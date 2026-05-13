import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function ApiRestPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">REST API Reference</h1>
            <p className="text-xl text-gray-300">Details for calling our REST endpoints and building resilient integrations.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Base URL</h2>
            <p>Use <code>https://api.sansmercantile.com/v1</code> for all REST requests.</p>

            <h2>Request structure</h2>
            <p>Send JSON payloads with a valid bearer token and explicit content-type headers.</p>

            <h2>Sample request</h2>
            <pre><code>{`fetch('https://api.sansmercantile.com/v1/priv/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({ prompt: 'Analyze cash flow for a mid-market portfolio.' }),
});`}</code></pre>

            <h2>Response payloads</h2>
            <p>Responses include <code>status</code>, <code>result</code>, and optional metadata for traceability and system confidence.</p>

            <h2>Versioning</h2>
            <p>All production APIs are versioned under <code>/v1</code>. Breaking changes are released with a clear migration path through the docs.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
