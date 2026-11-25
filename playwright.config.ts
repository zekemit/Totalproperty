import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

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
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, launchOptions } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    // Always test a fresh build: a stale server would silently test old code.
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
