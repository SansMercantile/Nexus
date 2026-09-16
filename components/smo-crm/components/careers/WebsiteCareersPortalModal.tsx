import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Upload, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Globe, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const WebsiteCareersPortalModal: React.FC = () => {
  const { 
    isWebsitePortalOpen, 
    setIsWebsitePortalOpen, 
    jobPostings, 
    submitWebsiteApplication,
    setActiveTab
  } = useCrm();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobPostings[0]?.id || '');
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('My_Resume.pdf');
  const [resumeTextContent, setResumeTextContent] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isWebsitePortalOpen) return null;

  const handleApplyPreset = (preset: 'dev' | 'comms') => {
    if (preset === 'dev') {
      setSelectedJobId('job-azure-architect');
      setCandidateName('Kiran Patel');
      setEmail('kiran.patel@cloudsystems.co.uk');
      setPhone('+44 7890 123456');
      setLocation('London, UK');
      setPortfolioUrl('https://github.com/kiranpatel-infra');
      setLinkedInUrl('https://linkedin.com/in/kiran-patel-azure');
      setCoverLetter('Excited to apply for the Senior Azure Cloud position. Over 8 years designing distributed high-availability microservices on Azure and Kubernetes.');
      setResumeName('Kiran_Patel_Senior_Azure_Architect.pdf');
      setResumeTextContent(`KIRAN PATEL - SENIOR AZURE CLOUD ARCHITECT
Email: kiran.patel@cloudsystems.co.uk | London, UK | GitHub: github.com/kiranpatel-infra

SUMMARY
Senior Infrastructure & Cloud Architect with 8 years scaling fintech systems on Microsoft Azure. Led Azure Kubernetes Service (AKS) migration for high-frequency settlement handling 15,000 TPS.

SKILLS
• Cloud: Azure AKS, Azure Key Vault, Azure Event Hubs, Azure Front Door, Terraform
• Languages: C#, Go, TypeScript, PowerShell
• Security: Zero Trust Architecture, PCI-DSS Level 1 compliance

EXPERIENCE
• Senior Cloud Architect | Monzo Financial Services (2022 - Present)
  - Designed automated disaster recovery cluster in North Europe with 99.99% uptime.
  - Reduced latency by 35% through Azure Front Door caching and HTTP/2 multiplexing.`);
    } else {
      setSelectedJobId('job-pr-comms-head');
      setCandidateName('Nadia Mkhize');
      setEmail('nadia.mkhize@brandswell.co.za');
      setPhone('+27 82 987 6543');
      setLocation('Cape Town, South Africa');
      setPortfolioUrl('https://nadiamkhize.com/press-portfolio');
      setLinkedInUrl('https://linkedin.com/in/nadiamkhize-comms');
      setCoverLetter('Deep admiration for Swell Agency and Pascaline Khoza’s narrative work. Having led media relations for pan-African fintechs, I look forward to amplifying the Priv Pay launch.');
      setResumeName('Nadia_Mkhize_Head_PR_Strategy.pdf');
      setResumeTextContent(`NADIA MKHIZE - STRATEGIC COMMUNICATIONS & PR DIRECTOR
Cape Town, South Africa | nadia.mkhize@brandswell.co.za | LinkedIn: linkedin.com/in/nadiamkhize-comms

PROFILE
Strategic communications leader with 7+ years directing public relations, crisis management, and media syndication for fintechs and sovereign development entities.

MEDIA TRACK RECORD
• Placements in Daily Maverick, Financial Times, CNBC Africa, and TechCabal.
• Spearheaded 4 international product launches with cumulative reach of 45M impressions.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !email) return;

    submitWebsiteApplication({
      candidateName,
      email,
      phone,
      location,
      jobId: selectedJobId,
      portfolioUrl,
      linkedInUrl,
      resumeName,
      resumeTextContent: resumeTextContent || `${candidateName} Resume: Experienced professional with extensive domain expertise applied to Sans Mercantile.`,
      coverLetter,
    });

    setIsSubmittedSuccess(true);
  };

  const handleResetForm = () => {
    setIsSubmittedSuccess(false);
    setCandidateName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setPortfolioUrl('');
    setLinkedInUrl('');
    setCoverLetter('');
    setResumeTextContent('');
    setIsWebsitePortalOpen(false);
    setActiveTab('careers');
  };

  const selectedJob = jobPostings.find(j => j.id === selectedJobId) || jobPostings[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none overflow-y-auto">
      <div 
        id="smo-website-careers-portal-modal"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Public Website Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
          
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-900 flex items-center justify-center font-bold text-sm">
                SMO
              </div>
              <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                Sans Mercantile Careers <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">Public Portal</span>
              </span>
            </div>

            <button
              onClick={() => setIsWebsitePortalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            Join the Sovereign Infrastructure Team
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Sans Mercantile is hiring world-class engineers, communications specialists (Swell), and deal partners. Applications are ingested directly into our CRM with automated AI vetting and skills assessment.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 overflow-y-auto max-h-[70vh] text-xs">
          {isSubmittedSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Application Successfully Ingested!</h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
                  Your resume documents have been received by the SMO CRM. Our AI engine has vetted your profile, scored matching dimensions, and alerted the department head in the Team Hub.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-left space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Ingestion Summary</div>
                <div className="text-slate-800 font-medium">Candidate: {candidateName}</div>
                <div className="text-slate-800 font-medium">Role: {selectedJob.title}</div>
                <div className="text-indigo-600 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Vetting Score Calculated & Stored in CRM</span>
                </div>
              </div>

              <button
                onClick={handleResetForm}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                View in SMO CRM Careers Module
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Quick Sample Demo Autofill Buttons */}
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-[11px] font-semibold text-indigo-900">
                    Test Live Website Ingestion with Sample Resumes:
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('dev')}
                    className="px-2.5 py-1 rounded-md bg-white hover:bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-200 shadow-2xs"
                  >
                    Load Azure Architect CV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('comms')}
                    className="px-2.5 py-1 rounded-md bg-white hover:bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-200 shadow-2xs"
                  >
                    Load PR Director CV
                  </button>
                </div>
              </div>

              {/* Step 1: Position Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Position *
                </label>
                <select
                  value={selectedJobId}
                  onChange={e => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/20"
                >
                  {jobPostings.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.department.toUpperCase()} ({job.location})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 mt-1">
                  {selectedJob.description}
                </div>
              </div>

              {/* Step 2: Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Vance"
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="candidate@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+44 7700 900000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Current Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. London, Cape Town, Remote"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Step 3: Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedInUrl}
                    onChange={e => setLinkedInUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Portfolio / GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Step 4: Resume Document Upload & Text */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resume / Curriculum Vitae *
                </label>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer mb-2">
                  <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                  <div className="font-semibold text-slate-700 text-xs">
                    {resumeName}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Drag & drop or edit text below (PDF, DOCX simulated ingestion)
                  </div>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Paste or review resume text here for automated AI parsing..."
                  value={resumeTextContent}
                  onChange={e => setResumeTextContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono leading-relaxed focus:bg-white"
                />
              </div>

              {/* Step 5: Cover Letter Statement */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Cover Letter / Sovereign Statement
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief note to the hiring team..."
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWebsitePortalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Submit Application to CRM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
