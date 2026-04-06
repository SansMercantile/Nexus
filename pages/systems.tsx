import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { fadeInUp } from '../lib/animations';
import { systemsData } from '../lib/system-data';

export default function Systems() {
  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Systems</title>
        <meta name="description" content="Explore our constellation of autonomous intelligent systems" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Our <span className="text-nexus-gold">Systems</span>
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              A constellation of autonomous, intelligent systems designed to transform global commerce, governance, and innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systemsData.map((system, index) => (
              <motion.div
                key={system.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-6 hover:border-nexus-gold/40 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  {system.image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-nexus-gold/30">
                      <img
                        src={system.image}
                        alt={`${system.name} face`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: system.color }}
                    >
                      {system.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-nexus-gold transition-colors">
                      {system.name}
                    </h3>
                    <p className="text-sm text-nexus-gray-400">{system.subtitle}</p>
                  </div>
                </div>
                <p className="text-nexus-gray-300 mb-4">{system.description}</p>
                <Link
                  href={`/systems/${system.slug}`}
                  className="inline-flex items-center gap-2 text-nexus-gold hover:text-white transition-colors"
                >
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}