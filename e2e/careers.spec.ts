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

test('jobs board serves internal openings without a database', async ({ request }) => {
  const res = await request.get('/api/jobs/board/');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.success).toBe(true);
  expect(Array.isArray(body.jobs)).toBe(true);
  expect(body.jobs.length).toBeGreaterThan(0);
  expect(body.jobs.every((j: any) => typeof j.jobId === 'string' && j.source === 'internal')).toBe(true);
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
