import React from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../lib/animations';

export default function ModularDeployment() {
  const deploymentStages = [
    {
      stage: '01',
      title: 'Node Provisioning',
      description: 'Deploying autonomous utility nodes into the enterprise fabric.',
      capabilities: ['Utility Node Setup', 'API Gateway Configuration', 'Resource Allocation', 'Network Routing']
    },
    {
      stage: '02',
      title: 'Model Integration',
      description: 'Injecting custom-trained models into specific sector utilities.',
      capabilities: ['Weight Optimization', 'Inference Tuning', 'Contextual Injection', 'Prompt Engineering']
    },
    {
      stage: '03',
      title: 'Orchestration Layer',
      description: 'Establishing the logic for cross-sector interoperability and data flow.',
      capabilities: ['Event Bus Setup', 'Workflow Automation', 'State Management', 'Message Queuing']
    },
    {
      stage: '04',
      title: 'Systemic Activation',
      description: 'Final validation and activation of the modular utility stack.',
      capabilities: ['Load Testing', 'Security Hardening', 'Uptime Verification', 'Production Handover']
    }
  ];

  const deploymentModules = [
    {
      title: 'Autonomous Utility Nodes',
      description: 'Modular, self-contained AI units designed for specific enterprise tasks.',
      technologies: ['Python', 'FastAPI', 'Docker', 'Kubernetes'],
      capabilities: ['Task Automation', 'Data Processing', 'Real-time Inference', 'Self-Correction']
    },
    {
      title: 'Custom Model Injection',
      description: 'Deploying bespoke models tailored to proprietary data and unique use cases.',
      technologies: ['PyTorch', 'TensorFlow', 'Hugging Face', 'LoRA'],
      capabilities: ['Fine-tuning', 'Quantization', 'Knowledge Distillation', 'Evaluation']
    },
    {
      title: 'Cross-Sector Orchestration',
      description: 'The connective tissue that allows different AI utilities to communicate and collaborate.',
      technologies: ['Redis', 'Kafka', 'RabbitMQ', 'GraphQL'],
      capabilities: ['Event Streaming', 'State Sync', 'Request Routing', 'Concurrency Management']
    },
    {
      title: 'Infrastructure as Code (IaC)',
      description: 'Ensuring the entire 18-Sector Stack is reproducible and version-controlled.',
      technologies: ['Terraform', 'Bicep', 'Ansible', 'Pulumi'],
      capabilities: ['Environment Parity', 'Automated Provisioning', 'Configuration Management', 'Drift Detection']
    }
  ];

  const stackCapabilities = [
    { category: 'Compute & Inference', technologies: ['GPU Clusters', 'NPU Acceleration', 'Quantized Models', 'Edge Computing'] },
    { category: 'Data Fabric', technologies: ['Vector Databases', 'Graph Networks', 'Real-time Streams', 'ETL Pipelines'] },
    { category: 'Orchestration', technologies: ['Kubernetes', 'Docker Swarm', 'Serverless Functions', 'Workflow Engines'] },
    { category: 'Security & Identity', technologies: ['OAuth2/OIDC', 'mTLS', 'RBAC', 'Encryption at Rest/Transit'] },
    { category: 'Observability', technologies: ['Prometheus', 'Grafana', 'Datadog', 'OpenTelemetry'] },
    { category: 'Model Governance', technologies: ['Lineage Tracking', 'Bias Auditing', 'Version Control', 'Compliance Logging'] }
  ];

  return (
    <Layout>
      <Head>
        <title>Sans Mercantile - Modular Utility Deployment</title>
        <meta name="description" content="Deploying permanent, modular AI utility infrastructure across an 18-Sector Stack." />
      </Head>

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center mb-20"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Modular Utility <span className="text-nexus-gold">Deployment</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-nexus-gray-300 max-w-3xl mx-auto mb-8"
            >
              We don't just build apps; we deploy permanent, modular AI utility infrastructure. Our deployment division integrates the Constellation architecture into your core enterprise operations as a scalable, production-ready stack.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <button className="btn btn-primary">Request Deployment Blueprint</button>
            </motion.div>
          </motion.div>

          {/* Deployment Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {deploymentStages.map((stage, i) => (
              <div key={i} className="p-6 bg-nexus-gray-900 border border-white/10 rounded-xl hover:border-nexus-gold transition-colors">
                <span className="text-nexus-gold font-bold text-lg">{stage.stage}</span>
                <h3 className="text-xl font-bold text-white mb-4">{stage.title}</h3>
                <p className="text-nexus-gray-400 mb-6 text-sm">{stage.description}</p>
                <ul className="space-y-2">
                  {stage.capabilities.map((item, j) => (
                    <li key={j} className="flex items-center text-xs text-nexus-gray-300">
                      <span className="mr-2">▹</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Deployment Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {deploymentModules.map((module, i) => (
              <div key={i} className="p-8 bg-nexus-gray-900/50 border border-white/5 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">{module.title}</h3>
                <p className="text-nexus-gray-400 mb-6">{module.description}</p>
                <div className="flex flex-wrap gap-2">
                  {module.capabilities.map((cap, j) => (
                    <span key={j} className="px-3 py-1 bg-white/5 rounded-full text-xs text-nexus-gold border border-white/10">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stack Capabilities */}
          <div className="bg-nexus-gray-900/50 p-10 rounded-2xl border border-white/5">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Deployment Capabilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stackCapabilities.map((cap, i) => (
                <div key={i} className="p-4 bg-white/5 rounded border border-white/10 text-center">
                  <h4 className="text-sm font-bold text-nexus-gold mb-2">{cap.category}</h4>
                  <p className="text-xs text-nexus-gray-400">{cap.technologies.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}