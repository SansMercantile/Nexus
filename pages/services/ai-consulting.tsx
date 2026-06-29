import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';

export default function StrategicAssessment() {
  const assessmentPhases = [
    {
      phase: '01',
      title: 'Topology Mapping',
      description: 'Comprehensive audit of existing enterprise infrastructure to identify integration points with the Constellation architecture.',
      deliverables: ['Infrastructure Audit', 'Data Flow Analysis', 'Gap Identification', 'Constraint Mapping']
    },
    {
      phase: '02',
      title: 'Architecture Alignment',
      description: 'Defining the structural requirements for modular AI utility deployment within your specific operational constraints.',
      deliverables: ['Alignment Blueprint', 'Sector Requirements', 'Resource Allocation Plan', 'Risk Mitigation Strategy']
    },
    {
      phase: '03',
      title: 'Deployment Roadmap',
      description: 'A phased execution plan for transitioning from legacy systems to the 18-Sector Stack.',
      deliverables: ['Phased Rollout Schedule', 'Milestone Definition', 'KPI Framework', 'Change Management Protocol']
    },
    {
      phase: '04',
      title: 'Operational Readiness',
      description: 'Final validation of infrastructure readiness before the activation of autonomous utility nodes.',
      deliverables: ['Readiness Certification', 'User Acceptance Testing', 'Performance Benchmarking', 'Knowledge Transfer']
    }
  ];

  const assessmentCapabilities = [
    {
      title: 'Enterprise Topology Audit',
      description: 'Deep-dive analysis into existing IT stacks to ensure seamless integration with modular AI utilities.',
      features: ['Legacy System Mapping', 'Data Silo Identification', 'Security Perimeter Analysis', 'Infrastructure Scalability']
    },
    {
      title: 'Constellation Alignment',
      description: 'Aligning organizational objectives with the 18-Sector Stack capabilities for maximum systemic impact.',
      features: ['Strategic Roadmap Design', 'ROI Modeling', 'Capability Mapping', 'Governance Frameworks']
    },
    {
      title: 'Risk & Compliance Assessment',
      description: 'Ensuring that infrastructure deployment meets institutional security and regulatory standards.',
      features: ['Data Privacy Audits', 'Compliance Mapping', 'Security Hardening Plans', 'Regulatory Alignment']
    },
    {
      title: 'Deployment Readiness Planning',
      description: 'Preparing the organizational fabric for the transition to autonomous AI utility orchestration.',
      features: ['Change Management Strategy', 'Training Roadmaps', 'Stakeholder Engagement', 'Operational Transitioning']
    }
  ];

  const infrastructureFocus = [
    { title: 'Topology Mapping', desc: 'Identifying integration points in complex enterprise environments' },
    { title: 'Sector Alignment', desc: 'Mapping business needs to specific 18-Sector Stack utilities' },
    { title: 'Data Flow Orchestration', desc: 'Designing systemic data movement across modular nodes' },
    { title: 'Security Hardening', desc: 'Ensuring infrastructure integrity during AI utility deployment' },
    { title: 'Scalability Modeling', desc: 'Predicting and planning for autonomous system growth' },
    { title: 'Compliance Frameworks', desc: 'Integrating regulatory requirements into the core architecture' },
    { title: 'Legacy Modernization', desc: 'Systematic replacement of obsolete systems with modular utilities' },
    { title: 'Operational Continuity', desc: 'Ensuring zero-downtime transitions during infrastructure deployment' }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Strategic Infrastructure Assessment</title>
        <meta name="description" content="Mapping enterprise topology to the Constellation architecture for modular AI utility deployment." />
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
              Strategic <span className="text-nexus-gold">Infrastructure Assessment</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              Before deployment, we map your existing enterprise topology to the Constellation architecture. We identify integration points, analyze data flows, and define the structural requirements for modular AI utility nodes.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <button className="btn btn-primary">Request Assessment Blueprint</button>
            </motion.div>
          </motion.div>

          {/* Assessment Phases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {assessmentPhases.map((phase, i) => (
              <div key={i} className="p-6 bg-nexus-gray-900 border border-white/10 rounded-xl hover:border-nexus-gold transition-colors">
                <span className="text-nexus-gold font-bold text-lg">{phase.phase}</span>
                <h3 className="text-xl font-bold text-white mb-4">{phase.title}</h3>
                <p className="text-nexus-gray-400 mb-6 text-sm">{phase.description}</p>
                <ul className="space-y-2">
                  {phase.deliverables.map((item, j) => (
                    <li key={j} className="flex items-center text-xs text-nexus-gray-300">
                      <span className="mr-2">▹</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Assessment Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {assessmentCapabilities.map((cap, i) => (
              <div key={i} className="p-8 bg-nexus-gray-900/50 border border-white/5 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">{cap.title}</h3>
                <p className="text-nexus-gray-400 mb-6">{cap.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cap.features.map((f, j) => (
                    <span key={j} className="px-3 py-1 bg-white/5 rounded-full text-xs text-nexus-gold border border-white/10">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Infrastructure Focus Areas */}
          <div className="bg-nexus-gray-900/50 p-10 rounded-2xl border border-white/5">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Infrastructure Focus Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {infrastructureFocus.map((focus, i) => (
                <div key={i} className="p-4 bg-white/5 rounded border border-white/10 text-center">
                  <h4 className="text-sm font-bold text-nexus-gold mb-2">{focus.title}</h4>
                  <p className="text-xs text-nexus-gray-400">{focus.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}