import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function DatabasePage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Database Integration</h1>
            <p className="text-xl text-gray-300">Connect your databases to Nexus AI systems to enrich insights and trigger decision workflows.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Supported databases</h2>
            <p>Our platform integrates with SQL and NoSQL stores, including PostgreSQL, MySQL, Azure SQL, and MongoDB.</p>

            <h2>Data sync patterns</h2>
            <p>Use batch exports, incremental syncs, or direct query pipelines to bring data into your AI workflows while preserving data integrity.</p>

            <h2>Security and governance</h2>
            <p>Protect database credentials with secrets managers, limit access to necessary tables, and audit data movement between systems.</p>

            <h2>Best practices</h2>
            <ul>
              <li>Normalize fields before sending them for analysis.</li>
              <li>Use consistent naming and schema conventions.</li>
              <li>Validate data quality before running predictions or enrichments.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}