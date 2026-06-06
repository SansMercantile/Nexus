import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useRouter } from 'next/router';

export default function PortalLogin() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [info, setInfo] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // Show feedback from approve/deny redirects
  React.useEffect(() => {
    if (router.query.approved === '1') {
      setInfo('Your account has been approved! You can now sign in.');
    } else if (router.query.denied === '1') {
      setInfo('Your account application was not approved. Contact hello@sansmercantile.com for assistance.');
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError('Invalid credentials. If your account is pending approval, please wait for an email confirmation.');
        } else if (res.status === 500) {
          setError('Server error. The database may not be configured yet. Please contact hello@sansmercantile.com.');
        } else {
          setError(data?.message || 'Login failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Successful login — redirect based on role
      const role = data?.user?.role;
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/admin'); // all authenticated users go to dashboard for now
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Web Portal - Sans Mercantile</title>
        <meta name="description" content="Sign in to your Sans Mercantile portal account." />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-md w-full"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Sans Mercantile Portal</h1>
            <p className="text-nexus-gray-400">Access your account and dashboard</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8">

            {info && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm"
              >
                {info}
              </motion.div>
            )}

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
                  autoComplete="email"
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
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-lg bg-nexus-dark border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-nexus-gray-400 text-sm mt-6">
            Need access?{' '}
            <Link href="/portal/register" className="text-nexus-gold hover:text-nexus-gold/80 transition-colors">
              Create an account
            </Link>{' '}
            or{' '}
            <Link href="/contact" className="text-nexus-gold hover:text-nexus-gold/80 transition-colors">
              contact our team
            </Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
