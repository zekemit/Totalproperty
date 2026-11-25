import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/", "/owners", "/commercial", "/lenders", "/tenants", "/services", "/about",
  "/contact", "/vendors", "/portal", "/privacy", "/accessibility", "/fair-housing",
];

for (const route of routes) {
  test.describe(route, () => {
    test("has exactly one h1, a title, a lang attribute and no console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      expect(errors).toEqual([]);
    });

    test("passes axe (WCAG 2.0/2.1/2.2 A and AA)", async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
      expect(summary).toEqual([]);
    });

    test("does not scroll horizontally", async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}

test("keyboard: skip link is first focusable element and targets main", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("legacy PHP URLs permanently redirect", async ({ request }) => {
  const map: Record<string, string> = {
    "/index.php": "/", "/aboutus.php": "/about", "/services.php": "/services", "/contactus.php": "/contact",
  };
  for (const [from, to] of Object.entries(map)) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(new URL(res.headers()["location"] ?? "", "http://x").pathname).toBe(to);
  }
});

test("security headers are present and the framework is not advertised", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["content-security-policy"]).toContain("object-src 'none'");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/owners");
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");
});

test("unknown URL shows the helpful 404 with one h1", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Go to the homepage" })).toBeVisible();
});
