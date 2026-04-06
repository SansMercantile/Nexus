import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { AnimatedIcon, type IconType } from '../components/AnimatedIcons';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { jobPostings, getOpenJobs, assessmentConfigs } from '../lib/jobs';
import { useState } from 'react';
import Link from 'next/link';
import type { JobPosting, AssessmentType } from '@/lib/jobs';

const JobCard = ({ job, onViewDetails }: { job: JobPosting; onViewDetails: () => void }) => {
  const assessmentNames = job.assessments
    .map(id => assessmentConfigs[id as AssessmentType]?.title)
    .filter(Boolean)
    .join(', ');

  const salaryDisplay = job.salary
    ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
    : 'Competitive';

  return (
    <motion.div
      variants={fadeInUp}
      className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark hover:border-nexus-gold/40 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-nexus-gold transition-colors">
            {job.title}
          </h3>
          <p className="text-nexus-gray-400">{job.department}</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-nexus-gold/20 text-nexus-gold">
          {job.level.charAt(0).toUpperCase() + job.level.slice(1)}
        </span>
      </div>

      <div className="flex flex-col gap-3 text-sm text-nexus-gray-400 mb-4">
        <span>📍 {job.location}</span>
        <span>💼 {job.type}</span>
        {job.salary && (
          <span className="text-nexus-gold font-medium">
            {salaryDisplay}
          </span>
        )}
      </div>

      <div className="text-xs text-nexus-gray-500 mb-4 p-2 bg-nexus-dark rounded">
        <div className="font-semibold text-nexus-gray-300 mb-1">Assessments:</div>
        <div>{assessmentNames || 'Standard evaluation'}</div>
      </div>

      <button
        onClick={onViewDetails}
        className="mt-6 w-full text-nexus-gold font-semibold py-2 border border-nexus-gold/30 rounded-lg hover:bg-nexus-gold/10 transition-all group-hover:translate-x-1"
      >
        View Details & Apply →
      </button>
    </motion.div>
  );
};

const BenefitCard = ({ icon, title, description, iconType }: any) => (
  <motion.div
    variants={fadeInUp}
    className="border border-nexus-gold/20 rounded-xl p-8 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark hover:border-nexus-gold/40 transition-all duration-300"
  >
    <div className="text-nexus-gold mb-4 inline-block">
      <AnimatedIcon type={iconType} size={48} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-nexus-gray-400">{description}</p>
  </motion.div>
);

