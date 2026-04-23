import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        {/* Global Title Template */}
        <title>Sans Mercantile - Reimagine • Rebuild • Transcend</title>
        <meta name="description" content="A network of autonomous, intelligent systems enabling global commerce, governance, and innovation" />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#d4af37" />
        <meta name="msapplication-TileColor" content="#d4af37" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Sans Mercantile",
              "url": "https://sansmercantile.com",
              "logo": "https://sansmercantile.com/logo.png",
              "description": "A network of autonomous, intelligent systems enabling global commerce, governance, and innovation",
              "foundingDate": "2026",
              "sameAs": [
                "https://linkedin.com/company/sans-mercantile"
              ]
            })
          }}
        />

        <link rel="icon" href="/logo.png" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
