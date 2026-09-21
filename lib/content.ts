import { getDb } from './mongodb';
import type { BlogPost } from './blog-data';

/**
 * Admin-managed editorial content (`content_posts` collection): full blogs
 * and press releases. Published items merge into the public media pages
 * alongside the static seed content; drafts stay invisible.
 */

export type ContentType = 'blog' | 'press';
export type ContentStatus = 'draft' | 'published';

export interface ContentPost {
  slug: string;
  type: ContentType;
  title: string;
  excerpt: string;
  body: string;
  cover?: string;
  author?: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'untitled';
}

export function validateContentPost(body: unknown): { ok: boolean; message?: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, message: 'A post object is required.' };
  }
  const post = body as Record<string, unknown>;
  const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

  if (post.type !== 'blog' && post.type !== 'press') {
    return { ok: false, message: 'type must be blog or press.' };
  }
  if (!str(post.title) || (post.title as string).length > 200) {
    return { ok: false, message: 'title is required (max 200 chars).' };
  }
  if (!str(post.excerpt) || (post.excerpt as string).length > 500) {
    return { ok: false, message: 'excerpt is required (max 500 chars).' };
  }
  if (!str(post.body) || (post.body as string).length > 200000) {
    return { ok: false, message: 'body is required (max 200k chars).' };
  }
  if (post.slug !== undefined && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(str(post.slug))) {
    return { ok: false, message: 'slug must be URL-safe (lowercase, numbers, hyphens).' };
  }
  if (post.status !== undefined && post.status !== 'draft' && post.status !== 'published') {
    return { ok: false, message: 'status must be draft or published.' };
  }
  if (post.cover !== undefined && post.cover !== '' && typeof post.cover !== 'string') {
    return { ok: false, message: 'cover must be a URL string.' };
  }
  return { ok: true };
}

function shapeDoc(doc: Record<string, unknown>): ContentPost {
  return {
    slug: String(doc.slug ?? ''),
    type: doc.type === 'press' ? 'press' : 'blog',
    title: String(doc.title ?? ''),
    excerpt: String(doc.excerpt ?? ''),
    body: String(doc.body ?? ''),
    cover: typeof doc.cover === 'string' ? doc.cover : undefined,
    author: typeof doc.author === 'string' ? doc.author : undefined,
    status: doc.status === 'published' ? 'published' : 'draft',
    publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : undefined,
    createdAt: String(doc.createdAt ?? ''),
    updatedAt: String(doc.updatedAt ?? ''),
  };
}

/** Published posts of a type, newest first. Empty when the DB is unreachable. */
export async function getPublishedPosts(type: ContentType): Promise<ContentPost[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('content_posts')
      .find({ type, status: 'published' })
      .sort({ publishedAt: -1, updatedAt: -1 })
      .limit(200)
      .toArray();
    return docs.map((doc) => shapeDoc(doc as Record<string, unknown>));
  } catch (error) {
    console.error('Content DB unavailable, serving no managed posts:', error);
    return [];
  }
}

/** Single published post by type + slug (DB only; static seed handled by callers). */
export async function getContentPost(type: ContentType, slug: string): Promise<ContentPost | null> {
  try {
    const db = await getDb();
    const doc = await db.collection('content_posts').findOne({ type, slug, status: 'published' });
    return doc ? shapeDoc(doc as Record<string, unknown>) : null;
  } catch (error) {
    console.error('Content DB unavailable:', error);
    return null;
  }
}

/** Map a managed post onto the static BlogPost shape for shared renderers. */
export function toBlogPost(post: ContentPost): BlogPost {
  const words = post.body.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return {
    id: `managed-${post.slug}`,
    slug: post.slug,
    title: post.title,
    subtitle: post.excerpt,
    author: post.author || 'Sans Mercantile',
    postedDate: post.publishedAt || post.updatedAt || post.createdAt,
    category: 'insights',
    relatedSystems: [],
    excerpt: post.excerpt,
    content: post.body,
    featuredImage: post.cover || '',
    keywords: [],
    readTime: Math.max(1, Math.round(words / 200)),
    status: 'published',
  };
}
