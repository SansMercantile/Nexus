import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { fadeInUp, staggerContainer, itemVariants } from '@/lib/animations';
import { PRIV_PRODUCT_SEO } from '@/lib/seo-meta';

type ProductKey = keyof typeof PRIV_PRODUCT_SEO;

interface ProductFeature {
  title: string;
  description: string;
}

interface ProductConfig {
  name: string;
  eyebrow: string;
  headline: string;
  intro: string;
  features: ProductFeature[];
  platforms: string[];
  primaryCta: { label: string; href: string; external: boolean };
  secondaryCta: { label: string; href: string };
  stats?: { value: string; label: string }[];
}

const PRODUCTS: Record<ProductKey, ProductConfig> = {
  privCore: {
    name: 'Priv Core',
    eyebrow: 'Priv Product · Autonomous Trading Desk',
    headline: 'Test the idea before you trust it. Keep control of your funds.',
    intro:
      'Priv Core is an autonomous trading desk and AI trading terminal: strategy backtesting on real candles, a 24/7 market watch across indices, synthetics, commodities and shares, and seven timeframes — from one minute to one day — all in one app. Funds never leave your own broker: you connect through official broker authorisation, orders are placed in your name, and you can disconnect in one tap.',
    features: [
      {
        title: 'Strategy Backtesting',
        description: 'Backtest strategies on real candles across 7 timeframes, from 1 minute to 1 day.',
      },
      {
        title: '24/7 Market Watch',
        description: 'Live watch across indices, synthetics, commodities and shares, around the clock.',
      },
      {
        title: 'Full Custody Control',
        description: 'Funds never leave your own broker. Orders are placed in your name; disconnect in one tap.',
      },
      {
        title: 'One Account, Six Platforms',
        description: 'Web, Windows, macOS, Linux, Android and iOS — one account across all six.',
      },
      {
        title: 'Free Tier, No Card',
        description: 'Start free with no card required. Paid plans are available when you are ready.',
      },
      {
        title: 'Risk Disclosure Up Front',
        description: 'Priv holds no client funds and stores no broker credentials in the clear. Software, not advice.',
      },
    ],
    platforms: ['Web', 'Windows', 'macOS', 'Linux', 'Android', 'iOS'],
    primaryCta: { label: 'Start Now — Free', href: 'https://priv.sansmercantile.com', external: true },
    secondaryCta: { label: 'Read the Press Release', href: '/media/press/priv-core-launch' },
    stats: [
      { value: '152', label: 'Backtest runs completed' },
      { value: '45+', label: 'Strategy boards' },
      { value: '7', label: 'Timeframes' },
    ],
  },
  privPhilanthropy: {
    name: 'Priv Philanthropy',
    eyebrow: 'Priv Product · Giving & Impact',
    headline: 'Transparent giving, tracked impact, philanthropic wealth with a conscience.',
    intro:
      'Priv Philanthropy is giving and social-impact capital through Priv: transparent donation rails, cause portfolios and impact tracking for philanthropic wealth. Live now at privphil.sansmercantile.com — mobile clients are on the way.',
    features: [
      {
        title: 'Transparent Donation Rails',
        description: 'See exactly where money goes, from pledge to payout, in one view.',
      },
      {
        title: 'Cause Portfolios',
        description: 'Allocate across causes the way you would across assets — with clear reporting.',
      },
      {
        title: 'Impact Tracking',
        description: 'Measure outcomes over time, not just amounts sent.',
      },
      {
        title: 'Live on Web Today',
        description: 'Available now in the browser; iOS and Android clients follow soon.',
      },
    ],
    platforms: ['Web', 'iOS', 'Android'],
    primaryCta: {
      label: 'Start Giving',
      href: 'https://privphil.sansmercantile.com',
      external: true,
    },
    secondaryCta: { label: 'Explore Priv', href: '/priv' },
  },
};

export default function PrivProductPage({ product }: { product: ProductKey }) {
  const seo = PRIV_PRODUCT_SEO[product];
  const config = PRODUCTS[product];

  return (
    <Layout>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} key="description" />
        <link rel="canonical" href={seo.canonical} />

        <meta property="og:title" content={seo.title} key="og:title" />
        <meta property="og:description" content={seo.description} key="og:description" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:url" content={seo.canonical} key="og:url" />
        <meta property="og:image" content={seo.ogImage} key="og:image" />
        <meta property="og:site_name" content="Sans Mercantile" key="og:site_name" />

        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:title" content={seo.title} key="twitter:title" />
        <meta name="twitter:description" content={seo.description} key="twitter:description" />
        <meta name="twitter:image" content={seo.ogImage} key="twitter:image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema) }}
        />
      </Head>

      {/* Hero */}
      <section className="pt-40 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4 inline-block">
              {config.eyebrow}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
              {config.headline}
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mb-8">{config.intro}</p>

            <div className="flex flex-wrap gap-4">
              {config.primaryCta.external ? (
                <a
                  href={config.primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  {config.primaryCta.label}
                </a>
              ) : (
                <Link
                  href={config.primaryCta.href}
                  className="px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  {config.primaryCta.label}
                </Link>
              )}
              <Link
                href={config.secondaryCta.href}
                className="px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors"
              >
                {config.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats (if any) */}
      {config.stats && (
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {config.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-8 text-center"
                >
                  <p className="text-4xl font-bold text-nexus-gold mb-2">{stat.value}</p>
                  <p className="text-nexus-gray-300 text-sm uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 border-t border-nexus-accent/20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-10"
          >
            What {config.name} does
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {config.features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-8"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-nexus-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-10">
            <h2 className="text-2xl font-bold text-white mb-6">Available on</h2>
            <div className="flex flex-wrap gap-3">
              {config.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-4 py-2 rounded-full border border-nexus-gold/40 text-nexus-gold text-sm font-medium"
                >
                  {platform}
                </span>
              ))}
            </div>
            <p className="text-nexus-gray-400 text-sm mt-6">
              {config.name} is part of the{' '}
              <Link href="/priv" className="text-nexus-gold hover:text-nexus-accent transition-colors">
                Priv
              </Link>{' '}
              system by Sans Mercantile.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 border-t border-nexus-accent/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start with {config.name}?</h2>
          <p className="text-nexus-gray-300 mb-8">{seo.description}</p>
          {config.primaryCta.external ? (
            <a
              href={config.primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
            >
              {config.primaryCta.label}
            </a>
          ) : (
            <Link
              href={config.primaryCta.href}
              className="inline-block px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
            >
              {config.primaryCta.label}
            </Link>
          )}
        </div>
      </section>
    </Layout>
  );
}
