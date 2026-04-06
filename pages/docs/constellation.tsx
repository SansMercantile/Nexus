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
        <meta name="description" content="Comprehensive documentation for the Sans Mercantile Constellation - unified AI orchestration across 10 domain systems" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-20">
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
              Unified AI orchestration platform integrating quantum computing, neuromorphic processing,
              and traditional accelerators across 10 specialized domain systems.
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
              title="Energy & Infrastructure Systems"
              description="Critical infrastructure management with AI-driven optimization"
              color="green"
              systems={[
                "RA - Solar Energy & Power Generation (300 agents)",
                "MONTU - Nuclear Energy Systems (335 agents)",
                "MAMI WATER - Hydraulics & Water Infrastructure (270 agents)",
                "PTAH - Construction & Infrastructure (260 agents)"
              ]}
            />
            <SystemOverview
              title="Agriculture & Logistics"
              description="Supply chain and agricultural intelligence systems"
              color="emerald"
              systems={[
                "HATHOR - Agricultural Intelligence (180 agents)",
                "HAPI - Supply Chain & Logistics (280 agents)"
              ]}
            />
            <SystemOverview
              title="Security & Environment"
              description="Protection and environmental monitoring systems"
              color="red"
              systems={[
                "SEKHMET - Cybersecurity & Defense (300 agents)",
                "SHANGO - Weather & Climate Systems (250 agents)"
              ]}
            />
            <SystemOverview
              title="Aerospace & Maritime"
              description="Advanced transportation and monitoring systems"
              color="blue"
              systems={[
                "KIBUKA - Aerospace & Satellite Technology (320 agents)",
                "SOBEK - Maritime & Water Systems (285 agents)"
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
              title="Quantum Computing"
              description="6 quantum providers for complex optimization problems"
              technologies={["IBM Quantum", "Google Quantum AI", "IonQ", "Quantinuum", "Rigetti", "D-Wave"]}
            />
            <TechSection
              title="Neuromorphic Processing"
              description="Brain-inspired computing for pattern recognition"
              technologies={["Intel Loihi 2", "BrainChip Akida", "IBM TrueNorth", "SpiNNaker"]}
            />
            <TechSection
              title="AI Accelerators"
              description="High-performance computing for AI workloads"
              technologies={["NVIDIA H100/A100", "Google TPU v4", "AWS Trainium", "AMD MI300"]}
            />
            <TechSection
              title="Cloud Infrastructure"
              description="Multi-cloud orchestration with failover"
              technologies={["AWS", "Azure", "Google Cloud", "Oracle Cloud"]}
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
              The Unified Orchestrator serves as the intelligent routing layer that automatically selects
              the optimal compute paradigm for each problem type:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Problem Classification</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Quantum-primary: Complex optimization, cryptography</li>
                  <li>• Neuromorphic-primary: Pattern recognition, anomaly detection</li>
                  <li>• GPU-primary: Training, simulation, parallel processing</li>
                  <li>• Cloud-primary: Data processing, storage, orchestration</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Intelligent Routing</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Cost-performance optimization</li>
                  <li>• Multi-level fallback systems</li>
                  <li>• Real-time resource allocation</li>
                  <li>• Cross-system coordination</li>
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
                <h3 className="text-xl font-bold text-nexus-gold mb-4">NVIDIA Kimodo Engine</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>FACS Facial Action Synthesis for realistic expressions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Real-time eye gaze and head movement tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Emotional state rendering and domain-specific reactions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Event-Driven Reactions</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Market events trigger avatar responses in PRIV system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Creative milestones activate reactions in MEZZO system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Domain-specific reaction mapping across all systems</span>
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
              <div className="text-3xl font-bold text-nexus-gold mb-2">2,850+</div>
              <div className="text-nexus-gray-300">Specialized Agents</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">50</div>
              <div className="text-nexus-gray-300">Domain Routers</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">10</div>
              <div className="text-nexus-gray-300">Domain Systems</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-nexus-gold/10 to-nexus-gold/5 rounded-xl border border-nexus-gold/20">
              <div className="text-3xl font-bold text-nexus-gold mb-2">17</div>
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
          <h2 className="text-3xl font-bold text-white mb-12">Integration Patterns</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h3 className="text-xl font-bold text-nexus-gold mb-6">Cross-System Communication Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-nexus-gray-300">
                <thead>
                  <tr className="border-b border-nexus-gold/20">
                    <th className="text-left p-3 text-nexus-gold">System</th>
                    <th className="text-left p-3 text-nexus-gold">Dependencies</th>
                    <th className="text-left p-3 text-nexus-gold">Provides To</th>
                    <th className="text-left p-3 text-nexus-gold">Communication</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-nexus-gold/10">
                    <td className="p-3 font-semibold">HATHOR</td>
                    <td className="p-3">SHANGO (weather), MAMI_WATER (water)</td>
                    <td className="p-3">RA (grid load forecast)</td>
                    <td className="p-3">REST APIs + WebSocket</td>
                  </tr>
                  <tr className="border-b border-nexus-gold/10">
                    <td className="p-3 font-semibold">RA</td>
                    <td className="p-3">SHANGO (irradiance), HATHOR (demand)</td>
                    <td className="p-3">MONTU (grid coordination)</td>
                    <td className="p-3">REST APIs + Queues</td>
                  </tr>
                  <tr className="border-b border-nexus-gold/10">
                    <td className="p-3 font-semibold">SHANGO</td>
                    <td className="p-3">KIBUKA (satellite data)</td>
                    <td className="p-3">All systems (weather context)</td>
                    <td className="p-3">WebSocket broadcast</td>
                  </tr>
                  <tr className="border-b border-nexus-gold/10">
                    <td className="p-3 font-semibold">SEKHMET</td>
                    <td className="p-3">KIBUKA (threat intel)</td>
                    <td className="p-3">All systems (security alerts)</td>
                    <td className="p-3">WebSocket + Event streams</td>
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