import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Platform() {
  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Platform</title>
        <meta name="description" content="The Sans Mercantile autonomous platform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The <span className="text-nexus-gold">Platform</span>
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              A comprehensive ecosystem of autonomous systems designed to revolutionize business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Core Features</h3>
              <ul className="space-y-4 text-nexus-gray-300">
                <li className="flex items-start">
                  <span className="text-nexus-gold mr-3">•</span>
                  Autonomous decision-making systems
                </li>
                <li className="flex items-start">
                  <span className="text-nexus-gold mr-3">•</span>
                  Real-time data processing and analytics
                </li>
                <li className="flex items-start">
                  <span className="text-nexus-gold mr-3">•</span>
                  Scalable cloud infrastructure
                </li>
                <li className="flex items-start">
                  <span className="text-nexus-gold mr-3">•</span>
                  Advanced AI and machine learning capabilities
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Benefits</h3>
              <ul className="space-y-4 text-nexus-gray-300">
                <li className="flex items-start">
                  <span className="text-nexus-gold mr-3">•</span>
                  Increased operational efficiency
                </li>
                <li className="flex items-start">
                  <span className="text-nexus-gold mr-3">•</span>
                  Reduced human error and costs
                </li>
                <li className="flex items-start">
                  <span className="text-nexus-gold mr-3">•</span>
                  24/7 system availability
                </li>
                <li className="flex items-start">
                  <span className="text-nexus-gold mr-3">•</span>
                  Predictive insights and optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}