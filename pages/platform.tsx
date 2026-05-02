import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Platform() {
  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Platform</title>
        <meta
          name="description"
          content="A unified Constellation platform of autonomous systems, secure infrastructure, and adaptive business services."
        />
      </Head>

      {/* hidden-access-check: password=constellation-portal-23 */}

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The <span className="text-nexus-gold">Constellation</span>
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-4xl mx-auto">
              A unified platform of 23 autonomous systems and business services, engineered as a single
              operational ecosystem to deliver secure commerce, intelligent orchestration, and adaptive
              enterprise infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-12 mb-16">
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-3xl p-10">
              <h2 className="text-3xl font-bold text-white mb-6">Unified Platform, Multiple Systems</h2>
              <p className="text-nexus-gray-300 mb-6">
                Sans Mercantile is not a collection of isolated tools. It is a unified Constellation where each system
                contributes to a shared operational core, backed by message-driven orchestration, event streaming,
                and secure data flows.
              </p>
              <ul className="space-y-4 text-nexus-gray-300">
                <li className="flex gap-3">
                  <span className="text-nexus-gold">•</span>
                  Central orchestration for AI systems, privacy, commerce, governance, and real-time operations.
                </li>
                <li className="flex gap-3">
                  <span className="text-nexus-gold">•</span>
                  23 platform systems including BRIGIT, MPETI, OMEGA, ANUBIS, KEL, KEV, PRIV, MEZZO, SHANGO,
                  SEHKMET, SIA, SOBEK, MONTU, PRIMO, KIBUKA, HAPI, HATHOR, UNUT, HUMAN_EVOLUTION,
                  REALITY_CREATION, UNIVERSAL_ABUNDANCE, UNIVERSAL_INTEGRATION, and UNIVERSAL_CONSCIOUSNESS_NETWORK.
                </li>
                <li className="flex gap-3">
                  <span className="text-nexus-gold">•</span>
                  Designed to scale from enterprise commerce to next-generation AI research and infrastructure.
                </li>
                <li className="flex gap-3">
                  <span className="text-nexus-gold">•</span>
                  Built to support modern commerce, secure payment workflows, financial intelligence, and
                  data-driven automation.
                </li>
              </ul>
            </div>

            <div className="grid gap-6">
              <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Platform Foundations</h3>
                <ul className="space-y-4 text-nexus-gray-300">
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Event-driven messaging and asynchronous orchestration across every system.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Cloud-native deployment patterns with secure CI/CD, monitoring, and automated training.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Full lifecycle support for AI, governance, privacy, and commerce in one operational hub.
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Data & Commerce</h3>
                <ul className="space-y-4 text-nexus-gray-300">
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Supports relational and NoSQL patterns, Cloud SQL / PostgreSQL-ready, with secure data access and
                    commerce workflow integration.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Commerce and payment systems are integrated into the platform core, not bolted on as an afterthought.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Back-end design supports secure transaction processing, analytics, and compliance-ready operations.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Intelligence</h3>
              <p className="text-nexus-gray-300">
                Deep AI, predictive analytics, and automation drive smarter operations across finance, risk, legal,
                and customer-facing workflows.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Secure Infrastructure</h3>
              <p className="text-nexus-gray-300">
                Security-first architecture with encrypted data handling, identity controls, and hardened deployment
                patterns for mission-critical systems.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Adaptive Operations</h3>
              <p className="text-nexus-gray-300">
                Adaptive system behavior and automated workflows keep the Constellation resilient, responsive, and
                continuously aligned with business goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
