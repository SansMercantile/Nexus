import { getSystemBySlug } from './system-data';
import { SystemData } from './constants';

export interface CaseStudy {
  systemId: string;
  title: string;
  subtitle: string;
  industry: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: Array<{ label: string; value: string }>;
  quote: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    systemId: 'priv',
    title: 'Priv: Financial Intelligence for Institutional Capital',
    subtitle: 'Transforming wealth management with predictive market intelligence',
    industry: 'Finance & Investment',
    overview: 'Priv helped a global asset manager unify fragmented data, automate risk decisions, and accelerate product launches with intelligent wealth analytics.',
    challenge: 'The client could not scale market research, portfolio risk, and compliance across geographies without manual workflows and isolated tools.',
    solution: 'Priv delivered a single AI-driven operating layer for portfolio optimization, real-time market surveillance, and compliance monitoring.',
    results: [
      '45% faster investment decision cycles',
      '28% improvement in risk-adjusted returns',
      '50% reduction in manual compliance reviews',
    ],
    metrics: [
      { label: 'Time to decision', value: '45% faster' },
      { label: 'Return improvement', value: '28%' },
      { label: 'Compliance efficiency', value: '50% less manual work' },
    ],
    quote: 'Priv gave our investment teams the confidence to move faster with better risk discipline.',
  },
  {
    systemId: 'kel',
    title: 'KEL: Precision Agriculture for Climate-Resilient Farms',
    subtitle: 'Boosting yields and sustainability for smallholder cooperatives',
    industry: 'Agriculture',
    overview: 'KEL empowered a network of farmers to increase yields, cut input waste, and gain stronger access to markets through precision agriculture intelligence.',
    challenge: 'Farmers lacked unified visibility into weather, soil, and market conditions, which led to costly planting decisions and resource waste.',
    solution: 'KEL combined satellite analytics, predictive climate modeling, and supply chain intelligence to optimize crop planning and procurement.',
    results: [
      '30% increase in crop yield per hectare',
      '22% reduction in water and fertilizer use',
      '18% growth in farm revenue through smarter pricing',
    ],
    metrics: [
      { label: 'Yield increase', value: '30%' },
      { label: 'Input reduction', value: '22%' },
      { label: 'Revenue growth', value: '18%' },
    ],
    quote: 'KEL turned data into the practical farming guidance our co-op needed to thrive.',
  },
  {
    systemId: 'mezzo',
    title: 'Mezzo: Ethical Governance for Autonomous Enterprises',
    subtitle: 'Embedding trust and compliance into AI-led decision systems',
    industry: 'Enterprise Governance',
    overview: 'Mezzo delivered an ethics-first governance framework that allowed an enterprise to scale autonomous operations without sacrificing oversight.',
    challenge: 'The organization struggled to keep digital decision systems aligned with evolving regulatory and ethical expectations.',
    solution: 'Mezzo provided real-time policy validation, audit trails, and governance workflows across the company’s autonomous platforms.',
    results: [
      '99% reduction in governance exceptions',
      '60% faster regulatory review cycles',
      'Improved stakeholder trust through transparent controls',
    ],
    metrics: [
      { label: 'Governance exceptions', value: '99% lower' },
      { label: 'Review speed', value: '60% faster' },
      { label: 'Stakeholder confidence', value: 'High' },
    ],
    quote: 'Mezzo gave us a practical way to govern autonomous systems at enterprise scale.',
  },
  {
    systemId: 'brigit',
    title: 'Brigit: Legal Intelligence for Global Compliance',
    subtitle: 'Simplifying regulatory complexity across multiple jurisdictions',
    industry: 'Legal & Regulatory',
    overview: 'Brigit helped a multinational services firm automate compliance monitoring and reduce regulatory risk across 20 countries.',
    challenge: 'Manual legal reviews and fragmented regulatory data slowed business expansion and increased compliance costs.',
    solution: 'Brigit centralized rule monitoring, contract analysis, and compliance workflows into a single intelligent platform.',
    results: [
      '40% reduction in legal review time',
      '30% fewer regulatory breaches',
      'Faster contract turnaround for new markets',
    ],
    metrics: [
      { label: 'Review time', value: '40% lower' },
      { label: 'Regulatory breaches', value: '30% fewer' },
      { label: 'Market entry speed', value: 'Improved' },
    ],
    quote: 'Brigit turned compliance from a bottleneck into a competitive advantage.',
  },
  {
    systemId: 'omega',
    title: 'Omega: Predictive Healthcare for Better Outcomes',
    subtitle: 'Accelerating diagnosis and treatment with medical AI systems',
    industry: 'Healthcare',
    overview: 'Omega enabled a regional healthcare network to improve patient outcomes by predicting disease risk and optimizing clinical workflows.',
    challenge: 'Doctors lacked fast access to predictive insights, which delayed diagnosis and treatment planning.',
    solution: 'Omega deployed predictive models, clinical decision support, and patient engagement pathways across the network.',
    results: [
      '25% faster diagnostic decision-making',
      '18% reduction in hospital readmissions',
      '14% improvement in patient satisfaction scores',
    ],
    metrics: [
      { label: 'Decision speed', value: '25% faster' },
      { label: 'Readmissions', value: '18% lower' },
      { label: 'Patient satisfaction', value: '14% higher' },
    ],
    quote: 'Omega helped clinicians deliver smarter care at every stage of the patient journey.',
  },
  {
    systemId: 'sia',
    title: 'SIA: Supply Chain Intelligence for Resilient Commerce',
    subtitle: 'Reducing waste and unlocking agility across global logistics networks',
    industry: 'Logistics & Supply Chain',
    overview: 'SIA helped a retail supply chain reduce costs and improve delivery reliability through demand forecasting and transportation optimization.',
    challenge: 'Unexpected demand swings and logistics disruptions caused inventory imbalances and missed deliveries.',
    solution: 'SIA synchronized demand planning, routing, and inventory with intelligent analytics and real-time monitoring.',
    results: [
      '32% fewer stockouts',
      '18% lower logistics costs',
      '22% faster order fulfillment',
    ],
    metrics: [
      { label: 'Stockouts', value: '32% fewer' },
      { label: 'Logistics cost', value: '18% lower' },
      { label: 'Order speed', value: '22% faster' },
    ],
    quote: 'SIA gave us the visibility and control we needed to make our supply chain dependable.',
  },
  {
    systemId: 'kev',
    title: 'Kev: Personalized Learning for Workforce Transformation',
    subtitle: 'Scaling education and skills development with adaptive AI',
    industry: 'Education & Training',
    overview: 'Kev helped a large enterprise retrain teams by delivering personalized learning paths and measurable skills growth at scale.',
    challenge: 'Training programs were generic, slow, and failed to keep pace with changing role requirements.',
    solution: 'Kev provided adaptive learning journeys, knowledge assessments, and progress tracking for every employee.',
    results: [
      '40% higher course completion rates',
      '35% faster time-to-proficiency',
      '21% increase in internal role mobility',
    ],
    metrics: [
      { label: 'Completion rate', value: '40% higher' },
      { label: 'Proficiency speed', value: '35% faster' },
      { label: 'Role mobility', value: '21% higher' },
    ],
    quote: 'Kev turned our learning programs into a strategic capability for growth.',
  },
  {
    systemId: 'Hapi',
    title: 'Hapi: Intelligent Logistics for Fast-Moving Goods',
    subtitle: 'Reducing transport friction while improving delivery predictability',
    industry: 'Transportation & Logistics',
    overview: 'Hapi helped a global distributor optimize routes and inventory planning to support on-time delivery and lower operating costs.',
    challenge: 'Manual route planning and poor demand forecasting led to missed shipments and bloated inventory.',
    solution: 'Hapi provided real-time routing, automated carrier selection, and dynamic stock balancing.',
    results: [
      '28% fewer late deliveries',
      '20% improvement in network utilization',
      '15% reduction in fuel impact',
    ],
    metrics: [
      { label: 'Late deliveries', value: '28% fewer' },
      { label: 'Utilization', value: '20% better' },
      { label: 'Fuel impact', value: '15% lower' },
    ],
    quote: 'Hapi transformed our distribution network from reactive to predictive.',
  },
  {
    systemId: 'RA',
    title: 'RA: Solar Fleet Optimization for Renewable Utilities',
    subtitle: 'Improving energy yield and grid reliability with AI-managed solar power',
    industry: 'Clean Energy',
    overview: 'RA enabled a solar operator to maximize output, reduce downtime, and improve grid integration using intelligent forecasting.',
    challenge: 'Inconsistent solar output and poor storage scheduling created reliability challenges for the grid.',
    solution: 'RA synchronized generation forecasting, storage management, and grid dispatch for the utility’s solar portfolio.',
    results: [
      '12% higher energy yield',
      '25% reduction in storage imbalances',
      '20% stronger grid stability during peak demand',
    ],
    metrics: [
      { label: 'Energy yield', value: '12% higher' },
      { label: 'Storage variance', value: '25% lower' },
      { label: 'Grid stability', value: '20% stronger' },
    ],
    quote: 'RA helped us turn solar into a dependable grid asset, not just an intermittent source.',
  },
  {
    systemId: 'Shango',
    title: 'Shango: Renewable Energy Integration for Industrial Power',
    subtitle: 'Driving efficiency across wind, geothermal, and hybrid energy systems',
    industry: 'Renewable Energy',
    overview: 'Shango supported an industrial energy provider in blending wind and geothermal assets to improve performance and reduce carbon intensity.',
    challenge: 'Energy sources were managed in isolation, causing inefficiencies and missed optimization opportunities.',
    solution: 'Shango coordinated renewable dispatch, asset maintenance, and environmental monitoring with adaptive control systems.',
    results: [
      '18% higher portfolio efficiency',
      '14% reduction in operational risk',
      '9% lower emissions intensity',
    ],
    metrics: [
      { label: 'Portfolio efficiency', value: '18% higher' },
      { label: 'Risk reduction', value: '14%' },
      { label: 'Emissions intensity', value: '9% lower' },
    ],
    quote: 'Shango showed us how to run renewables together as one intelligent system.',
  },
  {
    systemId: 'montu',
    title: 'Montu: Autonomous Reactor Management for Nuclear Safety',
    subtitle: 'Enhancing reliability and regulatory confidence in nuclear power plants',
    industry: 'Power Generation',
    overview: 'Montu enabled a nuclear operator to reduce safety incidents and improve reactor throughput through smart automation.',
    challenge: 'Conventional monitoring could not respond quickly enough to subtle reactor condition changes.',
    solution: 'Montu layered predictive maintenance, automated controls, and safety validation over the plant’s operations.',
    results: [
      '22% fewer maintenance incidents',
      '12% higher plant availability',
      'Improved regulatory reporting cadence',
    ],
    metrics: [
      { label: 'Maintenance incidents', value: '22% fewer' },
      { label: 'Availability', value: '12% higher' },
      { label: 'Reporting', value: 'Improved' },
    ],
    quote: 'Montu gave us a smarter way to keep nuclear power safe and productive.',
  },
  {
    systemId: 'kibuka',
    title: 'Kibuka: Autonomous Flight Safety for Aviation Operations',
    subtitle: 'Enhancing airspace efficiency and safety with predictive aerospace intelligence',
    industry: 'Aerospace & Defense',
    overview: 'Kibuka supported a commercial fleet with predictive maintenance, autonomous routing, and safer air traffic coordination.',
    challenge: 'Unplanned aircraft downtime and congested airspace were reducing flight reliability and operational margins.',
    solution: 'Kibuka introduced intelligent maintenance forecasting, flight mission planning, and adaptive airspace control.',
    results: [
      '30% fewer ground delays',
      '18% lower maintenance events',
      '14% improvement in on-time performance',
    ],
    metrics: [
      { label: 'Ground delays', value: '30% fewer' },
      { label: 'Maintenance events', value: '18% lower' },
      { label: 'On-time performance', value: '14% better' },
    ],
    quote: 'Kibuka helped us move from reactive aviation operations to predictive flight management.',
  },
  {
    systemId: 'mamiwata',
    title: 'Mami Wata: Smart Ocean Stewardship for Marine Sustainability',
    subtitle: 'Protecting marine ecosystems while unlocking safe maritime commerce',
    industry: 'Marine & Water Infrastructure',
    overview: 'Mami Wata enabled a coastal authority to monitor ocean health, protect fisheries, and reduce pollution through automated marine intelligence.',
    challenge: 'Environmental threats and unregulated fishing were damaging coastal ecosystems and local livelihoods.',
    solution: 'Mami Wata combined real-time sensors, patrol coordination, and sustainable resource planning for marine resilience.',
    results: [
      '42% stronger habitat protection coverage',
      '24% lower illegal fishing incidents',
      '12% improvement in coastal resource productivity',
    ],
    metrics: [
      { label: 'Protection coverage', value: '42% stronger' },
      { label: 'Illegal fishing', value: '24% lower' },
      { label: 'Resource productivity', value: '12% higher' },
    ],
    quote: 'Mami Wata made our coastal stewardship both smarter and more sustainable.',
  },
  {
    systemId: 'primo',
    title: 'Primo: Temporal Research for Advanced R&D Programs',
    subtitle: 'Supporting complex experimentation with time-aware planning and analysis',
    industry: 'Research & Development',
    overview: 'Primo helped a research lab accelerate experimental cycles and coordinate complex simulation workflows with temporal intelligence.',
    challenge: 'Long-running experiments were difficult to schedule and adapt when conditions shifted.',
    solution: 'Primo created a temporal operations layer that aligned experiment planning, data collection, and analysis across time horizons.',
    results: [
      '20% faster experiment iteration',
      '15% higher research throughput',
      'Improved cross-team collaboration on time-sensitive work',
    ],
    metrics: [
      { label: 'Iteration speed', value: '20% faster' },
      { label: 'Throughput', value: '15% higher' },
      { label: 'Collaboration', value: 'Improved' },
    ],
    quote: 'Primo helped our research teams make time an asset instead of a constraint.',
  },
  {
    systemId: 'anubis',
    title: 'Anubis: Sustainable Mission Planning for Space Exploration',
    subtitle: 'Enabling safer, more resilient interstellar operations and habitats',
    industry: 'Space Exploration',
    overview: 'Anubis supported a space agency in planning sustainable off-world missions and habitat systems with advanced simulation and life support intelligence.',
    challenge: 'Interstellar mission planning required balancing crew safety, resource limits, and environmental resilience.',
    solution: 'Anubis delivered integrated life support models, propulsion scheduling, and resource extraction planning for space habitats.',
    results: [
      '18% more efficient mission fuel planning',
      '28% stronger life support resilience',
      'Improved sustainability planning for off-world habitats',
    ],
    metrics: [
      { label: 'Fuel planning', value: '18% more efficient' },
      { label: 'Resilience', value: '28% stronger' },
      { label: 'Sustainability', value: 'Improved' },
    ],
    quote: 'Anubis put sustainable rigor behind every mission decision.',
  },
  {
    systemId: 'crazyjam',
    title: 'CRAZYJAM: AI Music Innovation for Creative Teams',
    subtitle: 'Accelerating music creation with intelligent composition workflows',
    industry: 'Media & Entertainment',
    overview: 'CRAZYJAM helped a creative studio produce more music faster by automating composition, mixing, and collaborative iteration.',
    challenge: 'Traditional music production was slow and de-prioritized experimental ideas due to time constraints.',
    solution: 'CRAZYJAM delivered adaptive composition, style blending, and collaboration tools that preserved artistic intent.',
    results: [
      '3x faster music production cycles',
      '25% more completed creative concepts',
      'Stronger collaboration between artists and producers',
    ],
    metrics: [
      { label: 'Production speed', value: '3x faster' },
      { label: 'Creative output', value: '25% higher' },
      { label: 'Collaboration', value: 'Stronger' },
    ],
    quote: 'CRAZYJAM helped our artists explore ideas faster without losing the soul of the work.',
  },
];

export function getAllCaseStudies(): CaseStudy[] {
  return CASE_STUDIES;
}

export function getCaseStudyBySystem(systemId: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.systemId.toLowerCase() === systemId.toLowerCase());
}

export function getCaseStudySystemData(systemId: string): SystemData | undefined {
  return getSystemBySlug(systemId);
}
