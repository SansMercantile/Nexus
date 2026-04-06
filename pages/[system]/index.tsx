import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { SystemHero } from '@/components/systems/SystemHero';
import { AnimatedIcon, featureIcons } from '@/components/AnimatedIcons';
import { getSystemBySlug } from '@/lib/system-data';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { useRouter } from 'next/router';

export default function SystemPage() {
  const router = useRouter();
  const { system } = router.query;

  if (!system || typeof system !== 'string') {
    return null;
  }

  const systemData = getSystemBySlug(system);

  if (!systemData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold">System not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{systemData.name} - Sans Mercantile</title>
        <meta name="description" content={systemData.description} />
      </Head>

      {/* Hero Section */}
      <SystemHero
        id={systemData.id}
        name={systemData.name}
        subtitle={systemData.subtitle}
        color={systemData.color}
        face={systemData.face}
      />

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Vision & Mission */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: systemData.color }}>
              Vision
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              {systemData.vision}
            </p>

            <h2 className="text-3xl font-bold mb-4" style={{ color: systemData.color }}>
              Mission
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              {systemData.mission}
            </p>
          </motion.div>

          {/* Values */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-8" style={{ color: systemData.color }}>
              Core Values
            </h2>

            <motion.div
              variants={staggerContainer}
              className="space-y-4"
            >
              {systemData.values.map((value, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="p-4 rounded-lg border-l-4 bg-white/5"
                  style={{ borderColor: systemData.color }}
                >
                  <h3 className="font-semibold text-lg mb-1">{value}</h3>
                  <p className="text-white/60 text-sm">
                    Core value driving {systemData.name} operations
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20 border-t border-nexus-accent/20"
      >
        <h2 className="text-4xl font-bold mb-12 gradient-text">Features</h2>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: 'rocket' as const, title: 'Advanced Technology', desc: 'Cutting-edge AI and automation' },
            { icon: 'lock' as const, title: 'Enterprise Security', desc: 'Bank-grade security protocols' },
            { icon: 'lightning' as const, title: 'High Performance', desc: 'Lightning-fast response times' },
            { icon: 'globe' as const, title: 'Global Scale', desc: 'Operates across all markets' },
            { icon: 'chart' as const, title: 'Real-time Analytics', desc: 'Live data and insights' },
            { icon: 'handshake' as const, title: 'Full Integration', desc: 'Seamless constellation integration' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="p-6 rounded-lg card hover:card-hover group transition-all duration-300"
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110 inline-block">
                <AnimatedIcon type={feature.icon} size={48} className="text-nexus-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 py-20 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-white/70 mb-8">
          Join thousands of organizations using {systemData.name}
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href={{
              pathname: '/contact',
              query: { subject: 'Free Trial', system: systemData.name },
            }}
          >
            <button
              className="btn btn-primary"
              style={{ backgroundColor: systemData.color, color: '#0a0e27' }}
            >
              Start Free Trial
            </button>
          </Link>
          <Link
            href={{
              pathname: '/contact',
              query: { subject: 'Schedule Demo', system: systemData.name },
            }}
          >
            <button className="btn btn-secondary">Schedule Demo</button>
          </Link>
        </div>
      </motion.section>
    </Layout>
  );
}
