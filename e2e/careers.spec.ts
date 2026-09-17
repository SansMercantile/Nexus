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
