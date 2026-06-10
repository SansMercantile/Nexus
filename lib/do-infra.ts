/**
 * DigitalOcean Infrastructure Configuration
 * 
 * This file defines the requirements for the standalone Node.js server 
 * required to host the Twilio/Deepgram Voice Bridge.
 * 
 * Deployment Target: DigitalOcean Droplet
 * OS: Ubuntu 22.04 LTS
 * Specs: 4GB RAM / 2 vCPU (Optimized for real-time audio processing)
 */

export const INFRA_CONFIG = {
  server: {
    name: 'nexus-voice-bridge',
    region: 'nyc3',
    image: 'ubuntu-22-04-x64',
    size: 's-2vcpu-4gb',
    firewall: [
      { port: 22, protocol: 'tcp', source: 'my-ip' }, // SSH
      { port: 80, protocol: 'tcp', source: 'any' },  // HTTP
      { port: 443, protocol: 'tcp', source: 'any' }, // HTTPS
      { port: 3000, protocol: 'tcp', source: 'any' }, // App Port
    ],
  },
  runtime: {
    nodeVersion: '20.x',
    processManager: 'pm2',
    envVars: [
      'MONGODB_URI',
      'DEEPGRAM_API_KEY',
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'NEXT_PUBLIC_CF_AI_TOKEN',
      'PORTAL_JWT_SECRET'
    ]
  }
};