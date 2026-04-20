import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { SYSTEMS } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard = ({ feature, color }: { feature: Feature; color: string }) => (
  <motion.div
    variants={fadeInUp}
    className="group relative p-8 rounded-xl border border-nexus-gold/20 bg-gradient-to-br from-nexus-dark to-[#0f1425] hover:border-nexus-gold/50 transition-all duration-300"
  >
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    
    <div
      className="w-12 h-12 rounded-lg mb-6 flex items-center justify-center font-bold text-xl"
      style={{ backgroundColor: color + '20', color: color }}
    >
      {feature.icon}
    </div>

    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-nexus-gold transition-colors">
      {feature.title}
    </h3>
    <p className="text-nexus-gray-300 leading-relaxed">
      {feature.description}
    </p>
  </motion.div>
);

export default function SystemFeaturesPage() {
  const router = useRouter();
  const { system } = router.query;
  
  const systemData = SYSTEMS.find(s => s.id === system);
  const systemUrl = systemData?.id === 'priv' 
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

  const features = (systemData.features || []).map((f, i) => ({
    ...f,
    icon: String.fromCharCode(0xf001 + i), // Dummy icons
  }));

  const iconEmojis: { [key: string]: string[] } = {
    priv: ['💰', '📊', '⚠️', '✅', '🔮', '🔌'],
    kel: ['🌾', '📈', '💧', '🌦️', '📡', '🚚'],
    mezzo: ['⚖️', '📋', '🛡️', '🎯', '📢', '🏛️'],
    brigit: ['⚖️', '📄', '✅', '🔍', '⚠️', '💼'],
    anubis: ['🔐', '⛓️', '🆔', '📝', '📚', '🛡️'],
    omega: ['💊', '🏥', '🧬', '👥', '📊', '🎯'],
    sia: ['📦', '🔍', '🧠', '📋', '🔗', '📈'],
    mpeti: ['💱', '🛍️', '💳', '🚚', '🚨', '✈️'],
    kev: ['📚', '🎓', '🧩', '📊', '📖', '🤝'],
    primo: ['⚙️', '🔧', '📦', '✓', '🌱', '👷'],
  };

  const systemIcons = iconEmojis[system as string] || ['⭐'];
  const enhancedFeatures = features.map((f, i) => ({
    ...f,
    icon: systemIcons[i] || '⭐',
  }));

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-20">
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
                Capabilities
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {systemData.name} Features
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-2xl mx-auto">
              Enterprise-grade capabilities designed to transform your operations and drive measurable results.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enhancedFeatures.map((feature, idx) => (
              <FeatureCard
                key={idx}
                feature={feature}
                color={systemData.color}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
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
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to unlock these capabilities?
            </h2>
            <p className="text-nexus-gray-300 mb-8 max-w-2xl mx-auto">
              Schedule a demo to see how {systemData.name} can transform your business with these advanced features.
            </p>
            <a
              href={systemUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: systemData.color,
              }}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Visit {systemData.name}
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
