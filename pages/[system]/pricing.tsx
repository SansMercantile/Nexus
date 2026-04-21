import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { SYSTEMS } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const PricingTierCard = ({ tier, color, isPopular }: any) => (
  <motion.div
    variants={fadeInUp}
    className={`relative rounded-2xl border transition-all duration-300 overflow-hidden group ${
      isPopular
        ? 'bg-gradient-to-br from-[#1a1f3a] to-[#0f1425] border-nexus-gold/40 md:scale-105'
        : 'bg-gradient-to-br from-nexus-dark to-[#0f1425] border-nexus-gold/20 hover:border-nexus-gold/30'
    }`}
  >
    {isPopular && (
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ backgroundColor: color }} />
    )}

    <div className="relative p-8 md:p-10 h-full flex flex-col">
      {isPopular && (
        <div className="mb-6">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: color + '20',
              color: color,
            }}
          >
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
        <p className="text-nexus-gray-400 text-sm mb-6">{tier.description}</p>

        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold text-white">
            ${(tier.price / 1000).toFixed(0)}k
          </span>
          <span className="text-nexus-gray-400">/year</span>
        </div>
      </div>

      <div className="space-y-4 flex-1 mb-8">
        {tier.features.map((feature: string, idx: number) => (
          <div key={idx} className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: color + '20', color: color }}
            >
              ✓
            </div>
            <span className="text-nexus-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      <a
        href={pricingUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: isPopular ? color : 'transparent',
          borderColor: color,
          color: isPopular ? '#000' : color,
        }}
        className="w-full py-3 rounded-lg font-semibold transition-all duration-300 border hover:opacity-90"
      >
        {tier.cta}
      </a>
    </div>
  </motion.div>
);

export default function SystemPricingPage() {
  const router = useRouter();
  const { system } = router.query;

  const systemData = SYSTEMS.find(s => s.id === system);
  const pricingUrl = systemData?.id === 'priv' 
    ? 'https://priv.sansmercantile.com/demo' 
    : 'https://sales.sansmercantile.com';

  if (!systemData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white text-xl">System not found</p>
        </div>
      </Layout>
    );
  }

  const pricing = systemData.pricing || [];

  return (
    <Layout>
      <div className=" pt-32 pb-20">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div
              className="inline-block px-4 py-2 rounded-full border mb-6"
              style={{
                borderColor: systemData.color + '40',
                backgroundColor: systemData.color + '10',
              }}
            >
              <span style={{ color: systemData.color }} className="text-sm font-semibold">
                Transparent Pricing
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {systemData.name} Plans
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your organization. Scale as you grow with transparent, flexible pricing.
            </p>
          </motion.div>
        </div>

        {/* Pricing Tiers */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((tier, idx) => (
              <PricingTierCard
                key={idx}
                tier={tier}
                color={systemData.color}
                isPopular={idx === 1} // Middle tier is popular
              />
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Pricing FAQs</h2>
            <p className="text-nexus-gray-300">Get answers to common questions about our plans and pricing.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Can I change plans anytime?', a: 'Yes, upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.' },
              { q: 'Do you offer custom quotes?', a: 'Absolutely. For Enterprise plans or unique requirements, contact our sales team for a custom quote.' },
              { q: 'Is there a free trial?', a: 'Yes, most plans offer a 30-day free trial with full access to all features.' },
              { q: 'What support do I get?', a: 'Support depends on your plan. All tiers include email support, with phone and dedicated support for Enterprise.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="border border-nexus-gold/20 rounded-lg p-6 bg-gradient-to-r from-nexus-dark to-[#0f1425] hover:border-nexus-gold/40 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-nexus-gray-300">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 mt-20 text-center"
        >
          <div
            className="rounded-2xl p-12 border"
            style={{
              borderColor: systemData.color + '30',
              backgroundColor: systemData.color + '08',
            }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Need a custom plan?</h2>
            <p className="text-nexus-gray-300 mb-8">
              Contact our enterprise team for tailored pricing and implementation support.
            </p>
            <a
              href={pricingUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: systemData.color,
              }}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Sales
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
