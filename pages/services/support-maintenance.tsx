import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { AnimatedIcon } from '../../components/AnimatedIcons';
import Link from 'next/link';

export default function SupportMaintenance() {
  const supportTiers = [
    {
      name: 'Basic Support',
      price: '$500/month',
      description: 'Essential support for stable production systems.',
      features: [
        'Email support (24/7)',
        'Bug fixes and patches',
        'Documentation updates',
        'Monthly system health reports',
        'Community forum access'
      ],
      responseTime: '24-48 hours',
      recommended: false
    },
    {
      name: 'Professional Support',
      price: '$2,500/month',
      description: 'Comprehensive support with priority response and proactive monitoring.',
      features: [
        'Phone & email support (24/7)',
        'Priority bug fixes',
        'Performance optimization',
        'Security updates',
        'Monthly consultation calls',
        'System monitoring alerts',
        'Backup & recovery assistance'
      ],
      responseTime: '4-12 hours',
      recommended: true
    },
    {
      name: 'Enterprise Support',
      price: 'Custom pricing',
      description: 'White-glove service with dedicated resources and guaranteed SLAs.',
      features: [
        'Dedicated support engineer',
        'Guaranteed 1-hour response',
        'On-site support options',
        'Custom development requests',
        '24/7 phone support',
        'Emergency response team',
        'Advanced security monitoring',
        'Compliance assistance'
      ],
      responseTime: '1 hour',
      recommended: false
    }
  ];

  const maintenanceServices = [
    {
      title: 'System Monitoring & Health Checks',
      description: 'Continuous monitoring of system performance, security, and reliability.',
      services: ['Real-time dashboards', 'Automated alerts', 'Performance metrics', 'Security scanning'],
      frequency: '24/7 continuous'
    },
    {
      title: 'Security Updates & Patching',
      description: 'Regular security updates and vulnerability management.',
      services: ['Security patches', 'Vulnerability assessments', 'Compliance updates', 'Security audits'],
      frequency: 'Weekly/Monthly'
    },
    {
      title: 'Performance Optimization',
      description: 'Ongoing performance tuning and optimization services.',
      services: ['Performance analysis', 'Database optimization', 'Code profiling', 'Resource scaling'],
      frequency: 'Monthly'
    },
    {
      title: 'Backup & Disaster Recovery',
      description: 'Comprehensive backup solutions and disaster recovery planning.',
      services: ['Automated backups', 'Recovery testing', 'Business continuity', 'Data restoration'],
      frequency: 'Daily/Weekly'
    },
    {
      title: 'Feature Updates & Enhancements',
      description: 'Regular feature updates and system enhancements.',
      services: ['Feature requests', 'UI/UX improvements', 'API enhancements', 'Integration updates'],
      frequency: 'Quarterly'
    },
    {
      title: 'Compliance & Documentation',
      description: 'Ongoing compliance monitoring and documentation maintenance.',
      services: ['Compliance audits', 'Documentation updates', 'Regulatory reporting', 'Policy updates'],
      frequency: 'Quarterly'
    }
  ];

  const supportChannels = [
    {
      channel: '24/7 Support Portal',
      description: 'Self-service portal for documentation, FAQs, and ticket submission.',
      features: ['Knowledge base', 'Ticket tracking', 'Status updates', 'Resource downloads'],
      icon: 'portal'
    },
    {
      channel: 'Phone Support',
      description: 'Direct phone support for critical issues and complex problems.',
      features: ['Immediate assistance', 'Screen sharing', 'Voice conferencing', 'Emergency hotline'],
      icon: 'phone'
    },
    {
      channel: 'Email Support',
      description: 'Detailed email support for non-urgent issues and documentation.',
      features: ['Detailed responses', 'File attachments', 'Follow-up tracking', 'Archive access'],
      icon: 'email'
    },
    {
      channel: 'On-site Support',
      description: 'On-site technical support for enterprise customers.',
      features: ['On-premise assistance', 'System audits', 'Training sessions', 'Architecture reviews'],
      icon: 'location'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Support & Maintenance</title>
        <meta name="description" content="Comprehensive support and maintenance services for AI systems and applications" />
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
              Support & <span className="text-nexus-gold">Maintenance</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              Comprehensive support and maintenance services ensuring your AI systems remain secure, performant,
              and up-to-date with the latest advancements.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Get Support</button>
              </Link>
              <Link href="/docs/troubleshooting/support">
                <button className="btn btn-secondary">Support Portal</button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Support Tiers */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Support Plans</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Choose the support level that best fits your organization's needs and requirements.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border rounded-xl p-8 ${
                    tier.recommended
                      ? 'border-nexus-gold ring-2 ring-nexus-gold/20'
                      : 'border-nexus-gold/20'
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-nexus-gold text-nexus-dark px-4 py-1 text-sm font-semibold rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="text-3xl font-bold text-nexus-gold mb-2">{tier.price}</div>
                    <p className="text-nexus-gray-300 text-sm">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-nexus-gold">Response Time:</span>
                      <span className="text-sm text-nexus-gray-300">{tier.responseTime}</span>
                    </div>
                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-nexus-gold"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    tier.recommended
                      ? 'bg-nexus-gold text-nexus-dark hover:bg-nexus-gold/90'
                      : 'bg-nexus-gold/20 text-nexus-gold hover:bg-nexus-gold/30 border border-nexus-gold/30'
                  }`}>
                    {tier.name === 'Enterprise Support' ? 'Contact Sales' : 'Select Plan'}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Maintenance Services */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Maintenance Services</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Proactive maintenance services to keep your systems running optimally.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {maintenanceServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    <span className="px-3 py-1 bg-nexus-gold/20 text-nexus-gold text-xs rounded-full">
                      {service.frequency}
                    </span>
                  </div>

                  <p className="text-nexus-gray-300 mb-6">{service.description}</p>

                  <div>
                    <h4 className="text-sm font-semibold text-nexus-gold mb-3">Included Services</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {service.services.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                          <div className="w-1 h-1 rounded-full bg-nexus-gold"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Channels */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12 mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Support Channels</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Multiple ways to get help when you need it most.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supportChannels.map((channel, index) => (
                <motion.div
                  key={channel.channel}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-nexus-gold/20 flex items-center justify-center">
                      <AnimatedIcon type={channel.icon as any} size={32} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{channel.channel}</h3>
                  <p className="text-nexus-gray-300 text-sm mb-4">{channel.description}</p>
                  <ul className="space-y-1 text-left">
                    {channel.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-nexus-gray-400">
                        <div className="w-1 h-1 rounded-full bg-nexus-gold"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SLA Guarantees */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Service Level Agreements</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Guaranteed service levels and response times for mission-critical systems.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'System Uptime',
                  guarantee: '99.9%',
                  description: 'Guaranteed uptime for production systems with automatic failover.'
                },
                {
                  title: 'Critical Issue Response',
                  guarantee: '< 1 hour',
                  description: 'Response time for critical system issues affecting production.'
                },
                {
                  title: 'Security Incident Response',
                  guarantee: '< 30 minutes',
                  description: 'Immediate response to security incidents and vulnerabilities.'
                }
              ].map((sla, index) => (
                <motion.div
                  key={sla.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{sla.title}</h3>
                  <div className="text-3xl font-bold text-nexus-gold mb-4">{sla.guarantee}</div>
                  <p className="text-nexus-gray-300 text-sm">{sla.description}</p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready for Reliable Support?</h2>
            <p className="text-nexus-gray-300 mb-8 max-w-2xl mx-auto">
              Ensure your AI systems remain secure, performant, and up-to-date with our comprehensive support services.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Get Started</button>
              </Link>
              <Link href="/docs/troubleshooting/support">
                <button className="btn btn-secondary">View SLAs</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}