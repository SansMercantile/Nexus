import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function MezzoPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Mezzo Ethical Governance Framework</h1>
            <p className="text-xl text-gray-300">Ethical governance framework with consciousness preservation and archetypal orchestration</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Overview</h2>
            <p className="text-gray-300 mb-6">
              Mezzo is the Sans Mercantile ethical governance framework providing consciousness preservation and archetypal orchestration. It establishes ethical AI governance standards and ensures responsible AI development and deployment across all systems.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision & Mission</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-nexus-gold mb-2">Vision</h3>
                <p className="text-gray-300">To establish ethical AI governance that preserves consciousness and human values</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-nexus-gold mb-2">Mission</h3>
                <p className="text-gray-300">Provide archetypal orchestration and consciousness preservation frameworks for ethical AI development</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Key Features</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Ethical AI Framework - Comprehensive guidelines for responsible AI development</li>
              <li>• Consciousness Preservation - Safeguarding human consciousness in AI systems</li>
              <li>• Archetypal Orchestration - Managing AI behavior patterns and decision-making</li>
              <li>• Governance Standards - Industry-leading ethical governance protocols</li>
              <li>• Compliance Monitoring - Automated ethical compliance and risk assessment</li>
              <li>• Value Alignment - Ensuring AI systems align with human values and ethics</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Values</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Ethics</p>
                <p className="text-gray-300 text-sm">Fundamental commitment to ethical AI principles</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Consciousness</p>
                <p className="text-gray-300 text-sm">Preservation of human consciousness and awareness</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Responsibility</p>
                <p className="text-gray-300 text-sm">Accountable and transparent AI governance</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Harmony</p>
                <p className="text-gray-300 text-sm">Balancing technological advancement with human values</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}