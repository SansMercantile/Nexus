import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function FirstIntegrationPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">First Integration</h1>
            <p className="text-xl text-gray-300">Connect your first workflow to a Sans Mercantile AI system.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Choose the right system</h2>
            <p>Review your use case and select the AI system that provides the best fit for data, industry, and compliance needs.</p>

            <h2>Prepare your data</h2>
            <p>Structure the data you will send to the API, including identifiers, metadata, and any context required for accurate results.</p>

            <h2>Configure authentication</h2>
            <p>Use your API key in the Authorization header and confirm the environment variables for your development and production environments.</p>

            <h2>Build the initial request</h2>
            <p>Start with a simple payload, validate the response, then add additional fields such as context, metadata, and callback URLs.</p>

            <h2>Monitor and adjust</h2>
            <p>Review response times, system outputs, and any warnings. Use this information to tune prompts, refine data mappings, and protect sensitive fields.</p>

            <h2>Next steps</h2>
            <ul>
              <li>Enable logging for audit and debug purposes.</li>
              <li>Configure webhooks or event-driven workflows.</li>
              <li>Move from test credentials to production credentials once validated.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
