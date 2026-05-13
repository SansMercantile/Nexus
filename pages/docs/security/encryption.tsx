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
            <h2>Encryption in transit</h2>
            <p>All API traffic is delivered over TLS 1.3 to safeguard credentials, payloads, and system responses while moving between your environment and our platform.</p>

            <h2>Encryption at rest</h2>
            <p>Stored data is encrypted with AES-256 across database storage, object storage, and backups. Sensitive fields are protected by application-layer encryption for an additional security boundary.</p>

            <h2>Key lifecycle management</h2>
            <p>Encryption keys are managed through a centralized key management system with periodic rotation and strict separation of duties between administrators and service operators.</p>

            <h2>Data segmentation</h2>
            <p>Tenant data is logically isolated, and cryptographic measures ensure that each customer’s sensitive information remains protected even in shared infrastructure environments.</p>

            <h2>Compliance alignment</h2>
            <p>Our encryption practices are designed to support SOC 2, HIPAA, and GDPR controls, making them appropriate for regulated industries and enterprise-grade deployments.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}