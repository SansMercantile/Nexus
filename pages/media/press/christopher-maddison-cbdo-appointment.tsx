import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

export default function PressReleasePage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <span className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4 inline-block">Press Release</span>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Sans Mercantile Appoints Christopher Maddison as Chief Business Development Officer
                </h1>
                <p className="text-xl text-nexus-gray-300 max-w-3xl">
                  April 1, 2026 — Christopher Maddison joins Sans Mercantile as the new Executive Partner and CBDO, leading global capital strategy for the sovereign AI platform.
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-nexus-gold/20">
                <img src="/Executives/cbdo_executive_partner.jpg" alt="Christopher Maddison, Executive Partner and CBDO" className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-12 mb-16">
            <div className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-12">
              <div className="prose prose-invert max-w-none text-nexus-gray-200">
                <p>
                  In this new role, Christopher Maddison will lead investor engagement, institutional commercialization, and global capital strategy for Sans Mercantile’s sovereign AI systems. His mandate includes aligning the financial ecosystem around the platform’s growth roadmap while preserving governance, risk management, and regulatory integrity.
                </p>
                <p>
                  Mr. Maddison will focus on accelerating market access for the platform’s intelligence systems, including Priv, Omega, and the broader autonomous infrastructure suite. His experience in structured capital deployment and cross-border finance is designed to help Sans Mercantile bridge next-generation AI architecture with institutional capital networks.
                </p>
                <p>
                  As the firm expands its sovereign AI infrastructure across Cape Town, London, and Tokyo, he will also steward the commercial pathways that translate infrastructure capability into institutional adoption and long-term value creation.
                </p>
                <h2 className="text-3xl font-bold text-white mt-8 mb-6">Executive Profile</h2>
                <p>
                  Christopher Maddison is a senior capital strategist and corporate finance professional with over two decades of international experience across emerging and developed markets. His expertise spans structured finance, capital raising, and strategic advisory, with a proven track record of originating and executing complex debt and equity transactions exceeding <strong>$125 million USD</strong>.
                </p>
                <p>
                  He has built a reputation for connecting institutional capital to high-impact opportunities, structuring bespoke funding solutions, and navigating sophisticated investment environments with a strong focus on governance, risk, and long-term value creation.
                </p>
              </div>
            </div>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="rounded-3xl border border-nexus-gold/20 bg-[#0c132b] p-10">
                <h2 className="text-2xl font-bold text-white mb-4">Strategic Mandate</h2>
                <p className="text-nexus-gray-300 leading-relaxed">
                  As CBDO and Executive Partner, Mr. Maddison is responsible for leading the firm’s $15M USD global capital strategy to support the physical manifestation of sovereign AI infrastructure. He will design investor engagement playbooks that align financing with the platform’s sovereign architecture and commercialization goals.
                </p>
                <ul className="space-y-4 text-nexus-gray-300 mt-6">
                  <li>Structured finance and private capital deployment for Priv and Omega</li>
                  <li>Investor engagement across EMEA, APAC, and institutional sovereign networks</li>
                  <li>Governance-aligned commercialization pathways for sovereign AI capacity</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-nexus-gold/20 bg-[#0c132b] p-10">
                <h2 className="text-2xl font-bold text-white mb-4">Institutional Alignment</h2>
                <p className="text-nexus-gray-300 leading-relaxed">
                  His dual UK/RSA citizenship strengthens Sans Mercantile’s sovereign alignment while providing the G7 proxy power required to bridge the gap between algorithmic intelligence and global institutional capital.
                </p>
                <ul className="space-y-4 text-nexus-gray-300 mt-6">
                  <li>Cross-border investor partnerships with sovereign and institutional stakeholders</li>
                  <li>Risk-managed launch strategies for fintech and healthtech kernels</li>
                  <li>Capital structures that preserve sovereignty while unlocking growth</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="rounded-3xl border border-nexus-gold/20 bg-[#0b1125] p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
            <div className="space-y-4 text-nexus-gray-300">
              <p><strong className="text-white">Press Office</strong> — Sans Mercantile</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:media@sansmercantile.com" className="text-nexus-gold hover:text-nexus-accent transition-colors">media@sansmercantile.com</a></p>
              <p><strong className="text-white">Web:</strong> <a href="https://sansmercantile.com" className="text-nexus-gold hover:text-nexus-accent transition-colors">sansmercantile.com</a></p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-center mt-16">
            <Link href="/media">
              <button className="px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors">
                Back to Media Center
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
