import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import type { SystemData } from '@/lib/constants';

/**
 * Shown instead of a system's real detail page (index/about/features/pricing) when
 * that system is write-restricted (Sobek, Anubis, Mpeti). Blocks direct URL access —
 * the systems grid already disables the "Learn More" link for these, but that alone
 * doesn't stop someone typing the URL directly, so each [system] page checks
 * systemData.badge?.tone === 'danger' and renders this instead of the real content.
 */
export function RestrictedSystemNotice({ systemData }: { systemData: SystemData }) {
  return (
    <Layout>
      <Head>
        <title>{systemData.name} | Restricted | Sans Mercantile</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center gold-panel rounded-2xl p-12">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-red-950/40 border border-red-400/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">{systemData.name} is Write Restricted</h1>
          <p className="text-nexus-gray-400 mb-8">
            This system&apos;s details aren&apos;t publicly accessible. You can see it listed on the
            systems page, but its full profile is restricted.
          </p>
          <Link
            href="/systems"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold
                     bg-gradient-to-r from-nexus-gold/20 to-nexus-gold/10 border border-nexus-gold/30
                     text-nexus-gold hover:from-nexus-gold/30 hover:to-nexus-gold/20 transition-all duration-300"
          >
            ← Back to Systems
          </Link>
        </div>
      </div>
    </Layout>
  );
}
