import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Linkedin, MapPin, Briefcase,
  Cpu, ShieldCheck, ChevronRight,
  GraduationCap, Layers, Rocket, Medal, Quote,
  Lightbulb, Target, Compass, Activity, Zap,
  Globe, Bot, Loader2, Search, ExternalLink, Terminal
} from 'lucide-react';

/** * --- SOVEREIGN BRIDGE CONFIGURATION ---
 */
const OLLAMA_ENDPOINT = "https://plain-bikes-follow.loca.lt/api/generate";
const OLLAMA_MODEL = "hermes3:8b";

const callOllama = async (prompt, systemInstruction) => {
  const payload = {
    model: OLLAMA_MODEL,
    prompt: `System: ${systemInstruction}\n\nUser: ${prompt}`,
    stream: false,
    options: { temperature: 0.7 }
  };

  const maxRetries = 5;
  const backoffDelays = [1000, 2000, 4000, 8000, 16000];

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(OLLAMA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status >= 500 && i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, backoffDelays[i]));
          continue;
        }
        throw new Error(`Uplink failed with status: ${response.status}`);
      }

      const result = await response.json();
      return result.response;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, backoffDelays[i]));
    }
  }
};

// --- LOGO COMPONENT ---
const SansMercantileLogo = () => {
  const brandOrange = '#ff7a00';
  return (
    <div className="group relative inline-flex items-center justify-center cursor-pointer h-10 min-w-[200px]">
      <div className="flex items-center gap-2 transition-all duration-500 ease-in-out transform group-hover:scale-50 group-hover:opacity-0 pointer-events-none">
        <span className="text-xl font-bold" style={{ color: brandOrange }}>
          Sans
        </span>
        <span
          className="text-xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #ffffff, #e0e0e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          }}
        >
          Mercantile™
        </span>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 pointer-events-none"
      >
        <img
          src="/logo.svg"
          alt="Sans Mercantile Logo"
          className="w-10 h-10 object-contain"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255, 122, 0, 0.4))' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span className="ml-2 font-black text-white tracking-widest text-xs uppercase">Sovereign_Node</span>
      </div>
    </div>
  );
};

