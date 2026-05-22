import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { getDb } from '@/lib/mongodb';
import { verifySessionToken } from '@/lib/auth';

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return match ? match.split('=')[1] : null;
}

export default function AdminHome({ user, stats }: { user: { name: string; email: string; role: string }; stats: { users: number; applications: number } }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/portal/logout', { method: 'GET' });
    router.push('/portal');
  };

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard | Sans Mercantile</title>
      </Head>

      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-sm text-nexus-gray-400 mb-2">Secure Portal Dashboard</p>
            <h1 className="text-5xl font-bold text-white">Welcome, {user.name}</h1>
            <p className="text-nexus-gray-300 mt-4 max-w-3xl">
              You are signed in as <span className="text-nexus-gold">{user.role}</span>. This dashboard is protected by a secure httpOnly session token stored in the browser.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/80 p-8 shadow-lg shadow-nexus-gold/5">
              <h2 className="text-xl font-semibold text-white mb-4">Portal activity</h2>
              <p className="text-nexus-gray-400 mb-2">Total registered portal users</p>
              <p className="text-4xl font-bold text-white mb-6">{stats.users}</p>
              <p className="text-nexus-gray-400">This count is read from MongoDB so portal user state is stored securely.</p>
            </div>
            <div className="rounded-3xl border border-nexus-gold/20 bg-[#111827]/80 p-8 shadow-lg shadow-nexus-gold/5">
              <h2 className="text-xl font-semibold text-white mb-4">Applications received</h2>
              <p className="text-nexus-gray-400 mb-2">Job applications stored in MongoDB</p>
              <p className="text-4xl font-bold text-white mb-6">{stats.applications}</p>
              <p className="text-nexus-gray-400">All applicant form submissions are stored in the portal database.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/admin/smo" className="block rounded-3xl border border-nexus-gold/20 bg-[#111827]/80 p-8 text-white hover:border-nexus-gold/40 transition">
              <h3 className="text-xl font-semibold mb-3">SMO Suite</h3>
              <p className="text-nexus-gray-400">Open the social media operations admin portal.</p>
            </Link>
            <Link href="/admin/compliance" className="block rounded-3xl border border-nexus-gold/20 bg-[#111827]/80 p-8 text-white hover:border-nexus-gold/40 transition">
              <h3 className="text-xl font-semibold mb-3">Compliance</h3>
              <p className="text-nexus-gray-400">Review audit events and security logs.</p>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left rounded-3xl border border-red-500/20 bg-[#111827]/80 p-8 text-white hover:border-red-400/40 transition"
            >
              <h3 className="text-xl font-semibold mb-3">Logout</h3>
              <p className="text-nexus-gray-400">End your secure portal session.</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }: { req: any }) {
  const sessionToken = getCookieValue(req.headers.cookie, 'portal_session');
  if (!sessionToken) {
    return {
      redirect: {
        destination: '/portal',
        permanent: false,
      },
    };
  }

  const payload = verifySessionToken(sessionToken) as any;
  if (!payload || typeof payload.email !== 'string') {
    return {
      redirect: {
        destination: '/portal',
        permanent: false,
      },
    };
  }

  const db = await getDb();
  const user = await db.collection('portal_users').findOne({ email: payload.email.toLowerCase(), active: true }) as any;

  if (!user) {
    return {
      redirect: {
        destination: '/portal',
        permanent: false,
      },
    };
  }

  const applicationsCount = await db.collection('job_applications').countDocuments();
  const userCount = await db.collection('portal_users').countDocuments({ active: true });

  return {
    props: {
      user: {
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      },
      stats: {
        users: userCount,
        applications: applicationsCount,
      },
    },
  };
}
