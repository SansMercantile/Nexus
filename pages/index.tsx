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
          {/* Big Overlapping Dual Core Circles */}
          <div className="relative w-full h-96 flex items-center justify-center mb-8 overflow-hidden">
            {/* Left Circle - AI (Cyan) - positioned higher */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0 }}
              className="absolute w-96 h-96 rounded-full border-4 border-[#00E5FF] flex items-center justify-center"
              style={{
                left: '5%',
                top: '-15%',
                background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.4), rgba(0, 229, 255, 0.05))',
                boxShadow: '0 0 100px rgba(0, 229, 255, 0.8), inset 0 0 100px rgba(0, 229, 255, 0.3)'
              }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#00E5FF" strokeWidth="0.8"/>
                <circle cx="50" cy="50" r="35" fill="none" stroke="#00E5FF" strokeWidth="0.5" opacity="0.6"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="#00E5FF" strokeWidth="0.4" opacity="0.4"/>
              </svg>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
                className="text-[#00E5FF] font-bold text-6xl z-10 drop-shadow-lg"
              >
                AI
              </motion.span>
            </motion.div>

            {/* Right Circle - AGI (Gold) - positioned lower and overlapping */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.8 }}
              className="absolute w-96 h-96 rounded-full border-4 border-[#D4AF37] flex items-center justify-center"
              style={{
                right: '5%',
                bottom: '-15%',
                background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0.05))',
                boxShadow: '0 0 100px rgba(212, 175, 55, 0.8), inset 0 0 100px rgba(212, 175, 55, 0.3)'
              }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="0.8"/>
                <circle cx="50" cy="50" r="35" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="#D4AF37" strokeWidth="0.4" opacity="0.4"/>
              </svg>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                className="text-[#D4AF37] font-bold text-6xl z-10 drop-shadow-lg"
              >
                AGI
              </motion.span>
            </motion.div>
          </div>

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
