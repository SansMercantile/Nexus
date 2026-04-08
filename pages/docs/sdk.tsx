import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';

export default function SdkDocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      description: 'Quick start guide and account setup',
      items: [
        { name: 'Quick Start Guide', slug: 'getting-started/quick-start', time: '4 min read' },
        { name: 'Account Setup', slug: 'getting-started/account-setup', time: '3 min read' },
        { name: 'Dashboard Overview', slug: 'getting-started/dashboard', time: '4 min read' },
        { name: 'First Integration', slug: 'getting-started/first-integration', time: '5 min read' },
      ]
    },
    {
      title: 'System Guides',
      description: 'Detailed guides for each AI system',
      items: [
        { name: 'Priv Wealth Intelligence', slug: 'systems/priv', time: '5 min read' },
        { name: 'KEL Agricultural Systems', slug: 'systems/kel', time: '5 min read' },
        { name: 'Mezzo Governance Framework', slug: 'systems/mezzo', time: '5 min read' },
        { name: 'Brigit Legal Solutions', slug: 'systems/brigit', time: '5 min read' },
        { name: 'Anubis Verification', slug: 'systems/anubis', time: '5 min read' },
        { name: 'Omega Medical AI', slug: 'systems/omega', time: '5 min read' },
      ]
    },
    {
      title: 'API Documentation',
      description: 'Technical API reference and integration',
      items: [
        { name: 'Authentication & Keys', slug: 'api/auth', time: '4 min read' },
        { name: 'REST API Reference', slug: 'api/rest', time: '4 min read' },
        { name: 'WebSocket Connections', slug: 'api/websocket', time: '4 min read' },
        { name: 'Rate Limiting', slug: 'api/rate-limiting', time: '4 min read' },
        { name: 'Error Handling', slug: 'api/errors', time: '4 min read' },
      ]
    },
    {
      title: 'Security & Compliance',
      description: 'Security measures and compliance standards',
      items: [
        { name: 'Data Encryption', slug: 'security/encryption', time: '4 min read' },
        { name: 'HIPAA Compliance', slug: 'security/hipaa', time: '4 min read' },
        { name: 'SOC 2 Certification', slug: 'security/soc2', time: '4 min read' },
        { name: 'Privacy Policy', slug: 'security/privacy', time: '4 min read' },
        { name: 'Regulatory Updates', slug: 'security/regulatory', time: '4 min read' },
      ]
    },
    {
      title: 'Integration Guides',
      description: 'Integration patterns and workflows',
      items: [
        { name: 'Webhook Configuration', slug: 'integration/webhooks', time: '4 min read' },
        { name: 'Database Integration', slug: 'integration/database', time: '4 min read' },
        { name: 'Payment Processing', slug: 'integration/payments', time: '4 min read' },
        { name: 'Third-party Services', slug: 'integration/third-party', time: '4 min read' },
        { name: 'Custom Workflows', slug: 'integration/workflows', time: '4 min read' },
      ]
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and debugging guides',
      items: [
        { name: 'Common Issues', slug: 'troubleshooting/common', time: '3 min read' },
        { name: 'Performance Optimization', slug: 'troubleshooting/performance', time: '4 min read' },
        { name: 'Debugging Guide', slug: 'troubleshooting/debugging', time: '4 min read' },
        { name: 'Support Resources', slug: 'troubleshooting/support', time: '3 min read' },
        { name: 'FAQ', slug: 'troubleshooting/faq', time: '3 min read' },
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">SDK Documentation</h1>
            <p className="text-xl text-gray-300">Comprehensive guides for integrating with our platform</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-2xl font-semibold text-white mb-2">{section.title}</h2>
                <p className="text-gray-300 mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.slug} className="flex justify-between items-center">
                      <Link
                        href={`/docs/${item.slug}`}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                      <span className="text-gray-400 text-sm">{item.time}</span>
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