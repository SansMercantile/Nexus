import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function RegulatoryPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Regulatory Updates</h1>
            <p className="text-xl text-gray-300">Latest regulatory changes and compliance updates</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Regulatory posture</h2>
            <p>Sans Mercantile monitors evolving requirements across technology, finance, healthcare, and privacy regulations to keep our services aligned with global standards.</p>

            <h2>Update process</h2>
            <p>We review and incorporate regulatory updates regularly, ensuring documentation, system controls, and customer notifications remain up to date.</p>

            <h2>Cross-border considerations</h2>
            <p>Our platform supports data residency and transfer requirements, helping customers manage compliance for international workflows.</p>

            <h2>Certifications and attestations</h2>
            <p>We maintain certifications such as SOC 2 and HIPAA-ready controls, and we provide the evidence required for customer audits and vendor assessments.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}