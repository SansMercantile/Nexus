import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function QuickStartPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Quick Start Guide</h1>
            <p className="text-xl text-gray-300">Get running with Sans Mercantile Nexus in minutes.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Step 1: Create your account</h2>
            <p>Register for a Sans Mercantile account, verify your business identity, and complete any required onboarding checks.</p>

            <h2>Step 2: Generate an API key</h2>
            <p>From your dashboard, create a production API key and store it securely in your environment configuration.</p>

            <h2>Step 3: Select a system</h2>
            <p>Choose the AI system that matches your use case, such as Priv for wealth insights or Omega for medical intelligence.</p>

            <h2>Step 4: Send your first request</h2>
            <pre><code>{`// JavaScript example
const response = await fetch('https://api.sansmercantile.com/v1/priv/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({ prompt: 'Analyze portfolio risk for a high-net-worth client.' }),
});
const result = await response.json();
console.log(result);`}</code></pre>

            <h2>Step 5: Validate results</h2>
            <p>Check the returned response for system confidence scores, actionable recommendations, and any trace data needed for compliance.</p>

            <h2>Best Practices</h2>
            <ul>
              <li>Use environment variables for keys and secrets.</li>
              <li>Start with a small dataset for initial testing.</li>
              <li>Review system-specific guidance in the Systems documentation section.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
