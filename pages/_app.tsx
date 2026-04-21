import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
