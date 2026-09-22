import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/Layout';
import inventory from '@/lib/brigit-agents.json';

type AgentDef = {
  id: string;
  name: string;
  class_name: string;
  module: string;
  summary: string;
  capabilities: string[];
};

type DepartmentDef = {
  id: string;
  name: string;
  agents: AgentDef[];
};

type SimAgent = {
  def: AgentDef;
  department: string;
  status: 'idle' | 'busy';
  task: string;
  progress: number;
  duration: number;
  completed: number;
};

type SimEvent = {
  id: number;
  tick: number;
  clock: string;
  text: string;
  kind: 'start' | 'done' | 'handoff' | 'escalation' | 'system';
};

const TASK_TEMPLATES: Record<string, Array<[string, string]>> = {
  content_creation: [
    ['Drafting', 'executive brief'],
    ['Reviewing', 'editorial queue'],
    ['Publishing', 'release memo'],
    ['Rewriting', 'announcement for distribution'],
  ],
  data_analysis: [
    ['Running', 'anomaly scan'],
    ['Compiling', 'KPI rollup'],
    ['Refreshing', 'forecast model'],
    ['Auditing', 'metrics pipeline'],
  ],
  decision_making: [
    ['Reviewing', 'approval request'],
    ['Prioritizing', 'work queue'],
    ['Ruling on', 'escalation case'],
  ],
  communication: [
    ['Broadcasting', 'status update'],
    ['Briefing', 'stakeholders'],
    ['Posting', 'shift handover note'],
  ],
  monitoring: [
    ['Sweeping', 'health checks'],
    ['Watching', 'SLA thresholds'],
    ['Checking', 'queue depth'],
  ],
  automation: [
    ['Reconciling', 'batch records'],
    ['Running', 'scheduled sync'],
    ['Assembling', 'operations report'],
  ],
  research: [
    ['Sweeping', 'intel sources'],
    ['Triaging', 'research leads'],
    ['Scanning', 'market landscape'],
  ],
  coordination: [
    ['Syncing', 'standup board'],
    ['Checking', 'cross-team dependencies'],
    ['Packaging', 'handoff bundle'],
  ],
};

const DEPARTMENTS: DepartmentDef[] = (inventory as { departments: DepartmentDef[] }).departments;
const ALL_AGENTS: Array<{ def: AgentDef; department: string }> = DEPARTMENTS.flatMap((dept) =>
  dept.agents.map((def) => ({ def, department: dept.name }))
);

const SPEEDS = [
  { label: '1×', ms: 1200 },
  { label: '2×', ms: 600 },
  { label: '4×', ms: 300 },
];

