import React from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function OnboardingComplete() {
  const router = useRouter();
  const { email, jobId } = router.query;

  return (
    <Layout>
      <Head>
        <title>Application Complete - Sans Mercantile</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center py-20 px-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-2xl w-full text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-500/50">
              <div className="text-6xl">✓</div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={fadeInUp} transition={{ delay: 0.3 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Application Complete!
            </h1>
            <p className="text-xl text-nexus-gray-400 mb-2">
              Thank you for completing all required assessments.
            </p>
            <p className="text-lg text-nexus-gray-500 mb-8">
              A confirmation has been sent to <span className="text-nexus-gold font-semibold">{email}</span>
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8 mb-12 text-left"
          >
            <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Assessment Review',
                  description:
                    'Our recruiting team will review your assessment responses over the next 2-3 business days.',
                },
                {
                  step: 2,
                  title: 'Shortlist Notification',
                  description:
                    'If selected, you will receive an email with interview details and next steps.',
                },
                {
                  step: 3,
                  title: 'Interview Process',
                  description:
                    'Shortlisted candidates will be invited to participate in one or more interview rounds.',
                },
                {
                  step: 4,
                  title: 'Final Decision',
                  description:
                    'We will communicate our final decision and discuss offer details with successful candidates.',
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  variants={fadeInUp}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-nexus-gold/20 border border-nexus-gold/40 flex items-center justify-center">
                    <span className="text-nexus-gold font-bold text-sm">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-nexus-gray-400 text-sm mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
            className="bg-nexus-dark border border-nexus-accent/20 rounded-xl p-6 mb-12"
          >
            <p className="text-nexus-gray-400 mb-4">
              Have questions? Our team is here to help.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/contact" className="text-nexus-gold hover:text-nexus-gold/80 transition-colors font-semibold">
                Contact Support
              </a>
              <span className="text-nexus-gray-600">•</span>
              <a href="mailto:careers@sansmercantile.com" className="text-nexus-gold hover:text-nexus-gold/80 transition-colors font-semibold">
                Email Careers Team
              </a>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/careers">
              <button className="px-6 py-3 rounded-lg border border-nexus-gold/40 text-nexus-gold hover:bg-nexus-gold/10 transition-all font-semibold">
                Back to Careers
              </button>
            </Link>
            <Link href="/">
              <button className="px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                Return Home
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
