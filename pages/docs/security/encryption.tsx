import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function EncryptionPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Data Encryption</h1>
            <p className="text-xl text-gray-300">How we protect your data with enterprise-grade encryption</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Encryption Standards</h2>
            <ul>
              <li><strong>AES-256:</strong> Data at rest encryption</li>
              <li><strong>TLS 1.3:</strong> Data in transit encryption</li>
              <li><strong>End-to-end encryption:</strong> For sensitive communications</li>
            </ul>

            <h2>Key Management</h2>
            <p>All encryption keys are managed through secure key management services with automatic rotation.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}