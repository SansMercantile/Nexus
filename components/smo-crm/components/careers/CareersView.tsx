import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  BrainCircuit, 
  Video, 
  CheckCircle2, 
  Globe, 
  Plus, 
  Filter, 
  Search, 
  Building, 
  ArrowUpRight,
  FileText,
  Clock,
  Layers,
  LayoutGrid,
  List
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { ApplicationStage, CandidateApplication, Department } from '../../types';
import { DEPARTMENTS } from '../../data/departmentsData';
import { CandidateDetailModal } from './CandidateDetailModal';
import { WebsiteCareersPortalModal } from './WebsiteCareersPortalModal';

export const CareersView: React.FC = () => {
  const { 
    candidateApplications, 
    jobPostings, 
    setSelectedCandidate, 
    setIsWebsitePortalOpen,
    currentUser 
  } = useCrm();

  const [selectedDeptFilter, setSelectedDeptFilter] = useState<Department | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Filter candidates
  const filteredCandidates = candidateApplications.filter(cand => {
    if (selectedDeptFilter !== 'all' && cand.department !== selectedDeptFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      cand.candidateName.toLowerCase().includes(q) ||
      cand.jobTitle.toLowerCase().includes(q) ||
      cand.email.toLowerCase().includes(q) ||
      cand.department.toLowerCase().includes(q)
    );
  });

  // Pipeline metrics
  const totalApps = candidateApplications.length;
  const vettedCount = candidateApplications.filter(c => c.aiVetting?.score > 0).length;
  const testsCount = candidateApplications.filter(c => c.aiTestBattery?.status === 'completed').length;
  const interviewCount = candidateApplications.filter(c => c.aiVideoInterview?.status === 'completed').length;
  const shortlistedCount = candidateApplications.filter(c => c.stage === 'shortlisted' || c.stage === 'offered').length;

  const STAGES: { stage: ApplicationStage; title: string; color: string }[] = [
    { stage: 'applied', title: '1. Website Ingested', color: 'border-slate-300' },
    { stage: 'vetted', title: '2. AI Vetted & Scored', color: 'border-blue-400' },
    { stage: 'tests_dispatched', title: '3. Tests In Progress', color: 'border-amber-400' },
    { stage: 'tests_completed', title: '4. Tests Completed', color: 'border-indigo-400' },
    { stage: 'interview_done', title: '5. AI Video Interview', color: 'border-purple-400' },
    { stage: 'shortlisted', title: '6. Preliminary Shortlisted', color: 'border-emerald-500' },
  ];

  return (
    <div id="smo-careers-module" className="flex-1 flex flex-col bg-slate-50/60 overflow-hidden select-none">
      {/* Top Header & Metrics */}
      <div className="bg-white border-b border-slate-200 p-4 shrink-0 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Careers & AI Talent Ingestion Engine</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Bedrock Vetting Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Website applicants flow directly into the CRM with automated AI resume parsing, automated test batteries, and AI video interview telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="open-website-portal-button"
              onClick={() => setIsWebsitePortalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulate Website Careers Portal</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Pipeline Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{totalApps}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Vetted
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{vettedCount}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <BrainCircuit className="w-3 h-3" /> Tests Passed
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{testsCount}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
              <Video className="w-3 h-3" /> AI Video Screened
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{interviewCount}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-emerald-200/90 bg-emerald-50/30">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Shortlisted
            </div>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">{shortlistedCount}</div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
          {/* Department Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedDeptFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedDeptFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Departments ({candidateApplications.length})
            </button>

            {Object.entries(DEPARTMENTS).map(([key, dept]) => {
              const count = candidateApplications.filter(c => c.department === key).length;
              const isSelected = selectedDeptFilter === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDeptFilter(key as Department)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{dept.name}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* View Mode & Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate dossiers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md ${viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Kanban Board View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Data Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
        {viewMode === 'kanban' ? (
          /* Kanban Board View */
          <div className="flex items-start gap-4 min-w-[1280px]">
            {STAGES.map(stageObj => {
              const stageCandidates = filteredCandidates.filter(c => {
                if (stageObj.stage === 'shortlisted') {
                  return c.stage === 'shortlisted' || c.stage === 'offered';
                }
                return c.stage === stageObj.stage;
              });

              return (
                <div 
                  key={stageObj.stage} 
                  className="w-72 bg-slate-100/80 rounded-xl border border-slate-200/90 flex flex-col max-h-[calc(100vh-250px)] shrink-0"
                >
                  <div className={`p-3 border-b border-slate-200 bg-white/70 rounded-t-xl flex items-center justify-between border-t-2 ${stageObj.color}`}>
                    <span className="text-xs font-bold text-slate-800">{stageObj.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {stageCandidates.length}
                    </span>
                  </div>

                  <div className="p-2 overflow-y-auto flex-1 space-y-2.5">
                    {stageCandidates.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-400">
                        No candidates at this stage
                      </div>
                    ) : (
                      stageCandidates.map(cand => {
                        const dept = DEPARTMENTS[cand.department];

                        return (
                          <div
                            key={cand.id}
                            id={`candidate-card-${cand.id}`}
                            onClick={() => setSelectedCandidate(cand)}
                            className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-indigo-300 transition-all cursor-pointer group text-xs space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {cand.candidateName}
                                </h3>
                                <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                  {cand.jobTitle}
                                </div>
                              </div>

                              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 font-bold shrink-0">
                                <span className="text-[11px] leading-none">{cand.aiVetting.score}</span>
                                <span className="text-[7px] text-indigo-500 uppercase">FIT</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${dept.badgeBg}`}>
                                {dept.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                                <FileText className="w-2.5 h-2.5" />
                                {cand.documents.resumeName.length > 15 ? `${cand.documents.resumeName.slice(0, 14)}...` : cand.documents.resumeName}
                              </span>
                            </div>

                            {/* Evaluation Badges */}
                            <div className="pt-1 border-t border-slate-100 space-y-1 text-[10px]">
                              {cand.aiTestBattery.status === 'completed' && (
                                <div className="flex items-center justify-between text-slate-600 font-medium">
                                  <span className="flex items-center gap-1">
                                    <BrainCircuit className="w-3 h-3 text-indigo-600" />
                                    AI Test Score:
                                  </span>
                                  <span className="font-bold text-slate-900">{cand.aiTestBattery.score}/100</span>
                                </div>
                              )}

                              {cand.aiVideoInterview.status === 'completed' && (
                                <div className="flex items-center justify-between text-slate-600 font-medium">
                                  <span className="flex items-center gap-1">
                                    <Video className="w-3 h-3 text-purple-600" />
                                    AI Video Screen:
                                  </span>
                                  <span className="font-bold text-slate-900">{cand.aiVideoInterview.overallScore}%</span>
                                </div>
                              )}

                              {cand.departmentReviews.length > 0 && (
                                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    {cand.departmentReviews[0].reviewerName.split(' ')[0]} Sign-off
                                  </span>
                                  <span>{'★'.repeat(cand.departmentReviews[0].score)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Target Role & Dept</th>
                  <th className="p-3">AI Match Score</th>
                  <th className="p-3">Test Battery</th>
                  <th className="p-3">AI Video Screen</th>
                  <th className="p-3">Current Stage</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map(cand => {
                  const dept = DEPARTMENTS[cand.department];

                  return (
                    <tr
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-bold text-slate-900">
                        {cand.candidateName}
                        <div className="text-[10px] text-slate-400 font-normal">{cand.email}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-slate-800">{cand.jobTitle}</div>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${dept.badgeBg}`}>
                          {dept.name}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {cand.aiVetting.score}% Match
                        </span>
                      </td>

                      <td className="p-3">
                        {cand.aiTestBattery.status === 'completed' ? (
                          <span className="font-semibold text-slate-800 text-xs">
                            {cand.aiTestBattery.score} / 100
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] capitalize">
                            {cand.aiTestBattery.status}
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        {cand.aiVideoInterview.status === 'completed' ? (
                          <span className="font-semibold text-purple-700 text-xs flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {cand.aiVideoInterview.overallScore}%
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] capitalize">
                            {cand.aiVideoInterview.status}
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="text-[11px] font-semibold text-slate-700 capitalize">
                          {cand.stage.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedCandidate(cand);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium text-[11px] transition-colors"
                        >
                          Open Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal />

      {/* Public Website Simulation Modal */}
      <WebsiteCareersPortalModal />
    </div>
  );
};
