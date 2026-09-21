import { describe, it, expect } from 'vitest';
import { slugify, validateContentPost } from './content';

describe('slugify', () => {
  it('produces URL-safe slugs', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  Series A: $350k Raise  ')).toBe('series-a-350k-raise');
    expect(slugify('Café Münchën')).toBe('cafe-munchen');
  });

  it('falls back for empty titles', () => {
    expect(slugify('!!!')).toBe('untitled');
  });
});

describe('validateContentPost', () => {
  const valid = {
    type: 'blog',
    title: 'A Real Post',
    excerpt: 'Short summary.',
    body: '<p>Full body.</p>',
  };

  it('accepts a complete valid post', () => {
    expect(validateContentPost(valid).ok).toBe(true);
    expect(validateContentPost({ ...valid, type: 'press', status: 'published' }).ok).toBe(true);
  });

  it('rejects bad types, missing fields, and bad slugs', () => {
    expect(validateContentPost({ ...valid, type: 'news' }).ok).toBe(false);
    expect(validateContentPost({ ...valid, title: '' }).ok).toBe(false);
    expect(validateContentPost({ ...valid, body: '' }).ok).toBe(false);
    expect(validateContentPost({ ...valid, slug: 'Bad Slug!' }).ok).toBe(false);
    expect(validateContentPost({ ...valid, status: 'archived' }).ok).toBe(false);
    expect(validateContentPost(null).ok).toBe(false);
  });

  it('enforces length caps', () => {
    expect(validateContentPost({ ...valid, title: 'x'.repeat(201) }).ok).toBe(false);
    expect(validateContentPost({ ...valid, excerpt: 'x'.repeat(501) }).ok).toBe(false);
  });
});
