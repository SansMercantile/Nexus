import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';
import { getAllCaseStudies, getCaseStudyBySystem, CaseStudy } from '../../lib/case-studies';
import { getSystemBySlug } from '../../lib/system-data';

interface CaseStudyPageProps {
  study: CaseStudy;
}

export default function CaseStudyPage({ study }: CaseStudyPageProps) {
  const system = getSystemBySlug(study.systemId);

  return (
    <Layout>
      <Head>
        <title>{study.title} - Sans Mercantile Case Study</title>
        <meta name="description" content={study.overview} />
      </Head>

      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-nexus-gold mb-3">Case Study</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{study.title}</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl">{study.subtitle}</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_0.45fr] mb-16">
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="space-y-8">
              <section className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-10">
                <h2 className="text-3xl font-semibold text-white mb-4">Overview</h2>
                <p className="text-nexus-gray-300 leading-8">{study.overview}</p>
              </section>

              <section className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-10">
                <h2 className="text-3xl font-semibold text-white mb-4">Challenge</h2>
                <p className="text-nexus-gray-300 leading-8">{study.challenge}</p>
              </section>

              <section className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-10">
                <h2 className="text-3xl font-semibold text-white mb-4">Solution</h2>
                <p className="text-nexus-gray-300 leading-8">{study.solution}</p>
              </section>

              <section className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-10">
                <h2 className="text-3xl font-semibold text-white mb-4">Results</h2>
                <ul className="list-disc list-inside space-y-3 text-nexus-gray-300">
                  {study.results.map((result, idx) => (
                    <li key={idx}>{result}</li>
                  ))}
                </ul>
              </section>
            </motion.div>

            <motion.aside variants={fadeInUp} initial="initial" animate="animate" className="space-y-6">
              <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">System</h3>
                <p className="text-nexus-gold font-semibold text-xl mb-2">{system?.name ?? study.systemId}</p>
                <p className="text-nexus-gray-300">{system?.subtitle ?? ''}</p>
              </div>

              <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Industry</h3>
                <p className="text-nexus-gray-300">{study.industry}</p>
              </div>

              <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Impact Metrics</h3>
                <div className="space-y-4">
                  {study.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl bg-nexus-dark/80 p-4 border border-nexus-gold/10">
                      <p className="text-sm text-nexus-gray-400">{metric.label}</p>
                      <p className="text-white font-semibold">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Executive Quote</h3>
                <p className="text-nexus-gray-300 italic">“{study.quote}”</p>
              </div>
            </motion.aside>
          </div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate" className="text-center">
            <Link href="/case-studies">
              <button className="btn btn-secondary">Back to Case Studies</button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const caseStudies = getAllCaseStudies();

  return {
    paths: caseStudies.map((study) => ({ params: { system: study.systemId } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<CaseStudyPageProps> = async ({ params }) => {
  const systemId = typeof params?.system === 'string' ? params.system : '';
  const study = getCaseStudyBySystem(systemId);

  if (!study) {
    return { notFound: true };
  }

  return {
    props: { study },
  };
};
