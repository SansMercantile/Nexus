import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { getContentPost, type ContentPost } from '@/lib/content';

interface Props {
  post: ContentPost | null;
  slug: string;
}

export default function MediaPressReleasePage({ post, slug }: Props) {
  if (!post) {
    return (
      <Layout>
        <Head>
          <title>Release Not Found | Sans Mercantile</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Release Not Found</h1>
            <p className="text-nexus-gray-300 mb-8">The press release you are looking for could not be found.</p>
            <Link href="/media/press">
              <button className="px-8 py-3 rounded-lg bg-nexus-gold text-black font-semibold hover:opacity-90 transition-opacity">
                Back to Press
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const siteUrl = 'https://www.sansmercantile.com';
  const pageTitle = `${post.title} | Sans Mercantile`;
  const pageUrl = `${siteUrl}/media/press/${slug}`;

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Sans Mercantile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={post.excerpt} />
      </Head>

      <div className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link href="/media/press">
              <span className="text-nexus-gold hover:text-white transition-colors cursor-pointer mb-6 inline-block">
                ← Back to Press
              </span>
            </Link>
            <p className="text-sm uppercase tracking-[0.4em] text-nexus-gold mb-4">Press Release</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{post.title}</h1>
            <p className="text-xl text-nexus-gray-300 max-w-3xl mx-auto">{post.excerpt}</p>
            <p className="text-xs text-nexus-gray-500 mt-4">
              {post.author || 'Sans Mercantile'}
              {post.publishedAt ? ` • ${new Date(post.publishedAt).toLocaleDateString()}` : ''}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-invert max-w-none text-nexus-gray-200 rounded-2xl p-8 border border-nexus-gold/20 bg-[#0b1125]"
          >
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const post = await getContentPost('press', slug);

  if (!post) {
    return { props: { post: null, slug } };
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      slug,
    },
  };
};
