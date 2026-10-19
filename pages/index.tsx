import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';
import { COMPANY_INFO } from '@/lib/constants';
import { BEDROCK_MODEL } from '@/lib/bedrock-client';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Sans Mercantile | AI-Driven Global Trade & Predictive Analytics</title>
        <meta name="description" content="Sans Mercantile is a constellation of 21 autonomous AI systems redefining global commerce, governance, and institutional architecture. Registered in South Africa (CIPC Reg No: K20255335)." key="description" />
        <meta name="keywords" content="AI Constellation, Predictive Analytics, Global Trade, Autonomous Systems, Fintech, Healthtech, Institutional Architecture, Sans Mercantile, CIPC K20255335" />
        <meta property="og:title" content="Sans Mercantile | Reimagine • Rebuild • Transcend" key="og:title" />
        <meta property="og:description" content="A network of autonomous, intelligent systems enabling global commerce, governance, and innovation." key="og:description" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:url" content="https://www.sansmercantile.com" key="og:url" />
        <meta property="og:image" content="https://www.sansmercantile.com/media/social-cover-hero.png" key="og:image" />
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:title" content="Sans Mercantile | AI-Driven Global Trade" key="twitter:title" />
        <meta name="twitter:description" content="Redefining global commerce through a constellation of 21 autonomous AI systems." key="twitter:description" />
        <meta name="twitter:image" content="https://www.sansmercantile.com/media/social-cover-hero.png" key="twitter:image" />
      </Head>

      {/* Priv Core Announcement Modal */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center pointer-events-auto"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-[var(--burgundy)] mb-4">Priv Core is now available</h3>
            <p className="text-gray-700 mb-6">
              An autonomous trading desk and AI trading terminal built for traders who want to test strategies and keep full custody of their funds. Start free, no card required.
            </p>
            <div className="flex gap-3">
              <a
                href="https://priv.sansmercantile.com"
                className="flex-1 bg-[var(--burgundy)] text-white font-bold py-3 rounded text-center hover:opacity-90 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start Now
              </a>
              <Link href="/systems" className="flex-1 border border-[var(--burgundy)] text-[var(--burgundy)] font-bold py-3 rounded text-center hover:bg-[var(--burgundy)] hover:text-white transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 grid-background opacity-20" />
        <div className="absolute inset-0 grid-background opacity-20" />

        {/* Glow Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-nexus-accent pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-nexus-gold pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black mb-6 gradient-text"
          >
            Sans Mercantile
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-2xl md:text-4xl text-white/80 mb-8 font-light"
          >
            {COMPANY_INFO.tagline}
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-white/60 mb-12 max-w-2xl mx-auto"
          >
            {COMPANY_INFO.description}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex gap-4 justify-center flex-wrap"
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

      {/* Systems Preview */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          The Constellation
        </h2>

        <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
          21 autonomous systems working in perfect harmony to drive innovation across all sectors
        </p>

        <div className="text-center">
          <Link href="/systems">
            <button className="btn btn-primary">
              View All Systems
            </button>
          </Link>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20 text-center border-t border-nexus-accent/20"
      >
        <h2 className="text-4xl font-bold mb-6">Ready to Join the Constellation?</h2>
        <p className="text-xl text-white/70 mb-8">
          Access our web portal or explore individual systems
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://www.sansmercantile.com/portal" target="_blank" rel="noopener noreferrer">
            <button className="btn btn-primary">Web Portal</button>
          </a>
          <a href="https://www.sansmercantile.com/docs" target="_blank" rel="noopener noreferrer">
            <button className="btn btn-secondary">Documentation</button>
          </a>
        </div>
      </motion.section>
    </Layout>
  );
}
