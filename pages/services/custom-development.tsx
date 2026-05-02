import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { AnimatedIcon } from '../../components/AnimatedIcons';
import Link from 'next/link';

export default function CustomDevelopment() {
  const developmentProcess = [
    {
      step: '01',
      title: 'Requirements Analysis',
      description: 'Deep dive into your business needs and technical requirements.',
      activities: ['Stakeholder interviews', 'Requirements gathering', 'Technical feasibility', 'Scope definition']
    },
    {
      step: '02',
      title: 'Architecture & Design',
      description: 'Design scalable, maintainable solutions with modern architecture patterns.',
      activities: ['System architecture', 'API design', 'Database schema', 'Security planning']
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Agile development with comprehensive testing and quality assurance.',
      activities: ['Iterative development', 'Unit testing', 'Integration testing', 'Code reviews']
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description: 'Production deployment with monitoring and ongoing support.',
      activities: ['CI/CD setup', 'Production deployment', 'Monitoring', 'Maintenance support']
    }
  ];

  const developmentServices = [
    {
      title: 'Custom AI Model Development',
      description: 'Tailored machine learning models designed for your specific use cases and data.',
      technologies: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Custom frameworks'],
      features: ['Data preprocessing', 'Model training', 'Hyperparameter tuning', 'Model optimization']
    },
    {
      title: 'Full-Stack Application Development',
      description: 'Complete web and mobile applications with modern technologies and best practices.',
      technologies: ['React/Next.js', 'Node.js', 'Python/FastAPI', 'PostgreSQL/MongoDB'],
      features: ['Responsive design', 'API development', 'Database design', 'Performance optimization']
    },
    {
      title: 'Integration Middleware',
      description: 'Custom middleware solutions for connecting disparate systems and APIs.',
      technologies: ['Node.js', 'Python', 'Go', 'Rust'],
      features: ['Event processing', 'Data transformation', 'Error handling', 'Monitoring']
    },
    {
      title: 'Real-time Systems',
      description: 'High-performance systems requiring real-time processing and low latency.',
      technologies: ['WebSocket', 'Kafka', 'Redis', 'Custom protocols'],
      features: ['Event streaming', 'Real-time analytics', 'Load balancing', 'Fault tolerance']
    }
  ];

  const techStack = [
    { category: 'Frontend', technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Angular'] },
    { category: 'Backend', technologies: ['Node.js', 'Python', 'FastAPI', 'Django', 'Go', 'Rust'] },
    { category: 'AI/ML', technologies: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI', 'Hugging Face', 'Custom models'] },
    { category: 'Database', technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'TimescaleDB'] },
    { category: 'Infrastructure', technologies: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform'] }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Custom Development Services</title>
        <meta name="description" content="Custom software development services including AI models, full-stack applications, and enterprise solutions" />
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
              Custom <span className="text-nexus-gold">Development</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              Tailored software solutions built specifically for your business needs. From custom AI models to full-stack
              applications, we deliver production-ready code that scales with your business.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Discuss Project</button>
              </Link>
              <Link href="/portfolio">
                <button className="btn btn-secondary">View Portfolio</button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Development Process */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Development Process</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Our proven methodology ensures high-quality deliverables and successful project outcomes.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {developmentProcess.map((phase, index) => (
                <motion.div
                  key={phase.step}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-2xl font-bold text-nexus-gold">{phase.step}</div>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  </div>
                  <p className="text-nexus-gray-300 mb-4">{phase.description}</p>
                  <ul className="space-y-2">
                    {phase.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-nexus-gold"></div>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Development Services */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Development Services</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Specialized development services covering the full spectrum of modern software needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {developmentServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8 hover:border-nexus-gold/40 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-nexus-gray-300 mb-6">{service.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-nexus-gold mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-nexus-gold/10 text-nexus-gold text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-nexus-gold mb-2">Features</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                          <div className="w-1 h-1 rounded-full bg-nexus-gold"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12 mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Technology Stack</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Modern technologies and frameworks ensuring scalable, maintainable, and high-performance solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {techStack.map((stack, index) => (
                <motion.div
                  key={stack.category}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-lg font-semibold text-nexus-gold mb-4">{stack.category}</h3>
                  <div className="space-y-2">
                    {stack.technologies.map((tech, idx) => (
                      <div key={idx} className="text-sm text-nexus-gray-300 bg-nexus-dark/50 rounded px-2 py-1">
                        {tech}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quality Assurance */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Quality Assurance</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Rigorous testing and quality processes ensuring reliable, secure, and performant software.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: 'code', title: 'Code Reviews', desc: 'Peer code reviews and automated analysis' },
                { icon: 'check', title: 'Automated Testing', desc: 'Unit, integration, and E2E tests' },
                { icon: 'shield', title: 'Security Testing', desc: 'Vulnerability assessment and penetration testing' },
                { icon: 'monitor', title: 'Performance Testing', desc: 'Load testing and performance optimization' },
                { icon: 'accessibility', title: 'Accessibility', desc: 'WCAG compliance and usability testing' },
                { icon: 'documentation', title: 'Documentation', desc: 'Comprehensive API and code documentation' },
                { icon: 'deployment', title: 'CI/CD', desc: 'Automated deployment and monitoring' },
                { icon: 'support', title: 'Maintenance', desc: 'Post-deployment support and updates' }
              ].map((qa, index) => (
                <motion.div
                  key={qa.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="text-center p-4 rounded-lg bg-nexus-dark/50"
                >
                  <div className="flex justify-center mb-3">
                    <AnimatedIcon type={qa.icon as any} size={24} />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{qa.title}</h4>
                  <p className="text-nexus-gray-400 text-xs">{qa.desc}</p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Something Amazing?</h2>
            <p className="text-nexus-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss your project requirements and create a custom solution that drives your business forward.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Start Your Project</button>
              </Link>
              <Link href="/docs/development">
                <button className="btn btn-secondary">Development Guide</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}