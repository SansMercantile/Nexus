import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { AnimatedIcon } from '../../components/AnimatedIcons';
import Link from 'next/link';

export default function Services() {
  const services = [
    {
      title: 'AI Consulting',
      description: 'Strategic AI consulting to help you identify opportunities, assess feasibility, and develop implementation roadmaps.',
      icon: 'brain',
      href: '/services/ai-consulting',
      features: ['AI strategy development', 'Technology assessment', 'ROI analysis', 'Implementation planning']
    },
    {
      title: 'System Integration',
      description: 'Seamless integration of AI systems with your existing infrastructure, ensuring compatibility and optimal performance.',
      icon: 'integration',
      href: '/services/system-integration',
      features: ['API integration', 'Data pipeline setup', 'Cloud migration', 'Legacy system modernization']
    },
    {
      title: 'Custom Development',
      description: 'Tailored software development including custom AI models, full-stack applications, and enterprise solutions.',
      icon: 'code',
      href: '/services/custom-development',
      features: ['AI model development', 'Full-stack apps', 'Real-time systems', 'Quality assurance']
    },
    {
      title: 'Training & Education',
      description: 'Comprehensive AI training programs and certifications to empower your team with cutting-edge knowledge.',
      icon: 'graduation',
      href: '/services/training-education',
      features: ['Executive training', 'Technical workshops', 'Certification programs', 'Mentorship']
    },
    {
      title: 'Support & Maintenance',
      description: 'Ongoing support and maintenance services ensuring your AI systems remain secure, performant, and up-to-date.',
      icon: 'shield',
      href: '/services/support-maintenance',
      features: ['24/7 support', 'System monitoring', 'Security updates', 'Performance optimization']
    }
  ];

  const serviceCategories = [
    {
      category: 'Strategy & Planning',
      services: ['AI Consulting', 'Training & Education'],
      description: 'Strategic guidance and team development for successful AI adoption.'
    },
    {
      category: 'Implementation & Development',
      services: ['Custom Development', 'System Integration'],
      description: 'Technical implementation and system development services.'
    },
    {
      category: 'Operations & Support',
      services: ['Support & Maintenance'],
      description: 'Ongoing operational support and system maintenance.'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Services</title>
        <meta name="description" content="Comprehensive AI services including consulting, development, integration, training, and support" />
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
              Our <span className="text-nexus-gold">Services</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              End-to-end AI solutions from strategy to implementation and beyond. We provide comprehensive services
              to help organizations successfully adopt and scale AI technologies.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Get Started</button>
              </Link>
              <Link href="/portfolio">
                <button className="btn btn-secondary">View Portfolio</button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Comprehensive AI Services</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Specialized services designed to address every aspect of your AI journey.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8 hover:border-nexus-gold/40 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-nexus-gold/20 flex items-center justify-center group-hover:bg-nexus-gold/30 transition-colors">
                      <AnimatedIcon type={service.icon as any} size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  </div>

                  <p className="text-nexus-gray-300 mb-6">{service.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-nexus-gold mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                          <div className="w-1 h-1 rounded-full bg-nexus-gold"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={service.href}>
                    <button className="w-full btn btn-secondary text-sm">
                      Learn More →
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Service Categories */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12 mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Service Categories</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Our services are organized into categories to help you find the right solution for your needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {serviceCategories.map((category, index) => (
                <motion.div
                  key={category.category}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{category.category}</h3>
                  <p className="text-nexus-gray-300 mb-6">{category.description}</p>

                  <div className="space-y-2">
                    {category.services.map((service, idx) => (
                      <div key={idx} className="text-sm text-nexus-gray-400">
                        • {service}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Sans Mercantile</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                What sets us apart in delivering exceptional AI services.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: 'expertise', title: 'Deep Expertise', desc: 'Years of experience in AI implementation' },
                { icon: 'innovation', title: 'Cutting-Edge', desc: 'Latest technologies and methodologies' },
                { icon: 'security', title: 'Enterprise Security', desc: 'Bank-grade security and compliance' },
                { icon: 'support', title: 'Full Support', desc: 'End-to-end project support and maintenance' },
                { icon: 'scalability', title: 'Scalable Solutions', desc: 'Solutions that grow with your business' },
                { icon: 'results', title: 'Proven Results', desc: 'Measurable ROI and business impact' },
                { icon: 'collaboration', title: 'Collaborative', desc: 'Partner approach to your success' },
                { icon: 'flexibility', title: 'Flexible', desc: 'Custom solutions tailored to your needs' }
              ].map((reason, index) => (
                <motion.div
                  key={reason.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="text-center p-4 rounded-lg bg-nexus-dark/50"
                >
                  <div className="flex justify-center mb-3">
                    <AnimatedIcon type={reason.icon as any} size={24} />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{reason.title}</h4>
                  <p className="text-nexus-gray-400 text-xs">{reason.desc}</p>
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
              Let's discuss your AI needs and create a customized solution that drives real business value.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Start Your Project</button>
              </Link>
              <Link href="/docs/services">
                <button className="btn btn-secondary">Service Documentation</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}