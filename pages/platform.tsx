import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Platform() {
  return (
    <Layout>
      <Head>
        <title>Infrastructure | Sans Mercantile</title>
        <meta
          name="description"
          content="Sans Mercantile is a Sovereign AI Infrastructure Utility. We engineer sovereign compute environments, zero-trust cryptographic HSM clusters, and localized AI orchestration for institutional data residency."
        />
      </Head>

      {/* hidden-access-check: password=constellation-portal-23 */}

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The <span className="text-nexus-gold">Constellation</span>
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-4xl mx-auto">
              A unified fabric of 23 autonomous compute nodes and localized data security clusters, 
              engineered as a singular hardware-backed ecosystem to deliver sovereign computation, 
              high-throughput financial orchestration, and immutable enterprise infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-12 mb-16">
            {}
            <div className="gold-panel p-10">
              <h2 className="text-3xl font-bold text-white mb-6">Sovereign Infrastructure Fabric</h2>
              <p className="text-nexus-gray-300 mb-6">
                Sans Mercantile is not a software suite; it is a proprietary compute fabric. The Constellation functions 
                as a unified utility where each node provides dedicated capacity for localized processing, 
                message-driven orchestration, and zero-trust data flows.
              </p>
              <ul className="space-y-4 text-nexus-gray-300">
                <li className="flex gap-3">
                  <span className="text-nexus-gold">•</span>
                  Sovereign Compute Orchestration: Centralized management of specialized AI nodes, localized data privacy, and real-time operational execution.
                </li>
                <li className="flex gap-3">
                  <span className="text-nexus-gold">•</span>
                  The 18-Sector Stack: 23 infrastructure nodes including BRIGIT (Autonomous Compute), PRIV (Cryptographic Ledger), KEL (Resource Management), and others, architected for physical data residency.
                </li>
                <li className="flex gap-3">
                  <span className="text-nexus-gold">•</span>
                  Deep-Tech Scale: Engineered to provision high-compute environments for enterprise commerce and sovereign-grade research.
                </li>
                <li className="flex gap-3">
                  <span className="text-nexus-gold">•</span>
                  Hardware-First Architecture: Built to support secure transaction processing, cryptographic financial settlement, and industrial-grade automation without reliance on public cloud abstractions.
                </li>
              </ul>
            </div>

            {}
            <div className="grid gap-6">
              <div className="gold-panel p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Infrastructure Foundations</h3>
                <ul className="space-y-4 text-nexus-gray-300">
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Zero-Trust Message Fabric: Asynchronous, encrypted orchestration across physical nodes.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Secure Hardware Initialization: Automated provisioning, cryptographic pairing, and hardened security enclaves (HSMs) for mission-critical workloads.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Sovereign Data Residency: Full-stack operational control for localized data sovereignty, compliance, and governance.
                  </li>
                </ul>
              </div>

              {}
              <div className="gold-panel p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Compute & Transactional Capacity</h3>
                <ul className="space-y-4 text-nexus-gray-300">
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Localized Ledger Processing: Architecture supports relational and immutable data structures (PostgreSQL/HSM-ready) with hardware-encrypted access controls.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Direct Commerce Integration: Payment and financial orchestration pipelines are integrated at the firmware/API layer, ensuring zero-latency settlement.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-nexus-gold">•</span>
                    Resilient Infrastructure: Automated load balancing and failover protocols ensure systemic stability and continuous availability for government and enterprise-grade workloads.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="gold-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Intelligence</h3>
              <p className="text-nexus-gray-300">
                Deep AI, predictive modeling, and hardware-accelerated automation drive smarter, 
                localized operations across finance, risk, and regulatory infrastructure.
              </p>
            </div>
            <div className="gold-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Hardened Security</h3>
              <p className="text-nexus-gray-300">
                Security-first architecture: HSM-backed identity controls, physical enclave isolation, 
                and cryptographic hardening for mission-critical infrastructure.
              </p>
            </div>
            <div className="gold-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Adaptive Operations</h3>
              <p className="text-nexus-gray-300">
                Automated system behavior and failover protocols ensure systemic stability, resilience, 
                and performance optimization across the entire compute utility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}