let eventSeq = 0;
const clockFor = (tick: number) => {
  const minutes = 9 * 60 + tick;
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const pickTask = (agent: { def: AgentDef; department: string }): { task: string; duration: number } => {
  const capability = agent.def.capabilities[0] || 'automation';
  const templates = TASK_TEMPLATES[capability] || TASK_TEMPLATES.automation;
  const [verb, object] = templates[Math.floor(Math.random() * templates.length)];
  return {
    task: `${verb} ${object} — ${agent.department}`,
    duration: 2 + Math.floor(Math.random() * 5),
  };
};

const pickHandoff = (agent: { def: AgentDef; department: string }): string => {
  const others = ALL_AGENTS.filter((a) => a.department !== agent.department);
  const target = others[Math.floor(Math.random() * others.length)];
  return `${agent.def.name} (${agent.department}) handed off to ${target.def.name} (${target.department})`;
};

export default function AgentSimulation() {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [speedIdx, setSpeedIdx] = React.useState(0);
  const [deptFilter, setDeptFilter] = React.useState('all');
  const [tick, setTick] = React.useState(0);
  const [agents, setAgents] = React.useState<Record<string, SimAgent>>({});
  const [events, setEvents] = React.useState<SimEvent[]>([]);
  const [deptCompleted, setDeptCompleted] = React.useState<Record<string, number>>({});
  const [handoffs, setHandoffs] = React.useState(0);

  React.useEffect(() => {
    fetch('/api/portal/me')
      .then(async (response) => {
        if (!response.ok) {
          window.location.href = '/portal';
          return;
        }
        await response.json();
        setAuthenticated(true);
      })
      .catch(() => {
        window.location.href = '/portal';
      });
  }, []);

  React.useEffect(() => {
    if (!running || !authenticated) return;
    const interval = window.setInterval(() => {
      setTick((prevTick) => {
        const nextTick = prevTick + 1;
        const clock = clockFor(nextTick);

        setAgents((prev) => {
          const next: Record<string, SimAgent> = { ...prev };
          const newEvents: SimEvent[] = [];
          const completedByDept: Record<string, number> = {};
          let handoffCount = 0;

          // Advance in-flight work.
          for (const agent of Object.values(next)) {
            if (agent.status !== 'busy') continue;
            agent.progress += 1;
            if (agent.progress >= agent.duration) {
              agent.status = 'idle';
              agent.completed += 1;
              agent.task = '';
              agent.progress = 0;
              completedByDept[agent.department] = (completedByDept[agent.department] || 0) + 1;
              newEvents.push({
                id: ++eventSeq,
                tick: nextTick,
                clock,
                text: `${agent.def.name} completed: ${agent.task || 'assignment'}`,
                kind: 'done',
              });
              // Corporate behavior: cross-department handoffs + rare escalations.
              const roll = Math.random();
              if (roll < 0.3) {
                handoffCount += 1;
                newEvents.push({ id: ++eventSeq, tick: nextTick, clock, text: pickHandoff(agent), kind: 'handoff' });
              } else if (roll > 0.96) {
                newEvents.push({
                  id: ++eventSeq,
                  tick: nextTick,
                  clock,
                  text: `${agent.def.name} escalated an exception to ${agent.department} command`,
                  kind: 'escalation',
                });
              }
            }
          }

          // Activate idle agents for this tick.
          const pool = ALL_AGENTS.filter(
            (a) => (deptFilter === 'all' || a.department === deptFilter) && !next[a.def.id]
          );
          const activations = Math.min(pool.length, 2 + Math.floor(Math.random() * 4));
          for (let i = 0; i < activations; i++) {
            const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            if (!pick) break;
            const { task, duration } = pickTask(pick);
            next[pick.def.id] = {
              def: pick.def,
              department: pick.department,
              status: 'busy',
              task,
              progress: 0,
              duration,
              completed: next[pick.def.id]?.completed || 0,
            };
            newEvents.push({
              id: ++eventSeq,
              tick: nextTick,
              clock,
              text: `${pick.def.name} started: ${task}`,
              kind: 'start',
            });
          }

          if (Object.keys(completedByDept).length > 0) {
            setDeptCompleted((prevCounts) => {
              const merged = { ...prevCounts };
              for (const [dept, count] of Object.entries(completedByDept)) {
                merged[dept] = (merged[dept] || 0) + count;
              }
              return merged;
            });
          }
          if (handoffCount > 0) {
            setHandoffs((prev) => prev + handoffCount);
          }
          if (newEvents.length > 0) {
            setEvents((prevEvents) => [...newEvents.reverse(), ...prevEvents].slice(0, 120));
          }
          return next;
        });

        return nextTick;
      });
    }, SPEEDS[speedIdx].ms);
    return () => window.clearInterval(interval);
  }, [running, authenticated, speedIdx, deptFilter]);

  if (!authenticated) return null;

  const activeAgents = Object.values(agents).filter((a) => a.status === 'busy');
  const totalCompleted = Object.values(deptCompleted).reduce((sum, count) => sum + count, 0);
  const topDepartments = Object.entries(deptCompleted)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxDeptCount = topDepartments.length > 0 ? topDepartments[0][1] : 1;

  return (
    <Layout>
      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/admin" className="text-nexus-gold hover:text-nexus-gold/80 mb-6 flex items-center gap-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">Agent Operations</h1>
          <p className="text-nexus-gray-300 text-lg mb-8">
            Live simulation of the {ALL_AGENTS.length} Brigit corporate agents across {DEPARTMENTS.length}{' '}
            departments — shift clock, live assignments, handoffs, and escalations in real time.
          </p>

          {/* Controls */}
          <div className="flex gap-4 mb-8 items-center flex-wrap">
            <button
              onClick={() => setRunning((prev) => !prev)}
              className={`px-8 py-3 rounded-xl font-bold transition ${
                running ? 'bg-red-500/90 text-white hover:bg-red-500' : 'bg-nexus-gold text-black hover:opacity-90'
              }`}
            >
              {running ? '⏸ Pause Simulation' : '▶ Simulate Agents Live'}
            </button>
            <div className="flex gap-2">
              {SPEEDS.map((speed, idx) => (
                <button
                  key={speed.label}
                  onClick={() => setSpeedIdx(idx)}
                  className={`px-4 py-3 rounded-xl font-semibold transition ${
                    speedIdx === idx
                      ? 'bg-nexus-gold text-black'
                      : 'bg-[#0b1125] text-nexus-gray-300 border border-nexus-gold/20'
                  }`}
                >
                  {speed.label}
                </button>
              ))}
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#0b1125] border border-nexus-gold/20 text-white"
            >
              <option value="all">All departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name} ({dept.agents.length})
                </option>
              ))}
            </select>
            <span className="ml-auto text-nexus-gray-300 font-mono">
              Shift clock <span className="text-nexus-gold font-bold">{clockFor(tick)}</span>
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Agents Online', value: String(ALL_AGENTS.length) },
              { label: 'Working Now', value: String(activeAgents.length) },
              { label: 'Tasks Completed', value: String(totalCompleted) },
              { label: 'Handoffs', value: String(handoffs) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                <p className="text-sm text-nexus-gray-400 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live feed */}
            <div className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Live Activity</h2>
              <div className="space-y-2 max-h-[480px] overflow-y-auto">
                {events.length === 0 && (
                  <p className="text-nexus-gray-400">Press “Simulate Agents Live” to start the shift.</p>
                )}
                {events.map((event) => (
                  <div key={event.id} className="text-sm p-2 rounded-lg bg-nexus-dark/50">
                    <span className="text-nexus-gray-500 font-mono mr-2">{event.clock}</span>
                    <span
                      className={
                        event.kind === 'handoff'
                          ? 'text-cyan-400'
                          : event.kind === 'escalation'
                            ? 'text-red-400'
                            : event.kind === 'done'
                              ? 'text-green-400'
                              : 'text-nexus-gray-300'
                      }
                    >
                      {event.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments + active agents */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Department Throughput</h2>
                <div className="space-y-3">
                  {topDepartments.length === 0 && (
                    <p className="text-nexus-gray-400 text-sm">No completed tasks yet this shift.</p>
                  )}
                  {topDepartments.map(([dept, count]) => (
                    <div key={dept}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-nexus-gray-300">{dept}</span>
                        <span className="text-white font-semibold">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-nexus-dark overflow-hidden">
                        <div
                          className="h-full bg-nexus-gold transition-all duration-300"
                          style={{ width: `${Math.round((count / maxDeptCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Active Assignments ({activeAgents.length})</h2>
                <div className="space-y-3 max-h-[320px] overflow-y-auto">
                  {activeAgents.slice(0, 12).map((agent) => (
                    <div key={agent.def.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white font-medium">{agent.def.name}</span>
                        <span className="text-nexus-gray-500">{agent.department}</span>
                      </div>
                      <p className="text-xs text-nexus-gray-400 mb-1 truncate">{agent.task}</p>
                      <div className="h-1.5 rounded-full bg-nexus-dark overflow-hidden">
                        <div
                          className="h-full bg-nexus-accent transition-all duration-300"
                          style={{ width: `${Math.round((agent.progress / agent.duration) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {activeAgents.length === 0 && (
                    <p className="text-nexus-gray-400 text-sm">No active assignments.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
