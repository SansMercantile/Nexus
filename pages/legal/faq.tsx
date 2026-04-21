import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is Sans Mercantile Nexus?',
      answer: 'Sans Mercantile Nexus is a comprehensive AI-powered platform that integrates multiple specialized systems to provide enterprise-grade solutions for wealth intelligence, governance, legal compliance, and more.'
    },
    {
      question: 'How do I get started?',
      answer: 'You can get started by visiting our documentation at /docs or contacting our sales team at sales@sansmercantile.com for a personalized demo.'
    },
    {
      question: 'What systems are included in the Nexus?',
      answer: 'The Nexus includes 21 specialized AI systems covering areas such as wealth intelligence, governance, legal solutions, medical AI, manufacturing, and more. Visit /systems to explore all available systems.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we implement industry-leading security measures including encryption, compliance with HIPAA, SOC 2, and GDPR standards. All data is processed with the highest security protocols.'
    },
    {
      question: 'Do you offer support?',
      answer: 'Yes, we provide comprehensive support through multiple channels including email (support@sansmercantile.com), documentation, and dedicated account management for enterprise clients.'
    }
  ];

  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-nexus-gray-300">
              Find answers to common questions about Sans Mercantile Nexus
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-r from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-nexus-gray-300 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <p className="text-nexus-gray-300 mb-6">
              Can't find what you're looking for?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}