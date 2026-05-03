import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useRouter } from 'next/router';

export default function PortalLogout() {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    const response = await fetch('/api/portal/logout', { method: 'GET' });
    if (response.ok) {
      setMessage('You have been logged out successfully. Redirecting to portal...');
      setTimeout(() => router.push('/portal'), 1300);
    } else {
      setMessage('Unable to log out. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Head>
        <title>Logout - Sans Mercantile Portal</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-lg w-full"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-3">Confirm Logout</h1>
            <p className="text-nexus-gray-400">This will end your secure portal session.</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8">
            <p className="text-nexus-gray-300 mb-6">
              Are you sure you want to sign out of your Sans Mercantile portal session? Your session cookie will be cleared and you will be returned to the login page.
            </p>

            {message && (
              <div className="mb-6 rounded-lg border border-nexus-gold/30 bg-nexus-gold/10 p-4 text-sm text-nexus-gold">
                {message}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing out...' : 'Confirm Logout'}
              </button>
              <Link
                href="/admin"
                className="w-full px-6 py-3 rounded-lg border border-nexus-gold/20 text-nexus-gold text-center font-semibold hover:bg-nexus-gold/10 transition-colors"
              >
                Cancel and return
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
