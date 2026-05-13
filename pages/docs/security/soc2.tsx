import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function Soc2Page() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">SOC 2 Certification</h1>
            <p className="text-xl text-gray-300">Security, availability, and confidentiality controls</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>SOC 2 framework</h2>
            <p>Our SOC 2 controls cover security, availability, processing integrity, confidentiality, and privacy to meet enterprise expectations.</p>

            <h2>Audit cadence</h2>
            <p>Third-party audits are performed regularly, and control evidence is collected continuously to demonstrate ongoing compliance.</p>

            <h2>Operational controls</h2>
            <p>We use automated monitoring, access controls, and incident response practices to ensure systems remain secure and operationally resilient.</p>

            <h2>Customer assurance</h2>
            <p>Customers can rely on our SOC 2 posture as a foundation for vendor risk management and trust in sensitive integrations.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}