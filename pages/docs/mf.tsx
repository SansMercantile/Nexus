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

export default function MfDocs() {
  return (
    <Layout>
      <Head>
        <title>MF CrazyJAM AI Music System - Sans Mercantile</title>
        <meta name="description" content="MF CrazyJAM AI Music System documentation - Advanced AI-powered music composition and generation with real-time audio synthesis" />
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
              MF CrazyJAM AI Music System
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Advanced AI-powered music composition and generation system with real-time audio synthesis
              and unlimited creative possibilities for music production and performance.
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
          <h2 className="text-3xl font-bold text-white mb-12">Music Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Multi-Genre Composition"
              description="Generate original music across all genres and styles with authentic musical understanding."
            />
            <FeatureCard
              title="Real-Time Performance"
              description="Live music generation and dynamic adaptive composition for interactive performances."
            />
            <FeatureCard
              title="Advanced Synthesis"
              description="Professional-grade synthesis and audio generation with high-fidelity sound production."
            />
            <FeatureCard
              title="Style Adaptation"
              description="Learn and adapt to musical preferences and styles with deep learning capabilities."
            />
            <FeatureCard
              title="Collaboration Tools"
              description="Real-time collaboration with musicians and artists across distributed networks."
            />
            <FeatureCard
              title="Production Suite"
              description="Complete music production, mixing, and mastering with professional audio tools."
            />
          </div>
        </motion.div>

        {/* Music Systems */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Creative Framework</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Composition Engine</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Algorithmic music generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Harmonic progression analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Rhythmic pattern creation</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Performance Systems</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Live improvisation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Interactive adaptation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Real-time collaboration</span>
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
          <h2 className="text-3xl font-bold text-white mb-12">Music Ecosystem</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h3 className="text-xl font-bold text-nexus-gold mb-6">Creative Production</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Content Sources</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Global music databases</li>
                  <li>• Artist collaboration networks</li>
                  <li>• Genre-specific libraries</li>
                  <li>• Performance archives</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Creative Outputs</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Original compositions</li>
                  <li>• Production masters</li>
                  <li>• Performance recordings</li>
                  <li>• Collaborative projects</li>
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
          <h2 className="text-3xl font-bold text-white mb-12">Implementation & Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Professional Studios</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Music production companies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Recording studios</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Entertainment industry</span>
                </li>
              </ul>
            </div>
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Independent Creators</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Solo artists and producers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Content creators</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Music educators</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}