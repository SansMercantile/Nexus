import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchHealth, fetchTelemetry, SMO_SUITE_CONFIG, type TelemetryData } from '@/lib/smo-suite';

export default function SMOAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user_name');
    if (!user) {
      window.location.href = '/login';
    } else {
      setAuthenticated(true);
    }
  }, []);

  // Fetch health and telemetry data
  useEffect(() => {
    if (!authenticated) return;
    
    const loadData = async () => {
      try {
        const healthData = await fetchHealth();
        setHealth(healthData);
        
        const teleData = await fetchTelemetry();
        setTelemetry(teleData);
      } catch (e) {
        console.error('Failed to load SMO-Suite data:', e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, SMO_SUITE_CONFIG.pollingInterval);
    return () => clearInterval(interval);
  }, [authenticated]);

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
            <h2 className="text-2xl font-bold text-white mb-6">SMO-Suite Deployment Status</h2>
            {loading ? (
              <div className="text-nexus-gray-300">Loading system status...</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                  <span className="text-nexus-gray-300">Backend API (Port 8000)</span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">Running</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                  <span className="text-nexus-gray-300">22-Sector Grid</span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">{health?.sectors_active || 22} Sectors Active</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                  <span className="text-nexus-gray-300">Blender Integration</span>
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${health?.blender_available ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className={health?.blender_available ? 'text-green-400' : 'text-yellow-400'}>
                      {health?.blender_available ? 'Available' : 'Simulation Mode'}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                  <span className="text-nexus-gray-300">ZKP Verification</span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">{health?.zkp_enabled ? 'Enabled' : 'Disabled'}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                  <span className="text-nexus-gray-300">VRAM Peak</span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">{health?.vram_peak?.toFixed(1) || '--'}%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-nexus-dark/50 rounded-lg">
                  <span className="text-nexus-gray-300">Stress Test</span>
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${health?.stress_test_active ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={health?.stress_test_active ? 'text-red-400' : 'text-green-400'}>
                      {health?.stress_test_active ? 'ACTIVE' : 'Idle'}
                    </span>
                  </span>
                </div>
                <a
                  href="http://localhost:8000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  Open Nexus Dashboard →
                </a>
              </div>
            )}
          </motion.div>
          
          {/* Live Telemetry Preview */}
          {telemetry && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border border-nexus-gold/20 rounded-2xl p-12 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark mt-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Live Telemetry Preview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-nexus-dark/50 rounded-lg p-4">
                  <div className="text-sm text-nexus-gray-300 mb-1">XAUUSD</div>
                  <div className="text-xl font-bold text-white">${telemetry.xauusd?.price?.toFixed(2)}</div>
                  <div className={`text-sm ${telemetry.xauusd?.trend === 'bullish' ? 'text-green-400' : 'text-red-400'}`}>
                    {telemetry.xauusd?.trend?.toUpperCase()}
                  </div>
                </div>
                <div className="bg-nexus-dark/50 rounded-lg p-4">
                  <div className="text-sm text-nexus-gray-300 mb-1">BTCUSD</div>
                  <div className="text-xl font-bold text-white">${telemetry.btcusd?.price?.toFixed(0)}</div>
                  <div className="text-sm text-green-400">{telemetry.btcusd?.trend?.toUpperCase()}</div>
                </div>
                <div className="bg-nexus-dark/50 rounded-lg p-4">
                  <div className="text-sm text-nexus-gray-300 mb-1">VRAM</div>
                  <div className="text-xl font-bold text-white">{telemetry.vram?.usage_percent?.toFixed(1)}%</div>
                  <div className="text-sm text-nexus-gray-300">{telemetry.vram?.quality_action}</div>
                </div>
                <div className="bg-nexus-dark/50 rounded-lg p-4">
                  <div className="text-sm text-nexus-gray-300 mb-1">Priv Expression</div>
                  <div className="text-xl font-bold text-purple-400">{telemetry.priv?.current_expression?.toUpperCase()}</div>
                  <div className="text-sm text-nexus-gray-300">{telemetry.priv?.zkp_verifications} ZKP</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-nexus-gray-400">
                ZKP Signature: {telemetry.zkp_signature?.substring(0, 24)}...
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
