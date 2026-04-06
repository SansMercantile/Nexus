import React from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic authentication - in production, this would call a real auth API
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Simple validation - in production, validate against backend
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Store user info in localStorage
      localStorage.setItem('user_name', email.split('@')[0]);
      localStorage.setItem('user_email', email);
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Web Portal - Sans Mercantile</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-md w-full"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Quantum Gateway</h1>
            <p className="text-nexus-gray-400">Access Sans Mercantile admin tools and operational dashboards</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-nexus-dark border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-nexus-dark border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none transition-colors"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : 'Authenticate'}
              </button>
            </form>
          </div>

          <p className="text-center text-nexus-gray-400 text-sm mt-6">
            Don&apos;t have access?{' '}
            <a href="/contact" className="text-nexus-gold hover:text-nexus-gold/80 transition-colors">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
