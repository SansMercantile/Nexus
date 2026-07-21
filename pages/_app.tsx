import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../components/ThemeProvider';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

// Initialize PostHog once on the client, guarded against missing env vars
if (typeof window !== 'undefined') {
  const phKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
  if (phKey && !posthog.__loaded) {
    posthog.init(phKey, {
      api_host: phHost,
      capture_pageview: false, // we send manually on route change for accurate SPA tracking
      capture_pageleave: true,
      autocapture: true,
      capture_exceptions: true, // catches unhandled JS errors and promise rejections automatically
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug();
      },
    });
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => posthog.capture('$pageview');
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  const siteUrl = 'https://www.sansmercantile.com';
  const defaultOgImage = siteUrl + '/media/social-cover-hero.png';
  const defaultTitle = 'Sans Mercantile - Reimagine \u2022 Rebuild \u2022 Transcend';
  const defaultDescription = 'A network of autonomous, intelligent systems enabling global commerce, governance, and innovation. Registered in South Africa (CIPC Reg No: K2025537335). Explore the nexus of technology and strategy.';

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <title key='title'>{defaultTitle}</title>
          <meta name='description' content={defaultDescription} key='description' />
          <meta name='theme-color' content='#d4af37' />
          <meta name='msapplication-TileColor' content='#d4af37' />
          <meta property='og:type' content='website' key='og:type' />
          <meta property='og:site_name' content='Sans Mercantile' key='og:site_name' />
          <meta property='og:url' content={siteUrl} key='og:url' />
          <meta property='og:title' content={defaultTitle} key='og:title' />
          <meta property='og:description' content={defaultDescription} key='og:description' />
          <meta property='og:image' content={defaultOgImage} key='og:image' />
          <meta property='og:image:secure_url' content={defaultOgImage} key='og:image:secure_url' />
          <meta property='og:image:type' content='image/png' key='og:image:type' />
          <meta property='og:image:width' content='1200' key='og:image:width' />
          <meta property='og:image:height' content='630' key='og:image:height' />
          <meta name='twitter:card' content='summary_large_image' key='twitter:card' />
          <meta name='twitter:title' content={defaultTitle} key='twitter:title' />
          <meta name='twitter:description' content={defaultDescription} key='twitter:description' />
          <meta name='twitter:image' content={defaultOgImage} key='twitter:image' />
          <link rel='icon' href={siteUrl + '/logo.png'} />
          <link rel='apple-touch-icon' href={siteUrl + '/logo.png'} />
        </Head>
        <Component {...pageProps} />
        <SpeedInsights />
        <Analytics />
      </ThemeProvider>
    </PostHogProvider>
  );
}
