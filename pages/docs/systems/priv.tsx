import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function PrivPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Priv</h1>
            <p className="text-xl text-gray-300">Advanced Financial Intelligence and Institutional Market Analysis</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Overview</h2>
            <p className="text-gray-300 mb-6">
              Priv is the Sans Mercantile wealth intelligence system providing advanced financial intelligence and institutional market analysis. It democratizes wealth intelligence across all economic strata through real-time market insights and predictive analytics.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Key Features</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Real-time Market Intelligence - Live market data with AI-powered sentiment analysis</li>
              <li>• Portfolio Optimization - AI-driven portfolio allocation and rebalancing</li>
              <li>• Predictive Analytics - Machine learning models for precise market forecasting</li>
              <li>• Risk Assessment - Advanced risk modeling and scenario planning</li>
              <li>• Compliance Monitoring - Automated regulatory compliance across markets</li>
              <li>• Trading API - Institutional-grade trading infrastructure</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision & Mission</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-nexus-gold mb-2">Vision</h3>
                <p className="text-gray-300">To democratize wealth intelligence across all economic strata</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-nexus-gold mb-2">Mission</h3>
                <p className="text-gray-300">Provide real-time market intelligence with predictive analytics for institutional and individual investors</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Values</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Integrity</p>
                <p className="text-gray-300 text-sm">Honest and transparent market analysis</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Transparency</p>
                <p className="text-gray-300 text-sm">Clear insights and methodology</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Innovation</p>
                <p className="text-gray-300 text-sm">Cutting-edge AI and analytics</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Accessibility</p>
                <p className="text-gray-300 text-sm">Available to all investor types</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
