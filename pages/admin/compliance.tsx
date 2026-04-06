'use client';

import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

export default function ComplianceDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      user: 'admin@example.com',
      action: 'USER_CREATED',
      resource: 'Users',
      timestamp: 'Today 2:30 PM',
      status: 'success',
      details: 'New user account created: john.doe@example.com',
    },
    {
      id: '2',
      user: 'sarah@example.com',
      action: 'ASSESSMENT_REVIEWED',
      resource: 'Assessments',
      timestamp: 'Today 1:15 PM',
      status: 'success',
      details: 'Assessment #1234 reviewed and marked as passed',
    },
    {
      id: '3',
      user: 'admin@example.com',
      action: 'SECURITY_INCIDENT',
      resource: 'Security',
      timestamp: 'Today 12:45 PM',
      status: 'warning',
      details: 'Cheating detected in assessment - voice anomaly flagged',
    },
    {
      id: '4',
      user: 'mike@example.com',
      action: 'DATABASE_BACKUP',
      resource: 'System',
      timestamp: 'Today 10:00 AM',
      status: 'success',
      details: 'Daily database backup completed successfully',
    },
    {
      id: '5',
      user: 'unknown@example.com',
      action: 'FAILED_LOGIN',
      resource: 'Authentication',
      timestamp: 'Today 9:30 AM',
      status: 'failed',
      details: 'Multiple failed login attempts detected',
    },
    {
      id: '6',
      user: 'admin@example.com',
      action: 'ROLE_CHANGED',
      resource: 'Users',
      timestamp: 'Yesterday 4:20 PM',
      status: 'success',
      details: 'User role changed from user to manager',
    },
  ]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    const user = localStorage.getItem('user_name');
    if (user) {
      setAuthenticated(true);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'USER_CREATED':
        return '👤';
      case 'ASSESSMENT_REVIEWED':
        return '📋';
      case 'SECURITY_INCIDENT':
        return '⚠️';
      case 'DATABASE_BACKUP':
        return '💾';
      case 'FAILED_LOGIN':
        return '🔒';
      case 'ROLE_CHANGED':
        return '👑';
      default:
        return '📝';
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const statusMatch = filterStatus === 'all' || log.status === filterStatus;
    const actionMatch = filterAction === 'all' || log.action === filterAction;
    const searchMatch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && actionMatch && searchMatch;
  });

  if (!authenticated) return null;

  const stats = {
    totalEvents: auditLogs.length,
    successEvents: auditLogs.filter((l) => l.status === 'success').length,
    warningEvents: auditLogs.filter((l) => l.status === 'warning').length,
    failedEvents: auditLogs.filter((l) => l.status === 'failed').length,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-nexus-dark via-[#0f1425] to-nexus-dark pt-32 pb-20">
        <div className="max-w-full mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Compliance & Audit</h1>
              <p className="text-gray-400">Security events and audit trail</p>
            </div>
            <Link href="/admin">
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                ← Back to Admin
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { title: 'Total Events', value: stats.totalEvents, icon: '📊', color: 'blue' },
              { title: 'Successful', value: stats.successEvents, icon: '✅', color: 'green' },
              { title: 'Warnings', value: stats.warningEvents, icon: '⚠️', color: 'yellow' },
              { title: 'Failed', value: stats.failedEvents, icon: '❌', color: 'red' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-${stat.color}-500/10 border border-${stat.color}-500/30 rounded-lg p-6`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-${stat.color}-300 text-sm mb-2`}>{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="text-4xl opacity-50">{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filter Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 bg-nexus-dark-light/50 border border-nexus-gold/20 rounded-xl p-6 h-fit"
            >
              <h2 className="text-xl font-bold text-white mb-6">Filters</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Search</label>
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-nexus-dark rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-nexus-gold"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-nexus-dark rounded-lg border border-gray-700 text-white focus:outline-none focus:border-nexus-gold"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Successful</option>
                    <option value="warning">Warnings</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Action Type</label>
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="w-full px-4 py-2 bg-nexus-dark rounded-lg border border-gray-700 text-white focus:outline-none focus:border-nexus-gold"
                  >
                    <option value="all">All Actions</option>
                    <option value="USER_CREATED">User Created</option>
                    <option value="ASSESSMENT_REVIEWED">Assessment Reviewed</option>
                    <option value="SECURITY_INCIDENT">Security Incident</option>
                    <option value="DATABASE_BACKUP">Database Backup</option>
                    <option value="FAILED_LOGIN">Failed Login</option>
                    <option value="ROLE_CHANGED">Role Changed</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Time Period</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-nexus-dark rounded-lg border border-gray-700 text-white focus:outline-none focus:border-nexus-gold"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Audit Logs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-nexus-dark-light/50 border border-nexus-gold/20 rounded-xl p-8"
            >
              <h2 className="text-xl font-bold text-white mb-6">Audit Log Timeline</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedLog(log)}
                      className={`p-4 rounded-lg cursor-pointer transition-all border ${                        selectedLog?.id === log.id
                          ? 'bg-nexus-gold/30 border-nexus-gold'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{getActionIcon(log.action)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <p className="font-semibold text-white truncate">{log.action.replace(/_/g, ' ')}</p>
                            <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(log.status)}`}>
                              {log.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-1">{log.user}</p>
                          <p className="text-xs text-gray-500">{log.timestamp}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No audit logs found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Details Panel */}
          {selectedLog && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8 bg-nexus-dark-light/50 border border-nexus-gold/20 rounded-xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Event ID</p>
                  <p className="text-white font-semibold mb-4">{selectedLog.id}</p>

                  <p className="text-gray-400 text-sm mb-2">User</p>
                  <p className="text-white font-semibold mb-4">{selectedLog.user}</p>

                  <p className="text-gray-400 text-sm mb-2">Action</p>
                  <p className="text-white font-semibold mb-4">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Resource</p>
                  <p className="text-white font-semibold mb-4">{selectedLog.resource}</p>

                  <p className="text-gray-400 text-sm mb-2">Status</p>
                  <div className="mb-4">
                    <span className={`inline-block px-4 py-2 rounded font-semibold ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-2">Timestamp</p>
                  <p className="text-white font-semibold">{selectedLog.timestamp}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Details</p>
                <p className="text-white bg-gray-800/50 rounded-lg p-4 border border-gray-700">{selectedLog.details}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}



