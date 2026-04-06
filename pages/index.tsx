import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { fadeInUp } from '../lib/animations';
import { COMPANY_INFO } from '../lib/constants';

export default function Home() {
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

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Faded Dual Core Circles Behind Text */}
          {/* Left Circle - AI (Cyan) */}
          <motion.div
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0 }}
            className="absolute left-1/2 top-1/2 transform -translate-x-full -translate-y-1/2 w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.08), rgba(0, 229, 255, 0.01))',
              boxShadow: '0 0 60px rgba(0, 229, 255, 0.12)',
              zIndex: -1
            }}
          />
          
          {/* Right Circle - AGI (Gold) */}
          <motion.div
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.8 }}
            className="absolute right-0 top-1/2 transform translate-x-1/4 -translate-y-1/2 w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.01))',
              boxShadow: '0 0 60px rgba(212, 175, 55, 0.12)',
              zIndex: -1
            }}
          />

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight uppercase leading-tight"
          >
            <span className="gradient-text-hero">Sans Mercantile</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-4 text-xl md:text-2xl font-light tracking-widest text-[#00E5FF] mb-8"
          >
            Reimagine • Rebuild • Transcend
          </motion.p>

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
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-constellation">The Constellation</h2>
          <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto mb-8">
            21 autonomous systems working in perfect harmony — Explore the core systems that power modern finance, healthcare, defense, energy, and next-generation sovereign AI infrastructure.
          </p>
          <Link href="/systems">
            <button className="btn btn-secondary">Explore All Systems</button>
          </Link>
        </div>
      </motion.section>
    </Layout>
  );
}
