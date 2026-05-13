import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function CommonPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Common Issues</h1>
            <p className="text-xl text-gray-300">Solutions to frequently encountered problems</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Authentication failures</h2>
            <p>Verify your API key, header format, and environment variable configuration. Check for expired or rotated credentials.</p>

            <h2>Connectivity issues</h2>
            <p>Confirm network access to <code>api.sansmercantile.com</code>, firewall rules, and TLS certificate trust for HTTPS traffic.</p>

            <h2>Invalid payloads</h2>
            <p>Validate JSON request bodies and required fields. Use the API reference pages to confirm endpoint parameters.</p>

            <h2>Rate limiting</h2>
            <p>Monitor request volume and implement exponential backoff when you receive limit responses. Cache repeated requests to reduce usage.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}