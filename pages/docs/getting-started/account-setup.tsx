import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function AccountSetupPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Account Setup</h1>
            <p className="text-xl text-gray-300">Register and configure your Sans Mercantile account for secure platform access.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Create your account</h2>
            <p>Begin by registering with your business credentials. Provide company details, a valid email address, and any required compliance information for your industry.</p>

            <h2>Verify and onboard</h2>
            <p>Confirm your email address and complete identity verification. For enterprise accounts, additional KYC and contract reviews may be required.</p>

            <h2>Generate credentials</h2>
            <p>Once verified, open the dashboard and generate a new API key. Treat this key like any other secret and store it in a protected secret manager.</p>

            <h2>Environment configuration</h2>
            <p>Configure separate environments for development, staging, and production:</p>
            <pre><code>{`# .env.local
NEXUS_API_KEY=your-production-key
NEXUS_ENVIRONMENT=production`}</code></pre>

            <h2>Access controls and governance</h2>
            <p>Use role-based access controls in the dashboard to limit who can create keys, change settings, or access compliance data.</p>

            <h2>Best practices</h2>
            <ul>
              <li>Use distinct API keys for test and production workloads.</li>
              <li>Rotate keys regularly and revoke any unused credentials.</li>
              <li>Document team roles and maintain an audit trail for account changes.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}