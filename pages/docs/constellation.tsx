import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { fadeInUp, staggerContainer } from '../../lib/animations';

const SystemOverview = ({ title, description, systems, color }: any) => (
  <motion.div
    variants={fadeInUp}
    className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark hover:border-nexus-gold/40 transition-all duration-300"
  >
    <h3 className={`text-2xl font-bold mb-3 text-${color}-400`}>{title}</h3>
    <p className="text-nexus-gray-300 mb-6">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {systems.map((system: string, idx: number) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="text-nexus-gold font-bold">→</span>
          <span className="text-nexus-gray-300">{system}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const TechSection = ({ title, description, technologies }: any) => (
  <motion.div
    variants={fadeInUp}
    className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark hover:border-nexus-gold/40 transition-all duration-300"
  >
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-nexus-gray-300 mb-6">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {technologies.map((tech: string, idx: number) => (
        <div key={idx} className="text-center p-4 bg-nexus-dark/50 rounded-lg">
          <span className="text-nexus-gold font-semibold">{tech}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function ConstellationDocs() {
  return (
    <Layout>
      <Head>
        <title>Constellation System - Sans Mercantile</title>
        <meta name="description" content="Comprehensive documentation for the Sans Mercantile Constellation - unified AI orchestration across 21 specialized domain systems" />
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
              Constellation System
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Unified AI orchestration platform integrating advanced computing technologies
              across 21 specialized domain systems for comprehensive enterprise solutions.
            </p>
          </motion.div>
        </div>

        {/* System Overview */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">System Architecture</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SystemOverview
              title="Financial & Trading Systems"
              description="Market intelligence and wealth management"
              color="green"
              systems={[
                "PRIV - Wealth Intelligence & Trading",
                "MEZZO - Governance & Ethics"
              ]}
            />
            <SystemOverview
              title="Legal & Compliance"
              description="Regulatory monitoring and legal intelligence"
              color="blue"
              systems={[
                "BRIGIT - Legal & Regulatory Intelligence",
                "SIA - Archetypal Intelligence"
              ]}
            />
            <SystemOverview
              title="Healthcare & Education"
              description="Medical and educational AI systems"
              color="emerald"
              systems={[
                "OMEGA - Medical AI & Consciousness",
                "KEV - Knowledge & Educational Vectors"
              ]}
            />
            <SystemOverview
              title="Energy & Infrastructure"
              description="Critical infrastructure management"
              color="yellow"
              systems={[
                "RA - Solar Energy & Power Generation",
                "MONTU - Nuclear Energy Systems",
                "MAMI WATER - Hydraulics & Water Infrastructure",
                "PTAH - Construction & Infrastructure",
                "SHANGO - Weather & Climate Systems"
              ]}
            />
            <SystemOverview
              title="Agriculture & Logistics"
              description="Supply chain and agricultural intelligence"
              color="orange"
              systems={[
                "KEL - Agricultural Intelligence",
                "HATHOR - Resource Extraction & Mining",
                "HAPI - Supply Chain & Transportation"
              ]}
            />
            <SystemOverview
              title="Security & Defense"
              description="Protection and defense systems"
              color="red"
              systems={[
                "SEKHMET - Defense & Strategic Intelligence",
                "SOBEK - Threat Detection & Cybersecurity"
              ]}
            />
            <SystemOverview
              title="Aerospace & Space"
              description="Advanced transportation and space systems"
              color="purple"
              systems={[
                "KIBUKA - Aerial Defense & Space Operations",
                "ANUBIS - Space Colonization & Interstellar Travel",
                "PRIMO - Temporal & Multidimensional Manipulation"
              ]}
            />
            <SystemOverview
              title="Creative & Entertainment"
              description="AI-powered creative and entertainment systems"
              color="pink"
              systems={[
                "MF - CrazyJAM AI Music System"
              ]}
            />
            <SystemOverview
              title="Backend & Development"
              description="Internal development and automation systems"
              color="gray"
              systems={[
                "MPETI - Autonomous Full Stack AI Developer"
              ]}
            />
          </div>
        </motion.div>

        {/* AI Infrastructure */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">AI Infrastructure Layer</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TechSection
              title="Advanced Computing"
              description="Multiple computing paradigms for diverse workloads"
              technologies={["Quantum Computing", "Neuromorphic Processing", "AI Accelerators", "Cloud Infrastructure"]}
            />
            <TechSection
              title="Processing Technologies"
              description="Specialized hardware for AI and computational tasks"
              technologies={["High-Performance GPUs", "Neural Processing Units", "Quantum Processors", "Distributed Systems"]}
            />
            <TechSection
              title="Orchestration Layer"
              description="Intelligent resource allocation and workload routing"
              technologies={["Unified Orchestrator", "Load Balancing", "Resource Management", "Multi-Cloud Support"]}
            />
            <TechSection
              title="Integration Framework"
              description="Seamless connectivity across all systems"
              technologies={["API Gateways", "Event Streaming", "Service Mesh", "Microservices Architecture"]}
            />
          </div>
        </motion.div>

        {/* Unified Orchestrator */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Unified Orchestrator</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <p className="text-nexus-gray-300 mb-6">
              The Unified Orchestrator provides intelligent resource allocation and coordination
              across all systems and computing platforms for optimal performance and efficiency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Workload Optimization</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Intelligent task distribution</li>
                  <li>• Resource utilization monitoring</li>
                  <li>• Performance optimization</li>
                  <li>• Scalability management</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">System Coordination</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Cross-system communication</li>
                  <li>• Service orchestration</li>
                  <li>• Fault tolerance</li>
                  <li>• Load balancing</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Avatar Integration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Avatar Integration</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Real-Time Avatars</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Dynamic visual representation of system states</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Interactive communication interfaces</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Contextual response systems</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Event-Driven Interactions</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Automated response to system events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Real-time status communication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Multi-modal interaction support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">System Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">21</div>
              <div className="text-nexus-gray-300">Autonomous Systems</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">1000+</div>
              <div className="text-nexus-gray-300">Specialized Agents</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">Multiple</div>
              <div className="text-nexus-gray-300">Compute Paradigms</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">Global</div>
              <div className="text-nexus-gray-300">Enterprise Scale</div>
            </div>
          </div>
        </motion.div>

        {/* Integration Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Integration Patterns</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h3 className="text-xl font-bold text-nexus-gold mb-6">System Interoperability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Communication Protocols</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• RESTful APIs for system integration</li>
                  <li>• Real-time event streaming</li>
                  <li>• Message queuing systems</li>
                  <li>• WebSocket connections</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Data Exchange</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Standardized data formats</li>
                  <li>• Cross-system data sharing</li>
                  <li>• Service discovery</li>
                  <li>• Load balancing</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">System Access</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">1.</span>
                  <span>Request API credentials for required systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">2.</span>
                  <span>Configure unified orchestrator routing preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">3.</span>
                  <span>Set up WebSocket connections for real-time events</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">4.</span>
                  <span>Initialize avatar integration hooks</span>
                </li>
              </ul>
            </div>
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Development Resources</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>REST API documentation for each system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>WebSocket event specifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>SDK libraries for major languages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Integration testing environments</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}