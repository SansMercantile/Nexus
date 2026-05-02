import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { AnimatedIcon } from '../../components/AnimatedIcons';
import Link from 'next/link';

export default function TrainingEducation() {
  const trainingPrograms = [
    {
      title: 'Executive AI Leadership',
      duration: '2 Days',
      level: 'Executive',
      description: 'Strategic AI leadership training for C-suite executives and board members.',
      topics: ['AI strategy development', 'Digital transformation', 'ROI measurement', 'Risk management'],
      format: 'In-person / Virtual'
    },
    {
      title: 'AI Implementation Workshop',
      duration: '3 Days',
      level: 'Technical',
      description: 'Hands-on training for technical teams implementing AI solutions.',
      topics: ['Model deployment', 'MLOps practices', 'System integration', 'Performance optimization'],
      format: 'In-person / Virtual'
    },
    {
      title: 'Data Science Fundamentals',
      duration: '5 Days',
      level: 'Intermediate',
      description: 'Comprehensive introduction to data science and machine learning.',
      topics: ['Statistical analysis', 'Machine learning algorithms', 'Python programming', 'Data visualization'],
      format: 'In-person / Virtual'
    },
    {
      title: 'Advanced AI Development',
      duration: '10 Days',
      level: 'Advanced',
      description: 'Deep technical training for AI researchers and senior developers.',
      topics: ['Deep learning architectures', 'Custom model development', 'Research methodologies', 'Advanced optimization'],
      format: 'In-person Only'
    }
  ];

  const certificationTracks = [
    {
      title: 'AI System Administrator',
      description: 'Comprehensive training for managing and maintaining AI systems.',
      modules: ['System architecture', 'Deployment strategies', 'Monitoring & alerting', 'Security & compliance'],
      duration: '6 weeks',
      certification: 'Sans Mercantile Certified'
    },
    {
      title: 'AI Ethics & Governance',
      description: 'Understanding responsible AI implementation and ethical considerations.',
      modules: ['AI ethics frameworks', 'Bias detection & mitigation', 'Regulatory compliance', 'Governance models'],
      duration: '4 weeks',
      certification: 'Industry Recognized'
    },
    {
      title: 'Machine Learning Engineer',
      description: 'Technical training for building and deploying ML models at scale.',
      modules: ['Model development', 'MLOps pipelines', 'Cloud deployment', 'Performance optimization'],
      duration: '8 weeks',
      certification: 'Sans Mercantile Certified'
    },
    {
      title: 'AI Product Manager',
      description: 'Product management skills specific to AI-powered products.',
      modules: ['AI product strategy', 'User experience design', 'Technical requirements', 'Go-to-market planning'],
      duration: '6 weeks',
      certification: 'Sans Mercantile Certified'
    }
  ];

  const learningFormats = [
    {
      title: 'Live Instructor-Led Training',
      description: 'Interactive sessions with expert instructors and hands-on exercises.',
      features: ['Real-time Q&A', 'Group discussions', 'Practical exercises', 'Certificate of completion'],
      icon: 'presentation'
    },
    {
      title: 'Self-Paced Online Learning',
      description: 'Flexible learning with comprehensive video content and assessments.',
      features: ['24/7 access', 'Video lectures', 'Interactive quizzes', 'Progress tracking'],
      icon: 'computer'
    },
    {
      title: 'Corporate Workshops',
      description: 'Customized training programs designed for your organization's specific needs.',
      features: ['Tailored content', 'On-site delivery', 'Team collaboration', 'Follow-up support'],
      icon: 'team'
    },
    {
      title: 'Mentorship Programs',
      description: 'One-on-one guidance from AI experts for personalized skill development.',
      features: ['Personal coach', 'Custom learning path', 'Regular check-ins', 'Project guidance'],
      icon: 'graduation'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Training & Education</title>
        <meta name="description" content="Comprehensive AI training programs, certifications, and educational resources for organizations and individuals" />
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
              Training & <span className="text-nexus-gold">Education</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              Comprehensive AI education programs designed to empower your team with the knowledge and skills needed
              to successfully implement and manage AI solutions.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">View Programs</button>
              </Link>
              <Link href="/docs/training">
                <button className="btn btn-secondary">Training Resources</button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Training Programs */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Training Programs</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Structured learning paths designed for different roles and experience levels.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trainingPrograms.map((program, index) => (
                <motion.div
                  key={program.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8 hover:border-nexus-gold/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
                      <div className="flex gap-4 text-sm text-nexus-gray-400">
                        <span>📅 {program.duration}</span>
                        <span>🎯 {program.level}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-nexus-gold/20 text-nexus-gold text-xs rounded-full">
                      {program.format}
                    </span>
                  </div>

                  <p className="text-nexus-gray-300 mb-6">{program.description}</p>

                  <div>
                    <h4 className="text-sm font-semibold text-nexus-gold mb-3">Key Topics</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {program.topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                          <div className="w-1 h-1 rounded-full bg-nexus-gold"></div>
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certification Tracks */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Certification Programs</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Industry-recognized certifications validating your AI expertise and competencies.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certificationTracks.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                  <p className="text-nexus-gray-300 mb-4">{cert.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="text-nexus-gray-400">⏱️ {cert.duration}</span>
                    <span className="px-2 py-1 bg-nexus-gold/20 text-nexus-gold text-xs rounded">
                      {cert.certification}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-nexus-gold mb-3">Curriculum</h4>
                    <ul className="space-y-1">
                      {cert.modules.map((module, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-nexus-gray-400">
                          <div className="w-1 h-1 rounded-full bg-nexus-gold"></div>
                          {module}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Learning Formats */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12 mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Learning Formats</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Flexible learning options to fit your schedule and learning preferences.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {learningFormats.map((format, index) => (
                <motion.div
                  key={format.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-nexus-gold/20 flex items-center justify-center">
                      <AnimatedIcon type={format.icon as any} size={32} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{format.title}</h3>
                  <p className="text-nexus-gray-300 text-sm mb-4">{format.description}</p>
                  <ul className="space-y-1 text-left">
                    {format.features.map((feature, idx) => (
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

          {/* Success Metrics */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Training Impact</h2>
              <p className="text-nexus-gray-300 max-w-2xl mx-auto">
                Measurable results from our comprehensive training programs.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { metric: '95%', label: 'Satisfaction Rate' },
                { metric: '500+', label: 'Professionals Trained' },
                { metric: '40+', label: 'Corporate Clients' },
                { metric: '85%', label: 'Skill Application Rate' }
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
            <h2 className="text-3xl font-bold text-white mb-4">Invest in Your Team's Future</h2>
            <p className="text-nexus-gray-300 mb-8 max-w-2xl mx-auto">
              Equip your organization with the AI knowledge and skills needed to drive innovation and competitive advantage.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact">
                <button className="btn btn-primary">Schedule Training</button>
              </Link>
              <Link href="/docs/training">
                <button className="btn btn-secondary">Browse Curriculum</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}