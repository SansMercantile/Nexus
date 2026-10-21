import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';

const PAGE_URL = 'https://www.sansmercantile.com/media/press/priv-core-launch/';
const OG_IMAGE = 'https://www.sansmercantile.com/press/priv-core-iphone-duo.png';
const PAGE_TITLE =
  'Sans Mercantile launches Priv Core, an autonomous trading desk, in South Africa';
const PAGE_DESCRIPTION =
  'Start free, no card required. Strategy backtesting, 24/7 market watch and full custody control in one app. Priv Core is available in South Africa from 19 October 2026.';

const PAGE_KEYWORDS =
  'Priv Core launch, autonomous trading desk South Africa, AI trading terminal, algorithmic trading South Africa, strategy backtesting app, Sans Mercantile press release, AI trading platform Cape Town';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.sansmercantile.com/' },
    { '@type': 'ListItem', position: 2, name: 'Media', item: 'https://www.sansmercantile.com/media/' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Press Releases',
      item: 'https://www.sansmercantile.com/media/press/',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Sans Mercantile launches Priv Core, an autonomous trading desk, in South Africa',
      item: PAGE_URL,
    },
  ],
};

const newsArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  datePublished: '2026-10-19',
  dateModified: '2026-10-19',
  image: [OG_IMAGE],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': PAGE_URL,
  },
  author: {
    '@type': 'Organization',
    name: 'Sans Mercantile',
    url: 'https://www.sansmercantile.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Sans Mercantile',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.sansmercantile.com/logo.svg',
    },
  },
  locationCreated: {
    '@type': 'Place',
    name: 'Cape Town, South Africa',
  },
};

const notesToEditors = [
  'Priv Core is a separate product from Priv Pay.',
  'Images, screenshots and logos are available on request. Screenshots must be unaltered and carry the risk disclosure.',
  'Interviews: Mezzoforte Privilège is available on request. Contact Swell to arrange.',
];

