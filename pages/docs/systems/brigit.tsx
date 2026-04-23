import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function BrigitPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Brigit Legal Intelligence System</h1>
            <p className="text-xl text-gray-300">Multi-agent legal system monitoring 195+ jurisdictions with 15+ department services</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Overview</h2>
            <p className="text-gray-300 mb-6">
              Brigit is the Sans Mercantile legal intelligence system providing multi-agent legal monitoring across 195+ jurisdictions with 15+ specialized department services. It ensures comprehensive legal compliance and risk management for global operations.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision & Mission</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-nexus-gold mb-2">Vision</h3>
                <p className="text-gray-300">To create a comprehensive global legal intelligence network</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-nexus-gold mb-2">Mission</h3>
                <p className="text-gray-300">Monitor 195+ jurisdictions with 15+ department services for complete legal compliance</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Key Features</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Multi-Jurisdictional Monitoring - Coverage across 195+ legal jurisdictions worldwide</li>
              <li>• Department Services - 15+ specialized legal department services and expertise areas</li>
              <li>• Contract Analysis - Automated contract review and legal document analysis</li>
              <li>• Compliance Tracking - Real-time regulatory compliance monitoring and alerts</li>
              <li>• Risk Assessment - Legal risk evaluation and mitigation strategies</li>
              <li>• Legal Research - Automated legal research and precedent analysis</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Values</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Justice</p>
                <p className="text-gray-300 text-sm">Fair and equitable legal analysis</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Compliance</p>
                <p className="text-gray-300 text-sm">Rigorous adherence to legal standards</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Accuracy</p>
                <p className="text-gray-300 text-sm">Precise and reliable legal intelligence</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Global Coverage</p>
                <p className="text-gray-300 text-sm">Comprehensive international legal monitoring</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}