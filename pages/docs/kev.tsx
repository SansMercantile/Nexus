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

export default function KevDocs() {
  return (
    <Layout>
      <Head>
        <title>KEV Knowledge & Educational Vectors - Sans Mercantile</title>
        <meta name="description" content="KEV Knowledge & Educational Vectors system documentation - AI-personalized education with comprehensive curriculum and expert mentorship" />
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
              KEV Knowledge & Educational Vectors
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Comprehensive educational intelligence system providing AI-personalized learning
              with extensive curriculum coverage and expert mentorship networks.
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
          <h2 className="text-3xl font-bold text-white mb-12">Educational Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Personalized Learning Paths"
              description="AI adapts to individual learning styles, pace, and goals for optimal educational outcomes."
            />
            <FeatureCard
              title="Comprehensive Curriculum"
              description="185+ subject coverage across all knowledge domains with interconnected learning pathways."
            />
            <FeatureCard
              title="Knowledge Graphs"
              description="Dynamic relationship mapping between concepts, skills, and learning objectives."
            />
            <FeatureCard
              title="Adaptive Coursework"
              description="Real-time difficulty adjustment and content personalization based on learner progress."
            />
            <FeatureCard
              title="Expert Mentorship"
              description="AI-facilitated connections with subject matter experts and learning communities."
            />
            <FeatureCard
              title="Progress Analytics"
              description="Comprehensive learning intelligence with predictive success indicators."
            />
          </div>
        </motion.div>

        {/* Learning Systems */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Learning Intelligence Framework</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Adaptive Learning</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Individual learning style assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Dynamic content adjustment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Performance-based progression</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Knowledge Networks</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Interdisciplinary connection mapping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Expert network facilitation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Collaborative learning environments</span>
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
          <h2 className="text-3xl font-bold text-white mb-12">Educational Ecosystem</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h3 className="text-xl font-bold text-nexus-gold mb-6">Learning Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Content Sources</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Global academic databases</li>
                  <li>• Expert knowledge networks</li>
                  <li>• Research publication archives</li>
                  <li>• Interactive learning modules</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Learning Outputs</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Personalized curricula</li>
                  <li>• Skill assessments</li>
                  <li>• Career guidance</li>
                  <li>• Certification programs</li>
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
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Educational Institutions</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>University and college integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Corporate training programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Professional development</span>
                </li>
              </ul>
            </div>
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Individual Learners</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Personalized learning journeys</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Expert mentorship access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Global learning communities</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}