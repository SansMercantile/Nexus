import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function KelPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">KEL Agricultural Intelligence System</h1>
            <p className="text-xl text-gray-300">Autonomous agricultural management with 300+ specialized agents</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Overview</h2>
            <p className="text-gray-300 mb-6">
              KEL is the Sans Mercantile agricultural intelligence system providing autonomous agricultural management through 300+ specialized AI agents. It transforms global agriculture and empowers small-scale farmers through AI-driven insights covering the entire farm lifecycle.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision & Mission</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-nexus-gold mb-2">Vision</h3>
                <p className="text-gray-300">To transform global agriculture and empower small-scale farmers</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-nexus-gold mb-2">Mission</h3>
                <p className="text-gray-300">Enable agricultural optimization through AI-driven insights covering entire farm lifecycle</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Key Features</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Satellite Crop Monitoring - Real-time crop analysis via satellite imagery</li>
              <li>• Yield Optimization - AI recommendations for planting, nurturing, and harvesting</li>
              <li>• Resource Management - Water, soil, and fertilizer optimization</li>
              <li>• Weather Intelligence - Predictive weather analysis and severe weather alerts</li>
              <li>• Commodity Pricing - Real-time market pricing and contract management</li>
              <li>• Supply Chain Optimization - Farm-to-market logistics and distribution</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Values</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Sustainability</p>
                <p className="text-gray-300 text-sm">Environmental stewardship and resource conservation</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Empowerment</p>
                <p className="text-gray-300 text-sm">Supporting farmers with advanced technology</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Innovation</p>
                <p className="text-gray-300 text-sm">Cutting-edge AI for agricultural advancement</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-nexus-gold font-semibold mb-2">Collaboration</p>
                <p className="text-gray-300 text-sm">Working together for global food security</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}