import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { fadeInUp, staggerContainer } from '../../lib/animations';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  value: number;
  lastContact: string;
  notes: string;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed';
  probability: number;
  expectedClose: string;
  contact: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  timestamp: string;
  contact: string;
}

// Sample data
const initialContacts: Contact[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@techcorp.io', company: 'TechCorp', status: 'customer', value: 150000, lastContact: '2024-01-15', notes: 'Enterprise license renewal due' },
  { id: '2', name: 'Michael Ross', email: 'mross@innovate.co', company: 'Innovate Co', status: 'prospect', value: 75000, lastContact: '2024-01-14', notes: 'Demo scheduled for Q1' },
  { id: '3', name: 'Emily Watson', email: 'emily@startupxyz.com', company: 'StartupXYZ', status: 'lead', value: 25000, lastContact: '2024-01-13', notes: 'Inbound from website' },
  { id: '4', name: 'James Miller', email: 'james@enterprise.net', company: 'Enterprise Net', status: 'prospect', value: 200000, lastContact: '2024-01-12', notes: 'Large deal opportunity' },
  { id: '5', name: 'Lisa Park', email: 'lisa@agency.io', company: 'Digital Agency', status: 'churned', value: 0, lastContact: '2024-01-10', notes: 'Budget constraints' },
];

const initialDeals: Deal[] = [
  { id: '1', title: 'Enterprise Platform License', value: 150000, stage: 'negotiation', probability: 80, expectedClose: '2024-02-28', contact: 'Sarah Chen' },
  { id: '2', title: 'AI Development Suite', value: 75000, stage: 'proposal', probability: 60, expectedClose: '2024-03-15', contact: 'Michael Ross' },
  { id: '3', title: 'Full Stack Implementation', value: 200000, stage: 'discovery', probability: 30, expectedClose: '2024-04-30', contact: 'James Miller' },
  { id: '4', title: 'Starter Package', value: 25000, stage: 'closed', probability: 100, expectedClose: '2024-01-20', contact: 'Emily Watson' },
];

