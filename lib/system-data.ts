import { SYSTEMS, SystemData } from './constants';

export type SystemValueDescription = {
  title: string;
  description: string;
};

export type SystemSdg = {
  goal: string;
  title: string;
  description: string;
};

const SYSTEM_VALUE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  priv: {
    Integrity: 'Secure, auditable financial decisions that build long-term trust for investors and institutions.',
    Transparency: 'Open market visibility and explainable intelligence to reduce hidden risk.',
    Innovation: 'AI-driven wealth strategies that adapt to shifting markets and emerging opportunities.',
    Accessibility: 'Wealth intelligence designed to broaden access for underserved markets and digital investors.',
  },
  kel: {
    Sustainability: 'Optimize land, water, and inputs so farming is productive without harming future harvests.',
    Empowerment: 'Give smallholder farmers actionable insight and market access to increase resilience.',
    Innovation: 'Use data-driven recommendations to boost yields and reduce waste across the farm lifecycle.',
    Collaboration: 'Connect growers, suppliers, and buyers through shared agricultural intelligence.',
  },
  mezzo: {
    Ethics: 'Embed ethical oversight into every decision the constellation makes on behalf of organizations.',
    Consciousness: 'Preserve and respect human-centered values while guiding autonomous systems.',
    Integrity: 'Ensure governance, policy, and system behavior remain aligned with mission-critical standards.',
    Harmony: 'Balance performance, risk, and human oversight across the broader platform.',
  },
  brigit: {
    Justice: 'Deliver legal clarity and fair regulatory outcomes across jurisdictions.',
    Clarity: 'Translate complex law into understandable guidance for organizations and leaders.',
    Protection: 'Guard firms against regulatory risk with proactive monitoring and response.',
    Excellence: 'Raise the standard of compliance through AI-enhanced legal intelligence.',
  },
  omega: {
    Health: 'Drive earlier detection, prevention, and treatment with predictive medical intelligence.',
    Innovation: 'Translate advanced biomedical research into practical healthcare outcomes.',
    Compassion: 'Support patient-centered care by combining data with empathy and ethical context.',
    Transcendence: 'Extend the boundaries of human health through intelligent life extension systems.',
  },
  sia: {
    Efficiency: 'Streamline logistics and operations to reduce waste and improve speed.',
    Reliability: 'Create dependable supply chains with intelligent routing and risk mitigation.',
    Speed: 'Accelerate delivery and decision cycles across global commerce networks.',
    Sustainability: 'Optimize transport and inventory to lower carbon footprint and resource use.',
  },
  kev: {
    Knowledge: 'Deliver adaptive learning experiences that build expertise and job readiness.',
    Education: 'Close skills gaps by personalizing curriculum for diverse learners and teams.',
    Growth: 'Help organizations and individuals scale competency through continuous learning.',
    Access: 'Break down barriers to education with inclusive, AI-enabled instruction.',
  },
  Hathor: {
    Wisdom: 'Capture institutional knowledge and apply it to governance decisions.',
    Order: 'Bring structure to complex systems through symbolic intelligence and policy frameworks.',
    Symbolism: 'Use archetypal constructs to align behavior with shared values and purpose.',
    Consciousness: 'Ensure decisions reflect both human and system-level perspective.',
  },
  Sekhmet: {
    Security: 'Protect critical assets and people with intelligent defensive posture and response.',
    Strategy: 'Align operational planning with real-time risk and mission objectives.',
    Protection: 'Maintain resilience for systems and communities under threat.',
    Intelligence: 'Use data-driven insights to anticipate and neutralize emerging hazards.',
  },
  Sobek: {
    Safety: 'Minimize environmental and human risk in resource extraction operations.',
    Efficiency: 'Increase productivity while reducing material and energy waste.',
    Quality: 'Deliver reliable outcomes through rigorous monitoring and automation.',
    Innovation: 'Reimagine extractive industries with intelligent, low-impact systems.',
  },
  Ptah: {
    Safety: 'Build infrastructure with safety-first design and predictive monitoring.',
    Energy: 'Optimize power and materials usage to support sustainable construction.',
    Innovation: 'Apply intelligent planning to reduce cost and accelerate delivery.',
    Sustainability: 'Design built environments with long-term ecological and operational resilience.',
  },
  Hapi: {
    Efficiency: 'Reduce logistics friction through smarter routing and capacity planning.',
    Reliability: 'Keep shipments moving with redundant, predictive transport networks.',
    Speed: 'Move goods faster while preserving accuracy and compliance.',
    Sustainability: 'Cut fuel use and emissions with optimized supply chain orchestration.',
  },
  RA: {
    Sustainability: 'Maximize clean energy output while minimizing ecological impact.',
    Efficiency: 'Balance generation, storage, and demand with smart energy orchestration.',
    'Clean Energy': 'Enable wider adoption of solar and renewable power at grid scale.',
    Innovation: 'Advance distributed energy systems with forecasting and automation.',
  },
  Shango: {
    Sustainability: 'Accelerate adoption of renewables while protecting environmental systems.',
    Innovation: 'Develop new clean technologies for wind, geothermal, and atmospheric science.',
    Efficiency: 'Boost energy yield with intelligent resource and infrastructure management.',
    Transformation: 'Help industries transition from fossil fuel dependence to resilient power systems.',
  },
  montu: {
    Safety: 'Ensure nuclear systems operate within the highest safety and regulatory standards.',
    Energy: 'Deliver reliable, low-carbon power using advanced reactor control.',
    Innovation: 'Use AI to optimize reactor performance and reduce operational risk.',
    Sustainability: 'Support clean baseload energy with safe, autonomous management.',
  },
  kibuka: {
    Safety: 'Maintain secure airspace and autonomous flight operations with precision controls.',
    Efficiency: 'Reduce delays and resource waste through intelligent aerospace orchestration.',
    Innovation: 'Apply next-generation avionics and predictive maintenance systems.',
    Reliability: 'Deliver consistent mission performance for aviation and space operations.',
  },
  mamiwata: {
    Conservation: 'Protect marine ecosystems with smart monitoring and enforcement tools.',
    Sustainability: 'Manage water and ocean resources for long-term ecological health.',
    Innovation: 'Use advanced sensors and autonomy to unlock new maritime science.',
    Exploration: 'Discover underwater environments safely and responsibly.',
  },
  primo: {
    Innovation: 'Invent new temporal and multidimensional capabilities with intentional rigor.',
    Temporal: 'Harness time-based systems to improve planning, research, and resilience.',
    Multidimensional: 'Coordinate operations across multiple dimensions and information domains.',
    Breakthrough: 'Enable discoveries that advance science, engineering, and enterprise strategy.',
  },
  anubis: {
    Exploration: 'Open safe pathways for human and cargo travel beyond Earth.',
    Innovation: 'Advance propulsion, habitat, and life support for interstellar missions.',
    Expansion: 'Build sustainable infrastructure for off-world communities.',
    Discovery: 'Enable scientific research in new planetary and orbital environments.',
  },
  crazyjam: {
    Creativity: 'Accelerate artistic creation through intelligent collaboration and inspiration.',
    Innovation: 'Push the boundaries of music production with adaptive AI tools.',
    Expression: 'Allow artists to translate ideas into original soundscapes at scale.',
    Musicality: 'Preserve musical nuance while generating professional-grade compositions.',
  },
};

