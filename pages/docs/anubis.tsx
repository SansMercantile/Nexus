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

export default function AnubisDocs() {
  return (
    <Layout>
      <Head>
        <title>ANUBIS Space Colonization - Sans Mercantile</title>
        <meta name="description" content="ANUBIS Space Colonization & Interstellar Travel system documentation - Interstellar travel and sustainable space colony systems" />
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
              ANUBIS Space Colonization
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Interstellar travel system enabling space colonization with advanced propulsion
              and life support for deep space exploration and sustainable colony establishment.
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
          <h2 className="text-3xl font-bold text-white mb-12">Space Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Advanced Propulsion"
              description="Faster-than-light drive systems and spacecraft propulsion for interstellar travel."
            />
            <FeatureCard
              title="Life Support Systems"
              description="Closed-loop life support for extended space travel and colony sustainability."
            />
            <FeatureCard
              title="Colony Infrastructure"
              description="Planning and deployment of sustainable space colonies and habitats."
            />
            <FeatureCard
              title="Terraforming"
              description="Planetary modification and habitability engineering for colonization."
            />
            <FeatureCard
              title="Space Navigation"
              description="Advanced navigation across interstellar distances and galactic coordinates."
            />
            <FeatureCard
              title="Resource Extraction"
              description="Off-world mining and resource processing for colony self-sufficiency."
            />
          </div>
        </motion.div>

        {/* Space Systems */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Interstellar Framework</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Propulsion & Travel</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>FTL drive technology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Interstellar navigation systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Radiation protection</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Colony Development</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Habitat construction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Resource sustainability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Environmental adaptation</span>
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
          <h2 className="text-3xl font-bold text-white mb-12">Space Operations</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h3 className="text-xl font-bold text-nexus-gold mb-6">Exploration & Colonization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Mission Planning</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Interstellar route optimization</li>
                  <li>• Colony site selection</li>
                  <li>• Resource assessment</li>
                  <li>• Risk analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Operations Support</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Real-time mission control</li>
                  <li>• Colony management systems</li>
                  <li>• Emergency response protocols</li>
                  <li>• Communication networks</li>
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
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Space Agencies</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Government space programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>International space cooperation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Commercial space ventures</span>
                </li>
              </ul>
            </div>
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Research & Development</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Advanced propulsion research</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                    <span>Life support technology</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Terraforming methodologies</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}