const initialActivities: Activity[] = [
  { id: '1', type: 'call', description: 'Discovery call with James Miller', timestamp: '2024-01-15 14:00', contact: 'James Miller' },
  { id: '2', type: 'email', description: 'Sent proposal to Michael Ross', timestamp: '2024-01-15 11:30', contact: 'Michael Ross' },
  { id: '3', type: 'meeting', description: 'Product demo with Sarah Chen', timestamp: '2024-01-14 16:00', contact: 'Sarah Chen' },
  { id: '4', type: 'note', description: 'Updated notes from discovery call', timestamp: '2024-01-14 14:30', contact: 'James Miller' },
];

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contacts' | 'deals' | 'ai-dev-studio'>('dashboard');
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  
  // AI Dev Studio state
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedPipeline = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  const closedDeals = deals.filter(d => d.stage === 'closed').reduce((sum, deal) => sum + deal.value, 0);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI code generation
    setTimeout(() => {
      const codeTemplate = `
// AI Generated Code for: ${aiPrompt}
// Generated: ${new Date().toISOString()}

interface CRMData {
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
}

// Generated React Component
export const GeneratedComponent = () => {
  const [data, setData] = useState<CRMData | null>(null);
  
  useEffect(() => {
    // Fetch data from API
    fetch('/api/crm/${aiPrompt.toLowerCase().replace(/\s+/g, '-')}')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="crm-component">
      {/* ${aiPrompt} */}
    </div>
  );
};
`;
      setGeneratedCode(codeTemplate);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Sans Mercantile</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">CRM & AI Dev Studio</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl">
              Customer relationship management with integrated AI-powered software development platform. 
              Transform natural language into production-ready full-stack applications.
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-nexus-gold/20 pb-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'contacts', label: 'Contacts', icon: '👥' },
              { id: 'deals', label: 'Deals', icon: '💼' },
              { id: 'ai-dev-studio', label: 'AI Dev Studio', icon: '🤖' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-nexus-gold text-black'
                    : 'bg-[#0b1125] text-nexus-gray-300 hover:text-white border border-nexus-gold/20'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div variants={fadeInUp} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                  <p className="text-sm text-nexus-gray-400 mb-2">Total Pipeline</p>
                  <p className="text-3xl font-bold text-white">${totalPipelineValue.toLocaleString()}</p>
                  <p className="text-sm text-green-400 mt-2">+12% from last month</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                  <p className="text-sm text-nexus-gray-400 mb-2">Weighted Value</p>
                  <p className="text-3xl font-bold text-white">${weightedPipeline.toLocaleString()}</p>
                  <p className="text-sm text-nexus-gray-500 mt-2">Probability adjusted</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                  <p className="text-sm text-nexus-gray-400 mb-2">Closed Deals</p>
                  <p className="text-3xl font-bold text-white">${closedDeals.toLocaleString()}</p>
                  <p className="text-sm text-green-400 mt-2">+8% this quarter</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                  <p className="text-sm text-nexus-gray-400 mb-2">Active Contacts</p>
                  <p className="text-3xl font-bold text-white">{contacts.filter(c => c.status !== 'churned').length}</p>
                  <p className="text-sm text-nexus-gray-500 mt-2">In pipeline</p>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <motion.div variants={fadeInUp} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#0f1425]">
                      <div className="text-2xl">
                        {activity.type === 'call' && '📞'}
                        {activity.type === 'email' && '📧'}
                        {activity.type === 'meeting' && '📅'}
                        {activity.type === 'note' && '📝'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.description}</p>
                        <p className="text-sm text-nexus-gray-400">{activity.contact} • {activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Pipeline Overview */}
              <motion.div variants={fadeInUp} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Deal Pipeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['discovery', 'proposal', 'negotiation', 'closed'].map((stage) => {
                    const stageDeals = deals.filter(d => d.stage === stage);
                    const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
                    return (
                      <div key={stage} className="rounded-xl border border-nexus-gold/10 bg-[#0a0f22] p-4">
                        <p className="text-sm text-nexus-gray-400 mb-2 capitalize">{stage}</p>
                        <p className="text-2xl font-bold text-white">${stageValue.toLocaleString()}</p>
                        <p className="text-sm text-nexus-gray-500 mt-2">{stageDeals.length} deals</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Contacts</h2>
                <button className="px-6 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90">
                  + Add Contact
                </button>
              </div>
              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                      <p className="text-nexus-gray-400">{contact.company} • {contact.email}</p>
                      <p className="text-sm text-nexus-gray-500 mt-1">{contact.notes}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        contact.status === 'customer' ? 'bg-green-500/20 text-green-400' :
                        contact.status === 'prospect' ? 'bg-blue-500/20 text-blue-400' :
                        contact.status === 'lead' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {contact.status}
                      </span>
                      <p className="text-white font-semibold mt-2">${contact.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Deals Tab */}
          {activeTab === 'deals' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Deals</h2>
                <button className="px-6 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90">
                  + Add Deal
                </button>
              </div>
              <div className="grid gap-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{deal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        deal.stage === 'closed' ? 'bg-green-500/20 text-green-400' :
                        deal.stage === 'negotiation' ? 'bg-purple-500/20 text-purple-400' :
                        deal.stage === 'proposal' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {deal.stage}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-nexus-gray-400">Value</p>
                        <p className="text-white font-semibold">${deal.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-nexus-gray-400">Probability</p>
                        <p className="text-white font-semibold">{deal.probability}%</p>
                      </div>
                      <div>
                        <p className="text-nexus-gray-400">Expected Close</p>
                        <p className="text-white font-semibold">{deal.expectedClose}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-nexus-gray-500">Contact: {deal.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI Dev Studio Tab */}
          {activeTab === 'ai-dev-studio' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* AI Code Generator */}
              <div className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-nexus-gold/20 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Dev Studio</h2>
                    <p className="text-nexus-gray-400">Natural language to production-ready code</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Prompt Input */}
                  <div>
                    <label className="block text-sm text-nexus-gray-400 mb-2">
                      Describe what you want to build
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., Create a React component for a contact list with search and filter functionality"
                      className="w-full h-32 px-4 py-3 rounded-xl bg-[#0f1425] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold/50 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Generate Button */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          Generate Code
                        </>
                      )}
                    </button>
                    <button className="px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10">
                      View Templates
                    </button>
                  </div>

                  {/* Generated Code Output */}
                  {generatedCode && (
                    <div className="rounded-xl border border-nexus-gold/20 bg-[#0a0f22] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Generated Code</h3>
                        <button className="text-sm text-nexus-gold hover:underline">
                          Copy to Clipboard
                        </button>
                      </div>
                      <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm text-nexus-gray-300 font-mono">
                        {generatedCode}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Templates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'React Component', description: 'Create UI components with TypeScript', icon: '⚛️' },
                  { title: 'FastAPI Route', description: 'Build REST API endpoints', icon: '🐍' },
                  { title: 'Database Schema', description: 'Design PostgreSQL schemas', icon: '🗄️' },
                ].map((template) => (
                  <button
                    key={template.title}
                    onClick={() => setAiPrompt(`Create a ${template.title.toLowerCase()}`)}
                    className="rounded-xl border border-nexus-gold/20 bg-[#0b1125] p-6 text-left hover:border-nexus-gold/40 transition"
                  >
                    <span className="text-3xl mb-4 block">{template.icon}</span>
                    <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
                    <p className="text-sm text-nexus-gray-400">{template.description}</p>
                  </button>
                ))}
              </div>

              {/* System Status */}
              <div className="rounded-xl border border-nexus-gold/10 bg-[#0a0f22] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">AI Dev Studio Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2"></div>
                    <p className="text-sm text-nexus-gray-400">NLP Engine</p>
                    <p className="text-xs text-green-400">Active</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2"></div>
                    <p className="text-sm text-nexus-gray-400">Code Generator</p>
                    <p className="text-xs text-green-400">Active</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-2"></div>
                    <p className="text-sm text-nexus-gray-400">LLM Provider</p>
                    <p className="text-xs text-yellow-400">Ready</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2"></div>
                    <p className="text-sm text-nexus-gray-400">Templates</p>
                    <p className="text-xs text-green-400">12 Loaded</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}