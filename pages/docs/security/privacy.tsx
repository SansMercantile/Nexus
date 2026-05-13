import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-300">How we collect, use, and protect your data</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Data minimization</h2>
            <p>We collect only the information necessary to deliver AI services and ensure compliance with your agreed use cases.</p>

            <h2>Purpose limitation</h2>
            <p>Data is processed only for fulfilling requests, improving platform reliability, and delivering the features you enable.</p>

            <h2>Data retention</h2>
            <p>Retention periods are defined by your service agreement and regulatory obligations. Sensitive data is retained only as long as needed for operational or legal reasons.</p>

            <h2>Access and control</h2>
            <p>Your organization controls who can access data through role-based permissions and audit controls in the dashboard.</p>

            <h2>Third-party sharing</h2>
            <p>We do not share customer data with third parties except as required for contracted services, compliance, or explicit authorization from your organization.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}