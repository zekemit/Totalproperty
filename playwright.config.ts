import { defineConfig, devices } from "@playwright/test";

import path from "node:path";

const PORT = Number(process.env.PORT ?? 3100);

/** The admin tests edit real site content. They run against a throwaway store and a known password. */
export const E2E_ADMIN_PASSWORD = "tpm-e2e-admin-pass-2026";
const E2E_CMS_FILE = path.join(__dirname, "test-results", "cms-e2e.json");

// Optional: use a system Chromium instead of the browser Playwright downloads
// (e.g. CI images that pre-install one). Unset by default.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;
const launchOptions = { ...(executablePath ? { executablePath } : {}), args: executablePath ? ["--no-sandbox"] : [] };

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  projects: [
    { name: "desktop", testIgnore: /admin\.spec\.ts/, use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, launchOptions } },
    { name: "mobile", testIgnore: /admin\.spec\.ts/, use: { ...devices["Pixel 7"], launchOptions } },
    // Runs last and alone: it changes site content, which the other projects read.
    {
      name: "admin",
      testMatch: /admin\.spec\.ts/,
      dependencies: ["desktop", "mobile"],
      fullyParallel: false,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, launchOptions },
    },
  ],
  webServer: {
    command: `rm -f "${E2E_CMS_FILE}" && npm run build && npx next start -p ${PORT}`,
    env: { ADMIN_PASSWORD: E2E_ADMIN_PASSWORD, CMS_FILE_PATH: E2E_CMS_FILE, NODE_ENV: "production" },
    url: `http://127.0.0.1:${PORT}`,
    // Always test a fresh build: a stale server would silently test old code.
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
