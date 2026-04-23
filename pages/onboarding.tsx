import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useRouter } from 'next/router';
import { jobPostings, assessmentConfigs, type AssessmentType } from '@/lib/jobs';
import type { JobPosting } from '@/lib/jobs';

export default function Onboarding() {
  const router = useRouter();
  const { jobId, email } = router.query;
  const [currentAssessmentIndex, setCurrentAssessmentIndex] = useState(0);
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, string>>({});
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get job details
  const job = jobPostings.find(j => j.id === jobId) as JobPosting | undefined;
  const assessmentIds = job?.assessments || [];
  const currentAssessmentId = assessmentIds[currentAssessmentIndex] as AssessmentType | undefined;
  const currentAssessment = currentAssessmentId 
    ? assessmentConfigs[currentAssessmentId]
    : null;

  if (!mounted) {
    return (
      <Layout>
        <Head>
          <title>Onboarding - Sans Mercantile</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-pulse">
              <div className="w-16 h-16 rounded-full bg-nexus-gold/30"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <Head>
          <title>Onboarding - Sans Mercantile</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
            <p className="text-nexus-gray-400 mb-6">
              The job position you applied for could not be found. Please contact our team for assistance.
            </p>
            <button
              onClick={() => router.push('/careers')}
              className="px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Careers
            </button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const handleStartAssessment = () => {
    // Assessment started, show questions
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAssessmentResponses({
      ...assessmentResponses,
      [`${currentAssessmentId}-q${questionIndex}`]: answer,
    });
  };

  const handleCompleteAssessment = async () => {
    if (!currentAssessmentId) return;

    // Mark assessment as completed
    setCompletedAssessments([...completedAssessments, currentAssessmentId]);

    // Save completion data
    const assessmentData = {
      jobId,
      email,
      assessmentType: currentAssessmentId,
      responses: assessmentResponses,
      completedAt: new Date().toISOString(),
      status: 'completed' as const,
    };

    const assessments = JSON.parse(localStorage.getItem('job_assessments') || '[]');
    assessments.push(assessmentData);
    localStorage.setItem('job_assessments', JSON.stringify(assessments));

    // Move to next assessment or finish
    if (currentAssessmentIndex < assessmentIds.length - 1) {
      setCurrentAssessmentIndex(currentAssessmentIndex + 1);
    } else {
      // All assessments completed
      router.push(`/onboarding-complete?email=${encodeURIComponent(email as string)}&jobId=${jobId}`);
    }
  };

  const progressPercentage = ((completedAssessments.length + 1) / assessmentIds.length) * 100;

  if (!currentAssessment) {
    return (
      <Layout>
        <Head>
          <title>Onboarding - Sans Mercantile</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center py-20 px-6">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="max-w-2xl w-full"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-2">Assessment Loading</h1>
              <p className="text-nexus-gray-400">Please wait while we prepare your assessment...</p>
            </div>
            <div className="animate-pulse text-center">
              <div className="inline-block w-12 h-12 rounded-full bg-nexus-gold/20"></div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Onboarding - {job.title} - Sans Mercantile</title>
      </Head>

      <div className="min-h-screen py-20 px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Position Assessment</h1>
                <p className="text-nexus-gold text-lg font-medium">{job.title}</p>
                <p className="text-nexus-gray-400 mt-1">Application for {email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-nexus-gray-500">Step {currentAssessmentIndex + 1} of {assessmentIds.length}</p>
                <div className="text-2xl font-bold text-nexus-gold mt-2">{Math.round(progressPercentage)}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-nexus-dark border border-nexus-gold/20 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-nexus-gold to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Assessment Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-br from-[#1a1f3a] to-nexus-dark border border-nexus-gold/20 rounded-2xl p-12"
          >
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-nexus-gold/20 text-nexus-gold text-sm font-semibold mb-4">
                Assessment Type: {currentAssessment.title}
              </span>
              <h2 className="text-3xl font-bold text-white">{currentAssessment.title}</h2>
              <p className="text-nexus-gray-400 mt-4">{currentAssessment.description}</p>
            </div>

            <div className="space-y-8">
              {/* Sample Assessment Questions */}
              {[1, 2, 3].map((questionNum) => (
                <motion.div
                  key={questionNum}
                  variants={fadeInUp}
                  className="border border-nexus-gold/20 rounded-xl p-6 bg-nexus-dark/50"
                >
                  <label className="block text-white font-semibold mb-4">
                    Question {questionNum}: {currentAssessment.title} Scenario {questionNum}
                  </label>
                  <p className="text-nexus-gray-400 mb-6">
                    Your response to this {currentAssessment.title.toLowerCase()} assessment question will help us evaluate your suitability for this position.
                  </p>
                  <textarea
                    value={assessmentResponses[`${currentAssessmentId}-q${questionNum}`] || ''}
                    onChange={(e) => handleAnswerChange(questionNum, e.target.value)}
                    placeholder="Enter your response here..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border border-nexus-gold/20 text-white placeholder-nexus-gray-500 focus:border-nexus-gold focus:outline-none transition-colors resize-none"
                  />
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div variants={fadeInUp} className="mt-12 flex gap-4">
              <button
                onClick={() => {
                  if (currentAssessmentIndex > 0) {
                    setCurrentAssessmentIndex(currentAssessmentIndex - 1);
                  }
                }}
                disabled={currentAssessmentIndex === 0}
                className="px-6 py-3 rounded-lg border border-nexus-gold/40 text-nexus-gold hover:bg-nexus-gold/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Previous Assessment
              </button>
              <button
                onClick={handleCompleteAssessment}
                className="flex-1 px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity"
              >
                {currentAssessmentIndex < assessmentIds.length - 1
                  ? 'Complete & Next Assessment'
                  : 'Submit Assessments'}
              </button>
            </motion.div>
          </motion.div>

          {/* Completed Assessments */}
          {completedAssessments.length > 0 && (
            <motion.div variants={fadeInUp} className="mt-12">
              <h3 className="text-xl font-bold text-white mb-4">Completed Assessments</h3>
              <div className="grid gap-4">
                {completedAssessments.map((assessmentId) => (
                  <motion.div
                    key={assessmentId}
                    variants={fadeInUp}
                    className="flex items-center gap-4 p-4 rounded-lg bg-green-500/20 border border-green-500/40"
                  >
                    <div className="text-2xl">✓</div>
                    <div>
                      <p className="font-semibold text-green-400">
                        {assessmentConfigs[assessmentId as AssessmentType]?.title}
                      </p>
                      <p className="text-sm text-green-300/60">Completed</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
