import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { AnimatedIcon } from '../../components/AnimatedIcons';
import Link from 'next/link';

export default function AIConsulting() {
  const consultingPhases = [
    {
      phase: 'Assessment',
      title: 'Current State Analysis',
      description: 'Comprehensive evaluation of your AI readiness, infrastructure, and strategic objectives.',
      deliverables: ['AI maturity assessment', 'Technology audit', 'Gap analysis report', 'ROI projections']
    },
    {
      phase: 'Strategy',
      title: 'AI Strategy Development',
      description: 'Custom AI roadmap aligned with your business goals and industry requirements.',
      deliverables: ['Strategic roadmap', 'Implementation timeline', 'Resource requirements', 'Risk assessment']
    },
    {
      phase: 'Implementation',
      title: 'Solution Design & Planning',
      description: 'Detailed technical architecture and implementation planning for AI solutions.',
      deliverables: ['Technical architecture', 'Integration plan', 'Change management', 'Training roadmap']
    },
    {
      phase: 'Execution',
      title: 'Guided Implementation',
      description: 'Hands-on support during implementation with expert guidance and best practices.',
      deliverables: ['Implementation support', 'Quality assurance', 'Performance optimization', 'Knowledge transfer']
    }
  ];

  const serviceOfferings = [
    {
      title: 'Executive AI Leadership',
      description: 'Strategic guidance for C-suite executives on AI adoption and digital transformation.',
      features: ['AI strategy workshops', 'Executive briefings', 'Board presentations', 'Industry benchmarking']
    },
    {
      title: 'Technical AI Consulting',
      description: 'Deep technical expertise for AI implementation and system architecture.',
      features: ['Architecture design', 'Technology selection', 'Performance optimization', 'Security integration']
    },
    {
      title: 'Industry-Specific Solutions',
      description: 'Tailored AI solutions for healthcare, finance, manufacturing, and other sectors.',
      features: ['Regulatory compliance', 'Industry best practices', 'Custom model development', 'Domain expertise']
    },
    {
      title: 'Change Management',
      description: 'Comprehensive support for organizational change and AI adoption.',
      features: ['Stakeholder engagement', 'Training programs', 'Communication planning', 'Cultural transformation']
    }
  ];

  const expertiseAreas = [
    { title: 'Machine Learning', desc: 'Advanced ML model development and deployment' },
    { title: 'Natural Language Processing', desc: 'NLP solutions for text analysis and generation' },
    { title: 'Computer Vision', desc: 'Image recognition and visual AI applications' },
    { title: 'Predictive Analytics', desc: 'Data-driven forecasting and decision support' },
    { title: 'Robotic Process Automation', desc: 'Intelligent automation and workflow optimization' },
    { title: 'Edge AI', desc: 'AI deployment on edge devices and IoT systems' },
    { title: 'MLOps', desc: 'Machine learning operations and model lifecycle management' },
    { title: 'AI Ethics & Governance', desc: 'Responsible AI implementation and compliance' }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - AI Consulting Services</title>
        <meta name="description" content="Expert AI consulting services for strategic implementation and digital transformation" />
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
              AI <span className="text-nexus-gold">Consulting</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              Strategic guidance and expert implementation support to help your organization successfully adopt AI technologies
              and drive meaningful business transformation.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Book Consultation</button>
              </Link>
              <Link href="/docs/sdk">
                <button className="btn btn-secondary">AI Strategy Guide</button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Consulting Process */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Consulting Process</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                A structured methodology ensuring successful AI adoption with measurable business impact.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              {consultingPhases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl border border-nexus-gold/20 bg-[#0b1225] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-nexus-gold text-black font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-nexus-gold mb-1">{phase.phase}</p>
                      <h3 className="text-2xl font-semibold text-white">{phase.title}</h3>
                    </div>
                  </div>
                  <p className="text-nexus-gray-300 mb-6">{phase.description}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {phase.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="rounded-2xl border border-nexus-gold/10 bg-[#111827] p-4 text-sm text-nexus-gray-300">
                        {deliverable}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Service Offerings */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Service Offerings</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Comprehensive consulting services covering all aspects of AI adoption and implementation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {serviceOfferings.map((offering, index) => (
                <motion.div
                  key={offering.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8 hover:border-nexus-gold/40 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{offering.title}</h3>
                  <p className="text-nexus-gray-300 mb-6">{offering.description}</p>
                  <ul className="space-y-2">
                    {offering.features.map((feature, idx) => (
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

          {/* Expertise Areas */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12 mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Technical Expertise</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Deep technical knowledge across the full spectrum of AI technologies and applications.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {expertiseAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="text-center p-4 rounded-lg bg-nexus-dark/50 hover:bg-nexus-dark/70 transition-colors"
                >
                  <h4 className="text-lg font-semibold text-white mb-2">{area.title}</h4>
                  <p className="text-nexus-gray-400 text-sm">{area.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Success Metrics */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Proven Results</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Measurable impact from our AI consulting engagements.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { metric: '300%', label: 'Average ROI Increase' },
                { metric: '85%', label: 'Project Success Rate' },
                { metric: '60%', label: 'Time to Value Reduction' },
                { metric: '50+', label: 'Enterprise Clients' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.metric}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-nexus-gold mb-2">{stat.metric}</div>
                  <p className="text-nexus-gray-400 text-sm">{stat.label}</p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Transform Your Business with AI</h2>
            <p className="text-nexus-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss your AI goals and develop a strategic roadmap for successful implementation.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Schedule Strategy Session</button>
              </Link>
              <Link href="/case-studies">
                <button className="btn btn-secondary">View Case Studies</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}