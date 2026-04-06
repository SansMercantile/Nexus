import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Services() {
  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Services</title>
        <meta name="description" content="Professional services offered by Sans Mercantile" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Our <span className="text-nexus-gold">Services</span>
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Comprehensive solutions to transform your business operations and drive innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-6 hover:border-nexus-gold/40 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4">System Integration</h3>
              <p className="text-nexus-gray-300">Seamlessly integrate our autonomous systems into your existing infrastructure.</p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-6 hover:border-nexus-gold/40 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4">Consulting</h3>
              <p className="text-nexus-gray-300">Expert guidance on implementing AI-driven solutions for your industry.</p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-6 hover:border-nexus-gold/40 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4">Custom Development</h3>
              <p className="text-nexus-gray-300">Tailored solutions built specifically for your unique business needs.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}