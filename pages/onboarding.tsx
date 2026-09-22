import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useRouter } from 'next/router';
import { jobPostings, assessmentConfigs, type AssessmentType } from '@/lib/jobs';
import type { JobPosting } from '@/lib/jobs';
import posthog from 'posthog-js';

export default function Onboarding() {
  const router = useRouter();
  const [currentAssessmentIndex, setCurrentAssessmentIndex] = useState(0);
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, string>>({});
  const [allAssessmentResponses, setAllAssessmentResponses] = useState<Record<string, string>>({});
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [screenShared, setScreenShared] = useState(false);
  const [proctoringReady, setProctoringReady] = useState(false);
  const [proctoringError, setProctoringError] = useState<string | null>(null);
  const [cheatAlerts, setCheatAlerts] = useState<string[]>([]);
  // Exam clock for server-side anti-cheat: set once at first proctoring
  // completion, never reset (re-verification after a tab switch must not
  // shrink the measured duration and cause a false 'too-fast' flag).
  const [examStartedAt, setExamStartedAt] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const jobId = router.isReady ? (router.query.jobId as string) : undefined;
  const email = router.isReady ? (router.query.email as string) : undefined;
  const viewToken = router.isReady ? (router.query.token as string) : undefined;
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  // Set when the application already has a submitted assessment review.
  const [alreadySubmittedAt, setAlreadySubmittedAt] = useState<string | null>(null);
  // Merged open roles (admin posts + static seed); falls back to static.
  const [allJobs, setAllJobs] = useState<JobPosting[]>(jobPostings);
  // Server-timed exam session (nonce issued by /api/applications/begin).
  const [examNonce, setExamNonce] = useState<string | null>(null);
  // Current section questions, released server-side one section at a time.
  const [sectionQuestions, setSectionQuestions] = useState<string[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [questionsAttempt, setQuestionsAttempt] = useState(0);
  // Section progress posts that failed to send; retried before final submit.
  const failedProgressRef = useRef<string[]>([]);
  useEffect(() => {
    fetch('/api/jobs/list/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.jobs) && data.jobs.length > 0) {
          setAllJobs(data.jobs);
        }
      })
      .catch(() => {});
  }, []);

  const isProctoringComplete = cameraReady && micReady && screenShared && proctoringReady;

  const requestProctoringVerification = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      setProctoringError('Proctoring is only available in a supported browser over HTTPS.');
      return;
    }

    setProctoringError(null);
    setCheatAlerts([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = stream;
      setCameraReady(true);
      setMicReady(true);
      captureExamEvent('exam_media_permissions_granted', { camera: true, microphone: true });
    } catch (error) {
      setProctoringError('Camera and microphone access are required. Please allow access to continue.');
      captureExamEvent('exam_media_permissions_failed', { error: String(error) });
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = displayStream;
      setScreenShared(true);
      captureExamEvent('exam_screen_share_started', { screenShare: true });
    } catch (error) {
      setProctoringError('Screen sharing is required. Please select your full screen and allow sharing.');
      captureExamEvent('exam_screen_share_failed', { error: String(error) });
      return;
    }

    setProctoringReady(true);
    setExamStartedAt((prev) => prev || new Date().toISOString());
    captureExamEvent('exam_proctoring_ready');
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!proctoringReady) return;
      if (document.visibilityState !== 'visible') {
        addCheatAlert('Exam paused because the browser tab lost focus.');
        setProctoringReady(false);
        setProctoringError('Tab switching is not allowed during the exam. Please return to this tab and restart proctoring.');
        captureExamEvent('exam_visibility_lost', { visibilityState: document.visibilityState });
      }
    };

    const handleWindowBlur = () => {
      if (!proctoringReady) return;
      addCheatAlert('Exam paused because the browser window lost focus.');
      setProctoringReady(false);
      setProctoringError('Switching windows or applications is not allowed during the exam. Please return and restart proctoring.');
      captureExamEvent('exam_window_blur');
    };

    const handleCopyPaste = (event: ClipboardEvent) => {
      if (!proctoringReady) return;
      event.preventDefault();
      addCheatAlert('Copy/paste actions are blocked during the exam.');
      captureExamEvent('exam_copy_paste_blocked', { type: event.type });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!proctoringReady) return;
      const isCopyPaste = (event.ctrlKey || event.metaKey) && ['c', 'v', 'x', 'a'].includes(event.key.toLowerCase());
      if (isCopyPaste) {
        event.preventDefault();
        addCheatAlert('Keyboard copy/paste shortcuts are blocked during the exam.');
        captureExamEvent('exam_keyboard_copy_paste_blocked', { key: event.key });
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (!proctoringReady) return;
      event.preventDefault();
      addCheatAlert('Right-click is blocked during the exam.');
      captureExamEvent('exam_context_menu_blocked');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [proctoringReady]);

  // CRITICAL FIX: router.query is always {} on the first render of a static
  // Next.js page. Reading jobId/email before router.isReady is true caused
  // job to always resolve to undefined, which produced the blank/stuck page.

  const job = jobId ? (allJobs.find(j => j.id === jobId) as JobPosting | undefined) : undefined;
  const assessmentIds = job?.assessments || [];
  const currentAssessmentId = assessmentIds[currentAssessmentIndex] as AssessmentType | undefined;
  const currentAssessment = currentAssessmentId ? assessmentConfigs[currentAssessmentId] : null;
  // Section questions are released server-side one section at a time so they
  // cannot be pre-read or answered out of order.
  const currentQuestions = sectionQuestions;

  // Open (or resume) the server-timed exam session once proctoring is done.
  useEffect(() => {
    if (!router.isReady || !tokenValid || !proctoringReady || !jobId || !email || !viewToken || examNonce) {
      return;
    }
    let cancelled = false;
    fetch('/api/applications/begin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: viewToken, jobId, email }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.nonce === 'string') {
          setExamNonce(data.nonce);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router.isReady, tokenValid, proctoringReady, jobId, email, viewToken, examNonce]);

  // Fetch the current section's questions from the server.
  useEffect(() => {
    if (!router.isReady || !tokenValid || !currentAssessmentId || !jobId || !email || !viewToken) {
      return;
    }
    setQuestionsLoading(true);
    setQuestionsError(null);
    let cancelled = false;
    const params = new URLSearchParams({ token: viewToken, jobId, email, assessmentId: currentAssessmentId });
    fetch(`/api/applications/questions?${params.toString()}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error((data && data.message) || 'Unable to load questions.');
        return data;
      })
      .then((data) => {
        if (!cancelled) {
          setSectionQuestions(Array.isArray(data?.questions) ? data.questions : []);
          setQuestionsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setQuestionsError(err instanceof Error ? err.message : 'Unable to load questions.');
          setQuestionsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [router.isReady, tokenValid, currentAssessmentId, jobId, email, viewToken, questionsAttempt]);

  const captureExamEvent = (event: string, props: Record<string, any> = {}) => {
    if (!job || !email) return;
    posthog.capture(event, {
      jobId: job.id,
      jobTitle: job.title,
      email,
      ...props,
    });
    // Persist security-relevant exam signals server-side (fire-and-forget).
    if (viewToken) {
      fetch('/api/applications/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: viewToken, jobId: job.id, email, event, props }),
      }).catch(() => {});
    }
  };

  const addCheatAlert = (message: string) => {
    setCheatAlerts((prev) => [...prev, message]);
    captureExamEvent('cheat_alert', { message });
  };

  useEffect(() => {
    if (job && email) {
      posthog.capture('onboarding_started', { jobId: job.id, jobTitle: job.title, email });
    }
  }, [job?.id]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!viewToken) {
      setTokenError('A secure application token is required to access this assessment.');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/applications/status?token=${encodeURIComponent(viewToken)}`);
        const data = await response.json();
        if (!response.ok || !data?.success) {
          setTokenError(data?.message || 'Unable to validate application token.');
          setTokenValid(false);
          return;
        }
        if (data.application?.jobId !== jobId || data.application?.applicantEmail !== email) {
          setTokenError('Application token does not match this assessment session.');
          setTokenValid(false);
          return;
        }
        if (data.application?.submitted) {
          setAlreadySubmittedAt(
            typeof data.application?.reviewedAt === 'string' ? data.application.reviewedAt : ''
          );
        }
        setTokenValid(true);
      } catch (error) {
        setTokenError('Unable to validate application token. Please try again or contact support.');
        setTokenValid(false);
      }
    };

    validateToken();
  }, [router.isReady, viewToken, jobId, email]);

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

  if (tokenError) {
    return (
      <Layout>
        <Head><title>Assessment Access Error | Sans Mercantile</title></Head>
        <div className="min-h-screen flex items-center justify-center py-20 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-nexus-gray-400 mb-6">{tokenError}</p>
            <button onClick={() => router.push('/careers')} className="px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
              Return to Careers
            </button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (alreadySubmittedAt !== null) {
    return (
      <Layout>
        <Head><title>Assessment Already Submitted | Sans Mercantile</title></Head>
        <div className="min-h-screen flex items-center justify-center py-20 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-white mb-4">Assessment Already Submitted</h1>
            <p className="text-nexus-gray-400 mb-6">
              {alreadySubmittedAt
                ? `Your assessment was submitted on ${new Date(alreadySubmittedAt).toLocaleString()}. `
                : 'Your assessment has already been submitted. '}
              Retakes are only possible with administrator approval — contact hello@sansmercantile.com to request one.
            </p>
            <button onClick={() => router.push('/careers')} className="px-6 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
              Return to Careers
            </button>
          </motion.div>
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

  const examRules = [
    'You must keep your camera and microphone on at all times during the assessment.',
    'Screen sharing is mandatory. Select your full screen and keep it visible until the assessment is complete.',
    'Copy/paste, text injection, and external cheating tools are strictly prohibited.',
    'Do not switch tabs, windows, or applications during the assessment.',
    'Any attempt to use browser extensions, screen capture tools, or secondary devices will be flagged.',
    'If you disable your camera, microphone, or screen share, the assessment will be terminated.',
    'Install the Proctorio extension before beginning and keep it active for the entire exam.',
  ];

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAssessmentResponses(prev => ({ ...prev, [currentAssessmentId + '-q' + questionIndex]: answer }));
  };

  const handleCompleteAssessment = async () => {
    if (!currentAssessmentId || submitting) return;
    if (!tokenValid) {
      alert('Your application token is not valid. Please re-open the assessment link from your confirmation email.');
      return;
    }
    if (!isProctoringComplete) {
      alert('You must complete the proctoring steps before starting the assessment.');
      return;
    }
    if (questionsError || currentQuestions.length === 0) {
      alert('Questions for this section have not loaded yet. Please wait or use Retry, then answer all questions.');
      return;
    }
    const unanswered = currentQuestions.filter((_, i) => {
      const val = assessmentResponses[currentAssessmentId + '-q' + i];
      return !val || !val.trim();
    });
    if (unanswered.length > 0) {
      alert('Please answer all ' + currentQuestions.length + ' questions before continuing.');
      return;
    }
    // Record server-side section completion (ordering + pacing evidence).
    // Failures are queued and retried before the final submit.
    if (currentAssessmentId && viewToken && jobId && email) {
      fetch('/api/applications/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: viewToken, jobId, email, nonce: examNonce, assessmentId: currentAssessmentId }),
      }).catch(() => {
        if (currentAssessmentId && !failedProgressRef.current.includes(currentAssessmentId)) {
          failedProgressRef.current.push(currentAssessmentId);
        }
      });
    }
    setSubmitting(true);
    captureExamEvent('assessment_completed', {
      assessmentType: currentAssessmentId,
      step: currentAssessmentIndex + 1,
      totalSteps: assessmentIds.length,
    });

    const nextAllResponses = {
      ...allAssessmentResponses,
      ...assessmentResponses,
    };
    setAllAssessmentResponses(nextAllResponses);

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
      captureExamEvent('onboarding_completed');

      const openSession = async (): Promise<string | null> => {
        if (examNonce) return examNonce;
        try {
          const res = await fetch('/api/applications/begin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: viewToken, jobId, email }),
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data && typeof data.nonce === 'string') {
            setExamNonce(data.nonce);
            return data.nonce as string;
          }
        } catch {
          // fall through to the failure path below
        }
        return null;
      };

      // Retry any section progress posts that failed mid-exam.
      const pendingSections = [...failedProgressRef.current];
      failedProgressRef.current = [];
      for (const assessmentId of pendingSections) {
        try {
          const progressRes = await fetch('/api/applications/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: viewToken, jobId, email, nonce: examNonce, assessmentId }),
          });
          if (!progressRes.ok) failedProgressRef.current.push(assessmentId);
        } catch {
          failedProgressRef.current.push(assessmentId);
        }
      }

      const sessionNonce = await openSession();
      if (!sessionNonce) {
        alert(
          'Could not establish a secure exam session. Please check your connection, then try again. ' +
            'If this persists, re-open the assessment from your confirmation email.'
        );
        setSubmitting(false);
        return;
      }

      const submitFinal = async (attNonce: string) =>
        fetch('/api/applications/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: viewToken,
            jobId,
            email,
            assessmentResponses: nextAllResponses,
            nonce: attNonce,
            proctoring: {
              camera: cameraReady,
              mic: micReady,
              screen: screenShared,
              startedAt: examStartedAt,
            },
          }),
        });

      let reviewOk = false;
      try {
        const readDenial = async (res: Response): Promise<string | null> => {
          const data = await res.json().catch(() => null);
          return data && typeof data.message === 'string' ? data.message : null;
        };
        let reviewRes = await submitFinal(sessionNonce);
        if (reviewRes.status === 403) {
          let denial = await readDenial(reviewRes);
          if (denial && /session/i.test(denial)) {
            // Session rotated or lost: open a fresh one and retry exactly once.
            setExamNonce(null);
            const freshNonce = await openSession();
            if (freshNonce) {
              reviewRes = await submitFinal(freshNonce);
              if (reviewRes.status === 403) {
                denial = await readDenial(reviewRes);
              } else {
                denial = null;
              }
            }
          }
          if (reviewRes.status === 403) {
            alert(
              denial ||
                'This assessment has already been submitted. Contact hello@sansmercantile.com to request a retake.'
            );
            setSubmitting(false);
            return;
          }
        }
        reviewOk = reviewRes.ok;
        if (!reviewOk) {
          console.error('Assessment review submission failed:', reviewRes.status);
        }
      } catch (err) {
        console.error('Assessment review submission failed:', err);
      }
      if (!reviewOk) {
        alert(
          'Your answers are saved on this device, but the review could not be submitted. Please stay on this page and try again in a moment.'
        );
        setSubmitting(false);
        return;
      }
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

          <motion.div variants={fadeInUp} className="mb-10 rounded-3xl border border-red-500/30 bg-[#2b1116]/90 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <h2 className="text-2xl font-bold text-white">Exam integrity rules</h2>
            </div>
            <p className="text-nexus-gray-300 mb-4">
              Before starting your assessment, please review the rules carefully. Any violation may lead to disqualification.
            </p>
            <ul className="space-y-3 text-nexus-gray-300 list-disc list-inside">
              {examRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-nexus-gold/20 bg-[#111827]/80 p-5">
              <p className="font-semibold text-white mb-2">Required proctoring checks</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-[#161b2f] p-4">
                  <p className="text-sm text-nexus-gray-400">Camera</p>
                  <p className={`font-semibold ${cameraReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {cameraReady ? 'Enabled' : 'Pending'}
                  </p>
                </div>
                <div className="rounded-xl bg-[#161b2f] p-4">
                  <p className="text-sm text-nexus-gray-400">Microphone</p>
                  <p className={`font-semibold ${micReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {micReady ? 'Enabled' : 'Pending'}
                  </p>
                </div>
                <div className="rounded-xl bg-[#161b2f] p-4">
                  <p className="text-sm text-nexus-gray-400">Screen share</p>
                  <p className={`font-semibold ${screenShared ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {screenShared ? 'Active' : 'Pending'}
                  </p>
                </div>
                <div className="rounded-xl bg-[#161b2f] p-4">
                  <p className="text-sm text-nexus-gray-400">Proctoring status</p>
                  <p className={`font-semibold ${proctoringReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {proctoringReady ? 'Ready' : 'Pending'}
                  </p>
                </div>
              </div>
              {proctoringError && (
                <p className="mt-4 text-sm text-red-400">{proctoringError}</p>
              )}
              {cheatAlerts.length > 0 && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-[#3f1c28]/80 p-4">
                  <p className="font-semibold text-red-300 mb-2">Integrity alerts</p>
                  <ul className="list-disc list-inside text-red-200 text-sm">
                    {cheatAlerts.map((alert, index) => (
                      <li key={index}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="button"
                onClick={requestProctoringVerification}
                className="mt-6 w-full rounded-full bg-nexus-gold px-5 py-3 text-black font-semibold hover:opacity-90 transition"
              >
                Start Proctoring Verification
              </button>
              <p className="mt-4 text-sm text-nexus-gray-500">
                If you do not already have Proctorio installed, please install the extension now. This assessment requires proctoring tools and shared screen access.
              </p>
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
                {questionsLoading && (
                  <p className="text-nexus-gray-400">Loading this section&apos;s questions securely…</p>
                )}
                {questionsError && !questionsLoading && (
                  <div className="rounded-xl border border-red-500/30 bg-[#3f1c28]/80 p-4">
                    <p className="text-red-200 text-sm mb-3">Could not load questions: {questionsError}</p>
                    <button
                      type="button"
                      onClick={() => setQuestionsAttempt((a) => a + 1)}
                      className="px-4 py-2 rounded-lg bg-nexus-gold text-black text-sm font-semibold hover:opacity-90"
                    >
                      Retry
                    </button>
                  </div>
                )}
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
