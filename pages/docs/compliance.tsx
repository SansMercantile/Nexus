import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';

export default function ComplianceDocsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Compliance Guide</p>
            <h1 className="text-5xl font-bold text-white mb-6">Compliance and Governance</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Review Sans Mercantile's approach to secure data handling, audit readiness, and ethical deployment.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-3xl border border-nexus-gold/20 bg-[#0c132b] p-12 prose prose-invert">
            <h2>Compliance for enterprise use</h2>
            <p>We build systems that are designed to be auditable and aligned with global regulatory expectations.</p>
            <h3>Data classification</h3>
            <p>All data is classified, encrypted in transit and at rest, and treated according to its sensitivity level.</p>
            <h3>Audit trails</h3>
            <p>Every major action within the platform is logged to provide a clear, searchable history for compliance reviews.</p>
            <h3>Ethical deployment</h3>
            <p>Our governance framework includes ongoing reviews to minimize bias, ensure transparency, and safeguard fairness for participants.</p>
            <h3>Operational readiness</h3>
            <ul>
              <li>Access controls tied to roles and policies</li>
              <li>Automated reporting for audit and regulatory teams</li>
              <li>Secure partner onboarding and risk evaluation</li>
            </ul>
          </motion.div>
          <div className="mt-10 text-center">
            <Link href="/docs" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold hover:bg-nexus-gold/10 transition-colors">
              Back to Docs Overview
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
