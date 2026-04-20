import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { fadeInUp } from '../lib/animations';
import { SYSTEMS } from '../lib/constants';

const getSystemFace = (faceName: string) => `/Faces/${faceName}`;

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
            {SYSTEMS.map((system, index) => (
              <motion.div
                key={system.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col h-full"
              >
                {/* Glassmorphism Card */}
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                               shadow-2xl hover:shadow-nexus-gold/20 transition-all duration-500 hover:scale-105
                               before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent
                               before:rounded-2xl before:pointer-events-none flex flex-col h-full">
                  {/* System Face Banner - Image Only */}
                  <div className="relative w-full overflow-hidden flex-shrink-0">
                    <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl">
                      {/* Background gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-nexus-gold/10 z-10"></div>

                      {/* Face image */}
                      <img
                        src={getSystemFace(system.face)}
                        alt={`${system.name} face`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          // Fallback to colored gradient background if image fails to load
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br flex items-center justify-center"
                                   style="background: linear-gradient(135deg, ${system.color}40, ${system.darkColor}80)">
                                <div class="text-3xl font-bold text-white opacity-50">
                                  ${system.name.charAt(0)}
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />

                      {/* Premium overlay effects */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-nexus-gold/0 via-nexus-gold/50 to-nexus-gold/0 z-30"></div>
                    </div>
                  </div>

                  {/* Content Section - Compact */}
                  <div className="relative z-10 flex-1 px-4 py-4 flex flex-col">
                    {/* System Name - Centered */}
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-nexus-gold transition-colors">
                        {system.name}
                      </h3>
                    </div>

                    {/* Subtitle - Left Aligned, Smaller */}
                    <p className="text-xs text-nexus-gray-400 font-medium text-left leading-tight mb-2">
                      {system.subtitle}
                    </p>

                    {/* Description - Left Aligned, Very Small */}
                    <p className="text-xs text-nexus-gray-500 text-left leading-tight flex-1 mb-3">
                      {system.description}
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={`/${system.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold
                               bg-gradient-to-r from-nexus-gold/20 to-nexus-gold/10
                               border border-nexus-gold/30 text-nexus-gold
                               hover:from-nexus-gold/30 hover:to-nexus-gold/20
                               hover:border-nexus-gold/50 hover:shadow-lg hover:shadow-nexus-gold/20
                               transition-all duration-300 backdrop-blur-sm"
                    >
                      Learn More
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Subtle animated border */}
                  <div className="absolute inset-0 rounded-2xl border border-nexus-gold/20 opacity-0
                                group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}