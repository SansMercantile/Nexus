import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/layout/Layout';

// Ported from C:\Users\kpasc\Downloads\smo\src\App.tsx
// ("SMO" — Sans Mercantile Operations CRM for investor relations,
// deal flow pipeline, contacts, and team coordination.)
//
// The CRM uses localStorage for persistence, so it is loaded
// client-side only to avoid Next.js SSR hydration mismatches.
const SmoCrmApp = dynamic(() => import('../../components/smo-crm/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 text-slate-600">
      <div className="text-center">
        <div className="text-2xl mb-2">◈</div>
        <p className="font-semibold">Loading SMO Operations CRM…</p>
        <p className="text-sm text-slate-500">Pipeline • Contacts • Inbox • Planner • Docs • Analytics • Chat • Careers</p>
      </div>
    </div>
  ),
});

export default function CRMPage() {
  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto px-4 pb-16">
        <SmoCrmApp />
      </div>
    </Layout>
  );
}
