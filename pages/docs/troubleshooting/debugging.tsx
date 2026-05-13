import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function DebuggingPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Debugging Guide</h1>
            <p className="text-xl text-gray-300">Tools and techniques for debugging integrations.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Inspect request traces</h2>
            <p>Log both outgoing payloads and API responses. Compare expected inputs with actual request bodies to isolate mismatches.</p>

            <h2>Use response metadata</h2>
            <p>Review status codes, API error messages, correlation IDs, and any returned diagnostics to pinpoint failure causes.</p>

            <h2>Validate configuration</h2>
            <p>Confirm environment variables, API endpoints, and authentication headers. Ensure your integration is using the correct environment (development vs production).</p>

            <h2>Reproduce locally</h2>
            <p>Recreate issues with the smallest possible payload and step through the request lifecycle to identify where the failure occurs.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}