export default function PrivCoreLaunchPressRelease() {
  return (
    <Layout>
      <Head>
        <title>{PAGE_TITLE} | Sans Mercantile Press Release</title>
        <meta name="description" content={PAGE_DESCRIPTION} key="description" />
        <meta name="keywords" content={PAGE_KEYWORDS} />
        <meta name="news_keywords" content="Priv Core, Sans Mercantile, autonomous trading desk, AI trading terminal, South Africa" />
        <link rel="canonical" href={PAGE_URL} />

        <meta property="og:title" content={PAGE_TITLE} key="og:title" />
        <meta property="og:description" content={PAGE_DESCRIPTION} key="og:description" />
        <meta property="og:type" content="article" key="og:type" />
        <meta property="og:url" content={PAGE_URL} key="og:url" />
        <meta property="og:image" content={OG_IMAGE} key="og:image" />
        <meta property="og:site_name" content="Sans Mercantile" key="og:site_name" />
        <meta property="og:locale" content="en_ZA" />
        <meta property="article:published_time" content="2026-10-19" />
        <meta property="article:section" content="Press Release" />
        <meta property="article:tag" content="Priv Core" />

        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:title" content={PAGE_TITLE} key="twitter:title" />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} key="twitter:description" />
        <meta name="twitter:image" content={OG_IMAGE} key="twitter:image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <div className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-nexus-gold/20">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">
                  Press Release
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-nexus-gray-500 mb-2">
                  Issued by Swell PR &amp; Communications
                </p>
                <p className="text-sm uppercase tracking-[0.2em] text-white font-semibold">
                  For Immediate Release:{' '}
                  <span className="text-nexus-gray-300 font-normal normal-case tracking-normal">
                    19 October 2026, 10:00 AM
                  </span>
                </p>
              </div>
              <div className="text-sm text-nexus-gray-400 md:text-right">
                <p>
                  Date: <span className="text-nexus-gray-200">19 October 2026</span>
                </p>
                <p>
                  Location: <span className="text-nexus-gray-200">Cape Town, South Africa</span>
                </p>
                <p>
                  Media contact:{' '}
                  <a
                    href="mailto:hello@swellprcomm.com"
                    className="text-nexus-gold hover:text-nexus-accent transition-colors"
                  >
                    hello@swellprcomm.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-16"
          >
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Sans Mercantile launches Priv Core, an autonomous trading desk, in South Africa
                </h1>
                <p className="text-xl text-nexus-gray-300 max-w-3xl">
                  Start free, no card required. Strategy backtesting, 24/7 market watch and full
                  custody control in one app.
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-nexus-gold/20">
                <img
                  src="/press/priv-core-iphone-duo.png"
                  alt="Priv Core on tablet and iPhone — strategy backtesting and 24/7 market watch at priv.sansmercantile.com"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl space-y-12 mb-16"
          >
            <div className="prose prose-invert max-w-none text-nexus-gray-200">
                <p>
                  <strong className="text-white">
                    Cape Town, South Africa, 19 October 2026
                  </strong>{' '}
                  — Sans Mercantile today launched Priv Core, an autonomous trading desk and AI
                  trading terminal built for traders who want to test their strategies and keep
                  control of their own funds. Priv Core is available in South Africa from today,
                  with a free tier that needs no card to start.
                </p>
                <p>
                  Priv Core combines strategy backtesting on real candles, a 24/7 market watch
                  across indices, synthetics, commodities and shares, and seven timeframes from
                  one minute to one day, all in one app. Funds never leave the user&apos;s own
                  broker: users connect through official broker authorisation, orders are placed
                  in their own name, and they can disconnect in one tap. Priv holds no client
                  funds.
                </p>
                <p>
                  Priv Core is available on web, Windows, macOS, Linux, Android and iOS, with one
                  account across all six. To date, Priv Core has completed 152 backtest runs
                  across more than 45 strategy boards and 7 timeframes.
                </p>

                <blockquote className="not-italic border-l-4 border-nexus-gold pl-6 my-8">
                  <p className="text-2xl text-white font-medium">
                    &ldquo;Traders should be able to test an idea before they trust it, and keep
                    control of their own funds. That is what Priv Core is built to do.&rdquo;
                  </p>
                  <footer className="text-nexus-gold text-sm uppercase tracking-wider mt-3">
                    Mezzoforte Privilège, CEO, Sans Mercantile
                  </footer>
                </blockquote>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Availability and pricing</h2>
              <p className="text-nexus-gray-300 leading-relaxed mb-5">
                Priv Core can be started free at priv.sansmercantile.com, with no card required.
                Paid plans are also available. Details are at priv.sansmercantile.com.
              </p>
              <a
                href="https://priv.sansmercantile.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
              >
                Go to Priv Core
              </a>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Risk disclosure</h2>
              <p className="text-nexus-gray-300 leading-relaxed mb-4">
                <strong className="text-white">Trading involves risk.</strong> Past performance
                is not indicative of future results. Priv holds no client funds and stores no
                broker credentials in the clear. Priv is software; nothing it produces is
                investment advice.
              </p>
              <p className="text-nexus-gray-300 leading-relaxed">
                Full disclosure:{' '}
                <a
                  href="https://priv.sansmercantile.com/risk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nexus-gold hover:text-nexus-accent transition-colors"
                >
                  priv.sansmercantile.com/risk
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">About Priv Core</h2>
              <p className="text-nexus-gray-300 leading-relaxed">
                Priv Core is an autonomous trading desk by Sans Mercantile: strategy
                backtesting, market watch and full custody control in one app. Funds never
                leave the user&apos;s own broker.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">About Sans Mercantile</h2>
              <p className="text-nexus-gray-300 leading-relaxed">
                Sans Mercantile is a South African-registered, AI-driven global trade and
                fintech company. It builds a constellation of 21 specialised, autonomous
                systems designed to support global commerce, governance and innovation, each
                able to operate on its own or together with the others. Sans Mercantile is led
                by founder and Chief Executive Officer Mezzoforte Privilège and is
                registered with the Companies and Intellectual Property Commission (CIPC)
                under registration number K2025537335. For more information, visit{' '}
                <a
                  href="https://www.sansmercantile.com"
                  className="text-nexus-gold hover:text-nexus-accent transition-colors"
                >
                  sansmercantile.com
                </a>
                .
              </p>
            </section>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Media contacts</h2>
            <div className="grid gap-8 md:grid-cols-2 text-nexus-gray-300">
              <div>
                <p className="text-white font-semibold mb-2">Sans Mercantile press</p>
                <p>
                  <a
                    href="mailto:press@sansmercantile.com"
                    className="text-nexus-gold hover:text-nexus-accent transition-colors"
                  >
                    press@sansmercantile.com
                  </a>
                </p>
              </div>
              <div>
                <p className="text-white font-semibold mb-2">
                  Swell PR &amp; Communications
                </p>
                <p>Pascaline Khoza</p>
                <p>
                  <a
                    href="mailto:hello@swellprcomm.com"
                    className="text-nexus-gold hover:text-nexus-accent transition-colors"
                  >
                    hello@swellprcomm.com
                  </a>
                </p>
                <p>
                  <a href="tel:+27695617666" className="hover:text-nexus-accent transition-colors">
                    +27 69 561 7666
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="max-w-3xl mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Notes to editors</h2>
            <ul className="space-y-4 text-nexus-gray-300 leading-relaxed">
              {notesToEditors.map((note) => (
                <li key={note} className="flex gap-4">
                  <span className="text-nexus-gold mt-1" aria-hidden="true">
                    ▪
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mt-16"
          >
            <Link href="/media/press">
              <button className="px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors">
                All Press Releases
              </button>
            </Link>
            <Link href="/priv">
              <button className="px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                Explore Priv
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
