import Head from 'next/head';
import { type SystemData } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sansmercantile.com';

type PageKey = 'about' | 'features' | 'pricing';

function pageTitle(systemData: SystemData, page: PageKey): string {
  const { name, subtitle } = systemData;
  switch (page) {
    case 'about':
      return `About ${name} — ${subtitle} | Sans Mercantile`;
    case 'features':
      return `${name} Features — ${subtitle} | Sans Mercantile`;
    case 'pricing':
      return `${name} Pricing & Plans — ${subtitle} | Sans Mercantile`;
  }
}

function pageDescription(systemData: SystemData, page: PageKey): string {
  const { name, subtitle, description, features } = systemData;
  switch (page) {
    case 'about':
      return `${description} Learn about ${name}'s mission, values and capabilities at Sans Mercantile.`;
    case 'features': {
      const top = (features || []).slice(0, 3).map((feature) => feature.title);
      const list = top.length > 0 ? ` ${name} includes ${top.join(', ')}.` : '';
      return `${description}${list}`;
    }
    case 'pricing':
      return `${name} pricing and plans — ${subtitle}. Compare tiers and get started with Sans Mercantile.`;
  }
}

export function SystemSeoHead({ systemData, page }: { systemData: SystemData; page: PageKey }) {
  const title = pageTitle(systemData, page);
  const description = pageDescription(systemData, page);
  const url = `${BASE_URL}/${systemData.id.toLowerCase()}/${page}/`;
  // Per-system OG art (public/Faces/*) — consistent with the system's
  // main page so shares of /ptah/about etc. carry the same artwork.
  const image = `${BASE_URL}/Faces/${encodeURIComponent(systemData.face)}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Sans Mercantile',
      url: `${BASE_URL}/`,
    },
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:url" content={url} key="og:url" />
      <meta property="og:image" content={image} key="og:image" />
      <meta property="og:site_name" content="Sans Mercantile" key="og:site_name" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={image} key="twitter:image" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </Head>
  );
}
