/**
 * SEO metadata for every Priv product. Each Priv product gets a dedicated,
 * indexable landing page on sansmercantile.com plus JSON-LD so Google can
 * surface it in search (title, description, OG/Twitter cards, schema.org).
 */

interface ProductSeo {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  schema: Record<string, unknown>;
}

export const PRIV_PRODUCT_SEO: Record<'privCore' | 'privPhilanthropy', ProductSeo> = {
  privCore: {
    title: 'Priv Core — Autonomous Trading Desk & AI Trading Terminal | Sans Mercantile',
    description:
      'Priv Core is an autonomous trading desk with strategy backtesting on real candles, 24/7 market watch and full custody control. Start free, no card required — web, Windows, macOS, Linux, Android and iOS.',
    canonical: 'https://www.sansmercantile.com/priv/core/',
    ogImage: 'https://www.sansmercantile.com/press/priv-core-iphone-duo.png',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Priv Core',
      applicationCategory: 'FinanceApplication',
      operatingSystem: ['Web', 'Windows', 'macOS', 'Linux', 'Android', 'iOS'],
      url: 'https://www.sansmercantile.com/priv/core/',
      sameAs: 'https://priv.sansmercantile.com',
      description:
        'Autonomous trading desk and AI trading terminal: strategy backtesting, 24/7 market watch and full custody control in one app.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
  },
  privPhilanthropy: {
    title: 'Priv Philanthropy — Charitable Giving & Impact Tracking | Sans Mercantile',
    description:
      'Priv Philanthropy is giving and social-impact capital through Priv: transparent donation rails, cause portfolios and impact tracking. Live now — start giving in minutes.',
    canonical: 'https://www.sansmercantile.com/priv/philanthropy/',
    ogImage: 'https://www.sansmercantile.com/media/social-cover-hero.png',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Priv Philanthropy',
      applicationCategory: 'NonProfitApplication',
      operatingSystem: ['Web', 'iOS', 'Android'],
      url: 'https://www.sansmercantile.com/priv/philanthropy/',
      sameAs: 'https://privphil.sansmercantile.com',
      description:
        'Giving and social-impact capital through Priv: transparent donation rails, cause portfolios and impact tracking for philanthropic wealth.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
  },
};
