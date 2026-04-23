import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../components/ThemeProvider';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  // Use the exact production domain LinkedIn is hitting
  const siteUrl = 'https://www.sansmercantile.com';
  
  /**
   * GLOBAL FALLBACKS
   * These tags use the "key" attribute. When a specific page (like a blog post) 
   * defines a tag with the same key, Next.js will replace this default 
   * instead of adding a second tag. This is CRITICAL to prevent the landing page 
   * fallback from overriding your specific article thumbnails.
   */
  const defaultOgImage = `${siteUrl}/media/social-cover-hero.png`; 
  const defaultTitle = 'Sans Mercantile - Reimagine • Rebuild • Transcend';
  const defaultDescription = 'A network of autonomous, intelligent systems enabling global commerce, governance, and innovation. Explore the nexus of technology and strategy.';

  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Core SEO - Using keys to allow per-page overrides */}
        <title key="title">{defaultTitle}</title>
        <meta name="description" content={defaultDescription} key="description" />
        <meta name="theme-color" content="#d4af37" />
        <meta name="msapplication-TileColor" content="#d4af37" />

        {/* LinkedIn / Open Graph Fallbacks */}
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:site_name" content="Sans Mercantile" key="og:site_name" />
        <meta property="og:url" content={siteUrl} key="og:url" />
        <meta property="og:title" content={defaultTitle} key="og:title" />
        <meta property="og:description" content={defaultDescription} key="og:description" />
        
        {/* Forceful Image Tags with keys for replacement logic */}
        <meta property="og:image" content={defaultOgImage} key="og:image" />
        <meta property="og:image:secure_url" content={defaultOgImage} key="og:image:secure_url" />
        <meta property="og:image:type" content="image/png" key="og:image:type" />
        <meta property="og:image:width" content="1200" key="og:image:width" />
        <meta property="og:image:height" content="630" key="og:image:height" />
        
        {/* Twitter Card Fallbacks */}
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:title" content={defaultTitle} key="twitter:title" />
        <meta name="twitter:description" content={defaultDescription} key="twitter:description" />
        <meta name="twitter:image" content={defaultOgImage} key="twitter:image" />

        {/* Global Organization Structured Data */}
        <script
          type="application/ld+json"
          key="org-jsonld"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Sans Mercantile",
              "url": siteUrl,
              "logo": `${siteUrl}/logo.png`,
              "description": defaultDescription,
              "foundingDate": "2026",
              "sameAs": [
                "https://linkedin.com/company/sans-mercantile"
              ]
            })
          }}
        />

        {/* Favicons */}
        <link rel="icon" href={`${siteUrl}/logo.png`} />
        <link rel="apple-touch-icon" href={`${siteUrl}/logo.png`} />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}