import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { fadeInUp, staggerContainer } from '../../lib/animations';

const FeatureCard = ({ title, description }: any) => (
  <motion.div
    variants={fadeInUp}
    className="border border-nexus-gold/20 rounded-xl p-6 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark hover:border-nexus-gold/40 transition-all duration-300"
  >
    <h3 className="text-xl font-bold text-nexus-gold mb-3">{title}</h3>
    <p className="text-nexus-gray-300">{description}</p>
  </motion.div>
);

export default function PrimoDocs() {
  return (
    <Layout>
      <Head>
        <title>PRIMO Temporal & Multidimensional - Sans Mercantile</title>
        <meta name="description" content="PRIMO Temporal & Multidimensional Manipulation system documentation - Advanced temporal mechanics and multidimensional access capabilities" />
      </Head>

      <div className=" pt-32 pb-20">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              PRIMO Temporal & Multidimensional
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Advanced temporal mechanics system enabling multidimensional manipulation
              with quantum computing capabilities for temporal and spatial operations.
            </p>
          </motion.div>
        </div>

        {/* Core Capabilities */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Temporal Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Temporal Mechanics"
              description="Time-based manipulation and temporal access systems for advanced chronological operations."
            />
            <FeatureCard
              title="Multidimensional Access"
              description="Cross-dimensional navigation and operations across multiple spatial frameworks."
            />
            <FeatureCard
              title="Quantum Tunneling"
              description="Quantum space traversal and manipulation for instantaneous spatial transitions."
            />
            <FeatureCard
              title="Timeline Navigation"
              description="Navigate and analyze alternate timelines with predictive modeling capabilities."
            />
            <FeatureCard
              title="Spacetime Engineering"
              description="Advanced spacetime manipulation and engineering for temporal construction."
            />
            <FeatureCard
              title="Dimensional Gating"
              description="Portal and gateway technology for controlled dimensional access and transit."
            />
          </div>
        </motion.div>

        {/* Advanced Systems */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Multidimensional Framework</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Temporal Operations</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Chronological manipulation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Timeline convergence analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Temporal stability assessment</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Spatial Technologies</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Multidimensional mapping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Quantum field manipulation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Dimensional interface design</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Integration Points */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">System Integration</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h3 className="text-xl font-bold text-nexus-gold mb-6">Advanced Operations Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Research Inputs</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Quantum field data</li>
                  <li>• Temporal measurement systems</li>
                  <li>• Dimensional analysis tools</li>
                  <li>• Spacetime research databases</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Operational Outputs</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Temporal navigation protocols</li>
                  <li>• Dimensional access frameworks</li>
                  <li>• Quantum manipulation tools</li>
                  <li>• Spacetime engineering designs</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Access Information */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Research & Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Advanced Research</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Quantum physics research institutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Temporal mechanics laboratories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                    <span>Multidimensional exploration programs</span>
                </li>
              </ul>
            </div>
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Strategic Operations</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Advanced strategic planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Long-term temporal analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Multidimensional risk assessment</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}