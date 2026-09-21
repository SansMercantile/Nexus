import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/Layout';
import { getDb } from '@/lib/mongodb';
import { getCookieValue, verifySessionToken, isAllowedAdminEmail } from '@/lib/auth';

type ManagedPost = {
  slug: string;
  type: 'blog' | 'press';
  title: string;
  excerpt: string;
  body: string;
  cover?: string;
  author?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  updatedAt?: string;
};

const EMPTY_FORM = {
  slug: '',
  type: 'blog' as 'blog' | 'press',
  title: '',
  excerpt: '',
  body: '',
  cover: '',
  author: '',
  status: 'draft' as 'draft' | 'published',
};

export default function ContentStudio({ user }: { user: { name: string; email: string; role: string } }) {
  const [tab, setTab] = React.useState<'blog' | 'press'>('blog');
  const [posts, setPosts] = React.useState<ManagedPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [editing, setEditing] = React.useState<typeof EMPTY_FORM | null>(null);
  const [saving, setSaving] = React.useState(false);

  const loadPosts = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/content/manage');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Unable to load posts.');
      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const visiblePosts = posts.filter((post) => post.type === tab);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || saving) return;
    setSaving(true);
    setError('');
    try {
      const isUpdate = posts.some((p) => p.slug === editing.slug && p.type === editing.type);
      const res = await fetch('/api/content/manage', {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Save failed.');
      setEditing(null);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (post: ManagedPost) => {
    try {
      const res = await fetch('/api/content/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: post.slug,
          type: post.type,
          status: post.status === 'published' ? 'draft' : 'published',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Update failed.');
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    }
  };

  const handleDelete = async (post: ManagedPost) => {
    if (!window.confirm(`Delete "${post.title}" permanently?`)) return;
    try {
      const res = await fetch(
        `/api/content/manage?slug=${encodeURIComponent(post.slug)}&type=${post.type}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Delete failed.');
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const startNew = () => setEditing({ ...EMPTY_FORM, type: tab, author: user.name });
  const startEdit = (post: ManagedPost) =>
    setEditing({
      slug: post.slug,
      type: post.type,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      cover: post.cover || '',
      author: post.author || '',
      status: post.status,
    });

  return (
    <Layout>
      <Head>
        <title>Content Studio | Sans Mercantile</title>
      </Head>

      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/admin" className="text-nexus-gold hover:text-nexus-gold/80 mb-6 flex items-center gap-2">
            ← Back to Dashboard
          </Link>
          <p className="text-sm text-nexus-gray-400 mb-2">Signed in as {user.email} ({user.role})</p>
          <h1 className="text-5xl font-bold text-white mb-4">Content Studio</h1>
          <p className="text-nexus-gray-300 mb-8 max-w-3xl">
            Publish full blogs and press releases. Published items appear on the media pages immediately;
            drafts stay invisible until you publish them.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-8 items-center flex-wrap">
            {(['blog', 'press'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  tab === t
                    ? 'bg-nexus-gold text-black'
                    : 'bg-[#0b1125] text-nexus-gray-300 hover:text-white border border-nexus-gold/20'
                }`}
              >
                {t === 'blog' ? 'Blogs' : 'Press Releases'}
              </button>
            ))}
            <button
              onClick={startNew}
              className="ml-auto px-6 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90"
            >
              + New {tab === 'blog' ? 'Blog Post' : 'Press Release'}
            </button>
          </div>

          {editing && (
            <form
              onSubmit={handleSave}
              className="mb-8 rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-8 space-y-4"
            >
              <h2 className="text-2xl font-bold text-white">
                {posts.some((p) => p.slug === editing.slug && p.type === editing.type) ? 'Edit' : 'New'}{' '}
                {editing.type === 'blog' ? 'Blog Post' : 'Press Release'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-nexus-gray-400 mb-2">Title *</label>
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    required
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-nexus-gray-400 mb-2">
                    Slug {posts.some((p) => p.slug === editing.slug) ? '(locked)' : '(auto from title if blank)'}
                  </label>
                  <input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="auto-generated"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-nexus-gray-400 mb-2">Excerpt *</label>
                <textarea
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  required
                  maxLength={500}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-nexus-gray-400 mb-2">Body (HTML) *</label>
                <textarea
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  required
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-nexus-gray-400 mb-2">Cover image URL</label>
                  <input
                    value={editing.cover}
                    onChange={(e) => setEditing({ ...editing, cover: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-nexus-gray-400 mb-2">Author</label>
                  <input
                    value={editing.author}
                    onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-nexus-gray-400 mb-2">Status</label>
                  <select
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-nexus-accent/20 text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 rounded-xl bg-nexus-gold text-black font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-8 py-3 rounded-xl border border-nexus-gold text-nexus-gold font-semibold hover:bg-nexus-gold/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-nexus-gray-300">Loading posts...</div>
          ) : (
            <div className="grid gap-4">
              {visiblePosts.map((post) => (
                <div key={post.slug} className="rounded-2xl border border-nexus-gold/20 bg-[#0b1125] p-6 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[240px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          post.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-xs text-nexus-gray-500">/{post.slug}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    <p className="text-sm text-nexus-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(post)}
                      className="px-4 py-2 rounded-lg border border-nexus-gold/30 text-nexus-gold text-sm font-semibold hover:bg-nexus-gold/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(post)}
                      className="px-4 py-2 rounded-lg border border-nexus-accent/30 text-nexus-accent text-sm font-semibold hover:bg-nexus-accent/10"
                    >
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {visiblePosts.length === 0 && (
                <p className="text-nexus-gray-400">No {tab === 'blog' ? 'blog posts' : 'press releases'} yet.</p>
              )}
            </div>
          )}
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
