import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  // Use the exact production domain LinkedIn is hitting
  const siteUrl = 'https://www.sansmercantile.com';
  
  /**
   * GLOBAL FALLBACKS
   * Ensure this file exists exactly at: public/media/social-cover-hero.png
   * Using PNG for maximum compatibility and to prevent "No image found" due to format headers.
   */
  const defaultOgImage = `${siteUrl}/media/social-cover-hero.png`; 
  const defaultTitle = 'Sans Mercantile - Reimagine • Rebuild • Transcend';
  const defaultDescription = 'A network of autonomous, intelligent systems enabling global commerce, governance, and innovation. Explore the nexus of technology and strategy.';

  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Core SEO */}
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta name="theme-color" content="#d4af37" />
        <meta name="msapplication-TileColor" content="#d4af37" />

        {/* LinkedIn / Open Graph Fallbacks */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sans Mercantile" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        
        {/* Forceful Image Tags for Scrapers */}
        <meta property="og:image" content={defaultOgImage} />
        <meta property="og:image:secure_url" content={defaultOgImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Sans Mercantile System Hero" />
        
        {/* Some scrapers look for this specifically */}
        <meta name="image" content={defaultOgImage} />

        {/* Twitter Card Fallbacks */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sansmercantile" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={defaultOgImage} />
        <meta name="twitter:image:src" content={defaultOgImage} />

        {/* Global Organization Structured Data */}
        <script
          type="application/ld+json"
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

        {/* Favicons (Absolute URLs) */}
        <link rel="icon" href={`${siteUrl}/logo.png`} />
        <link rel="apple-touch-icon" href={`${siteUrl}/logo.png`} />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}