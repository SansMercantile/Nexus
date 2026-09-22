import { test, expect } from '@playwright/test';

/**
 * Careers pipeline tests. All assertions hit pre-database validation paths,
 * so they are deterministic without MongoDB, SMTP, or AWS credentials.
 */

const VALID_APPLY = {
  jobId: 'director-ai-product-strategy',
  name: 'Test Candidate',
  email: 'candidate@example.com',
  resume: 'https://example.com/resume.pdf',
  linkedin: 'https://linkedin.com/in/testcandidate',
  socialLinks: ['https://x.com/testcandidate', 'https://github.com/testcandidate'],
};

test('careers page lists open positions', async ({ page }) => {
  await page.goto('/careers/');
  await expect(page.getByRole('heading', { name: /open positions/i })).toBeVisible();
});

test('apply rejects malformed email addresses', async ({ request }) => {
  const res = await request.post('/api/apply/', {
    data: { ...VALID_APPLY, email: 'not-an-email' },
  });
  expect(res.status()).toBe(400);
});

test('apply rejects unknown positions', async ({ request }) => {
  const res = await request.post('/api/apply/', {
    data: { ...VALID_APPLY, jobId: 'no-such-job' },
  });
  expect(res.status()).toBe(400);
});

test('apply rejects missing fields', async ({ request }) => {
  const res = await request.post('/api/apply/', { data: { jobId: VALID_APPLY.jobId } });
  expect(res.status()).toBe(400);
});

test('assess rejects incomplete submissions', async ({ request }) => {
  const res = await request.post('/api/applications/assess/', { data: {} });
  expect(res.status()).toBe(400);
});

test('assess enforces answer coverage before touching the database', async ({ request }) => {
  const res = await request.post('/api/applications/assess/', {
    data: {
      token: 'not-a-real-token',
      jobId: 'director-ai-product-strategy',
      email: 'candidate@example.com',
      assessmentResponses: { 'technical-q0': 'a partial answer' },
    },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.message).toMatch(/missing answers/i);
});

test('application status rejects unknown tokens', async ({ request }) => {
  const res = await request.get('/api/applications/status/?token=deadbeef-no-such-token');
  expect([404, 500]).toContain(res.status());
});

test('application events require token and event', async ({ request }) => {
  const res = await request.post('/api/applications/events/', { data: {} });
  expect(res.status()).toBe(400);
});

test('exam session endpoints validate input without a database', async ({ request }) => {
  const beginEmpty = await request.post('/api/applications/begin/', { data: {} });
  expect(beginEmpty.status()).toBe(400);
  const beginUnknown = await request.post('/api/applications/begin/', {
    data: { token: 'deadbeef', jobId: 'director-ai-product-strategy', email: 'c@example.com' },
  });
  expect([404, 500]).toContain(beginUnknown.status());

  const progressEmpty = await request.post('/api/applications/progress/', { data: {} });
  expect(progressEmpty.status()).toBe(400);

  const questionsMissing = await request.get('/api/applications/questions/?token=x');
  expect(questionsMissing.status()).toBe(400);

  const reviewAnon = await request.get('/api/applications/review/');
  expect(reviewAnon.status()).toBe(401);
});
test('jobs board serves internal openings without a database', async ({ request }) => {
  const res = await request.get('/api/jobs/board/');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.success).toBe(true);
  expect(Array.isArray(body.jobs)).toBe(true);
  expect(body.jobs.length).toBeGreaterThan(0);
  expect(body.jobs.every((j: any) => typeof j.jobId === 'string' && j.source === 'internal')).toBe(true);
});

test('jobs list serves merged openings without a database', async ({ request }) => {
  const res = await request.get('/api/jobs/list/');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.success).toBe(true);
  expect(Array.isArray(body.jobs)).toBe(true);
  expect(body.jobs.length).toBeGreaterThan(0);
  expect(body.jobs.every((j: any) => typeof j.id === 'string' && typeof j.title === 'string')).toBe(true);
});

test('jobs manage requires an admin session', async ({ request }) => {
  const list = await request.get('/api/jobs/manage/');
  expect(list.status()).toBe(401);
  const create = await request.post('/api/jobs/manage/', { data: { id: 'x' } });
  expect(create.status()).toBe(401);
});

test('jobs scan and registry require an admin session', async ({ request }) => {
  const scan = await request.post('/api/jobs/scan/', { data: {} });
  expect(scan.status()).toBe(401);
  const list = await request.get('/api/jobs/external/');
  expect(list.status()).toBe(401);
  const write = await request.post('/api/jobs/external/', { data: { action: 'dismiss', id: 'x' } });
  expect(write.status()).toBe(401);
});

test('retake grants require an admin session', async ({ request }) => {
  const res = await request.post('/api/applications/allow-retake/', {
    data: { email: 'candidate@example.com', jobId: 'director-ai-product-strategy', count: 1 },
  });
  expect(res.status()).toBe(401);
});

test('content list serves published posts without a database', async ({ request }) => {
  const res = await request.get('/api/content/list/?type=blog');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.success).toBe(true);
  expect(Array.isArray(body.posts)).toBe(true);
});

test('content manage requires an admin session', async ({ request }) => {
  const list = await request.get('/api/content/manage/');
  expect(list.status()).toBe(401);
  const create = await request.post('/api/content/manage/', { data: { type: 'blog' } });
  expect(create.status()).toBe(401);
});

test('indeed feed serves Job Sync XML for open roles', async ({ request }) => {
  const res = await request.get('/api/jobs/indeed-feed/');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/xml');
  const xml = await res.text();
  expect(xml).toContain('<source>');
  expect(xml).toContain('<referencenumber>');
  expect(xml).toContain('careers@sansmercantile.com');
  expect(xml).toContain('source=Indeed');
});
