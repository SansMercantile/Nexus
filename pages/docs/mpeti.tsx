import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { fadeInUp, staggerContainer } from '../../lib/animations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FeatureCard = ({ title, description }: any) => (
  <motion.div
    variants={fadeInUp}
    className="border border-nexus-gold/20 rounded-xl p-6 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark hover:border-nexus-gold/40 transition-all duration-300"
  >
    <h3 className="text-xl font-bold text-nexus-gold mb-3">{title}</h3>
    <p className="text-nexus-gray-300">{description}</p>
  </motion.div>
);

export default function MpetiDocs() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'No response received',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Error communicating with Mpeti: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure Ollama is running on localhost:11434.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>MPETI Autonomous Developer - Sans Mercantile</title>
        <meta name="description" content="MPETI Autonomous Full Stack AI Developer system documentation - Self-building AI systems for software development and deployment" />
      </Head>

      <div className=" pt-32 pb-20">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              MPETI Autonomous Developer
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">
              Autonomous software development system generating, testing, and deploying
              full-stack applications with self-building AI capabilities.
            </p>
          </motion.div>
        </div>

        {/* Core Capabilities */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Development Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Autonomous Development"
              description="Code generation, testing, and deployment automation for complete software lifecycles."
            />
            <FeatureCard
              title="Full-Stack Generation"
              description="End-to-end application development from concept to production deployment."
            />
            <FeatureCard
              title="Self-Building Systems"
              description="AI systems capable of creating and maintaining their own infrastructure."
            />
            <FeatureCard
              title="CI/CD Automation"
              description="Automated testing, integration, and deployment pipelines with intelligent optimization."
            />
            <FeatureCard
              title="Infrastructure Management"
              description="Auto-scaling cloud infrastructure with intelligent resource allocation."
            />
            <FeatureCard
              title="Code Quality Assurance"
              description="Automated code review, optimization, and security validation."
            />
          </div>
        </motion.div>

        {/* Development Systems */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Autonomous Framework</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Code Generation</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Multi-language code synthesis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Architecture pattern recognition</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Best practices implementation</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-nexus-gold mb-4">Deployment Automation</h3>
                <ul className="space-y-3 text-nexus-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Container orchestration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Cloud platform integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nexus-gold mt-1">•</span>
                    <span>Performance optimization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Integration Points */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Development Ecosystem</h2>
          <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h3 className="text-xl font-bold text-nexus-gold mb-6">Software Engineering</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Development Inputs</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Requirements specifications</li>
                  <li>• Code repositories</li>
                  <li>• Testing frameworks</li>
                  <li>• Deployment environments</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nexus-gold font-semibold mb-3">Engineering Outputs</h4>
                <ul className="space-y-2 text-nexus-gray-300">
                  <li>• Production applications</li>
                  <li>• Automated test suites</li>
                  <li>• Infrastructure as code</li>
                  <li>• Documentation systems</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Access Information */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6"
        >
          <h2 className="text-3xl font-bold text-white mb-12">Implementation & Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Enterprise Development</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Large-scale software development</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>DevOps automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Platform engineering</span>
                </li>
              </ul>
            </div>
            <div className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
              <h3 className="text-xl font-bold text-nexus-gold mb-4">Research & Innovation</h3>
              <ul className="space-y-3 text-nexus-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>AI system development</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Autonomous system research</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-gold mt-1">•</span>
                  <span>Software engineering innovation</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Interactive Mpeti Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 mt-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Interact with Mpeti</h2>
          <div className="border border-nexus-gold/30 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            {/* Messages Display */}
            <div className="h-96 overflow-y-auto bg-[#0f1425] p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-nexus-gray-400 text-center">
                    Start a conversation with Mpeti below. Ask anything about constellation systems, AI development, or autonomous operations.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-nexus-gold text-nexus-dark font-medium'
                            : 'bg-[#1a1f3a] border border-nexus-gold/20 text-nexus-gray-200'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-nexus-dark/60' : 'text-nexus-gray-500'}`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-[#1a1f3a] border border-nexus-gold/20 text-nexus-gray-200 px-4 py-3 rounded-lg">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-nexus-gold rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-nexus-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-nexus-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t border-nexus-gold/20 bg-[#1a1f3a] p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Mpeti something..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg bg-[#0f1425] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:outline-none focus:border-nexus-gold/60 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 rounded-lg bg-nexus-gold text-nexus-dark font-semibold hover:bg-nexus-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-nexus-gray-500 mt-2">
                💡 Running Mpeti offline via Ollama (gemma:2b). Make sure Ollama is running on localhost:11434
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}