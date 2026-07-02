import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useRouter } from 'next/router';
import { jobPostings, assessmentConfigs, type AssessmentType } from '@/lib/jobs';
import type { JobPosting } from '@/lib/jobs';
import posthog from 'posthog-js';

const assessmentQuestions: Record<AssessmentType, string[]> = {
  'culture-fit': [
    'Describe a time you had to adapt quickly to a significant change at work. What did you do and what was the outcome?',
    'What does working in a sovereign AI infrastructure company mean to you, and how does it align with your personal values?',
    'How do you approach disagreements with teammates or leadership when you strongly believe a different direction is better?',
  ],
  communication: [
    'Describe how you would communicate a complex technical decision to a non-technical executive stakeholder.',
    'Tell us about a time your written or verbal communication directly influenced a major business outcome.',
    'How do you ensure alignment across cross-functional teams who have competing priorities?',
  ],
  'system-design': [
    'Design a high-availability job application processing system that can handle 10,000 concurrent submissions per hour. Describe the architecture.',
    'How would you design a real-time notification system that reliably delivers approval emails even during infrastructure failures?',
    'Describe the trade-offs you would make when choosing between a microservices and monolithic architecture for an AI platform with 25+ agents.',
  ],
  technical: [
    'Walk us through how you would debug a production API endpoint that intermittently returns 500 errors with no consistent pattern.',
    'Explain the difference between horizontal and vertical scaling and when you would use each for a ML inference workload.',
    'What strategies do you use to ensure database performance does not degrade as collections grow from thousands to millions of documents?',
  ],
  algorithm: [
    'Given an unsorted list of job application timestamps, describe an efficient algorithm to find all applications submitted within the same 60-minute window.',
    'How would you detect and remove duplicate job applications where the same person applied multiple times with slight email variations?',
    'Design a priority queue for processing onboarding assessments that weighs completion time, role seniority, and application date.',
  ],
  creativity: [
    'Propose a novel way Sans Mercantile could use AI to improve the candidate experience for high-volume recruiting across open positions.',
    'If you had to redesign the onboarding assessment process from scratch with no constraints, what would it look like?',
    'Describe a creative solution you implemented to a problem that initially seemed to have no good answer.',
  ],
  'systems-thinking': [
    'How would you map the interdependencies between a multi-platform AI constellation to identify single points of failure?',
    'Describe a situation where optimising one part of a system unexpectedly degraded another. How did you identify and resolve it?',
    'How do you approach capacity planning for a system where demand patterns are driven by unpredictable AI model usage?',
  ],
};