const SYSTEM_SDG_ALIGNMENTS: Record<string, SystemSdg[]> = {
  priv: [
    { goal: '8', title: 'Decent Work & Economic Growth', description: 'Support stronger financial systems and inclusive economic opportunities.' },
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Build resilient financial infrastructure powered by intelligent markets.' },
    { goal: '10', title: 'Reduced Inequalities', description: 'Improve access to wealth management for underserved communities.' },
  ],
  kel: [
    { goal: '2', title: 'Zero Hunger', description: 'Increase agricultural productivity and support food security for farming communities.' },
    { goal: '12', title: 'Responsible Consumption & Production', description: 'Optimize resource use in agriculture through smart input management.' },
    { goal: '13', title: 'Climate Action', description: 'Reduce farming emissions and improve resilience to weather extremes.' },
    { goal: '15', title: 'Life on Land', description: 'Protect soil health and biodiversity across agricultural landscapes.' },
  ],
  mezzo: [
    { goal: '16', title: 'Peace, Justice & Strong Institutions', description: 'Embed ethical governance into autonomous systems and business operations.' },
    { goal: '17', title: 'Partnerships for the Goals', description: 'Enable aligned decision-making across teams, regulators, and stakeholders.' },
  ],
  brigit: [
    { goal: '16', title: 'Peace, Justice & Strong Institutions', description: 'Simplify regulatory compliance and strengthen legal accountability.' },
    { goal: '10', title: 'Reduced Inequalities', description: 'Make legal intelligence more accessible to global businesses and jurisdictions.' },
    { goal: '17', title: 'Partnerships for the Goals', description: 'Support collaborative risk management across cross-border operations.' },
  ],
  omega: [
    { goal: '3', title: 'Good Health & Well-being', description: 'Advance medical outcomes through predictive, personalized healthcare.' },
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Scale health systems with intelligent diagnostics and treatment planning.' },
    { goal: '10', title: 'Reduced Inequalities', description: 'Extend care access to underserved populations with AI-driven workflows.' },
  ],
  sia: [
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Improve transport infrastructure with smarter, more resilient logistics.' },
    { goal: '12', title: 'Responsible Consumption & Production', description: 'Lower waste across global supply chains and inventory systems.' },
    { goal: '8', title: 'Decent Work & Economic Growth', description: 'Support efficient trade and commerce that creates sustainable jobs.' },
  ],
  kev: [
    { goal: '4', title: 'Quality Education', description: 'Deliver adaptive learning and skills development for a changing workforce.' },
    { goal: '5', title: 'Gender Equality', description: 'Increase learning access and opportunity for all learners.' },
    { goal: '8', title: 'Decent Work & Economic Growth', description: 'Prepare talent for emerging roles and better careers.' },
  ],
  Hathor: [
    { goal: '4', title: 'Quality Education', description: 'Share knowledge responsibly through symbolic and governance intelligence.' },
    { goal: '16', title: 'Peace, Justice & Strong Institutions', description: 'Strengthen institutional decision-making with structured wisdom.' },
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Support resilient governance systems across complex organizations.' },
  ],
  Sekhmet: [
    { goal: '16', title: 'Peace, Justice & Strong Institutions', description: 'Protect people and infrastructure with intelligent defense systems.' },
    { goal: '11', title: 'Sustainable Cities & Communities', description: 'Help maintain safe, resilient communities under changing threats.' },
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Advance security infrastructure with predictive analytics and response.' },
  ],
  Sobek: [
    { goal: '8', title: 'Decent Work & Economic Growth', description: 'Support safer, more productive resource industries.' },
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Modernize extraction with intelligent monitoring and automation.' },
    { goal: '12', title: 'Responsible Consumption & Production', description: 'Reduce environmental impact through responsible mining and processing.' },
    { goal: '15', title: 'Life on Land', description: 'Protect land ecosystems while sourcing critical materials.' },
  ],
  Ptah: [
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Build smarter, more resilient infrastructure with AI-driven planning.' },
    { goal: '11', title: 'Sustainable Cities & Communities', description: 'Deliver safer and more sustainable construction outcomes.' },
    { goal: '12', title: 'Responsible Consumption & Production', description: 'Optimize materials and energy use across construction lifecycles.' },
  ],
  Hapi: [
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Connect supply chains through intelligent logistics platforms.' },
    { goal: '13', title: 'Climate Action', description: 'Reduce transport emissions by optimizing routes and loads.' },
    { goal: '12', title: 'Responsible Consumption & Production', description: 'Drive resource efficiency across global distribution networks.' },
  ],
  RA: [
    { goal: '7', title: 'Affordable & Clean Energy', description: 'Expand clean solar generation with smart grid integration.' },
    { goal: '11', title: 'Sustainable Cities & Communities', description: 'Support resilient energy access for urban and commercial systems.' },
    { goal: '13', title: 'Climate Action', description: 'Cut carbon emissions by making solar reliable and predictable.' },
  ],
  Shango: [
    { goal: '7', title: 'Affordable & Clean Energy', description: 'Bring diverse renewable power sources into practical use.' },
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Advance clean-energy infrastructure for a low-carbon future.' },
    { goal: '13', title: 'Climate Action', description: 'Reduce reliance on fossil fuel systems with intelligent renewables.' },
  ],
  montu: [
    { goal: '7', title: 'Affordable & Clean Energy', description: 'Support safe nuclear power as a low-carbon baseload resource.' },
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Modernize power generation with autonomous reactor control.' },
    { goal: '12', title: 'Responsible Consumption & Production', description: 'Improve energy efficiency and waste management in nuclear operations.' },
  ],
  kibuka: [
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Advance aerospace systems that improve transport reliability.' },
    { goal: '11', title: 'Sustainable Cities & Communities', description: 'Enable safer, more efficient air mobility and logistics.' },
    { goal: '3', title: 'Good Health & Well-being', description: 'Reduce accident risk through predictive maintenance and safety systems.' },
  ],
  mamiwata: [
    { goal: '14', title: 'Life Below Water', description: 'Protect ocean health with smart monitoring and conservation systems.' },
    { goal: '6', title: 'Clean Water & Sanitation', description: 'Manage water resources to improve access and quality.' },
    { goal: '13', title: 'Climate Action', description: 'Build resilience to ocean change through adaptive maritime intelligence.' },
  ],
  primo: [
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Develop advanced temporal systems that strengthen scientific infrastructure.' },
    { goal: '17', title: 'Partnerships for the Goals', description: 'Enable collaboration across dimensions of research and operations.' },
  ],
  anubis: [
    { goal: '9', title: 'Industry, Innovation & Infrastructure', description: 'Expand the frontiers of aerospace and space-colonization infrastructure.' },
    { goal: '17', title: 'Partnerships for the Goals', description: 'Coordinate international exploration through shared knowledge and resources.' },
    { goal: '11', title: 'Sustainable Cities & Communities', description: 'Design sustainable habitats for off-world settlement and research.' },
  ],
  crazyjam: [
    { goal: '4', title: 'Quality Education', description: 'Support creative learning and the development of artistic skills.' },
    { goal: '8', title: 'Decent Work & Economic Growth', description: 'Create new opportunities for musicians and cultural workers.' },
    { goal: '11', title: 'Sustainable Cities & Communities', description: 'Enrich communities through inclusive, culturally relevant creative technology.' },
  ],
};

export const systemsData: SystemData[] = SYSTEMS;

export function getSystemBySlug(slug: string): SystemData | undefined {
  return SYSTEMS.find((system) => system.id === slug);
}

export function getSystemById(id: string): SystemData | undefined {
  return SYSTEMS.find((system) => system.id === id);
}

export function getAllSystems(): SystemData[] {
  return SYSTEMS;
}

export function getSystemValueDescription(systemId: string, value: string): string | undefined {
  return SYSTEM_VALUE_DESCRIPTIONS[systemId]?.[value];
}

export function getSystemSdgs(systemId: string): SystemSdg[] {
  return SYSTEM_SDG_ALIGNMENTS[systemId] || [];
}

export function getSystemValueDetails(systemId: string, values: string[]): SystemValueDescription[] {
  return values.map((value) => ({
    title: value,
    description:
      getSystemValueDescription(systemId, value) || `Core value driving ${systemId} operations`,
  }));
}
