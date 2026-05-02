import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { AnimatedIcon } from '../../components/AnimatedIcons';
import Link from 'next/link';

export default function SystemIntegration() {
  const integrationSteps = [
    {
      step: '01',
      title: 'Assessment & Planning',
      description: 'Comprehensive analysis of your current infrastructure and integration requirements.',
      icon: 'search'
    },
    {
      step: '02',
      title: 'Architecture Design',
      description: 'Custom integration architecture tailored to your specific systems and workflows.',
      icon: 'network'
    },
    {
      step: '03',
      title: 'API Development',
      description: 'Development of custom APIs and middleware for seamless system communication.',
      icon: 'code'
    },
    {
      step: '04',
      title: 'Testing & Validation',
      description: 'Rigorous testing and validation to ensure reliable system performance.',
      icon: 'check'
    },
    {
      step: '05',
      title: 'Deployment & Monitoring',
      description: 'Safe deployment with continuous monitoring and performance optimization.',
      icon: 'shield'
    }
  ];

  const integrationTypes = [
    {
      title: 'Legacy System Migration',
      description: 'Seamlessly migrate from legacy systems to modern AI-powered infrastructure.',
      features: ['Data migration', 'System compatibility', 'Performance optimization', 'Training support']
    },
    {
      title: 'Real-time Data Integration',
      description: 'Connect systems for real-time data synchronization and processing.',
      features: ['Event streaming', 'Data transformation', 'Error handling', 'Monitoring']
    },
    {
      title: 'Cloud Infrastructure Integration',
      description: 'Integrate with major cloud providers and hybrid environments.',
      features: ['Multi-cloud support', 'Auto-scaling', 'Security compliance', 'Cost optimization']
    },
    {
      title: 'Enterprise API Management',
      description: 'Comprehensive API management and orchestration solutions.',
      features: ['API gateway', 'Rate limiting', 'Authentication', 'Documentation']
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - System Integration Services</title>
        <meta name="description" content="Expert system integration services for seamless AI implementation and infrastructure modernization" />
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
              System <span className="text-nexus-gold">Integration</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              Seamlessly integrate our autonomous AI systems into your existing infrastructure with expert guidance,
              ensuring optimal performance and maximum business value.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Start Integration</button>
              </Link>
              <Link href="/docs/integration">
                <button className="btn btn-secondary">Integration Guide</button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Integration Process */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Integration Process</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                A systematic approach ensuring successful integration with minimal disruption to your operations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {integrationSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-nexus-gold/20 flex items-center justify-center">
                      <AnimatedIcon type={step.icon as any} size={24} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-nexus-gold mb-2">{step.step}</div>
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-nexus-gray-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Integration Types */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Integration Solutions</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Comprehensive integration services tailored to your specific infrastructure and business needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {integrationTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8 hover:border-nexus-gold/40 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{type.title}</h3>
                  <p className="text-nexus-gray-300 mb-6">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-nexus-gold flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technical Capabilities */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12 mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Technical Capabilities</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Advanced integration technologies ensuring seamless connectivity and optimal performance.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: 'network', title: 'API Integration', desc: 'REST, GraphQL, WebSocket' },
                { icon: 'database', title: 'Database Sync', desc: 'Real-time data synchronization' },
                { icon: 'cloud', title: 'Cloud Native', desc: 'Kubernetes, Docker, Microservices' },
                { icon: 'shield', title: 'Security', desc: 'End-to-end encryption, OAuth, SAML' },
                { icon: 'zap', title: 'Performance', desc: 'Load balancing, caching, optimization' },
                { icon: 'monitor', title: 'Monitoring', desc: 'Real-time metrics, alerting, logging' },
                { icon: 'sync', title: 'Event Streaming', desc: 'Kafka, RabbitMQ, custom protocols' },
                { icon: 'code', title: 'Custom Middleware', desc: 'Tailored integration solutions' }
              ].map((capability, index) => (
                <motion.div
                  key={capability.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <AnimatedIcon type={capability.icon as any} size={32} />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{capability.title}</h4>
                  <p className="text-nexus-gray-400 text-sm">{capability.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center bg-gradient-to-r from-nexus-gold/10 to-nexus-accent/10 border border-nexus-gold/20 rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Integrate?</h2>
            <p className="text-nexus-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss your integration requirements and develop a customized solution for your infrastructure.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Schedule Assessment</button>
              </Link>
              <Link href="/docs/integration">
                <button className="btn btn-secondary">Technical Documentation</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}