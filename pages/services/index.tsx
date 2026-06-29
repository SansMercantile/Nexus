import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';

export default function Services() {
  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Enterprise Infrastructure & Systemic Deployment</title>
        <meta name="description" content="Deploying permanent, modular AI utility infrastructure across an 18-Sector Stack." />
      </Head>

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center mb-20"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Enterprise Infrastructure & <span className="text-nexus-gold">Systemic Deployment</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              Sans Mercantile does not operate as a traditional IT consultancy or bespoke software agency. We deploy permanent, modular AI utility infrastructure across an 18-Sector Stack. Our deployment division works exclusively with institutional partners to integrate the Constellation architecture into core enterprise operations.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <button className="btn btn-primary">Request Deployment Blueprint</button>
              <button className="btn btn-secondary">View Architecture Portfolio</button>
            </motion.div>
          </motion.div>

          {/* Infrastructure Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {([
              {
                title: 'Strategic Assessment',
                description: 'Mapping existing enterprise topology to the Constellation architecture.',
                features: ['Infrastructure Audit', 'Gap Analysis', 'Roadmap Generation']
              },
              {
                title: 'Modular Deployment',
                description: 'Deploying autonomous utility modules into production environments.',
                features: ['AI Utility Nodes', 'Custom Model Integration', 'API Orchestration']
              },
              {
                title: 'Systemic Lifecycle',
                description: 'Ensuring perpetual uptime and evolution of the deployed stack.',
                features: ['Continuous Monitoring', 'Security Hardening', 'Model Evolution']
              }
            ]).map((pillar, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="p-8 bg-nexus-gray-900 border border-nexus-gold/20 rounded-xl hover:border-nexus-gold transition-colors"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{pillar.title}</h3>
                <p className="text-nexus-gray-400 mb-6">{pillar.description}</p>
                <ul className="space-y-2">
                  {pillar.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-sm text-nexus-gold">
                      <span className="mr-2">▹</span> {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* The 18-Sector Stack Overview */}
          <div className="bg-nexus-gray-900/50 p-10 rounded-2xl border border-white/5">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">The 18-Sector Stack</h2>
            <p className="text-nexus-gray-400 text-center max-w-4xl mx-auto mb-12">
              Our architecture is organized into eighteen distinct sectors, each providing a specialized utility layer.
              From core data ingestion and processing to autonomous decisioning and cross-sector interoperability,
              the Constellation architecture provides a unified fabric for enterprise intelligence.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['Data Ingestion', 'Vectorization', 'Contextual Retrieval', 'Reasoning Engine', 'Action Orchestration', 'Feedback Loops', 'Security Layer', 'Identity Management', 'Compliance Monitoring', 'Model Governance', 'Edge Deployment', 'Real-time Streaming', 'Predictive Analytics', 'Sentiment Analysis', 'Knowledge Synthesis', 'Cross-Sector Sync', 'Audit Logging', 'Systemic Evolution'].map((sector, i) => (
                <div key={i} className="p-3 bg-white/5 rounded border border-white/10 text-center text-xs text-nexus-gray-300">
                  {sector}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}