const ApplicationFormModal = ({
  jobId,
  onClose,
}: {
  jobId: string;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const job = jobPostings.find(j => j.id === jobId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store application data (in real app, would call API)
    const applicationData = {
      jobId,
      applicantName: formData.name,
      applicantEmail: formData.email,
      appliedAt: new Date().toISOString(),
      status: 'applied' as const,
    };
    
    // Save to localStorage for now (mock)
    const applications = JSON.parse(localStorage.getItem('job_applications') || '[]');
    applications.push(applicationData);
    localStorage.setItem('job_applications', JSON.stringify(applications));
    
    setSubmitted(true);
    setTimeout(() => {
      // Redirect to onboarding portal
      window.location.href = `/onboarding?jobId=${jobId}&email=${encodeURIComponent(formData.email)}`;
    }, 2000);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-nexus-dark border border-nexus-gold/30 rounded-2xl p-12 max-w-2xl text-center"
        >
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
          <p className="text-nexus-gray-300 mb-2">Thank you for applying to {job?.title}.</p>
          <p className="text-nexus-gray-400 mb-8">You will now be redirected to our secure onboarding portal to complete the assessment for this position.</p>
          <p className="text-sm text-nexus-gray-500">Redirecting in 2 seconds...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-nexus-dark border border-nexus-gold/30 rounded-2xl p-10 max-w-2xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Apply for Position</h2>
            <p className="text-nexus-gold mt-2">{job?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-nexus-gray-400 hover:text-white transition text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Resume/CV Link *</label>
            <input
              type="url"
              required
              value={formData.resume}
              onChange={e => setFormData({ ...formData, resume: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none"
              placeholder="https://linkedin.com/in/johndoe or https://example.com/resume.pdf"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Cover Letter (Optional)</label>
            <textarea
              value={formData.coverLetter}
              onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none h-24 resize-none"
              placeholder="Tell us why you're interested in this role..."
            />
          </div>

          <div className="p-4 bg-nexus-gold/5 border border-nexus-gold/20 rounded-lg">
            <p className="text-sm text-nexus-gray-300">
              <span className="text-nexus-gold font-semibold">Next Step:</span> After submitting this form, you'll be taken to our secure onboarding portal where you&apos;ll complete the required assessments for this position.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-8 py-4 rounded-lg bg-nexus-gold text-black font-bold hover:opacity-90 transition-opacity"
            >
              Submit Application
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 rounded-lg border border-nexus-gold/30 text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Job Details Modal Component
const JobDetailsModal = ({
  job,
  onClose,
  onApply,
}: {
  job: JobPosting;
  onClose: () => void;
  onApply: (job: JobPosting) => void;
}) => {
  const assessments = job.assessments.map(id => assessmentConfigs[id as AssessmentType]);
  const salaryDisplay = job.salary
    ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
    : 'Competitive';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-nexus-dark border border-nexus-gold/30 rounded-2xl p-10 max-w-3xl max-h-[85vh] overflow-y-auto w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">{job.title}</h2>
            <p className="text-xl text-nexus-gold">{job.department}</p>
          </div>
          <button
            onClick={onClose}
            className="text-nexus-gray-400 hover:text-white transition text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-[#1a1f3a]/50 rounded-xl">
          <div>
            <p className="text-nexus-gray-400 text-sm">Level</p>
            <p className="text-white font-semibold">{job.level.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-nexus-gray-400 text-sm">Location</p>
            <p className="text-white font-semibold">{job.location.split('+')[0]}</p>
          </div>
          <div>
            <p className="text-nexus-gray-400 text-sm">Type</p>
            <p className="text-white font-semibold">{job.type}</p>
          </div>
          <div>
            <p className="text-nexus-gray-400 text-sm">Salary</p>
            <p className="text-nexus-gold font-semibold">{salaryDisplay}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">About the Role</h3>
          <p className="text-nexus-gray-300 leading-relaxed">{job.description}</p>
        </div>

        {/* Responsibilities */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Key Responsibilities</h3>
          <ul className="space-y-3">
            {job.responsibilities.map((resp, idx) => (
              <li key={idx} className="flex gap-3 text-nexus-gray-300">
                <span className="text-nexus-gold flex-shrink-0 mt-1">▸</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Qualifications */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Required Qualifications</h3>
          <ul className="space-y-3">
            {job.qualifications.map((qual, idx) => (
              <li key={idx} className="flex gap-3 text-nexus-gray-300">
                <span className="text-nexus-gold flex-shrink-0 mt-1">▸</span>
                <span>{qual}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assessments */}
        <div className="mb-8 p-6 bg-nexus-gold/5 border border-nexus-gold/20 rounded-xl">
          <h3 className="text-2xl font-bold text-white mb-4">Evaluation Process</h3>
          <p className="text-nexus-gray-300 mb-4">Candidates for this role will complete the following assessments:</p>
          <div className="space-y-4">
            {assessments.map(assessment => (
              <div key={assessment.id} className="rounded-2xl border border-white/10 bg-[#09101f] p-4">
                <p className="font-semibold text-white">{assessment.title}</p>
                <p className="text-sm text-nexus-gray-400 mt-2">{assessment.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">What We Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-nexus-gold flex-shrink-0">✓</span>
                <span className="text-nexus-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4 pt-8 border-t border-nexus-gold/20">
          <button
            onClick={() => onApply(job)}
            className="flex-1 px-8 py-4 rounded-lg bg-nexus-gold text-black font-bold hover:opacity-90 transition-opacity text-lg"
          >
            Apply Now
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-lg border border-nexus-gold/30 text-nexus-gold font-semibold hover:bg-nexus-gold/10 transition-colors text-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationJobId, setApplicationJobId] = useState<string | null>(null);
  const [filterDept, setFilterDept] = useState<string | null>(null);

  const openJobs = filterDept 
    ? jobPostings.filter(j => (j.status ?? 'open') === 'open' && j.department === filterDept)
    : jobPostings.filter(j => (j.status ?? 'open') === 'open');

  const departments = Array.from(new Set(jobPostings.map(j => j.department)));

  const handleApplyClick = (job: JobPosting) => {
    setApplicationJobId(job.id);
    setShowApplicationForm(true);
    setSelectedJob(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-20">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Shape the Future of Intelligence
            </h1>
            <p className="text-xl text-nexus-gray-300 max-w-2xl mx-auto">
              Join a team of visionaries building the 21-system constellation that&apos;s transforming how the world works.
            </p>
          </motion.div>
        </div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-white">Open Positions ({openJobs.length})</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterDept(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !filterDept
                    ? 'bg-nexus-gold text-black font-semibold'
                    : 'border border-nexus-gold/30 text-nexus-gold hover:bg-nexus-gold/10'
                }`}
              >
                All
              </button>
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setFilterDept(dept)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterDept === dept
                      ? 'bg-nexus-gold text-black font-semibold'
                      : 'border border-nexus-gold/30 text-nexus-gold hover:bg-nexus-gold/10'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <motion.div className="grid grid-cols-1 gap-6">
            {openJobs.length > 0 ? (
              openJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={() => setSelectedJob(job)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-nexus-gray-400">
                <p className="text-lg">No positions available in this department.</p>
              </div>
            )}
          </motion.div>

        </motion.div>

        {/* Why Join Us */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <h2 className="text-4xl font-bold text-white mb-12">Why Join Sans Mercantile</h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: '🚀', iconType: 'rocket' as const, title: 'Impact at Scale', description: 'Work on systems affecting billions of people globally' },
              { icon: '🧠', iconType: 'globe' as const, title: 'Cutting-Edge Tech', description: 'Access to latest AI, blockchain, and distributed systems' },
              { icon: '💰', iconType: 'chart' as const, title: 'Competitive Comp', description: 'Salary, equity, and benefits packages that matter' },
              { icon: '🌍', iconType: 'globe' as const, title: 'Global Team', description: 'Collaborate with exceptional talent from 50+ countries' },
              { icon: '📚', iconType: 'chart' as const, title: 'Continuous Learning', description: 'Unlimited conference budget and development opportunities' },
              { icon: '⚖️', iconType: 'lock' as const, title: 'Ethics-First Culture', description: 'Work on responsible AI—we do it the right way' },
            ].map((benefit, idx) => (
              <BenefitCard key={idx} {...benefit} />
            ))}
          </motion.div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="border border-nexus-gold/20 rounded-2xl p-12 bg-gradient-to-br from-[#1a1f3a] to-nexus-dark">
            <h2 className="text-3xl font-bold text-white mb-8">Comprehensive Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Healthcare', items: ['Medical, dental, vision', 'Mental health support', 'Wellness programs'] },
                { title: 'Time Off', items: ['Unlimited vacation', 'Parental leave', 'Sabbaticals after 5 years'] },
                { title: 'Equity & Compensation', items: ['Competitive salary', 'Stock options', 'Performance bonuses'] },
                { title: 'Growth & Development', items: ['Tuition reimbursement', 'Conference attendance', 'Internal training'] },
              ].map((benefit, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-bold text-nexus-gold mb-4">{benefit.title}</h3>
                  <ul className="space-y-3">
                    {benefit.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-nexus-gray-300">
                        <span className="w-2 h-2 rounded-full bg-nexus-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <div className="rounded-2xl p-12 border border-nexus-gold/30 bg-gradient-to-r from-nexus-gold/10 to-nexus-accent/10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to build the future?</h2>
            <p className="text-nexus-gray-300 mb-4">Apply for any of our open positions above, or submit your profile for future opportunities.</p>
            <p className="text-sm text-nexus-gray-400 mb-6">All candidates who apply will be directed to our secure onboarding portal where you&apos;ll complete role-specific assessments.</p>
          </div>
        </motion.div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyClick}
        />
      )}

      {/* Application Form Modal */}
      {showApplicationForm && applicationJobId && (
        <ApplicationFormModal
          jobId={applicationJobId}
          onClose={() => {
            setShowApplicationForm(false);
            setApplicationJobId(null);
          }}
        />
      )}
    </Layout>
  );
}
