import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { getSystemBySlug } from '@/lib/system-data';
import { fadeInUp } from '@/lib/animations';
import { useRouter } from 'next/router';

export default function SystemAbout() {
  const router = useRouter();
  const { system } = router.query;

  if (!system || typeof system !== 'string') {
    return null;
  }

  const systemData = getSystemBySlug(system);
  const features = systemData?.features || [];
  const values = systemData?.values || [];

  if (!systemData) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>About {systemData.name} - Sans Mercantile</title>
      </Head>

      <div className="max-w-4xl mx-auto px-6 py-20 pt-32">
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            About {systemData.name}
          </h1>

          <p className="text-xl text-white/70 leading-relaxed mb-8">
            {systemData.description}
          </p>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <div className="bg-white/5 border border-nexus-accent/30 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">What sets {systemData.name} apart</h2>
              <p className="text-nexus-gray-300 leading-relaxed">
                {systemData.name} combines domain-specific autonomy with secure orchestration to deliver outcome-focused capabilities for mission-critical workflows.
              </p>
            </div>
            <div className="bg-white/5 border border-nexus-accent/30 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Built for enterprise impact</h2>
              <ul className="space-y-3 text-nexus-gray-300">
                {values.map((value, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-nexus-gold">•</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-nexus-gold/20 bg-[#0b1225] p-10">
            <h2 className="text-3xl font-bold text-white mb-6">Core capabilities</h2>
            <div className="grid gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white/5 border border-nexus-gold/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-nexus-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
