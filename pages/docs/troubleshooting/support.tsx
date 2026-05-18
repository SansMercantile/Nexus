import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function SupportPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Support Resources</h1>
            <p className="text-xl text-gray-300">Get help from our support team and community.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Self-service resources</h2>
            <p>Use the documentation site to troubleshoot common scenarios, explore integration patterns, and verify expected platform behavior before contacting support.</p>

            <h2>Support channels</h2>
            <p>Reach our operations team via the dashboard support portal, direct email, or your dedicated customer success manager for urgent system issues.</p>

            <h2>Incident reporting</h2>
            <p>Submit incidents with system names, request IDs, timestamps, and any error payloads so our response teams can prioritize and resolve issues quickly.</p>

            <h2>Escalation flow</h2>
            <p>Critical outages and security events are escalated immediately to our incident response specialists, with follow-up updates provided throughout incident resolution.</p>

            <h2>Service level expectations</h2>
            <p>Our support offering includes guaranteed response windows, regular status updates, and post-incident reviews to help your team stay aligned and productive.</p>

            <h2>Knowledge and training</h2>
            <p>Access support articles, integration guides, and onboarding checklists to reduce friction during deployment and ramp-up phases.</p>

            <h2>Continuous improvement</h2>
            <p>We capture feedback from every support interaction to improve system documentation, incident handling, and long-term platform reliability.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}