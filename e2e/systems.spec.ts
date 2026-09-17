import { test, expect } from '@playwright/test';

/**
 * System product sections: each system's `applications` entries render on
 * its dynamic system page (/priv, /ptah, /kev, ...).
 */

test('ptah page lists Ptah Core, Real Estates and Philanthropy', async ({ page }) => {
  await page.goto('/ptah/');
  await expect(page.getByRole('heading', { name: 'Ptah Applications' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ptah Core' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ptah Real Estates' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ptah Philanthropy' })).toBeVisible();
});

test('kev page lists KEV Core, Schools and Philanthropy', async ({ page }) => {
  await page.goto('/kev/');
  await expect(page.getByRole('heading', { name: 'KEV Applications' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'KEV Core' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'KEV Schools' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'KEV Philanthropy' })).toBeVisible();
});

test('priv page still lists Priv Core and Priv Pay', async ({ page }) => {
  await page.goto('/priv/');
  await expect(page.getByRole('heading', { name: 'Priv Core' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Priv Pay' })).toBeVisible();
});
