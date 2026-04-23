import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';
import { getBlogPost, BlogPost } from '@/lib/blog-data';

interface Props {
  post: BlogPost | null;
  slug: string;
}

export default function MediaBlogPostPage({ post, slug }: Props) {
  // 1. Handle 404 state if post is missing
  if (!post) {
    return (
      <Layout>
        <Head>
          <title>Post Not Found | Sans Mercantile</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-nexus-gray-300 mb-8">The blog post you are looking for could not be found.</p>
            <Link href="/media/blog">
              <button className="px-8 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                Back to Blog
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // 2. SEO Calculations
  const siteUrl = 'https://www.sansmercantile.com';
  const pageTitle = `${post.title} | Sans Mercantile`;
  
  // LinkedIn requires descriptions to be > 100 chars. We combine excerpt and subtitle to ensure length.
  const rawDescription = post.excerpt || post.subtitle || "";
  const pageDescription = rawDescription.length < 100 
    ? `${rawDescription} Explore deep insights into ${post.category} and autonomous intelligent systems at Sans Mercantile. Reimagine, Rebuild, and Transcend with our latest strategic updates and regulatory intelligence.`
    : rawDescription;

  const pageUrl = `${siteUrl}/media/blog/${slug}`;
  
  // FORCE ABSOLUTE URLS: Pointing explicitly to the domain for LinkedIn
  // Note: We use the siteUrl prefix to ensure the scraper can find the asset.
  const ogImage = post.featuredImage?.startsWith('http') 
    ? post.featuredImage 
    : `${siteUrl}${post.featuredImage}`;

  // Format date correctly for Google/LinkedIn using the server-side value
  const isoDate = new Date(post.postedDate).toISOString();

  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
      case 'markets':
        return 'bg-gradient-to-br from-[#1a2140]/30 to-nexus-dark/30 border-nexus-gold/20';
      case 'governance':
      case 'insights':
        return 'bg-gradient-to-br from-[#1f1a2e]/30 to-nexus-dark/30 border-nexus-accent/20';
      default:
        return 'bg-gradient-to-br from-[#1a2140]/30 to-nexus-dark/30 border-nexus-gold/20';
    }
  };

  return (
    <Layout>
      <Head>
        {/* Basic SEO */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Sans Mercantile" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Article Specific Metadata */}
        <meta property="article:published_time" content={isoDate} />
        <meta property="article:author" content={post.author || "Sans Mercantile"} />
        <meta property="article:section" content={post.category} />
        {post.keywords?.map(keyword => (
          <meta key={keyword} property="article:tag" content={keyword.replace('#', '')} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data (Schema.org) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": pageDescription,
              "image": ogImage,
              "datePublished": isoDate,
              "author": {
                "@type": "Person",
                "name": post.author || "Sans Mercantile"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Sans Mercantile",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${siteUrl}/logo.png`
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": pageUrl
              }
            })
          }}
        />
      </Head>

      <div className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link href="/media/blog">
              <span className="text-nexus-gold hover:text-white transition-colors cursor-pointer mb-6 inline-block">
                ← Back to Blog
              </span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <span className="px-3 py-1 rounded-full bg-nexus-gold/10 text-nexus-gold text-xs uppercase tracking-[0.3em]">
                {post.category}
              </span>
              <span className="text-xs text-nexus-gray-500">{post.postedDate}</span>
              <span className="text-xs text-nexus-gray-500">• {post.readTime} min read</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{post.title}</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">{post.subtitle}</p>
          </motion.div>

          {post.featuredImage && (
            <div className="relative mb-12 overflow-hidden rounded-3xl border border-nexus-gold/20 h-[500px]">
              <img 
                src={post.featuredImage} 
                alt={post.featuredImageAlt || post.title} 
                className="h-full w-full object-cover" 
              />
            </div>
          )}

          <motion.div 
            variants={fadeInUp} 
            initial="hidden" 
            animate="visible" 
            className={`prose prose-invert max-w-none text-nexus-gray-200 rounded-2xl p-8 border ${getCategoryStyles(post.category)}`}
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

// Server-Side Data Fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const post = getBlogPost(slug);

  if (!post) {
    return { props: { post: null, slug } };
  }

  return {
    props: {
      // Stringify then parse to handle potential Date object serialization issues
      post: JSON.parse(JSON.stringify(post)),
      slug
    }
  };
};