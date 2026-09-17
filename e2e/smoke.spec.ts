import { test, expect } from '@playwright/test';

/**
 * Deterministic smoke tests: no database, SMTP, or AWS credentials needed.
 * Auth-gated routes are expected to 401; public pages must render.
 */

test('portal sign-in page renders', async ({ page }) => {
  await page.goto('/portal/');
  await expect(page.getByRole('heading', { name: 'Sans Mercantile Portal' })).toBeVisible();
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
});

test('legacy /login redirects to the portal', async ({ page }) => {
  await page.goto('/login/');
  await expect(page).toHaveURL(/\/portal\/?$/);
  await expect(page.getByRole('heading', { name: 'Sans Mercantile Portal' })).toBeVisible();
});

test('SMO summary API requires a session', async ({ request }) => {
  const res = await request.post('/api/analytics/ai-summary/', {
    data: { kpis: { totalValue: 100 } },
  });
  expect(res.status()).toBe(401);
});

test('portal session endpoint rejects anonymous callers', async ({ request }) => {
  const res = await request.get('/api/portal/me/');
  expect(res.status()).toBe(401);
});

test('CRM page serves its client shell', async ({ page }) => {
  await page.goto('/crm/');
  // Client-side CRM shell: pipeline nav renders after hydration.
  await expect(page.locator('#smo-nav-pipeline')).toBeVisible();
});
