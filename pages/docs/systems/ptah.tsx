import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

const PAGE_URL = 'https://www.sansmercantile.com/docs/systems/ptah/';
const PAGE_TITLE = 'Ptah Docs — AI Construction Project Management | Sans Mercantile';
const PAGE_DESCRIPTION =
  'Ptah by Sans Mercantile: AI-driven building and infrastructure management. Documentation for project management, safety systems, budget optimization, quality assurance and BIM integration.';

export default function PtahPage() {
  return (
    <Layout>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} key="description" />
        <meta
          name="keywords"
          content="Ptah, construction project management software South Africa, AI construction management, construction safety monitoring, budget optimization software, building information management"
        />
        <link rel="canonical" href={PAGE_URL} key="canonical" />
        <meta property="og:title" content={PAGE_TITLE} key="og:title" />
        <meta property="og:description" content={PAGE_DESCRIPTION} key="og:description" />
        <meta property="og:type" content="article" key="og:type" />
        <meta property="og:url" content={PAGE_URL} key="og:url" />
        <meta property="og:image" content="https://www.sansmercantile.com/media/social-cover-hero.png" key="og:image" />
        <meta property="og:site_name" content="Sans Mercantile" key="og:site_name" />
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:title" content={PAGE_TITLE} key="twitter:title" />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} key="twitter:description" />
        <meta name="twitter:image" content="https://www.sansmercantile.com/media/social-cover-hero.png" key="twitter:image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TechArticle',
              headline: PAGE_TITLE,
              description: PAGE_DESCRIPTION,
              url: PAGE_URL,
              inLanguage: 'en-ZA',
              author: { '@type': 'Organization', name: 'Sans Mercantile', url: 'https://www.sansmercantile.com/' },
              publisher: { '@type': 'Organization', name: 'Sans Mercantile', url: 'https://www.sansmercantile.com/' },
            }),
          }}
        />
      </Head>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">Ptah - Building & Infrastructure Management</h1>
            <p className="text-xl text-gray-300">AI-driven construction with project management, safety, and optimization.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-6">Core Capabilities</h2>
            <ul className="text-gray-300 space-y-3 text-lg">
              <li>✓ Project management and scheduling</li>
              <li>✓ Safety systems</li>
              <li>✓ Budget optimization</li>
              <li>✓ Quality assurance</li>
              <li>✓ Equipment tracking and maintenance</li>
              <li>✓ Building information management</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-semibold text-white mb-6">Vision</h2>
            <p className="text-gray-300 text-lg">Ptah revolutionizes construction through AI-powered project management and safety systems, delivering projects on time and within budget.</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
