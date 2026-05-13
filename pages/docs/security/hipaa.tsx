import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function HipaaPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">HIPAA Compliance</h1>
            <p className="text-xl text-gray-300">Medical data protection and HIPAA compliance measures</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>HIPAA controls</h2>
            <p>Our platform supports HIPAA obligations by encrypting PHI, enforcing access controls, and maintaining detailed audit logs for every request.</p>

            <h2>Patient data handling</h2>
            <p>Protected health information is isolated, tokenized when appropriate, and only processed by authorized systems and personnel.</p>

            <h2>Audit readiness</h2>
            <p>We provide access to compliance documentation and logging artifacts needed for audit reviews and vendor due diligence.</p>

            <h2>Access management</h2>
            <p>Role-based permissions, multi-factor authentication, and least-privilege administration help reduce the risk of unauthorized PHI access.</p>

            <h2>Vendor accountability</h2>
            <p>When using our medical AI services, your organization retains responsibility for PHI usage and data-sharing decisions; our controls are built to make that accountability manageable.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}