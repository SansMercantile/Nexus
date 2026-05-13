import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function ApiAuthPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Authentication & Keys</h1>
            <p className="text-xl text-gray-300">How to authenticate API requests and manage your credentials securely.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Authentication model</h2>
            <p>All API requests require a bearer token in the <code>Authorization</code> header. Generate your API key from the dashboard and keep it secure.</p>

            <h2>Request format</h2>
            <pre><code>{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}</code></pre>

            <h2>Key rotation</h2>
            <p>Rotate keys periodically and retire old keys immediately after a trusted replacement is in place. Always store keys in a secrets manager or environment variable.</p>

            <h2>Scopes and access control</h2>
            <p>API keys are scoped to the products and systems you enable in your account. Grant keys only the permissions needed for the integration.</p>

            <h2>Security best practices</h2>
            <ul>
              <li>Never store keys in source control.</li>
              <li>Use separate keys for development and production.</li>
              <li>Secure key storage with a vault or managed secret store.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
