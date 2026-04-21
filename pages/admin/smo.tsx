import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SMOAdmin() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user_name');
    if (!user) {
      window.location.href = '/login';
    } else {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) return null;

  const smoFeatures = [
    {
      title: 'Social Media Management',
      description: 'Manage Twitter, LinkedIn, Instagram, Facebook, TikTok accounts',
      icon: '📱'
    },
    {
      title: 'Campaign Management',
      description: 'Create, schedule, and monitor marketing campaigns',
      icon: '📢'
    },
    {
      title: 'Lead Scoring',
      description: 'AI-powered lead qualification and scoring',
      icon: '🎯'
    },
    {
      title: 'Analytics & Reporting',
      description: 'Real-time metrics and performance dashboards',
      icon: '📊'
    },
    {
      title: 'Content Calendar',
      description: 'Plan and schedule content across all platforms',
      icon: '📅'
    },
    {
      title: 'Customer Insights',
      description: 'Analyze customer behavior and preferences',
      icon: '💡'
    }
  ];

  return (
    <Layout>
      <div className=" pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link href="/admin" className="text-nexus-gold hover:text-nexus-gold/80 mb-6 flex items-center gap-2">
              ← Back to Dashboard
            </Link>
            <h1 className="text-5xl font-bold text-white mb-4">SMO Suite Admin</h1>
            <p className="text-nexus-gray-300 text-lg">
              Social Media & Marketing Operations Engine
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-nexus-gold/20 rounded-2xl p-12 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">About SMO Suite</h2>
            <p className="text-nexus-gray-300 mb-6 leading-relaxed">
              The SMO Suite is an AI-native office suite providing comprehensive social media management, marketing automation, 
              and customer relationship management capabilities. Manage multiple platforms, automate campaigns, and gain deep 
              insights into customer behavior with our institutional-grade tools.
            </p>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
            >
              API Documentation
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {smoFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-8 hover:border-nexus-gold/40 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-nexus-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-nexus-gold/20 rounded-2xl p-12 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Deployment Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                <span className="text-nexus-gray-300">Backend API</span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400">Running</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                <span className="text-nexus-gray-300">Database</span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400">Connected</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                <span className="text-nexus-gray-300">Frontend UI</span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-400">Pending</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
