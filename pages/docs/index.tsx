import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { getAllSystems } from '@repo/constellation';

export default function DocsPage() {
  const systems = getAllSystems();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">Documentation</h1>
            <p className="text-xl text-gray-300">Explore our comprehensive AI systems documentation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((system, index) => (
              <motion.div
                key={system.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{system.name}</h3>
                <p className="text-gray-300 mb-4">{system.description}</p>
                <Link href={`/docs/${system.slug}`} className="text-nexus-blue hover:text-white transition-colors">
                  Learn more →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}