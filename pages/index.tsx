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
          {/* Dual Core Circles */}
          <div className="relative h-64 mb-12 flex items-center justify-center">
            {/* Left Circle - AI (Cyan) */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              className="absolute left-1/4 top-8 w-24 h-24 rounded-full border-2 border-[#00E5FF] bg-[#00E5FF]/10 flex items-center justify-center"
            >
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#00E5FF" strokeWidth="1"/>
                <circle cx="30" cy="30" r="8" fill="#00E5FF" opacity="0.3"/>
                <circle cx="70" cy="30" r="8" fill="#00E5FF" opacity="0.3"/>
                <circle cx="50" cy="70" r="8" fill="#00E5FF" opacity="0.3"/>
                <line x1="30" y1="30" x2="50" y2="70" stroke="#00E5FF" strokeWidth="0.5" opacity="0.3"/>
                <line x1="70" y1="30" x2="50" y2="70" stroke="#00E5FF" strokeWidth="0.5" opacity="0.3"/>
              </svg>
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="text-[#00E5FF] font-bold text-lg z-10"
              >
                AI
              </motion.span>
            </motion.div>

            {/* Right Circle - AGI (Gold) */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute right-1/4 bottom-8 w-24 h-24 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center"
            >
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#D4AF37" strokeWidth="1"/>
                <circle cx="30" cy="30" r="8" fill="#D4AF37" opacity="0.3"/>
                <circle cx="70" cy="30" r="8" fill="#D4AF37" opacity="0.3"/>
                <circle cx="50" cy="70" r="8" fill="#D4AF37" opacity="0.3"/>
                <line x1="30" y1="30" x2="50" y2="70" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3"/>
                <line x1="70" y1="30" x2="50" y2="70" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3"/>
              </svg>
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="text-[#D4AF37] font-bold text-lg z-10"
              >
                AGI
              </motion.span>
            </motion.div>

            {/* Neural connection line between cores */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 2px rgba(0, 229, 255, 0.1))' }}>
              <motion.path
                d="M 25% 40% Q 50% 50%, 75% 60%"
                stroke="#00E5FF"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
                strokeDasharray="100"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.path
                d="M 75% 60% Q 50% 50%, 25% 40%"
                stroke="#D4AF37"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
                strokeDasharray="100"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
            </svg>
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
