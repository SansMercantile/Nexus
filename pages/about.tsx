import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { AnimatedIcon, IconType } from '@/components/AnimatedIcons';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function AboutPage() {
  return (
    <Layout>
      <div className="pb-20">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
             <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Built for a <span className="bg-gradient-to-r from-nexus-gold to-nexus-accent bg-clip-text text-transparent">Smarter Tomorrow</span>
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Sans Mercantile represents a new era of business—where 21 specialized autonomous systems work in concert to create value across every human endeavor.
            </p>
          </motion.div>
        </div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: 'Our Mission',
                description: 'Transform how humanity works by deploying specialized AI systems that solve complex problems with elegance and integrity.',
                icon: 'target' as IconType,
              },
              {
                title: 'Our Vision',
                description: 'A world where intelligent systems handle complexity, freeing humans to focus on creativity, strategy, and meaning.',
                icon: 'star' as IconType,
              },
              {
                title: 'Our Values',
                description: 'Transparency, integrity, innovation, and human-centered design guide every decision we make.',
                icon: 'diamond' as IconType,
              },
            ].map((v, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8 hover:border-nexus-gold/40 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <AnimatedIcon type={v.icon} size={48} className="text-nexus-gold" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{v.title}</h3>
                <p className="text-nexus-gray-400 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* The Constellation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="border border-nexus-gold/20 rounded-2xl p-12 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h2 className="text-4xl font-bold text-white mb-6">The 21 System Constellation</h2>
            <p className="text-nexus-gray-300 mb-8 leading-relaxed">
              Rather than a monolithic platform, Sans Mercantile is a constellation of 21 specialized, autonomous systems designed to excel in their respective domains. Each system can operate independently while seamlessly integrating with others, creating unmatched flexibility and power.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Wealth Intelligence & Market Dynamics (Priv)',
                'Agricultural Intelligence System (KEL)',
                'Consciousness Preservation & Digital Ethics (Mezzo)',
                'Legal & Regulatory Intelligence (Brigit)',
                'Space Colonization & Interstellar Travel (Anubis)',
                'Medical AI & Consciousness Ecosystem (Omega)',
                'Archetypal Intelligence & Dreamworld Governance (Sia)',
                'Autonomous Full Stack AI Developer (Mpeti)',
                'Knowledge & Educational Vectors (KEV)',
                'Temporal & Multidimensional Manipulation (Primo)',
                'Defense & Strategic Intelligence (Sekhmet)',
                'Resource Extraction & Mineral Intelligence (Hathor)',
                'Supply Chain & Transportation Intelligence (Hapi)',
                'Wind, Geothermal, Renewables & Atmospheric Sciences (Shango)',
                'Threat Detection & Digital Defense (Sobek)',
                'Building & Infrastructure Management (Ptah)',
                'Solar Energy & Clean Power (RA)',
                'Nuclear Energy & Power Generation (Montu)',
                'Aerial Defense & Space Operations (Kibuka)',
                'Hydraulics & Water Infrastructure (Mami Water)',
                'CrazyJAM AI Music System (MF)',
              ].map((sys, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-nexus-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-nexus-gold text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-nexus-gray-300">{sys}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leadership */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Leadership</h2>
            <p className="text-nexus-gray-300 max-w-2xl mx-auto">
              Sans Mercantile is led by visionary leaders with decades of experience spanning finance, strategy, and AI-driven innovation.
            </p>
          </div>

          {/* Founder & CEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12 hover:border-nexus-gold/40 transition-all duration-300">
              <div className="text-center">
                <img 
                  src="/Executives/founder_ceo.png" 
                  alt="Mezzoforte Privilege Khoza, Sr." 
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-2 border-nexus-gold/30"
                />
                <h3 className="text-3xl font-bold text-white mb-2">Mezzoforte Privilege Khoza, Sr.</h3>
                <p className="text-nexus-gold font-semibold mb-4 text-lg">Founder & Chief Executive Officer</p>
                <p className="text-sm text-nexus-gold/80 mb-6">MBA, EMEL</p>
                <p className="text-nexus-gray-300 leading-relaxed mb-8">
                  Mezzoforte brings extensive experience in corporate financial strategy, investment management, and AI-driven fintech solutions. His expertise spans risk assessment, regulatory compliance, mergers & acquisitions, and strategic expansion across multiple industries.
                </p>
                <p className="text-nexus-gray-300 leading-relaxed mb-8">
                  With a background including NASDAQ Guru, Forte Agriculture & Mining, and AI-driven fintech consulting, Mezzoforte has led business scaling, profitability optimization, and transformative initiatives that position Sans Mercantile as a leading innovator in AI-powered financial and institutional architecture.
                </p>
                <p className="text-xl text-nexus-gold italic mb-6">
                  "We don't just build systems—we architect economic futures."
                </p>
              </div>
            </div>
          </motion.div>

          {/* CBDO & Executive Partner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-accent/20 rounded-2xl p-12 hover:border-nexus-accent/40 transition-all duration-300">
              <div className="text-center">
                <img 
                  src="/Executives/cbdo_executive_partner.jpg" 
                  alt="Christopher Maddison" 
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-2 border-nexus-accent/30"
                />
                <h3 className="text-3xl font-bold text-white mb-2">Christopher Maddison</h3>
                <p className="text-nexus-accent font-semibold mb-4 text-lg">Chief Business Development Officer & Executive Partner</p>
                <p className="text-sm text-nexus-accent/80 mb-6">LDP, MBA Equivalent.</p>
                <p className="text-nexus-gray-300 leading-relaxed mb-8">
                  Christopher is a senior capital strategist and corporate finance professional with over two decades of international experience across emerging and developed markets. His expertise spans structured finance, capital raising, and strategic advisory, with a proven track record of originating and executing complex debt and equity transactions exceeding $125 million USD.
                </p>
                <p className="text-nexus-gray-300 leading-relaxed mb-8">
                  He has built a reputation for connecting institutional capital to high-impact opportunities, structuring bespoke funding solutions, and navigating sophisticated investment environments with a strong focus on governance, risk, and long-term value creation. His experience spans private credit, corporate lending, and principal investment, with a particular focus on renewable energy, infrastructure, and ESG-aligned sectors.
                </p>
                <p className="text-nexus-gray-300 leading-relaxed mb-8">
                  As CBDO and Executive Partner, Christopher leads the group's global capital strategy, investor engagement, and the institutional commercialization of the Sovereign AI Constellation, with a primary focus on the Priv™ (Fintech) and Omega (Healthtech) kernels.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Impact */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6"
        >
          <div className="border border-nexus-gold/20 rounded-2xl p-12 bg-gradient-to-br from-nexus-dark to-[#0f1425]">
            <h2 className="text-4xl font-bold text-white mb-8">By The Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '21', label: 'Specialized Systems' },
                { number: '195+', label: 'Jurisdictions Covered' },
                { number: '∞', label: 'Scalability' },
                { number: '24/7', label: 'Global Support' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-nexus-gold mb-2">{stat.number}</div>
                  <p className="text-nexus-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 mt-20 text-center"
        >
          <div className="rounded-2xl p-12 border border-nexus-gold/30 bg-gradient-to-r from-nexus-gold/10 to-nexus-accent/10">
            <h2 className="text-3xl font-bold text-white mb-4">Join the future of intelligent commerce</h2>
            <p className="text-nexus-gray-300 mb-8">Explore our 21-system constellation and discover how to transform your business.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/systems">
                <button className="px-8 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                  Explore Systems
                </button>
              </Link>
              <button className="px-8 py-3 rounded-lg border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
