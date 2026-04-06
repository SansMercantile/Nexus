import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function AccountSetupPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Account Setup</h1>
            <p className="text-xl text-gray-300">Create and configure your Sans Mercantile account</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Creating Your Account</h2>
            <ol>
              <li>Visit the Sans Mercantile registration page</li>
              <li>Provide your business information</li>
              <li>Verify your email address</li>
              <li>Complete KYC verification</li>
            </ol>

            <h2>API Key Generation</h2>
            <p>Once your account is verified, generate your API keys from the dashboard.</p>

            <h2>Environment Configuration</h2>
            <pre><code>// .env.local
NEXUS_API_KEY=your-production-key
NEXUS_ENVIRONMENT=production</code></pre>
          </div>
        </div>
      </div>
    </Layout>
  );
}