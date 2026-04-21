import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/Layout';
import { getAllSystems, getSystemBySlug, SystemData } from '@repo/constellation';

interface SystemPageProps {
  system: SystemData;
}

export default function SystemDocPage({ system }: SystemPageProps) {
  return (
    <Layout>
      <Head>
        <title>{system.name} System Docs - Sans Mercantile</title>
        <meta
          name="description"
          content={`${system.name} — ${system.subtitle} for the Sans Mercantile Constellation`}
        />
      </Head>

      <div className=" pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-nexus-gold mb-3">Constellation System</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{system.name}</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">{system.subtitle}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] mb-16">
            <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
              <h2 className="text-3xl font-semibold text-white mb-4">Overview</h2>
              <p className="text-nexus-gray-300 leading-8 mb-6">{system.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-nexus-dark/80 p-5 border border-nexus-gold/10">
                  <h3 className="text-lg font-semibold text-nexus-gold mb-2">Mission</h3>
                  <p className="text-nexus-gray-300">{system.mission}</p>
                </div>
                <div className="rounded-2xl bg-nexus-dark/80 p-5 border border-nexus-gold/10">
                  <h3 className="text-lg font-semibold text-nexus-gold mb-2">Vision</h3>
                  <p className="text-nexus-gray-300">{system.vision}</p>
                </div>
              </div>
            </div>

            <aside className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
              <h3 className="text-2xl font-semibold text-white mb-5">Core values</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                {system.values.map((value) => (
                  <li key={value} className="rounded-2xl bg-nexus-dark/80 p-4 border border-nexus-gold/10">
                    {value}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <section className="grid gap-8 lg:grid-cols-2 mb-16">
            <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
              <h3 className="text-2xl font-semibold text-white mb-5">Key features</h3>
              <div className="space-y-4 text-nexus-gray-300">
                {system.features?.map((feature) => (
                  <div key={feature.title} className="rounded-2xl bg-nexus-dark/80 p-5 border border-nexus-gold/10">
                    <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                ))}
                {!system.features?.length && <p>No feature details available yet.</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
              <h3 className="text-2xl font-semibold text-white mb-5">Pricing & plans</h3>
              <div className="space-y-4">
                {system.pricing?.map((tier) => (
                  <div key={tier.name} className="rounded-2xl bg-nexus-dark/80 p-5 border border-nexus-gold/10">
                    <div className="flex items-center justify-between mb-3 gap-4">
                      <h4 className="font-semibold text-white">{tier.name}</h4>
                      <span className="text-nexus-gold font-bold">${tier.price.toLocaleString()}</span>
                    </div>
                    <p className="text-nexus-gray-300 mb-3">{tier.description}</p>
                    <ul className="space-y-2 text-nexus-gray-300 mb-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="text-nexus-gold">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="rounded-full border border-nexus-gold px-4 py-2 text-sm font-semibold text-white hover:bg-nexus-gold/10 transition">
                      {tier.cta}
                    </button>
                  </div>
                ))}
                {!system.pricing?.length && <p className="text-nexus-gray-300">Pricing details will be available soon.</p>}
              </div>
            </div>
          </section>

          <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/90 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-nexus-gray-300">
                Explore the complete constellation and discover how each system powers the broader platform.
              </p>
              <Link href="/docs" className="text-nexus-blue hover:text-white font-semibold">
                Back to documentation index
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const excludedSlugs = ['anubis', 'kev', 'mf', 'mpeti', 'omega', 'primo', 'sia'];
  const systems = getAllSystems().filter((system) => !excludedSlugs.includes(system.id));

  return {
    paths: systems.map((system) => ({ params: { system: system.id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<SystemPageProps> = async ({ params }) => {
  const systemSlug = typeof params?.system === 'string' ? params.system : '';
  const system = getSystemBySlug(systemSlug);

  if (!system) {
    return { notFound: true };
  }

  return {
    props: { system },
  };
};
