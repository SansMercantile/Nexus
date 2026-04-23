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
          {/* Global Metadata */}
          <meta name="description" content="Sans Mercantile Constellation - The 21 System Constellation for global trade and predictive analytics solutions." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Sans Mercantile" />
          <meta name="keywords" content="AI, autonomous systems, global trade, predictive analytics, constellation, technology" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:site_name" content="Sans Mercantile" />
          <meta property="og:title" content="Sans Mercantile - Reimagine • Rebuild • Transcend" />
          <meta property="og:description" content="A network of autonomous, intelligent systems enabling global commerce, governance, and innovation" />
          <meta property="og:image" content="https://sansmercantile.com/og-default.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Sans Mercantile Global Trade" />
          <meta property="og:url" content="https://sansmercantile.com" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@sansmercantile" />
          <meta name="twitter:title" content="Sans Mercantile - Reimagine • Rebuild • Transcend" />
          <meta name="twitter:description" content="A network of autonomous, intelligent systems enabling global commerce, governance, and innovation" />
          <meta name="twitter:image" content="https://sansmercantile.com/og-default.jpg" />

          {/* Favicon and Icons */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

          {/* Fonts */}
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

          {/* Canonical URL */}
          <link rel="canonical" href="https://sansmercantile.com" />
        </Head>
        <body className="bg-nexus-dark text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
