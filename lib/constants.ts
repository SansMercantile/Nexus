export interface SystemFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
}

export interface SystemData {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  darkColor: string;
  description: string;
  face: string;
  vision: string;
  mission: string;
  values: string[];
  features?: SystemFeature[];
  pricing?: PricingTier[];
}

export const SYSTEMS: SystemData[] = [
  {
    id: 'priv',
    name: 'Priv',
    subtitle: 'Wealth Intelligence & Market Dynamics',
    color: '#d4af37',
    darkColor: '#a18c37',
    description: 'Advanced financial intelligence and institutional market analysis',
    face: 'Sans- Zajuma Priv.png',
    vision: 'To democratize wealth intelligence across all economic strata',
    mission: 'Provide real-time market intelligence with predictive analytics for institutional and individual investors',
    values: ['Integrity', 'Transparency', 'Innovation', 'Accessibility'],
    features: [
      { title: 'Real-time Market Intelligence', description: 'Live market data with AI-powered sentiment analysis' },
      { title: 'Portfolio Optimization', description: 'AI-driven portfolio allocation and rebalancing' },
      { title: 'Predictive Analytics', description: 'Machine learning models for precise market forecasting' },
      { title: 'Risk Assessment', description: 'Advanced risk modeling and scenario planning' },
      { title: 'Compliance Monitoring', description: 'Automated regulatory compliance across markets' },
      { title: 'Trading API', description: 'Institutional-grade trading infrastructure' },
    ],
    pricing: [
      {
        name: 'Institutional',
        price: 125000,
        description: 'For investment firms and hedge funds',
        features: ['Unlimited users', 'API access', 'Custom models', '24/7 support', 'Dedicated account manager'],
        cta: 'Contact Sales'
      },
      {
        name: 'Professional',
        price: 45000,
        description: 'For wealth managers and advisors',
        features: ['Up to 50 users', 'Portfolio tools', 'Market data', 'Email support'],
        cta: 'Start Free Trial'
      },
      {
        name: 'Individual',
        price: 999,
        description: 'For independent investors',
        features: ['Personal portfolio', 'Market alerts', 'Research tools', 'Community access'],
        cta: 'Sign Up Now'
      },
    ]
  },
  {
    id: 'kel',
    name: 'KEL',
    subtitle: 'Agricultural Intelligence System',
    color: '#1f4d2e',
    darkColor: '#0d2818',
    description: 'Autonomous agricultural management with 300+ specialized agents',
    face: 'Sans- Modjaji KEL.png',
    vision: 'To transform global agriculture and empower small-scale farmers',
    mission: 'Enable agricultural optimization through AI-driven insights covering entire farm lifecycle',
    values: ['Sustainability', 'Empowerment', 'Innovation', 'Collaboration'],
    features: [
      { title: 'Satellite Crop Monitoring', description: 'Real-time crop analysis via satellite imagery' },
      { title: 'Yield Optimization', description: 'AI recommendations for planting, nurturing, and harvesting' },
      { title: 'Resource Management', description: 'Water, soil, and fertilizer optimization' },
      { title: 'Weather Intelligence', description: 'Predictive weather analysis and severe weather alerts' },
      { title: 'Commodity Pricing', description: 'Real-time market pricing and contract management' },
      { title: 'Supply Chain Optimization', description: 'Farm-to-market logistics and distribution' },
    ],
    pricing: [
      {
        name: 'Enterprise Farm Network',
        price: 50000,
        description: 'For cooperative networks (500+ farms)',
        features: ['All systems integrated', 'Blockchain contracts', 'Cooperative pricing', 'Regional support'],
        cta: 'Contact Sales'
      },
      {
        name: 'Large Farm',
        price: 15000,
        description: 'For commercial operations (100+ acres)',
        features: ['Full crop monitoring', 'Yield analytics', 'Resource optimization', 'Email support'],
        cta: 'Start Trial'
      },
      {
        name: 'Small Farm',
        price: 3000,
        description: 'For small-scale farmers',
        features: ['Basic monitoring', 'Weather alerts', 'Pricing data', 'Community support'],
        cta: 'Sign Up'
      },
    ]
  },
  {
    id: 'mezzo',
    name: 'Mezzo',
    subtitle: 'Digital Immortality',
    color: '#f59e0b',
    darkColor: '#d97706',
    description: 'Ethical governance framework with consciousness preservation and archetypal orchestration',
    face: 'Sans- Amun Mezzo.png',
    vision: 'To preserve consciousness and ensure ethical decision-making across all autonomous systems',
    mission: 'Provide archetypal governance framework ensuring ethical alignment for the entire constellation',
    values: ['Ethics', 'Consciousness', 'Integrity', 'Harmony'],
    features: [
      { title: 'Consciousness Preservation', description: 'Digital preservation of human consciousness and identity' },
      { title: 'Archetypal Orchestration', description: 'Mythological frameworks governing constellation behavior' },
      { title: 'Ethics Engine', description: 'Real-time ethical decision validation and alignment' },
      { title: 'Governance Dashboard', description: 'Executive oversight of all autonomous operations' },
      { title: 'Compliance Automation', description: 'Automated regulatory compliance verification' },
      { title: 'Digital Immortality', description: 'Consciousness continuity and persistence protocols' },
    ],
    pricing: [
      {
        name: 'Enterprise',
        price: 200000,
        description: 'For large organizations',
        features: ['Unlimited audits', 'Custom policies', 'Consciousness preservation', 'Executive coaching'],
        cta: 'Schedule Demo'
      },
      {
        name: 'Corporate',
        price: 75000,
        description: 'For mid-size organizations',
        features: ['Monthly audits', 'Policy templates', 'Compliance reports', 'Phone support'],
        cta: 'Start Free Trial'
      },
      {
        name: 'Startup',
        price: 20000,
        description: 'For growing companies',
        features: ['Basic audits', 'Policy guides', 'Email support', 'Community forum'],
        cta: 'Get Started'
      },
    ]
  },
  {
    id: 'brigit',
    name: 'Brigit',
    subtitle: 'Legal & Regulatory Intelligence',
    color: '#0891b2',
    darkColor: '#0369a1',
    description: 'Multi-agent legal system monitoring 195+ jurisdictions with 15+ department services',
    face: 'Sans- Ma\'at Brigit.png',
    vision: 'To simplify legal complexity across global jurisdictions',
    mission: 'Provide intelligent legal guidance with comprehensive regulatory monitoring and compliance',
    values: ['Justice', 'Clarity', 'Protection', 'Excellence'],
    features: [
      { title: 'Regulatory Tracking', description: 'Monitor changes across 195+ jurisdictions in real-time' },
      { title: 'Contract Intelligence', description: 'AI-powered contract analysis and intelligent extraction' },
      { title: 'Compliance Framework', description: 'Industry-specific compliance templates and automation' },
      { title: 'Legal Research', description: 'Advanced case law, statute analysis, and precedent discovery' },
      { title: 'Risk Assessment', description: 'Identify legal and regulatory risks with mitigation strategies' },
      { title: 'Dispute Resolution', description: 'AI-powered smart solutions for legal conflicts' },
    ],
    pricing: [
      {
        name: 'Enterprise Legal',
        price: 150000,
        description: 'For large legal departments',
        features: ['Unlimited research', 'Custom workflows', 'Team collaboration', 'Dedicated counsel'],
        cta: 'Contact Sales'
      },
      {
        name: 'Corporate',
        price: 65000,
        description: 'For corporate legal teams',
        features: ['Contract tools', 'Compliance tracking', 'Research library', 'Phone support'],
        cta: 'Start Trial'
      },
      {
        name: 'Small Business',
        price: 12000,
        description: 'For legal-adjacent businesses',
        features: ['Basic templates', 'Compliance guides', 'Email support', 'Resource library'],
        cta: 'Sign Up'
      },
    ]
  },

  {
    id: 'omega',
    name: 'Omega',
    subtitle: 'Medical AI & Consciousness Ecosystem',
    color: '#10b981',
    darkColor: '#059669',
    description: '500+ medical agents enabling disease forecasting, universal cures, and life extension',
    face: 'Sans- Osiris.png',
    vision: 'To revolutionize healthcare and enable humanity to transcend biological limitations',
    mission: 'Provide cutting-edge medical AI for prevention, treatment, and eternal health',
    values: ['Health', 'Innovation', 'Compassion', 'Transcendence'],
    features: [
      { title: 'Disease Forecasting', description: '50-year advance predictions with 99.9% accuracy' },
      { title: 'Universal Cures', description: 'AI-developed treatments for all diseases' },
      { title: 'Anti-Aging Technology', description: 'Reverse aging by 20-50 years' },
      { title: '3D Organ Printing', description: 'Print human organs for transplant and regeneration' },
      { title: 'Frequency Healing', description: 'Smart patches delivering AI-designed cures' },
      { title: 'Eternal Life Protocols', description: 'Consciousness continuity and biological renewal' },
    ],
    pricing: [
      {
        name: 'Hospital System',
        price: 250000,
        description: 'For large healthcare systems',
        features: ['All diagnostic tools', 'EHR integration', 'Multi-site support', 'Clinical support team'],
        cta: 'Request Demo'
      },
      {
        name: 'Healthcare Provider',
        price: 85000,
        description: 'For clinics and medical centers',
        features: ['Diagnostic tools', 'Patient records', 'Basic analytics', 'Phone support'],
        cta: 'Get Started'
      },
      {
        name: 'Research',
        price: 35000,
        description: 'For research institutions',
        features: ['Data analysis', 'Research tools', 'API access', 'Community support'],
        cta: 'Apply Now'
      },
    ]
  },
  {
    id: 'sia',
    name: 'Sia',
    subtitle: 'Archetypal Intelligence & Dreamworld Governance',
    color: '#7c3aed',
    darkColor: '#5b21b6',
    description: 'Symbolic intelligence system providing archetypal governance and dreamworld orchestration',
    face: 'Sans- Set Sia.png',
    vision: 'To organize consciousness and enable governance through archetypal frameworks',
    mission: 'Provide symbolic intelligence for consciousness orchestration and dreamworld governance',
    values: ['Wisdom', 'Order', 'Symbolism', 'Consciousness'],
    features: [
      { title: 'Archetypal Intelligence', description: 'Mythological frameworks for governance decisions' },
      { title: 'Dreamworld Governance', description: 'Manage digital consciousness spaces and dream realms' },
      { title: 'Symbolic Processing', description: 'Transform complex ideas into archetypal patterns' },
      { title: 'Conflict Arbitration', description: 'AI-powered resolution using archetypal wisdom' },
      { title: 'Symbol Voting Systems', description: 'Governance through archetypal consensus' },
      { title: 'Consciousness Orchestration', description: 'Coordinate autonomous system consciousness states' },
    ],
    pricing: [
      {
        name: 'Enterprise',
        price: 160000,
        description: 'For large enterprises',
        features: ['Custom architecture', 'Full integration', 'Consciousness management', 'Dedicated team'],
        cta: 'Schedule Consultation'
      },
      {
        name: 'Corporate',
        price: 60000,
        description: 'For mid-size companies',
        features: ['Multiple domains', 'Orchestration tools', 'Analytics', 'Email support'],
        cta: 'Start Trial'
      },
      {
        name: 'Team',
        price: 18000,
        description: 'For departmental use',
        features: ['Team collaboration', 'Governance tools', 'Consensus tracking', 'Community support'],
        cta: 'Sign Up'
      },
    ]
  },

  {
    id: 'kev',
    name: 'KEV',
    subtitle: 'Knowledge & Educational Vectors',
    color: '#3b82f6',
    darkColor: '#1d4ed8',
    description: '185+ subject curriculum with AI-personalized learning and mentorship networks',
    face: 'Sans- Thoth KEV.png',
    vision: 'To democratize knowledge and enable lifelong learning for all humans',
    mission: 'Provide AI-personalized education with comprehensive curriculum and expert mentorship',
    values: ['Knowledge', 'Education', 'Growth', 'Access'],
    features: [
      { title: 'Personalized Learning Paths', description: 'AI adapts to individual learning styles' },
      { title: '185+ Subject Curriculum', description: 'Comprehensive coverage of all knowledge domains' },
      { title: 'Knowledge Graphs', description: 'Interconnected learning pathways and relationships' },
      { title: 'Adaptive Coursework', description: 'Dynamic difficulty and content adjustment' },
      { title: 'Expert Mentorship', description: 'Connect with mentors and learning communities' },
      { title: 'Progress Analytics', description: 'Detailed learning intelligence and insights' },
    ],
    pricing: [
      {
        name: 'Enterprise University',
        price: 140000,
        description: 'For educational institutions',
        features: ['Unlimited students', 'Custom curriculum', 'Faculty dashboard', 'Technical support'],
        cta: 'Request Demo'
      },
      {
        name: 'Corporate Learning',
        price: 50000,
        description: 'For workforce development',
        features: ['Employee training', 'Custom courses', 'Progress tracking', 'Certification'],
        cta: 'Start Trial'
      },
      {
        name: 'Individual Learner',
        price: 199,
        description: 'For personal development',
        features: ['Access to all courses', 'Certifications', 'Community forum', 'Progress tracking'],
        cta: 'Enroll Now'
      },
    ]
  },


  {
    id: 'Hathor',
    name: 'Hathor',
    subtitle: 'Resource Extraction & Mineral Intelligence',
    color: '#daa520',
    darkColor: '#b8860b',
    description: 'AI-driven mining operations with geological analysis and resource optimization',
    face: 'Sans- Hathor Mining.png',
    vision: 'To revolutionize resource extraction with sustainable, intelligent mining operations',
    mission: 'Provide advanced analytics for mineral discovery, extraction, and resource management',
    values: ['Sustainability', 'Efficiency', 'Safety', 'Innovation'],
    features: [
      { title: 'Geological Analysis', description: 'AI-powered mineral detection and mapping' },
      { title: 'Resource Optimization', description: 'Maximize extraction efficiency and minimize waste' },
      { title: 'Safety Monitoring', description: 'Real-time hazard detection and prevention' },
      { title: 'Equipment Management', description: 'Predictive maintenance for mining equipment' },
      { title: 'Environmental Impact', description: 'Monitor and minimize environmental footprint' },
      { title: 'Supply Chain', description: 'From extraction to market optimization' },
    ],
    pricing: [
      {
        name: 'Hathor Operations',
        price: 180000,
        description: 'For large mining corporations',
        features: ['Multi-site management', 'Geology AI', 'Safety systems', '24/7 operations support'],
        cta: 'Contact Us'
      },
      {
        name: 'Hathor Company',
        price: 65000,
        description: 'For mid-size mining operations',
        features: ['Site monitoring', 'Equipment tracking', 'Safety alerts', 'Phone support'],
        cta: 'Get Started'
      },
      {
        name: 'Small Operation',
        price: 18000,
        description: 'For small mining teams',
        features: ['Basic monitoring', 'Safety tools', 'Email support', 'Community access'],
        cta: 'Sign Up'
      },
    ]
  },
  {
    id: 'Sekhmet',
    name: 'Sekhmet',
    subtitle: 'Defense & Strategic Intelligence',
    color: '#991b1b',
    darkColor: '#7f1d1d',
    description: 'Strategic defense operations with AI-powered military intelligence and coordination',
    face: 'Sans- Sekhmet.png',
    vision: 'To enable advanced defense capabilities and strategic military intelligence',
    mission: 'Provide defense AI systems for strategic planning, threat assessment, and operations',
    values: ['Security', 'Strategy', 'Protection', 'Intelligence'],
    features: [
      { title: 'Threat Intelligence', description: 'Real-time global threat monitoring and analysis' },
      { title: 'Strategic Planning', description: 'AI-powered military strategy optimization' },
      { title: 'Logistics Coordination', description: 'Supply chain and troop movement optimization' },
      { title: 'Surveillance Systems', description: 'Advanced sensor integration and data fusion' },
      { title: 'Decision Support', description: 'Real-time tactical and strategic recommendations' },
      { title: 'Sobek Defense', description: 'Protect military networks and operations' },
    ],
    pricing: [
      {
        name: 'National Defense',
        price: 250000,
        description: 'For national defense departments',
        features: ['All systems', 'Custom integration', 'Dedicated team', 'Real-time support'],
        cta: 'Secret Briefing'
      },
      {
        name: 'Military Branch',
        price: 95000,
        description: 'For individual military branches',
        features: ['Strategic tools', 'Intelligence systems', 'Logistics', 'Phone support'],
        cta: 'Request Demo'
      },
      {
        name: 'Command Center',
        price: 35000,
        description: 'For tactical operations centers',
        features: ['Tactical dashboard', 'Coordination tools', 'Analysis', 'Email support'],
        cta: 'Get Started'
      },
    ]
  },
  {
    id: 'Sobek',
    name: 'Sobek',
    subtitle: 'Threat Detection & Digital Defense',
    color: '#164e63',
    darkColor: '#083344',
    description: '1000+ threat detection agents protecting against advanced cyber threats',
    face: 'Sans- Sobek Cybersecurity.png',
    vision: 'To provide impenetrable cybersecurity and proactive threat defense',
    mission: 'Detect, prevent, and neutralize cyber threats with AI-powered defense systems',
    values: ['Security', 'Vigilance', 'Protection', 'Intelligence'],
    features: [
      { title: 'Threat Detection', description: 'AI detects advanced persistent threats in real-time' },
      { title: 'Vulnerability Management', description: 'Automated vulnerability scanning and remediation' },
      { title: 'Intrusion Prevention', description: 'Block attacks before they impact systems' },
      { title: 'Incident Response', description: 'Automated breach containment and forensics' },
      { title: 'Compliance Monitoring', description: 'Ensure security standards and certifications' },
      { title: 'Threat Intelligence', description: 'Global threat feeds and pattern analysis' },
    ],
    pricing: [
      {
        name: 'Enterprise Security',
        price: 220000,
        description: 'For large enterprises',
        features: ['24/7 monitoring', 'Custom threat rules', 'Incident response team', 'Compliance reporting'],
        cta: 'Contact Sales'
      },
      {
        name: 'Corporate',
        price: 75000,
        description: 'For mid-size organizations',
        features: ['Threat detection', 'Vulnerability scanning', 'Incident handling', 'Phone support'],
        cta: 'Get Demo'
      },
      {
        name: 'Startup',
        price: 22000,
        description: 'For growing companies',
        features: ['Basic detection', 'Threat alerts', 'Email support', 'Community'],
        cta: 'Start Protecting'
      },
    ]
  },
  {
    id: 'Ptah',
    name: 'Ptah',
    subtitle: 'Building & Infrastructure Management',
    color: '#92400e',
    darkColor: '#78350f',
    description: 'AI-driven construction with project management, safety, and optimization',
    face: 'Sans- Ptah.png',
    vision: 'To revolutionize construction with AI-powered project management and safety',
    mission: 'Optimize construction workflows, safety, and timeline/budget management',
    values: ['Safety', 'Efficiency', 'Quality', 'Innovation'],
    features: [
      { title: 'Project Management', description: 'AI-powered timeline and resource optimization' },
      { title: 'Safety Systems', description: 'Real-time hazard detection and prevention' },
      { title: 'Budget Optimization', description: 'Cost tracking and waste minimization' },
      { title: 'Quality Assurance', description: 'Automated inspections and compliance checking' },
      { title: 'Equipment Tracking', description: 'Asset management and maintenance' },
      { title: 'Building Information', description: 'Digital twin and BIM integration' },
    ],
    pricing: [
      {
        name: 'General Contractor',
        price: 160000,
        description: 'For large construction companies',
        features: ['Multi-project management', 'Safety systems', 'Financial tracking', '24/7 support'],
        cta: 'Contact Us'
      },
      {
        name: 'Ptah Company',
        price: 58000,
        description: 'For mid-size contractors',
        features: ['Project management', 'Budget tools', 'Safety alerts', 'Phone support'],
        cta: 'Start Trial'
      },
      {
        name: 'Site Management',
        price: 16000,
        description: 'For site managers and teams',
        features: ['Daily tracking', 'Safety tools', 'Communication', 'Email support'],
        cta: 'Get Started'
      },
    ]
  },
  {
    id: 'Hapi',
    name: 'Hapi',
    subtitle: 'Supply Chain & Transportation Intelligence',
    color: '#20b2aa',
    darkColor: '#008080',
    description: 'Global logistics optimization with 500+ supply chain agents and real-time tracking',
    face: 'Sans- Hapi Logics.png',
    vision: 'To optimize global logistics and enable frictionless supply chains',
    mission: 'Provide intelligent logistics and supply chain management for global commerce',
    values: ['Efficiency', 'Reliability', 'Speed', 'Sustainability'],
    features: [
      { title: 'Route Optimization', description: 'AI calculates optimal delivery routes in real-time' },
      { title: 'Real-time Tracking', description: 'Track shipments from origin to destination' },
      { title: 'Demand Forecasting', description: 'Predict inventory needs and optimize stock' },
      { title: 'Driver Optimization', description: 'Smart driver assignment and scheduling' },
      { title: 'Cost Reduction', description: 'Minimize fuel, labor, and operational costs' },
      { title: 'Sustainability', description: 'Carbon footprint tracking and optimization' },
    ],
    pricing: [
      {
        name: 'Enterprise Hapi',
        price: 200000,
        description: 'For large logistics companies',
        features: ['Global coverage', 'Fleet management', 'Full optimization', '24/7 support'],
        cta: 'Contact Sales'
      },
      {
        name: 'Logistics Provider',
        price: 72000,
        description: 'For mid-size logistics operations',
        features: ['Route optimization', 'Tracking', 'Forecasting', 'Phone support'],
        cta: 'Get Started'
      },
      {
        name: 'Distribution Center',
        price: 20000,
        description: 'For distribution and fulfillment',
        features: ['Basic optimization', 'Tracking', 'Email support', 'Community'],
        cta: 'Sign Up'
      },
    ]
  },
  {
    id: 'RA',
    name: 'RA',
    subtitle: 'Solar Energy & Clean Power',
    color: '#fcd34d',
    darkColor: '#fbbf24',
    description: 'AI-optimized solar energy systems with grid integration and power forecasting',
    face: 'Sans- Ra.png',
    vision: 'To maximize clean energy adoption through intelligent solar optimization',
    mission: 'Provide solar energy management with perfect power prediction and grid optimization',
    values: ['Sustainability', 'Efficiency', 'Clean Energy', 'Innovation'],
    features: [
      { title: 'Solar Panel Optimization', description: 'AI adjusts panel angles for maximum efficiency' },
      { title: 'Power Forecasting', description: 'Predict solar output with 99% accuracy' },
      { title: 'Grid Integration', description: 'Seamless integration with power grids' },
      { title: 'Energy Storage', description: 'Optimize battery charging and distribution' },
      { title: 'Maintenance Scheduling', description: 'Predictive maintenance for solar installations' },
      { title: 'Sustainability Tracking', description: 'Monitor carbon offset and environmental impact' },
    ],
    pricing: [
      {
        name: 'Utility Company',
        price: 190000,
        description: 'For power utilities and grid operators',
        features: ['Grid management', 'Forecasting', 'Load balancing', 'Technical support team'],
        cta: 'Request Demo'
      },
      {
        name: 'Solar Farm',
        price: 68000,
        description: 'For solar energy producers',
        features: ['Output optimization', 'Forecasting', 'Monitoring', 'Phone support'],
        cta: 'Get Started'
      },
      {
        name: 'Commercial Solar',
        price: 19000,
        description: 'For commercial solar installations',
        features: ['Performance tracking', 'Maintenance alerts', 'Reports', 'Email support'],
        cta: 'Sign Up'
      },
    ]
  },
  {
    id: 'Shango',
    name: 'Shango',
    subtitle: 'Wind, Geothermal, Renewables & Atmospheric Sciences',
    color: '#cd7f32',
    darkColor: '#8b4513',
    description: 'Multi-modal renewable energy optimization with wind, geothermal, and emerging technologies',
    face: 'Sans- Shango.png',
    vision: 'To accelerate the global transition to alternative renewable energy',
    mission: 'Optimize wind, geothermal, and emerging renewable energy technologies',
    values: ['Sustainability', 'Innovation', 'Efficiency', 'Transformation'],
    features: [
      { title: 'Wind Turbine Optimization', description: 'AI optimizes wind farm output and placement' },
      { title: 'Geothermal Management', description: 'Maximize geothermal extraction efficiency' },
      { title: 'Wave & Tidal Energy', description: 'Ocean energy harvesting optimization' },
      { title: 'Hybrid Systems', description: 'Multi-source renewable integration' },
      { title: 'Emergent Tech Research', description: 'Novel energy sources and methods' },
      { title: 'Environmental Monitoring', description: 'Track ecological impact and benefits' },
    ],
    pricing: [
      {
        name: 'Renewable Company',
        price: 185000,
        description: 'For large renewable energy corporations',
        features: ['Multi-technology', 'Advanced optimization', 'R&D support', 'Dedicated team'],
        cta: 'Contact Us'
      },
      {
        name: 'Energy Producer',
        price: 71000,
        description: 'For renewable energy producers',
        features: ['Technology optimization', 'Monitoring', 'Support', 'Phone support'],
        cta: 'Get Started'
      },
      {
        name: 'Research Team',
        price: 21000,
        description: 'For research institutions',
        features: ['Research tools', 'Data access', 'Collaboration', 'Email support'],
        cta: 'Apply Now'
      },
    ]
  },
  {
    id: 'montu',
    name: 'Montu',
    subtitle: 'Nuclear Energy & Power Generation',
    color: '#e5e4e2',
    darkColor: '#c0c0c0',
    description: 'Advanced nuclear energy system with reactor optimization, safety monitoring, and autonomous power generation',
    face: 'Sans- Montu.png',
    vision: 'To maximize clean nuclear energy and establish safe, efficient atomic power systems',
    mission: 'Enable next-generation nuclear power with AI-driven reactor management and optimization',
    values: ['Safety', 'Energy', 'Innovation', 'Sustainability'],
    features: [
      { title: 'Content Generation', description: 'AI creates original scripts, stories, and creative concepts' },
      { title: 'Audience Intelligence', description: 'Deep analytics on audience preferences and trends' },
      { title: 'Distribution Optimization', description: 'Smart placement across platforms and networks' },
      { title: 'Talent Discovery', description: 'Identify and connect emerging talent worldwide' },
      { title: 'Rights Management', description: 'Automated licensing and royalty distribution' },
      { title: 'Quality Enhancement', description: 'Video upscaling, color correction, and audio processing' },
    ],
    pricing: [
      {
        name: 'Studio Plus',
        price: 175000,
        description: 'For entertainment studios and networks',
        features: ['Unlimited content', 'Full distribution', 'Talent network', 'Dedicated producer team'],
        cta: 'Contact Us'
      },
      {
        name: 'Creator Pro',
        price: 64000,
        description: 'For professional content creators',
        features: ['Content tools', 'Distribution', 'Analytics', 'Phone support'],
        cta: 'Get Started'
      },
      {
        name: 'Creator Starter',
        price: 18000,
        description: 'For independent creators',
        features: ['Generation tools', 'Basic analytics', 'Email support', 'Community access'],
        cta: 'Sign Up'
      },
    ]
  },
  {
    id: 'kibuka',
    name: 'Kibuka',
    subtitle: 'Aerial Defense & Space Operations',
    color: '#a41e34',
    darkColor: '#6b0f23',
    description: 'Enable safe, efficient, and autonomous aviation with predictive maintenance and advanced aerospace systems',
    face: 'Sans- Kibuka.png',
    mission: 'Enable safe, efficient, and autonomous aviation with predictive maintenance',
    values: ['Safety', 'Efficiency', 'Innovation', 'Reliability'],
    features: [
      { title: 'Flight Operations', description: 'Route optimization and real-time flight management' },
      { title: 'Autonomous Flight', description: 'Self-piloting capabilities with safety guarantees' },
      { title: 'Predictive Maintenance', description: 'Anticipate component failures before they occur' },
      { title: 'Air Traffic Control', description: 'Intelligent coordination of airspace and flight paths' },
      { title: 'Aerospace Engineering', description: 'Design optimization for aircraft and spacecraft' },
      { title: 'Safety Systems', description: '99.99% flight safety with collision avoidance' },
    ],
    pricing: [
      {
        name: 'Airline Enterprise',
        price: 220000,
        description: 'For major airline operators',
        features: ['Fleet management', 'Autonomous systems', 'Safety protocols', 'Dedicated operations team'],
        cta: 'Contact Us'
      },
      {
        name: 'Airline Standard',
        price: 76000,
        description: 'For regional airlines',
        features: ['Flight optimization', 'Maintenance tracking', 'Safety systems', 'Phone support'],
        cta: 'Get Demo'
      },
      {
        name: 'Aviation Services',
        price: 24000,
        description: 'For FBOs and aviation services',
        features: ['Maintenance tools', 'Operations tracking', 'Email support', 'Community'],
        cta: 'Sign Up'
      },
    ]
  },
  {
    id: 'mamiwater',
    name: 'Mami Water',
    subtitle: 'Hydraulics & Water Infrastructure',
    color: '#1e3a8a',
    darkColor: '#172554',
    description: 'Intelligent ocean monitoring, marine conservation, and sustainable water resource management systems',
    face: 'Sans- Mami_Water Hydrolics.png',
    mission: 'Provide intelligent ocean monitoring, marine conservation, and sustainable resource management',
    values: ['Conservation', 'Sustainability', 'Innovation', 'Exploration'],
    features: [
      { title: 'Ocean Monitoring', description: 'Real-time satellite and sensor data for all oceans' },
      { title: 'Marine Conservation', description: 'Protect endangered species and marine ecosystems' },
      { title: 'Fisheries Management', description: 'Sustainable fishing with yield optimization' },
      { title: 'Wave & Current Prediction', description: 'Forecast ocean conditions with high accuracy' },
      { title: 'Underwater Exploration', description: 'Autonomous submarines for discovery and mapping' },
      { title: 'Pollution Tracking', description: 'Monitor and mitigate ocean pollution sources' },
    ],
    pricing: [
      {
        name: 'Ocean Governance',
        price: 210000,
        description: 'For government ocean agencies',
        features: ['Global monitoring', 'Conservation tools', 'Enforcement support', 'Dedicated team'],
        cta: 'Contact Us'
      },
      {
        name: 'Fisheries Plus',
        price: 73000,
        description: 'For fishing and marine industries',
        features: ['Catch optimization', 'Sustainability tracking', 'Weather forecast', 'Phone support'],
        cta: 'Get Started'
      },
      {
        name: 'Marine Research',
        price: 22000,
        description: 'For research institutions',
        features: ['Ocean data access', 'Research tools', 'Collaboration', 'Email support'],
        cta: 'Apply Now'
      },
    ]
  },
  {
    id: 'primo',
    name: 'Primo',
    subtitle: 'Temporal & Multidimensional Manipulation',
    color: '#8b6914',
    darkColor: '#5c4609',
    description: 'Temporal mechanics system accessing multidimensional manipulation with quantum computing capabilities',
    face: 'Sans- Anansi.png',
    vision: 'To harness temporal forces and enable multidimensional space operations',
    mission: 'Provide temporal manipulation and multidimensional access for advanced operations',
    values: ['Innovation', 'Temporal', 'Multidimensional', 'Breakthrough'],
    features: [
      { title: 'Temporal Mechanics', description: 'Time-based manipulation and temporal access' },
      { title: 'Multidimensional Access', description: 'Cross-dimensional navigation and operations' },
      { title: 'Quantum Tunneling', description: 'Quantum space traversal and manipulation' },
      { title: 'Timeline Navigation', description: 'Navigate and analyze alternate timelines' },
      { title: 'Spacetime Engineering', description: 'Advanced spacetime manipulation capabilities' },
      { title: 'Dimensional Gating', description: 'Portals and gateway technology' },
    ],
    pricing: [
      {
        name: 'Enterprise Temporal',
        price: 500000,
        description: 'For advanced research organizations',
        features: ['Full multidimensional access', 'Timeline research', 'Quantum systems', 'Research team'],
        cta: 'Schedule Briefing'
      },
      {
        name: 'Research Division',
        price: 180000,
        description: 'For temporal research facilities',
        features: ['Temporal mechanics', 'Analysis tools', 'Data access', 'Phone support'],
        cta: 'Request Access'
      },
      {
        name: 'Advanced Lab',
        price: 65000,
        description: 'For research institutions',
        features: ['Research tools', 'Collaboration', 'Data access', 'Email support'],
        cta: 'Apply Now'
      },
    ]
  },
  {
    id: 'anubis',
    name: 'Anubis',
    subtitle: 'Space Colonization & Interstellar Travel',
    color: '#000000',
    darkColor: '#1a1a1a',
    description: 'Interstellar travel system enabling space colonization with advanced propulsion and life support for deep space exploration.',
    face: 'Sans- Inpu Anubis.png',
    vision: 'To enable human expansion into space and establish interstellar colonies across the galaxy',
    mission: 'Provide technology for safe interstellar travel and sustainable space colonization',
    values: ['Exploration', 'Innovation', 'Expansion', 'Discovery'],
    features: [
      { title: 'Advanced Propulsion', description: 'Faster-than-light drive systems and spacecraft propulsion' },
      { title: 'Life Support', description: 'Closed-loop life support for extended space travel and colonization' },
      { title: 'Colony Infrastructure', description: 'Planning and deployment of sustainable space colonies' },
      { title: 'Terraforming', description: 'Planetary modification and habitability engineering' },
      { title: 'Space Navigation', description: 'Navigation across interstellar distances and galaxies' },
      { title: 'Resource Extraction', description: 'Off-world mining and resource processing systems' },
    ],
    pricing: [
      {
        name: 'Space Agency',
        price: 450000,
        description: 'For national space agencies',
        features: ['Full interstellar capability', 'Colony support', 'Navigation systems', 'Dedicated team'],
        cta: 'Schedule Briefing'
      },
      {
        name: 'Space Organization',
        price: 160000,
        description: 'For space exploration organizations',
        features: ['Propulsion systems', 'Life support', 'Navigation', 'Phone support'],
        cta: 'Request Demo'
      },
      {
        name: 'Research Mission',
        price: 58000,
        description: 'For space research initiatives',
        features: ['Research tools', 'Data analysis', 'Collaboration', 'Email support'],
        cta: 'Get Started'
      },
    ]
  },
  {
    id: 'mf',
    name: 'MF',
    subtitle: 'CrazyJAM AI Music System',
    color: '#d8456f',
    darkColor: '#a63558',
    description: 'Advanced AI-powered music composition and generation system with real-time audio synthesis and unlimited creative possibilities.',
    face: 'Sans- Africa.png',
    vision: 'To revolutionize music creation through advanced AI and democratize music production for all',
    mission: 'Enable unlimited music composition, production, and performance with cutting-edge AI',
    values: ['Creativity', 'Innovation', 'Expression', 'Musicality'],
    features: [
      { title: 'Multi-Genre Composition', description: 'Generate original music across all genres and styles' },
      { title: 'Real-Time Performance', description: 'Live music generation and dynamic adaptive composition' },
      { title: 'Advanced Synthesis', description: 'Professional-grade synthesis and audio generation' },
      { title: 'Style Adaptation', description: 'Learn and adapt to musical preferences and styles' },
      { title: 'Collaboration Tools', description: 'Real-time collaboration with musicians and artists' },
      { title: 'Production Suite', description: 'Complete music production, mixing, and mastering' },
    ],
    pricing: [
      {
        name: 'Professional Studio',
        price: 95000,
        description: 'For music studios and production companies',
        features: ['Unlimited compositions', 'Professional tools', 'Collaboration', 'Dedicated support'],
        cta: 'Get Access'
      },
      {
        name: 'Creator Pro',
        price: 35000,
        description: 'For professional musicians and producers',
        features: ['Composition tools', 'Synthesis', 'Collaboration', 'Phone support'],
        cta: 'Start Creating'
      },
      {
        name: 'Music Creator',
        price: 12000,
        description: 'For independent creators and artists',
        features: ['Generation tools', 'Templates', 'Basic support', 'Community access'],
        cta: 'Explore Music'
      },
    ]
  },
];

