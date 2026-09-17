import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke suite: deterministic without MongoDB, SMTP, or AWS credentials.
 * Run `npm run build` first, then `npm run test:e2e`
 * (CI does this; locally the webServer reuses a running instance).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
