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
        <meta name="description" content="Comprehensive documentation for the Sans Mercantile Constellation - unified AI orchestration across 21 autonomous systems" />
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
              The Constellation
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Twenty-one autonomous intelligent systems working in harmony to enable global commerce,
              governance, and innovation through advanced AI orchestration.
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SystemOverview
              title="Financial & Trading Systems"
              description="Intelligent market analysis and wealth management"
              color="green"
              systems={[
                "PRIV - Wealth Intelligence & Market Dynamics",
                "MF - Creative Financial Instruments"
              ]}
            />
            <SystemOverview
              title="Agricultural & Resource Systems"
              description="Sustainable agriculture and resource management"
              color="emerald"
              systems={[
                "KEL - Agricultural Intelligence System",
                "HATHOR - Resource Extraction & Mining"
              ]}
            />
            <SystemOverview
              title="Governance & Legal Systems"
              description="Ethical governance and regulatory compliance"
              color="blue"
              systems={[
                "MEZZO - Digital Immortality & Governance",
                "BRIGIT - Legal & Regulatory Intelligence",
                "SIA - Archetypal Intelligence & Dreamworld"
              ]}
            />
            <SystemOverview
              title="Healthcare & Education"
              description="Advanced medical and educational technologies"
              color="purple"
              systems={[
                "OMEGA - Medical AI & Consciousness",
                "KEV - Knowledge & Educational Vectors"
              ]}
            />
            <SystemOverview
              title="Security & Defense Systems"
              description="Comprehensive security and defense capabilities"
              color="red"
              systems={[
                "SEKHMET - Defense & Strategic Intelligence",
                "SOBEK - Threat Detection & Cybersecurity"
              ]}
            />
            <SystemOverview
              title="Infrastructure & Construction"
              description="Smart infrastructure and construction management"
              color="orange"
              systems={[
                "PTAH - Building & Infrastructure Management",
                "HAPI - Supply Chain & Transportation"
              ]}
            />
            <SystemOverview
              title="Energy & Environmental Systems"
              description="Clean energy and environmental monitoring"
              color="yellow"
              systems={[
                "RA - Solar Energy & Clean Power",
                "SHANGO - Wind, Geothermal & Renewables",
                "MONTU - Nuclear Energy & Power",
                "MAMI WATER - Hydraulics & Water Infrastructure"
              ]}
            />
            <SystemOverview
              title="Aviation & Space Systems"
              description="Advanced aerospace and space technologies"
              color="indigo"
              systems={[
                "KIBUKA - Aerial Defense & Space Operations",
                "ANUBIS - Space Colonization & Travel",
                "PRIMO - Temporal & Multidimensional Systems"
              ]}
            />
            <SystemOverview
              title="Creative & Development Systems"
              description="AI-powered creativity and autonomous development"
              color="pink"
              systems={[
                "MPETI - Autonomous Full Stack Development"
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
          <h2 className="text-3xl font-bold text-white mb-12">AI Infrastructure</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TechSection
              title="Compute Paradigms"
              description="Multiple computing approaches for optimal problem solving"
              technologies={["Quantum Computing", "Neuromorphic Processing", "AI Accelerators", "Cloud Computing"]}
            />
            <TechSection
              title="Integration Technologies"
              description="Advanced integration and orchestration technologies"
              technologies={["Real-time APIs", "Event Streaming", "WebSocket Communication", "Microservices Architecture"]}
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
          <h2 className="text-3xl font-bold text-white mb-12">Unified Orchestration</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <p className="text-nexus-gray-300 mb-6">
              The constellation operates through intelligent orchestration that automatically routes problems
              to the most appropriate systems and computing resources for optimal results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Problem Classification</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Complex optimization problems</li>
                  <li>• Pattern recognition and analysis</li>
                  <li>• Real-time processing requirements</li>
                  <li>• Large-scale data processing</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Intelligent Routing</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Automatic system coordination</li>
                  <li>• Resource optimization</li>
                  <li>• Real-time performance monitoring</li>
                  <li>• Cross-system collaboration</li>
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
          <h2 className="text-3xl font-bold text-white mb-12">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">21</div>
              <div className="text-nexus-gray-300">Autonomous Systems</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">3000+</div>
              <div className="text-nexus-gray-300">Specialized Agents</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">50+</div>
              <div className="text-nexus-gray-300">Domain Routers</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">17+</div>
              <div className="text-nexus-gray-300">Compute Providers</div>
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
          <h2 className="text-3xl font-bold text-white mb-12">System Integration</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h3 className="text-xl font-bold text-nexus-gold mb-6">Cross-System Communication</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-nexus-gray-300">
                <thead>
                  <tr className="border-b border-nexus-gold/20">
                    <th className="text-left p-3 text-nexus-gold">System Category</th>
                    <th className="text-left p-3 text-nexus-gold">Integration Points</th>
                    <th className="text-left p-3 text-nexus-gold">Communication</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-nexus-gold/10">
                    <td className="p-3 font-semibold">Financial Systems</td>
                    <td className="p-3">Market data, trading signals, risk analysis</td>
                    <td className="p-3">Real-time APIs, event streams</td>
                  </tr>
                  <tr className="border-b border-nexus-gold/10">
                    <td className="p-3 font-semibold">Infrastructure Systems</td>
                    <td className="p-3">Resource optimization, logistics coordination</td>
                    <td className="p-3">REST APIs, WebSocket connections</td>
                  </tr>
                  <tr className="border-b border-nexus-gold/10">
                    <td className="p-3 font-semibold">Security Systems</td>
                    <td className="p-3">Threat intelligence, compliance monitoring</td>
                    <td className="p-3">Event streams, secure channels</td>
                  </tr>
                  <tr className="border-b border-nexus-gold/10">
                    <td className="p-3 font-semibold">Environmental Systems</td>
                    <td className="p-3">Weather data, resource forecasting</td>
                    <td className="p-3">Broadcast messaging, data feeds</td>
                  </tr>
                </tbody>
              </table>
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
                  <span>Configure orchestration preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">3.</span>
                  <span>Set up real-time event connections</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">4.</span>
                  <span>Initialize system integrations</span>
                </li>
              </ul>
            </div>
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Developer Resources</h3>
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