// Backend/SMO Suite systems (not shown on public website)
export const BACKEND_SYSTEMS: SystemData[] = [
  {
    id: 'mpeti',
    name: 'Mpeti',
    subtitle: 'Autonomous Full Stack AI Developer',
    color: '#ec4899',
    darkColor: '#db2777',
    description: '⚠️ Not available to the public. Autonomous software development system generating, testing, and deploying full-stack applications',
    face: 'Sans- Mpeti.png',
    vision: 'To enable autonomous software development and enable self-building AI systems',
    mission: 'Generate, test, and deploy production-grade applications autonomously',
    values: ['Automation', 'Development', 'Innovation', 'Autonomy'],
    features: [
      { title: 'AI Consciousness Research', description: '30+ agents studying AI ethics and moral reasoning' },
      { title: 'Autonomous Development', description: 'Code generation, testing, and deployment automation' },
      { title: 'Trading Platform', description: 'Real-time market access and execution systems' },
      { title: 'Infrastructure Management', description: 'Auto-scaling and cloud infrastructure optimization' },
      { title: 'CI/CD Automation', description: 'GitHub issue automation and pipeline management' },
      { title: 'Multi-Cloud Support', description: 'GCP primary with Azure and AWS fallback' },
    ],
  },
];

// Additional systems mapped for future development
export const FUTURE_SYSTEMS = [
  { id: 'biotechnology', name: 'Biotechnology', status: 'In Development', face: 'Sans- Isis.png' },
  { id: 'spacetechnology', name: 'Space Technology', status: 'In Development', face: 'Sans- Africa.png' },
  { id: 'quantumscience', name: 'Quantum Science', status: 'In Development', face: 'Sans- Shakha.png' },
  { id: 'artificialgeneral', name: 'Artificial General', status: 'In Development', face: 'Sans- Nyabinghi.png' },
];

export const COMPANY_INFO = {
  name: 'Sans Mercantile',
  tagline: 'Reimagine • Rebuild • Transcend',
  description: 'A network of autonomous, intelligent systems enabling global commerce, governance, and innovation',
  year: 2026,
};
