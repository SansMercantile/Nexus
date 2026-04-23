import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';
import { COMPANY_INFO } from '@/lib/constants';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - {COMPANY_INFO.tagline}</title>
        <meta name="description" content={COMPANY_INFO.description} />
        <meta property="og:title" content="Sans Mercantile Constellation" />
        <meta property="og:description" content={COMPANY_INFO.tagline} />
      </Head>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background Grid */}
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
          <Link href="/portal">
            <button className="btn btn-primary">Web Portal</button>
          </Link>
          <Link href="/docs">
            <button className="btn btn-secondary">Documentation</button>
          </Link>
        </div>
      </motion.section>
    </Layout>
  );
}
