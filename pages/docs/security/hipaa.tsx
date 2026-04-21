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
            <h2>Compliance Framework</h2>
            <p>Omega Medical AI maintains full HIPAA compliance for all medical data processing.</p>

            <h2>Protected Health Information</h2>
            <p>All PHI is encrypted and access is strictly controlled with audit logging.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}