export default function Onboarding() {
  const router = useRouter();
  const [currentAssessmentIndex, setCurrentAssessmentIndex] = useState(0);
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, string>>({});
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // CRITICAL FIX: router.query is always {} on the first render of a static
  // Next.js page. Reading jobId/email before router.isReady is true caused
  // job to always resolve to undefined, which produced the blank/stuck page.
  const jobId = router.isReady ? (router.query.jobId as string) : undefined;
  const email = router.isReady ? (router.query.email as string) : undefined;

  const job = jobId ? (jobPostings.find(j => j.id === jobId) as JobPosting | undefined) : undefined;
  const assessmentIds = job?.assessments || [];
  const currentAssessmentId = assessmentIds[currentAssessmentIndex] as AssessmentType | undefined;
  const currentAssessment = currentAssessmentId ? assessmentConfigs[currentAssessmentId] : null;
  const currentQuestions = currentAssessmentId ? (assessmentQuestions[currentAssessmentId] || []) : [];

  useEffect(() => {
    if (job && email) {
      posthog.capture('onboarding_started', { jobId: job.id, jobTitle: job.title, email });
    }
  }, [job?.id]);

  if (!router.isReady) {
    return (
      <Layout>
        <Head><title>Loading Assessment | Sans Mercantile</title></Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin w-10 h-10 border-4 border-nexus-gold border-t-transparent rounded-full mb-4"></div>
            <p className="text-nexus-gray-400">Preparing your assessment...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <Head><title>Onboarding - Sans Mercantile</title></Head>
        <div className="min-h-screen flex items-center justify-center py-20 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
            <p className="text-nexus-gray-400 mb-6">The position you applied for could not be found. Please contact our team for assistance.</p>
            <button onClick={() => router.push('/careers')} className="px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
              Back to Careers
            </button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAssessmentResponses(prev => ({ ...prev, [currentAssessmentId + '-q' + questionIndex]: answer }));
  };

  const handleCompleteAssessment = async () => {
    if (!currentAssessmentId || submitting) return;
    const unanswered = currentQuestions.filter((_, i) => {
      const val = assessmentResponses[currentAssessmentId + '-q' + i];
      return !val || !val.trim();
    });
    if (unanswered.length > 0) {
      alert('Please answer all ' + currentQuestions.length + ' questions before continuing.');
      return;
    }
    setSubmitting(true);
    posthog.capture('assessment_completed', {
      jobId: job.id,
      assessmentType: currentAssessmentId,
      step: currentAssessmentIndex + 1,
      totalSteps: assessmentIds.length,
    });
    const assessmentData = {
      jobId,
      email,
      assessmentType: currentAssessmentId,
      responses: assessmentResponses,
      completedAt: new Date().toISOString(),
      status: 'completed',
    };
    try {
      const stored = JSON.parse(localStorage.getItem('job_assessments') || '[]');
      stored.push(assessmentData);
      localStorage.setItem('job_assessments', JSON.stringify(stored));
    } catch (e) {
      // localStorage unavailable — non-fatal, assessment still progresses
    }
    setCompletedAssessments(prev => [...prev, currentAssessmentId]);
    setSubmitting(false);
    if (currentAssessmentIndex < assessmentIds.length - 1) {
      setCurrentAssessmentIndex(prev => prev + 1);
      setAssessmentResponses({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      posthog.capture('onboarding_completed', { jobId: job.id, jobTitle: job.title, email });
      router.push('/onboarding-complete?email=' + encodeURIComponent(email || '') + '&jobId=' + jobId);
    }
  };

  const progressPercentage = ((completedAssessments.length + 1) / assessmentIds.length) * 100;

  return (
    <Layout>
      <Head><title>Assessment: {job.title} | Sans Mercantile</title></Head>
      <div className="min-h-screen py-20 px-6">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-4xl mx-auto">

          <motion.div variants={fadeInUp} className="mb-12">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Position Assessment</h1>
                <p className="text-nexus-gold text-lg font-medium">{job.title}</p>
                {email && <p className="text-nexus-gray-400 mt-1 text-sm">Assessing: {email}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm text-nexus-gray-500">Step {currentAssessmentIndex + 1} of {assessmentIds.length}</p>
                <div className="text-2xl font-bold text-nexus-gold mt-1">{Math.round(progressPercentage)}%</div>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-nexus-dark border border-nexus-gold/20 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-nexus-gold to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: progressPercentage + '%' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {currentAssessment && (
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-8 md:p-12">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-nexus-gold/20 text-nexus-gold text-sm font-semibold mb-4">
                  {currentAssessment.title}
                </span>
                <h2 className="text-3xl font-bold text-white">{currentAssessment.title}</h2>
                <p className="text-nexus-gray-400 mt-3">{currentAssessment.description}</p>
              </div>

              <div className="space-y-8">
                {currentQuestions.map((question, i) => (
                  <motion.div key={i} variants={fadeInUp} className="border border-nexus-gold/20 rounded-xl p-6 bg-nexus-dark/50">
                    <label className="block text-white font-semibold mb-3">Question {i + 1}</label>
                    <p className="text-nexus-gray-300 mb-5 leading-relaxed">{question}</p>
                    <textarea
                      value={assessmentResponses[currentAssessmentId + '-q' + i] || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      placeholder="Enter your response here..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none transition-colors resize-none"
                    />
                    <div className="text-xs text-nexus-gray-500 mt-1 text-right">
                      {(assessmentResponses[currentAssessmentId + '-q' + i] || '').length} characters
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeInUp} className="mt-10 flex gap-4">
                <button
                  onClick={() => {
                    if (currentAssessmentIndex > 0) {
                      setCurrentAssessmentIndex(prev => prev - 1);
                      setAssessmentResponses({});
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={currentAssessmentIndex === 0}
                  className="px-6 py-3 rounded-lg border border-nexus-gold/40 text-nexus-gold hover:bg-nexus-gold/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
                >
                  Previous
                </button>
                <button
                  onClick={handleCompleteAssessment}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (currentAssessmentIndex < assessmentIds.length - 1 ? 'Save and Continue' : 'Submit All Assessments')}
                </button>
              </motion.div>
            </motion.div>
          )}

          {completedAssessments.length > 0 && (
            <motion.div variants={fadeInUp} className="mt-10">
              <h3 className="text-lg font-bold text-white mb-4">Completed</h3>
              <div className="grid gap-3">
                {completedAssessments.map((id) => (
                  <div key={id} className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <span className="text-green-400 text-xl">✓</span>
                    <div>
                      <p className="font-semibold text-green-400">{assessmentConfigs[id as AssessmentType]?.title}</p>
                      <p className="text-xs text-green-300/60">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </Layout>
  );
}
