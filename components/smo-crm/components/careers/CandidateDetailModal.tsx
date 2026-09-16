import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  Download, 
  Clock, 
  Send, 
  Building, 
  UserCheck, 
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  BrainCircuit,
  MessageSquareQuote
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { ApplicationStage, Department } from '../../types';
import { DEPARTMENTS } from '../../data/departmentsData';

export const CandidateDetailModal: React.FC = () => {
  const { 
    selectedCandidate, 
    setSelectedCandidate, 
    updateCandidateStage, 
    dispatchAiTestBattery, 
    conductAiVideoInterview, 
    addDepartmentReview, 
    runAiVetting,
    currentUser 
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'ai_vetting' | 'documents' | 'tests' | 'video_interview' | 'department_reviews'>('ai_vetting');
  
  // Video player simulation state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [selectedVideoQuestionIndex, setSelectedVideoQuestionIndex] = useState(0);

  // Department review form state
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'request_clarification' | 'reject'>('approve');

  if (!selectedCandidate) return null;

  const deptInfo = DEPARTMENTS[selectedCandidate.department];
  const { aiVetting, aiTestBattery, aiVideoInterview, documents, departmentReviews } = selectedCandidate;

  const handleStageChange = (newStage: ApplicationStage) => {
    updateCandidateStage(selectedCandidate.id, newStage);
  };

  const handleDepartmentReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewNotes.trim()) return;

    addDepartmentReview(selectedCandidate.id, {
      score: reviewScore,
      notes: reviewNotes,
      decision: reviewDecision,
    });

    setReviewNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div 
        id="smo-candidate-detail-modal"
        className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-100">
              {selectedCandidate.candidateName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  {selectedCandidate.candidateName}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${deptInfo.badgeBg}`}>
                  {deptInfo.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  AI Fit: {aiVetting.score}%
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{selectedCandidate.jobTitle}</span>
                <span>•</span>
                <span>{selectedCandidate.location}</span>
                <span>•</span>
                <span>Applied {selectedCandidate.appliedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stage:</span>
              <select
                id="candidate-stage-selector"
                value={selectedCandidate.stage}
                onChange={e => handleStageChange(e.target.value as ApplicationStage)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="applied">Applied (Website)</option>
                <option value="vetted">AI Vetted & Scored</option>
                <option value="tests_dispatched">Tests Dispatched</option>
                <option value="tests_completed">Tests Completed</option>
                <option value="interview_done">AI Video Interview Done</option>
                <option value="shortlisted">Preliminary Shortlisted</option>
                <option value="offered">Offer Extended</option>
                <option value="rejected">Archived / Rejected</option>
              </select>
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 border-b border-slate-200 bg-slate-50/70 flex items-center gap-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('ai_vetting')}
            className={`px-3 py-2.5 font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'ai_vetting'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Vetting Scorecard ({aiVetting.score}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2.5 font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Uploaded Documents & CV</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-2.5 font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'tests'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-slate-500" />
            <span>AI Skills Test ({aiTestBattery.status === 'completed' ? `${aiTestBattery.score}/100` : aiTestBattery.status})</span>
          </button>

          <button
            onClick={() => setActiveTab('video_interview')}
            className={`px-3 py-2.5 font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'video_interview'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-slate-500" />
            <span>AI Video Interview ({aiVideoInterview.status === 'completed' ? `${aiVideoInterview.overallScore}%` : aiVideoInterview.status})</span>
          </button>

          <button
            onClick={() => setActiveTab('department_reviews')}
            className={`px-3 py-2.5 font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'department_reviews'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span>Department Reviews ({departmentReviews.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs bg-slate-50/40">
          {/* TAB 1: AI VETTING & PARSING SCORECARD */}
          {activeTab === 'ai_vetting' && (
            <div className="space-y-6">
              {/* Overall AI Assessment Card */}
              <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 shrink-0">
                    <span className="text-2xl font-black">{aiVetting.score}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">AI Match</span>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {aiVetting.recommendation}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Preliminary AI Shortlist Evaluation
                    </h3>
                    <p className="text-slate-500 mt-1 max-w-xl text-xs leading-relaxed">
                      {aiVetting.summary}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => runAiVetting(selectedCandidate.id)}
                  className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Re-evaluate AI Reasoning</span>
                </button>
              </div>

              {/* Dimensional Evaluation Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Technical Competence</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{aiVetting.technicalSkillsScore}%</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${aiVetting.technicalSkillsScore}%` }} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Domain & Industry Alignment</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{aiVetting.domainAlignmentScore}%</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${aiVetting.domainAlignmentScore}%` }} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Experience Depth</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{aiVetting.experienceDepthScore}%</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${aiVetting.experienceDepthScore}%` }} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Communication & Executive</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{aiVetting.communicationScore}%</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${aiVetting.communicationScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Strengths & Gaps Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key AI Synthesized Strengths
                  </h4>
                  <ul className="space-y-2 text-slate-600 text-xs">
                    {aiVetting.keyStrengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
                  <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    AI Considerations & Growth Points
                  </h4>
                  <ul className="space-y-2 text-slate-600 text-xs">
                    {aiVetting.considerationsAndGaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOADED DOCUMENTS & RESUME VIEWER */}
          {activeTab === 'documents' && (
            <div className="space-y-5">
              {/* Document Overview Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{documents.resumeName}</div>
                    <div className="text-[11px] text-slate-400">PDF Application Ingestion • {documents.resumeSize}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedCandidate.portfolioUrl && (
                    <a
                      href={selectedCandidate.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1.5 border border-slate-200"
                    >
                      <span>Portfolio / GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {selectedCandidate.linkedInUrl && (
                    <a
                      href={selectedCandidate.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1.5 border border-slate-200"
                    >
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Cover Letter if available */}
              {documents.coverLetter && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Applicant Cover Letter Statement
                  </div>
                  <div className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60 font-sans italic">
                    "{documents.coverLetter}"
                  </div>
                </div>
              )}

              {/* Parsed Resume Text Content */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Full Resume Content (Extracted by AI OCR)
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">100% Verified Parse</span>
                </div>
                <pre className="text-slate-800 text-[11px] font-mono leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-4 rounded-lg border border-slate-200/60 max-h-96 overflow-y-auto">
                  {documents.resumeTextContent}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: AI SKILLS TEST BATTERY */}
          {activeTab === 'tests' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{aiTestBattery.testName}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      aiTestBattery.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {aiTestBattery.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Target Department: {selectedCandidate.department.toUpperCase()} • Minimum Passing Threshold: {aiTestBattery.passingScore}%
                  </div>
                </div>

                {aiTestBattery.status !== 'completed' ? (
                  <button
                    onClick={() => dispatchAiTestBattery(selectedCandidate.id)}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch AI Test Battery</span>
                  </button>
                ) : (
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600">{aiTestBattery.score} / 100</div>
                    <div className="text-[10px] text-slate-400">Completed on {new Date(aiTestBattery.completedAt || '').toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              {/* Questions & AI Grading */}
              {aiTestBattery.questions.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Graded Test Questions ({aiTestBattery.questions.length})
                  </div>
                  {aiTestBattery.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
                      <div className="flex items-start justify-between gap-4">
                        <div className="font-bold text-slate-900 text-xs">
                          Q{idx + 1}: {q.question}
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          {q.awardedPoints} / {q.maxPoints} PTS
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Candidate Submitted Solution:</div>
                        <p className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                          {q.candidateAnswer}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                        <span><strong>AI Evaluation:</strong> {q.aiGradingNotes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
                  <BrainCircuit className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <div className="font-semibold text-slate-700">Test Battery Pending</div>
                  <div className="text-[11px] mt-1">
                    Click "Dispatch AI Test Battery" to trigger the automated role evaluation module for {selectedCandidate.candidateName}.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AI VIDEO INTERVIEW SUITE */}
          {activeTab === 'video_interview' && (
            <div className="space-y-5">
              {aiVideoInterview.status === 'completed' ? (
                <>
                  {/* Video Player Box */}
                  <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white">
                    <div className="relative aspect-video max-h-[300px] w-full bg-slate-950 flex items-center justify-center">
                      <img
                        src={aiVideoInterview.thumbnailUrl}
                        alt="Candidate Video Stream"
                        className="w-full h-full object-cover opacity-60"
                      />
                      
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span>AI Verified Recording</span>
                          </div>
                          <span className="text-xs font-mono bg-black/50 px-2 py-0.5 rounded">
                            Duration: {aiVideoInterview.durationMinutes}m
                          </span>
                        </div>

                        <div className="text-center">
                          <button
                            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                            className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 mx-auto"
                          >
                            {isPlayingVideo ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                          </button>
                        </div>

                        {/* Animated Waveform Visualizer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 h-4">
                            {[12, 24, 18, 28, 16, 22, 14, 26, 20, 30, 16, 24].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full ${isPlayingVideo ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                            <span className="text-[10px] text-white/70 ml-2 font-mono">
                              Audio Waveform Sync
                            </span>
                          </div>

                          <div className="text-right text-[11px] font-semibold text-emerald-400">
                            AI Score: {aiVideoInterview.overallScore}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Question selector tabs */}
                    <div className="bg-slate-900 border-t border-white/10 p-2 flex items-center gap-2 overflow-x-auto text-xs">
                      {aiVideoInterview.questions.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => setSelectedVideoQuestionIndex(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                            selectedVideoQuestionIndex === idx
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Q{idx + 1} ({q.timestampStart})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry Radar Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Clarity & Articulation</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {aiVideoInterview.metrics.clarityAndArticulation}%
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Technical Precision</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {aiVideoInterview.metrics.technicalPrecision}%
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Strategic Clarity</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {aiVideoInterview.metrics.strategicThinking}%
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Composure</div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {aiVideoInterview.metrics.executiveComposure}%
                      </div>
                    </div>
                  </div>

                  {/* Transcript for active question */}
                  {aiVideoInterview.questions[selectedVideoQuestionIndex] && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="font-bold text-slate-900 text-xs">
                          {aiVideoInterview.questions[selectedVideoQuestionIndex].prompt}
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Score: {aiVideoInterview.questions[selectedVideoQuestionIndex].metricScore}%
                        </span>
                      </div>

                      <div className="text-slate-800 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/70 font-sans">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Live Candidate Transcript:</div>
                        "{aiVideoInterview.questions[selectedVideoQuestionIndex].candidateTranscript}"
                      </div>

                      <div className="text-[11px] text-slate-500 italic">
                        <strong>AI Observation:</strong> {aiVideoInterview.questions[selectedVideoQuestionIndex].feedback}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
                  <Video className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <div className="font-semibold text-slate-700">AI Video Interview Not Recorded</div>
                  <div className="text-[11px] mt-1 max-w-md mx-auto mb-4">
                    Send an automated AI video interview invitation. The candidate completes a structured, timed interview with questions tailored to {selectedCandidate.jobTitle}.
                  </div>
                  <button
                    onClick={() => conductAiVideoInterview(selectedCandidate.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Trigger AI Video Interview Run</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MULTI-DEPARTMENT REVIEWS */}
          {activeTab === 'department_reviews' && (
            <div className="space-y-5">
              {/* Existing Reviews */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Internal Department Evaluations ({departmentReviews.length})
                </div>

                {departmentReviews.length === 0 ? (
                  <div className="bg-white p-5 rounded-xl border border-slate-200 text-center text-slate-400">
                    No department notes recorded yet. Add your review below.
                  </div>
                ) : (
                  departmentReviews.map(rev => (
                    <div key={rev.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                          <span className="text-[10px] text-slate-400">• {rev.reviewerRole}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-slate-100 text-slate-600">
                            {rev.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-500">{'★'.repeat(rev.score)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            rev.decision === 'approve'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {rev.decision}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                        "{rev.notes}"
                      </p>
                      <div className="text-[10px] text-slate-400">
                        Logged on {new Date(rev.reviewedAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Department Review Form */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Submit {currentUser.department.toUpperCase()} Review as {currentUser.name}</span>
                </h4>

                <form onSubmit={handleDepartmentReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Technical / Domain Rating (1 - 5 Stars)
                      </label>
                      <select
                        value={reviewScore}
                        onChange={e => setReviewScore(Number(e.target.value))}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                      >
                        <option value={5}>★★★★★ - Exceptional (Strong Hire)</option>
                        <option value={4}>★★★★☆ - Strong (Hire)</option>
                        <option value={3}>★★★☆☆ - Adequate (Needs additional technical check)</option>
                        <option value={2}>★★☆☆☆ - Below Bar</option>
                        <option value={1}>★☆☆☆☆ - Reject</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Department Recommendation
                      </label>
                      <select
                        value={reviewDecision}
                        onChange={e => setReviewDecision(e.target.value as any)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                      >
                        <option value="approve">Approve & Preliminary Shortlist</option>
                        <option value="request_clarification">Request Clarification / Technical Sync</option>
                        <option value="reject">Pass / Archive Candidate</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Department Review Notes & Rationale
                    </label>
                    <textarea
                      rows={3}
                      placeholder={`Provide assessment of ${selectedCandidate.candidateName}'s suitability for ${selectedCandidate.jobTitle}...`}
                      value={reviewNotes}
                      onChange={e => setReviewNotes(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!reviewNotes.trim()}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    Log Department Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Quick Actions */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              Department Owner: <strong>{selectedCandidate.department.toUpperCase()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStageChange('rejected')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"
            >
              Archive / Reject
            </button>

            <button
              onClick={() => handleStageChange('shortlisted')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Confirm Shortlist</span>
            </button>

            <button
              onClick={() => handleStageChange('offered')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
            >
              Extend Sovereign Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
