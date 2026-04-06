import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      items: [
        { name: 'Quick Start Guide', slug: 'getting-started/quick-start' },
        { name: 'Account Setup', slug: 'getting-started/account-setup' },
        { name: 'Dashboard Overview', slug: 'getting-started/dashboard' },
        { name: 'First Integration', slug: 'getting-started/first-integration' },
      ]
    },
    {
      title: 'System Guides',
      items: [
        { name: 'Priv Wealth Intelligence', slug: 'systems/priv' },
        { name: 'KEL Agricultural Systems', slug: 'systems/kel' },
        { name: 'Mezzo Governance Framework', slug: 'systems/mezzo' },
        { name: 'Brigit Legal Solutions', slug: 'systems/brigit' },
        { name: 'Anubis Verification', slug: 'systems/anubis' },
        { name: 'Omega Medical AI', slug: 'systems/omega' },
        { name: 'SIA Archetypal Intelligence', slug: 'systems/sia' },
        { name: 'KEV Educational Vectors', slug: 'systems/kev' },
        { name: 'Primo Temporal Manipulation', slug: 'systems/primo' },
        { name: 'MF Music AI', slug: 'systems/mf' },
        { name: 'MPeti Autonomous Developer', slug: 'systems/mpeti' },
        { name: 'Nexus Integration Hub', slug: 'systems/nexus' },
        { name: 'Quantum Financial Modeling', slug: 'systems/quantum' },
        { name: 'Bio-Enhancement Systems', slug: 'systems/bio' },
        { name: 'Climate Prediction Networks', slug: 'systems/climate' },
        { name: 'Autonomous Manufacturing', slug: 'systems/manufacturing' },
        { name: 'Space Resource Management', slug: 'systems/space' },
        { name: 'Neural Interface Technology', slug: 'systems/neural' },
        { name: 'Predictive Analytics Engine', slug: 'systems/analytics' },
        { name: 'Distributed Computing Grid', slug: 'systems/distributed' },
        { name: 'Ethical AI Governance', slug: 'systems/ethical' },
      ]
    },
    {
      title: 'API Documentation',
      items: [
        { name: 'Authentication & Keys', slug: 'api/auth' },
        { name: 'REST API Reference', slug: 'api/rest' },
        { name: 'WebSocket Connections', slug: 'api/websocket' },
        { name: 'Rate Limiting', slug: 'api/rate-limiting' },
        { name: 'Error Handling', slug: 'api/errors' },
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">Documentation</h1>
            <p className="text-xl text-gray-300">Complete guide to Sans Mercantile Nexus</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${item.slug}`}
                        className="text-gray-300 hover:text-white transition-colors block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}