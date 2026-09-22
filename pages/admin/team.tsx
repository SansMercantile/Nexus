import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/Layout';
import { getDb } from '@/lib/mongodb';
import { getCookieValue, verifySessionToken, isAllowedAdminEmail } from '@/lib/auth';
import type { DepartmentTool } from '@/lib/departments';

type TeamUser = {
  email: string;
  name: string;
  role: string;
  department?: string | null;
  active: boolean;
};

type ManagedDepartment = {
  id: string;
  name: string;
  description: string;
  tools: DepartmentTool[];
  active: boolean;
};

const ROLES = ['hr', 'administrator', 'ceo', 'member'];

const slugifyId = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export default function TeamAdmin({ user }: { user: { name: string; email: string; role: string } }) {
  const [users, setUsers] = React.useState<TeamUser[]>([]);
  const [departments, setDepartments] = React.useState<ManagedDepartment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');

  const [newUser, setNewUser] = React.useState({ name: '', email: '', role: 'member', department: '', password: '' });
  const [newDept, setNewDept] = React.useState({ name: '', description: '', active: true });
  const [newDeptTools, setNewDeptTools] = React.useState<DepartmentTool[]>([{ name: '', description: '', route: '' }]);
  const [editingDeptId, setEditingDeptId] = React.useState<string | null>(null);

  const loadAll = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, deptsRes] = await Promise.all([
        fetch('/api/users/manage'),
        fetch('/api/departments/manage'),
      ]);
      const usersData = await usersRes.json();
      const deptsData = await deptsRes.json();
      if (!usersRes.ok) throw new Error(usersData?.message || 'Unable to load users.');
      if (!deptsRes.ok) throw new Error(deptsData?.message || 'Unable to load departments.');
      setUsers(Array.isArray(usersData.users) ? usersData.users : []);
      setDepartments(Array.isArray(deptsData.departments) ? deptsData.departments : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load team data.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  const flashNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 6000);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/users/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department || undefined,
          ...(newUser.password ? { password: newUser.password } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Create failed.');
      setNewUser({ name: '', email: '', role: 'member', department: '', password: '' });
      await loadAll();
      flashNotice(
        data.generatedPassword
          ? `Account created. Temporary password (share once): ${data.generatedPassword}`
          : 'Account created.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed.');
    }
  };

  const handlePatchUser = async (email: string, patch: Record<string, unknown>) => {
    setError('');
    try {
      const res = await fetch('/api/users/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Update failed.');
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`Delete ${email} permanently?`)) return;
    try {
      const res = await fetch(`/api/users/manage?email=${encodeURIComponent(email)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Delete failed.');
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const tools = newDeptTools
        .filter((tool) => tool.name.trim() && tool.description.trim())
        .map((tool) => ({
          name: tool.name.trim(),
          description: tool.description.trim(),
          ...(tool.route?.trim() ? { route: tool.route.trim() } : {}),
        }));
      const payload = {
        ...(editingDeptId ? { id: editingDeptId } : { id: slugifyId(newDept.name) }),
        name: newDept.name.trim(),
        description: newDept.description.trim(),
        tools,
        active: newDept.active,
      };
      const res = await fetch('/api/departments/manage', {
        method: editingDeptId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Save failed.');
      setNewDept({ name: '', description: '', active: true });
      setNewDeptTools([{ name: '', description: '', route: '' }]);
      setEditingDeptId(null);
      await loadAll();
      flashNotice('Department saved. Its toolset is live for that department immediately.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    }
  };

  const startEditDepartment = (dept: ManagedDepartment) => {
    setEditingDeptId(dept.id);
    setNewDept({ name: dept.name, description: dept.description, active: dept.active });
    setNewDeptTools(dept.tools.length > 0 ? dept.tools.map((t) => ({ ...t })) : [{ name: '', description: '', route: '' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!window.confirm(`Delete department "${id}"? Users must be reassigned first.`)) return;
    try {
      const res = await fetch(`/api/departments/manage?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Delete failed.');
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Team Management | Sans Mercantile</title>
      </Head>

      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/admin" className="text-nexus-gold hover:text-nexus-gold/80 mb-6 flex items-center gap-2">
            ← Back to Dashboard
          </Link>
          <p className="text-sm text-nexus-gray-400 mb-2">Signed in as {user.email} ({user.role})</p>
          <h1 className="text-5xl font-bold text-white mb-4">Team Management</h1>
          <p className="text-nexus-gray-300 mb-8 max-w-3xl">
            HR user provisioning and department toolsets. New accounts sign in immediately;
            departments carry the tools each team needs for its job description.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-sm">
              {error}
            </div>
          )}
          {notice && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm break-all">
              {notice}
            </div>
          )}

          {/* Users */}
          <h2 className="text-3xl font-bold text-white mb-4">Users</h2>
          <form
            onSubmit={handleCreateUser}
            className="mb-6 rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Full name *"
              required
              className="px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
            />
            <input
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email *"
              required
              type="email"
              className="px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={newUser.department}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              className="px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
            >
              <option value="">No department</option>
              {departments.filter((d) => d.active).map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <input
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Password (blank = auto-generate)"
              type="text"
              autoComplete="off"
              className="px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
            />
            <button type="submit" className="px-6 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90">
              + Add User
            </button>
          </form>

          {loading ? (
            <div className="text-nexus-gray-300 mb-12">Loading team...</div>
          ) : (
            <div className="grid gap-3 mb-12">
              {users.map((member) => (
                <div key={member.email} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-4 flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-white font-semibold">{member.name}</p>
                    <p className="text-sm text-nexus-gray-400">{member.email}</p>
                  </div>
                  <select
                    value={member.role}
                    onChange={(e) => handlePatchUser(member.email, { role: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-nexus-accent/20 text-white text-sm"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <select
                    value={member.department || ''}
                    onChange={(e) => handlePatchUser(member.email, { department: e.target.value || null })}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-nexus-accent/20 text-white text-sm"
                  >
                    <option value="">No department</option>
                    {departments.filter((d) => d.active).map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handlePatchUser(member.email, { active: !member.active })}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                      member.active
                        ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                        : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    {member.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(member.email)}
                    className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {users.length === 0 && <p className="text-nexus-gray-400">No users yet.</p>}
            </div>
          )}

          {/* Departments */}
          <h2 className="text-3xl font-bold text-white mb-4">Departments</h2>
          <form
            onSubmit={handleSaveDepartment}
            className="mb-6 rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6 space-y-4"
          >
            <h3 className="text-xl font-bold text-white">{editingDeptId ? `Edit ${editingDeptId}` : 'New Department'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={newDept.name}
                onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                placeholder="Department name * (e.g. Technical Support)"
                required
                disabled={!!editingDeptId}
                className="px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white disabled:opacity-60"
              />
              <label className="flex items-center gap-2 text-sm text-nexus-gray-300">
                <input
                  type="checkbox"
                  checked={newDept.active}
                  onChange={(e) => setNewDept({ ...newDept, active: e.target.checked })}
                />
                Active
              </label>
            </div>
            <textarea
              value={newDept.description}
              onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
              placeholder="Job description for this department *"
              required
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
            />
            <div className="space-y-2">
              <p className="text-sm text-nexus-gray-400">Tools this department needs (name + description required, route optional)</p>
              {newDeptTools.map((tool, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    value={tool.name}
                    onChange={(e) => {
                      const next = [...newDeptTools];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setNewDeptTools(next);
                    }}
                    placeholder="Tool name"
                    className="px-3 py-2 rounded-lg bg-white/5 border border-nexus-accent/20 text-white text-sm"
                  />
                  <input
                    value={tool.description}
                    onChange={(e) => {
                      const next = [...newDeptTools];
                      next[idx] = { ...next[idx], description: e.target.value };
                      setNewDeptTools(next);
                    }}
                    placeholder="What it is for"
                    className="px-3 py-2 rounded-lg bg-white/5 border border-nexus-accent/20 text-white text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      value={tool.route || ''}
                      onChange={(e) => {
                        const next = [...newDeptTools];
                        next[idx] = { ...next[idx], route: e.target.value };
                        setNewDeptTools(next);
                      }}
                      placeholder="Route (e.g. /crm)"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-nexus-accent/20 text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setNewDeptTools(newDeptTools.filter((_, i) => i !== idx))}
                      className="px-3 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setNewDeptTools([...newDeptTools, { name: '', description: '', route: '' }])}
                className="text-sm text-nexus-gold hover:underline"
              >
                + Add tool
              </button>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90">
                {editingDeptId ? 'Save Department' : 'Create Department'}
              </button>
              {editingDeptId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingDeptId(null);
                    setNewDept({ name: '', description: '', active: true });
                    setNewDeptTools([{ name: '', description: '', route: '' }]);
                  }}
                  className="px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="grid gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-lg font-semibold text-white">{dept.name}</h3>
                  <span className="text-xs text-nexus-gray-500">/{dept.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${dept.active ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {dept.active ? 'active' : 'archived'}
                  </span>
                  <span className="ml-auto flex gap-2">
                    <button onClick={() => startEditDepartment(dept)} className="text-sm text-nexus-gold hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteDepartment(dept.id)} className="text-sm text-red-400 hover:underline">
                      Delete
                    </button>
                  </span>
                </div>
                <p className="text-sm text-nexus-gray-400 mb-3">{dept.description}</p>
                <ul className="space-y-1">
                  {dept.tools.map((tool, i) => (
                    <li key={i} className="text-sm text-nexus-gray-300">
                      <span className="text-white font-medium">{tool.name}</span>
                      {' — '}{tool.description}
                      {tool.route && <span className="text-nexus-gray-500"> ({tool.route})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }: { req: any }) {
  const sessionToken = getCookieValue(req.headers.cookie, 'portal_session');
  if (!sessionToken) {
    return { redirect: { destination: '/portal', permanent: false } };
  }

  const payload = verifySessionToken(sessionToken) as any;
  if (!payload || typeof payload.email !== 'string') {
    return { redirect: { destination: '/portal', permanent: false } };
  }

  const db = await getDb();
  const user = await db.collection('portal_users').findOne({ email: payload.email.toLowerCase(), active: true }) as any;

  if (!user || !isAllowedAdminEmail(user.email)) {
    return { redirect: { destination: '/portal', permanent: false } };
  }

  return {
    props: {
      user: { name: user.name, email: user.email, role: user.role || 'user' },
    },
  };
}