const App = () => {
  const [glitch, setGlitch] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [isConsulting, setIsConsulting] = useState(false);
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4500);

    const pulseInterval = setInterval(() => {
      setPulse(p => (p + 1) % 100);
    }, 50);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  const profile = {
    name: "Mezzoforte Privilege",
    handle: "CEO | SOVEREIGN ARCHITECT",
    contact: {
      email: "mezzoforte@sansmercantile.com",
      phone: "+27663496137",
      linkedin: "linkedin.com/in/mezzoforte-p-49250a67",
      location: "Fukuoka, Japan | Remote & Global Reach",
      website: "sansmercantile.com"
    }
  };

  const handleInquiry = async (customQuery = null) => {
    const finalQuery = customQuery || query;
    if (!finalQuery) return;
    setIsConsulting(true);
    setAiResponse(null);

    const systemPrompt = `You are the Sovereign Intelligence Node for Mezzoforte Privilege, CEO of Sans Mercantile.
    Act as a PRE-SCREENING INTERFACE for potential equity partners.
    MEZZOFORTE'S AUTHENTIC PROFILE:
    - CEO of Sans Mercantile (Fukuoka, Japan).
    - Credentials: MBA (Distinction, Isabel I), Master's Executive (IEAD), Coaching/Psych (ENEB).
    - Background: Founder of the 'Priv System' (est 2016), former AI Business Consultant at Appen, Director at NASDAQ Guru.
    - PHILOSOPHY: Transcending boundaries between human intent and autonomous intelligence.
    - OFFERING: Strategic equity participation for high-aligned partners.
    Respond with industrial authority and evaluate if the inquiry warrants Mezzoforte's personal focus.`;

    try {
      const res = await callOllama(finalQuery, systemPrompt);
      setAiResponse(res);
    } catch (err) {
      setAiResponse("UPLINK_FAILURE: Connection refused. Check LocalTunnel status and browser verification.");
    } finally {
      setIsConsulting(false);
      setQuery("");
    }
  };

  const formatAIResponse = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###')) return <h4 key={i} className="text-[#ff7a00] font-bold mt-4 mb-1 uppercase tracking-wider">{line.replace('###', '').trim()}</h4>;
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-bold">$1</span>');
      return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  const ExperienceBlock = ({ title, company, period, location, description, skills, isStealth = false }) => (
    <div className={`relative pl-8 border-l ${isStealth ? 'border-dashed border-[#ff7a00]/30' : 'border-cyan-500/20'} mb-12 group transition-all`}>
      <div className={`absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full ${isStealth ? 'bg-[#ff7a00]/80 border border-white animate-pulse' : 'bg-cyan-500 shadow-[0_0_15px_#06b6d4]'}`} />

      <div className="flex flex-col md:flex-row justify-between items-start mb-2">
        <div className="max-w-xl">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-[#ff7a00] transition-colors">
            {title} {isStealth && <span className="text-[10px] ml-2 text-[#ff7a00] font-mono tracking-widest bg-[#ff7a00]/10 px-2 py-0.5 rounded border border-[#ff7a00]/30">CORE_GENESIS</span>}
          </h3>
          <p className="text-sm font-bold text-cyan-500 mb-1 uppercase tracking-[0.2em]">{company}</p>
        </div>
        <div className="text-right flex flex-col items-end font-mono">
          <span className="text-[10px] text-cyan-500/60 mb-1">[{period}]</span>
          <span className="text-[9px] text-gray-500 flex items-center gap-1 opacity-70"><MapPin size={10} /> {location}</span>
        </div>
      </div>

      <div className="text-sm text-gray-400 leading-relaxed mb-4 font-light border-l border-white/5 pl-4 py-1">
        {description}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {skills && skills.map(skill => (
          <span key={skill} className="px-2 py-0.5 bg-white/5 text-[9px] font-bold text-gray-400 rounded-sm border border-white/10 uppercase tracking-tighter hover:bg-[#ff7a00]/20 hover:text-white transition-all cursor-crosshair">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#020203] text-gray-300 font-sans selection:bg-[#ff7a00]/30 overflow-x-hidden ${glitch ? 'opacity-95' : ''}`}>

      {/* Scanline & Grid Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-1 bg-[#ff7a00]/5 absolute top-0 left-0 animate-[scan_10s_linear_infinite]" />
        <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,122,0,0.01),rgba(0,0,0,0),rgba(0,255,255,0.01))] bg-[length:100%_4px,3px_100%]" />
      </div>

      {/* Global Navigation */}
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <SansMercantileLogo />
          <div className="hidden md:flex gap-6 items-center text-[10px] font-mono tracking-widest text-gray-500 uppercase">
             <span className="flex items-center gap-2 hover:text-[#ff7a00] cursor-pointer transition-colors"><Terminal size={12}/> Console</span>
             <span className="flex items-center gap-2 hover:text-[#ff7a00] cursor-pointer transition-colors"><ShieldCheck size={12}/> Security</span>
             <div className="w-[1px] h-4 bg-white/10" />
             <span className="text-cyan-500 animate-pulse flex items-center gap-2">
               <Activity size={12} /> SYSTEM_READY
             </span>
          </div>
        </div>
      </nav>

      <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20">

        {/* Hero Section */}
        <header className="mb-24 relative">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="flex-1 relative group">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#ff7a00] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white mb-4 italic leading-none">
                {profile.name.split(' ').map((word, i) => (
                  <span key={i} className="block last:text-[#ff7a00] transition-all hover:translate-x-2 cursor-default">{word}</span>
                ))}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-xl md:text-2xl text-cyan-400 font-mono font-bold tracking-tighter uppercase">
                  {profile.handle}
                </p>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500 to-transparent opacity-30" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-4 text-[11px] font-mono uppercase tracking-widest text-right">
              <a href={`mailto:${profile.contact.email}`} className="flex items-center justify-end gap-3 hover:text-[#ff7a00] transition-all border-b border-white/5 pb-2 group">
                 {profile.contact.email} <Mail size={12} className="group-hover:scale-125 transition-transform" />
              </a>
              <a href={`tel:${profile.contact.phone}`} className="flex items-center justify-end gap-3 hover:text-[#ff7a00] transition-all border-b border-white/5 pb-2 group text-white font-bold">
                 {profile.contact.phone} <Phone size={12} className="group-hover:rotate-12 transition-transform text-[#ff7a00]" />
              </a>
              <a href={`https://${profile.contact.linkedin}`} target="_blank" className="flex items-center justify-end gap-3 hover:text-white transition-all border-b border-white/5 pb-2 group">
                 MEZZOFORTE_P <Linkedin size={12} className="group-hover:text-[#ff7a00] transition-colors" />
              </a>
              <span className="flex items-center justify-end gap-3 text-gray-500">
                 {profile.contact.location} <MapPin size={12} />
              </span>
            </div>
          </div>
        </header>

        {/* AI Pre-Screening Interface */}
        <section className="mb-24 border border-[#ff7a00]/20 bg-[#ff7a00]/5 p-8 rounded shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff7a00] to-transparent opacity-30" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff7a00] mb-6 flex items-center gap-2">
            <Bot size={18} /> EQUITY_PRE-SCREENING_INTERFACE
          </h2>

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInquiry()}
              placeholder="Submit equity inquiry or strategic proposal..."
              className="w-full bg-black/50 border border-white/10 py-4 pl-12 pr-4 text-sm text-white focus:border-[#ff7a00] outline-none transition-all placeholder:text-gray-700 font-mono"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
            <button
              onClick={() => handleInquiry()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#ff7a00] text-black px-6 py-1.5 text-[10px] font-black hover:bg-white transition-all disabled:opacity-50"
            >
              {isConsulting ? <Loader2 className="animate-spin" size={12} /> : "VALIDATE_PROPOSAL"}
            </button>
          </div>

          {aiResponse && (
            <div className="mt-8 bg-black/80 p-6 border-l-2 border-[#ff7a00] text-[13px] leading-relaxed animate-in fade-in slide-in-from-left-2 duration-500 font-light italic">
              {formatAIResponse(aiResponse)}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Sidebar - System Telemetry */}
          <div className="lg:col-span-4 space-y-8">

            {/* Card 1: Intelligence Core */}
            <section className="p-8 bg-gradient-to-br from-[#ff7a00]/10 to-black border border-[#ff7a00]/20 rounded-sm relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-[#ff7a00] animate-spin-slow"><Compass size={18} /></div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff7a00]/80">Intelligence_Core</h2>
              </div>
              <p className="text-sm leading-relaxed text-white italic font-light tracking-wide relative">
                <span className="absolute -left-4 top-0 text-[#ff7a00]/20 font-serif text-4xl">"</span>
                I architect sovereignty. My work is the synthesis of unyielding logic and creative disruption, aimed at transcending the boundaries between human intent and autonomous intelligence.
              </p>
            </section>

            {/* Card 2: Credentials */}
            <section className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="text-white"><GraduationCap size={18} /></div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Validation_Node</h2>
              </div>
              <div className="space-y-6">
                {[
                  { inst: "Universidad Isabel I", degree: "MBA", grade: "9.8/10", meta: "Distinction" },
                  { inst: "IEAD - Madrid", degree: "Master's Executive", grade: "9.5/10", meta: "Distinction" },
                  { inst: "ENEB - Barcelona", degree: "Coaching & Psychology", grade: "9.7/10", meta: "Dual Distinction" }
                ].map((edu, idx) => (
                  <div key={idx} className={idx !== 0 ? "border-t border-white/5 pt-4" : ""}>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{edu.inst}</h4>
                    <p className="text-[9px] text-[#ff7a00] font-mono mt-1">{edu.degree}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[9px] font-mono text-white bg-white/5 px-2 py-0.5 border border-white/10">{edu.grade}</span>
                      <span className="text-[9px] text-yellow-500/60 uppercase font-black tracking-tighter flex items-center gap-1"><Medal size={10}/> {edu.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Card 3: System Capacity */}
            <section className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="text-white"><Layers size={18} /></div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">System_Capacity</h2>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Autonomous Logic", val: 98, color: "bg-[#ff7a00]" },
                  { label: "Capital Allocation", val: 95, color: "bg-white" },
                  { label: "Algorithmic Risk", val: 92, color: "bg-cyan-500" },
                  { label: "Neural Architecture", val: 89, color: "bg-gray-400" }
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[9px] mb-2 font-mono uppercase tracking-widest text-gray-400">
                      <span>{stat.label}</span>
                      <span className="text-white">{(stat.val + (pulse % 2)).toFixed(0)}%</span>
                    </div>
                    <div className="h-[2px] bg-white/5 w-full">
                      <div className={`h-full ${stat.color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: `${stat.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Card 4: Resource Stack */}
            <section className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-white"><Cpu size={18} /></div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Resource_Stack</h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['M&A AI', 'Predictive', 'Embodied', 'Fintech', 'Sovereign', 'Quant'].map(tag => (
                    <div key={tag} className="px-2 py-3 bg-white/5 border border-white/5 text-[8px] font-mono text-center uppercase tracking-tighter text-gray-500 hover:text-[#ff7a00] hover:border-[#ff7a00]/30 transition-all cursor-crosshair group relative">
                      {tag}
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-[#ff7a00] transition-all duration-300" />
                    </div>
                  ))}
                </div>
            </section>
          </div>

          {/* Experience Feed */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-6 mb-16 border-l-4 border-[#ff7a00] pl-6">
              <div className="text-white">
                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">Command_Timeline</h2>
                <p className="text-[10px] font-mono text-[#ff7a00]/60 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Zap size={10} fill="currentColor" /> Strategic Execution History
                </p>
              </div>
            </div>

            <ExperienceBlock
              title="Chief Executive Officer"
              company="Sans Mercantile"
              period="2025 – PRESENT"
              location="Fukuoka, Japan"
              description="Orchestrating the launch of Sans Mercantile from deep-stealth. Architecting AI infrastructure and algorithmic models that bridge the gap between financial theory and autonomous execution. Leading cross‑domain R&D in embodied AGI."
              skills={["Embodied AGI", "AI Infrastructure", "Capital Synthesis"]}
            />

            <ExperienceBlock
              title="Founder (Stealth Phase)"
              company="Sans Mercantile"
              period="2016 – 2025"
              location="Global Operations"
              isStealth={true}
              description="A decade of experimental refinement. Following a pivotal market volatility event in 2016, I began developing the 'Priv System'—a proprietary framework for autonomous decision-making and risk mitigation. This period represents the fundamental code-base of all current operations."
              skills={["Quant Research", "Systemic Innovation", "Model Hardening"]}
            />

            <ExperienceBlock
              title="AI Business Consultant"
              company="Appen"
              period="2019 – 2025"
              location="Remote"
              description="Deploying AI-driven analytics to optimize investment frameworks. Automating risk assessment models to facilitate high-frequency corporate financial decision-making."
              skills={["Machine Learning", "Financial Forecasting", "Risk Frameworks"]}
            />

            <ExperienceBlock
              title="Director of Market Strategy"
              company="NASDAQ Guru"
              period="2018 – 2023"
              location="Remote"
              description="Directed corporate financial strategy and investment management. Engineered AI-driven market analysis tools to optimize M&A valuation and entry protocols."
              skills={["FX Options", "M&A Architecture", "Predictive Systems"]}
            />

            <ExperienceBlock
              title="Co-Founder & Financial Ops"
              company="Forte Agriculture & Mining"
              period="2019 – 2023"
              location="Johannesburg, SA"
              description="Controlled multi-million dollar capital allocation and operational funding. Directed due diligence for high-stakes industrial acquisitions."
              skills={["Due Diligence", "Capital Structuring", "Governance"]}
            />
          </div>
        </div>
      </div>

      <footer className="mt-32 border-t border-white/5 py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[#ff7a00] font-mono text-[10px] tracking-[0.5em] uppercase flex items-center gap-3">
            <ShieldCheck size={16}/> Sovereign_Certified. Sans Mercantile 2026.
          </div>
          <div className="flex items-center gap-8 text-[10px] font-mono text-gray-600 tracking-[0.3em] uppercase">
            <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#" className="hover:text-white transition-colors">Protocols</a>
            <span>© SANS_MERCANTILE™</span>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan { from { transform: translateY(-10vh); } to { transform: translateY(110vh); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 12s linear infinite; }

        ::selection {
          background: #ff7a00;
          color: black;
        }
      `}} />
    </div>
  );
};

export default App;