import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke suite: deterministic without MongoDB, SMTP, or AWS credentials.
 * Run `npm run build` first, then `npm run test:e2e`
 * (CI does this; locally the webServer reuses a running instance).
 *
 * Port 3100 is used deliberately: port 3000 is commonly occupied by other
 * local apps on dev machines, and a squatter would silently invalidate
 * results when reuseExistingServer kicks in.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Capped at 2: higher parallelism crashes headless-shell workers on
  // constrained machines (worker exit 3221226505). Still fast (~15s).
  workers: 2,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run start -- -p 3100',
    port: 3100,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
