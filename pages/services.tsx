import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { AnimatedIcon } from '../components/AnimatedIcons';
import Link from 'next/link';

export default function Services() {
  const services = [
    {
      title: 'System Integration',
      description: 'Seamlessly integrate our autonomous systems into your existing infrastructure with expert guidance and support.',
      icon: 'network',
      features: [
        'Custom API integrations',
        'Legacy system migration',
        'Real-time data synchronization',
        'Performance optimization',
        '24/7 monitoring & support'
      ],
      cta: 'Start Integration'
    },
    {
      title: 'AI Consulting',
      description: 'Expert guidance on implementing AI-driven solutions tailored to your industry and business objectives.',
      icon: 'brain',
      features: [
        'Industry-specific AI strategies',
        'Technology assessment & roadmap',
        'Implementation planning',
        'Change management support',
        'ROI optimization'
      ],
      cta: 'Book Consultation'
    },
    {
      title: 'Custom Development',
      description: 'Tailored solutions built specifically for your unique business needs and operational requirements.',
      icon: 'code',
      features: [
        'Custom AI model development',
        'Proprietary algorithm creation',
        'System customization',
        'Integration middleware',
        'Performance tuning'
      ],
      cta: 'Discuss Project'
    },
    {
      title: 'Training & Education',
      description: 'Comprehensive training programs to empower your team with AI expertise and operational knowledge.',
      icon: 'graduation',
      features: [
        'Executive AI leadership training',
        'Technical implementation workshops',
        'System administration courses',
        'Industry certification programs',
        'Ongoing support & updates'
      ],
      cta: 'View Programs'
    },
    {
      title: 'Managed Services',
      description: 'Full-service management of your AI systems with proactive monitoring, maintenance, and optimization.',
      icon: 'shield',
      features: [
        '24/7 system monitoring',
        'Automated maintenance',
        'Performance optimization',
        'Security updates',
        'Incident response'
      ],
      cta: 'Learn More'
    },
    {
      title: 'Compliance & Security',
      description: 'Ensure regulatory compliance and enterprise-grade security across all your AI implementations.',
      icon: 'lock',
      features: [
        'Regulatory compliance audits',
        'Security assessments',
        'Data privacy protection',
        'Risk management frameworks',
        'Audit trail management'
      ],
      cta: 'Security Review'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Professional Services</title>
        <meta name="description" content="Comprehensive AI consulting, system integration, and custom development services from Sans Mercantile" />
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
              Professional <span className="text-nexus-gold">Services</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              Comprehensive solutions to transform your business operations and drive innovation through our constellation of autonomous AI systems.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Get Started</button>
              </Link>
              <Link href="/docs">
                <button className="btn btn-secondary">View Documentation</button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8 hover:border-nexus-gold/40 hover:shadow-lg hover:shadow-nexus-gold/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-nexus-gold">
                    <AnimatedIcon type={service.icon as any} size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-nexus-gold transition-colors">
                    {service.title}
                  </h3>
                </div>

                <p className="text-nexus-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-nexus-gold flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full px-4 py-3 rounded-lg bg-nexus-gold/10 border border-nexus-gold/30 text-nexus-gold hover:bg-nexus-gold/20 transition-all duration-300 font-semibold">
                  {service.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Process Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12 mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Process</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                A proven methodology that ensures successful AI implementation and maximum business value.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Discovery & Assessment',
                  description: 'We analyze your current systems, identify opportunities, and develop a strategic roadmap.'
                },
                {
                  step: '02',
                  title: 'Design & Planning',
                  description: 'Custom solution architecture and detailed implementation planning with your team.'
                },
                {
                  step: '03',
                  title: 'Implementation',
                  description: 'Seamless integration and deployment with comprehensive testing and validation.'
                },
                {
                  step: '04',
                  title: 'Optimization & Support',
                  description: 'Continuous monitoring, performance optimization, and ongoing support.'
                }
              ].map((phase, index) => (
                <motion.div
                  key={phase.step}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-nexus-gold mb-4">{phase.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{phase.title}</h3>
                  <p className="text-nexus-gray-400 text-sm leading-relaxed">{phase.description}</p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-nexus-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how our AI systems and professional services can drive innovation and growth for your organization.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Schedule Consultation</button>
              </Link>
              <Link href="/systems">
                <button className="btn btn-secondary">Explore Systems</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}