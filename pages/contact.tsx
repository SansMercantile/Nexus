import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const { subject } = router.query;
    if (typeof subject === 'string' && subject.trim().length > 0) {
      setFormData(prev => ({ ...prev, subject }));
    }
  }, [router.isReady, router.query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Layout>
      <div className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-xl text-nexus-gray-300 max-w-2xl mx-auto">
              Have questions? Want to learn more? Our team is here to help. Contact us through any of these channels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-10"
            >
              <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
              {submitted ? (
                <div className="bg-nexus-gold/20 border border-nexus-gold/40 rounded-lg p-6 text-center">
                  <p className="text-nexus-gold font-semibold mb-2">Thank you for your message!</p>
                  <p className="text-nexus-gray-300">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-nexus-dark border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-nexus-dark border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-nexus-dark border border-nexus-gold/20 text-white focus:border-nexus-gold focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                        <option value="Sales">Sales Inquiry</option>
                      <option value="Support">Technical Support</option>
                      <option value="Partnership">Partnership Opportunity</option>
                      <option value="Free Trial">Free Trial</option>
                      <option value="Schedule Demo">Schedule Demo</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-nexus-dark border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none transition-colors resize-none"
                      placeholder="Tell us more..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Support</h3>
                <p className="text-nexus-gray-300 mb-3">For technical help and customer support:</p>
                <a href="mailto:support@sansmercantile.com" className="text-nexus-gold font-semibold hover:text-nexus-gold/80 transition-colors">
                  support@sansmercantile.com
                </a>
              </div>

              <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Sales & Partnerships</h3>
                <p className="text-nexus-gray-300 mb-3">Interested in our services or partnerships?</p>
                <a href="mailto:sales@sansmercantile.com" className="text-nexus-gold font-semibold hover:text-nexus-gold/80 transition-colors">
                  sales@sansmercantile.com
                </a>
              </div>

              <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Compliance & Legal</h3>
                <p className="text-nexus-gray-300 mb-3">For compliance and regulatory matters:</p>
                <a href="mailto:compliance@sansmercantile.com" className="text-nexus-gold font-semibold hover:text-nexus-gold/80 transition-colors">
                  compliance@sansmercantile.com
                </a>
              </div>

              <div className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Developer API</h3>
                <p className="text-nexus-gray-300 mb-3">Technical integration support:</p>
                <a href="mailto:api@sansmercantile.com" className="text-nexus-gold font-semibold hover:text-nexus-gold/80 transition-colors">
                  api@sansmercantile.com
                </a>
              </div>

              <div className="bg-gradient-to-r from-nexus-gold/10 to-nexus-accent/10 border border-nexus-gold/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Response Time</h3>
                <p className="text-nexus-gray-300">
                  We aim to respond to all inquiries within 24 business hours. For urgent matters, please mark your email as "URGENT" in the subject line.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
