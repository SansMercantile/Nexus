import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { fadeInUp } from '../lib/animations';
import { COMPANY_INFO, SYSTEMS } from '../lib/constants';

export default function Home() {
  const previewSystems = SYSTEMS.slice(0, 6);

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - {COMPANY_INFO.tagline}</title>
        <meta name="description" content={COMPANY_INFO.description} />
        <meta property="og:title" content="Sans Mercantile Constellation" />
        <meta property="og:description" content={COMPANY_INFO.tagline} />
      </Head>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28"
      >
        <div className="absolute inset-0 grid-background opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,229,255,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(172,255,88,0.12),transparent_18%)]" />
        <div className="absolute inset-x-0 top-24 h-96 mx-auto w-[85%] rounded-full bg-[#00e5ff]/10 blur-3xl opacity-70" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight uppercase text-white leading-tight"
          >
            <span className="gradient-text">Sans Mercantile</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg md:text-xl text-white max-w-3xl mx-auto font-light"
          >
            A network of autonomous, intelligent systems built to architect economic futures, govern complexity, and unlock sovereign-scale innovation.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/systems">
              <button className="btn btn-primary">Explore Systems</button>
            </Link>
            <Link href="/about">
              <button className="btn btn-secondary">Learn More</button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.35em] text-nexus-gold mb-4">The Constellation</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">21 autonomous systems working in perfect harmony</h2>
          <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto">
            Explore the core systems that power modern finance, healthcare, defense, energy, and next-generation sovereign AI infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewSystems.map((system) => (
            <div key={system.id} className="card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-white/5 pointer-events-none" />
              <div className="relative rounded-3xl p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-white text-xl font-bold shadow-lg shadow-cyan-500/10">
                      {system.name.charAt(0)}
                    </span>
                    <span className={`status-badge ${system.status === 'restricted' ? 'status-restricted' : 'status-open'}`}>
                      {system.status === 'restricted' ? 'RESTRICTED' : 'PUBLIC'}
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{system.name}</h3>
                    <p className="text-sm uppercase tracking-[0.2em] text-nexus-gold mb-3">{system.subtitle}</p>
                    <p className="text-nexus-gray-300 leading-relaxed">{system.description}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/systems" className="text-sm font-semibold text-nexus-gold hover:text-white">
                    Explore system →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/systems">
            <button className="btn btn-secondary">View All Systems</button>
          </Link>
        </div>
      </motion.section>
    </Layout>
  );
}
