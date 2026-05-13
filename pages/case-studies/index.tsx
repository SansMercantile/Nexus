import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { getAllCaseStudies } from '../../lib/case-studies';

export default function CaseStudiesIndex() {
  const caseStudies = getAllCaseStudies();

  return (
    <Layout>
      <Head>
        <title>Case Studies - Sans Mercantile</title>
        <meta
          name="description"
          content="Explore comprehensive system case studies from Sans Mercantile's AI consulting and autonomous platforms."
        />
      </Head>

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeInUp} initial="initial" animate="animate" className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-nexus-gold mb-3">Case Studies</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">System Success Stories</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Discover how each Sans Mercantile system has delivered measurable business impact and real-world outcomes.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-8 md:grid-cols-2">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.systemId}
                variants={fadeInUp}
                transition={{ delay: index * 0.05 }}
                className="group rounded-3xl border border-nexus-gold/20 bg-gradient-to-br from-[#111827] to-[#0b1225] p-8 hover:border-nexus-gold/40 transition-all duration-300"
              >
                <div className="mb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-nexus-gold mb-2">{study.industry}</p>
                  <h2 className="text-2xl font-bold text-white mb-3">{study.title}</h2>
                  <p className="text-nexus-gray-300">{study.subtitle}</p>
                </div>
                <p className="text-nexus-gray-400 mb-6">{study.overview}</p>
                <div className="grid gap-3">
                  {study.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl bg-nexus-dark/80 p-4 border border-nexus-gold/10">
                      <p className="text-sm text-nexus-gray-400">{metric.label}</p>
                      <p className="text-lg font-semibold text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href={`/case-studies/${study.systemId}`}>
                    <button className="btn btn-secondary">Read full case study</button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
