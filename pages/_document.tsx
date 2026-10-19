import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html lang="en" suppressHydrationWarning>
        <Head>
          {/* SEO defaults (title/description/og/twitter) live in _app.tsx with
              next/head keys so page-level Heads can override them. This file
              only carries tags _app does not own — never duplicate them here:
              _document tags bypass next/head dedupe and leak onto every page. */}
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Sans Mercantile" />
          <meta name="keywords" content="AI, autonomous systems, global trade, predictive analytics, constellation, technology, CIPC K2025537335, South Africa Registered" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:image:alt" content="Sans Mercantile Global Trade" />
          <meta name="twitter:site" content="@sansmercantile" />

          {/* Favicon and Icons */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

          {/* Fonts */}
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <body className="bg-nexus-dark text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
