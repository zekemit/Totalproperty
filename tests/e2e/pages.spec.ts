import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/", "/owners", "/commercial", "/lenders", "/tenants", "/services", "/about",
  "/contact", "/vendors", "/portal", "/privacy", "/accessibility", "/fair-housing",
  "/careers", "/spaces", "/newsletter",
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
      // Measure the settled state: with motion enabled, axe can sample text mid-fade at partial
      // opacity. This also exercises the prefers-reduced-motion path.
      await page.emulateMedia({ reducedMotion: "reduce" });
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
    // The reference draft's URLs (maxalley.net/tpm).
    "/about.php": "/about", "/team.php": "/careers", "/team": "/careers", "/space": "/spaces",
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

test("by default the site keeps search engines out (preview-safe), and says so three ways", async ({ request, page }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const body = await robots.text();
  expect(body).toContain("Disallow: /");
  expect(body).not.toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain("<loc>");
  const home = await request.get("/");
  expect(home.headers()["x-robots-tag"]).toContain("noindex");
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("with pending business info left blank nothing renders half-empty or overclaims", async ({ page }) => {
  await page.goto("/about", { waitUntil: "networkidle" });
  for (const heading of ["Leadership", "Licensing", "Properties we manage", "What clients say"]) {
    await expect(page.getByRole("heading", { name: heading })).toHaveCount(0);
  }
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "What clients say" })).toHaveCount(0);
  // Only a PO box is verified, so no page may claim a walk-in office.
  for (const route of ["/", "/about", "/owners", "/lenders", "/contact"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    expect(await page.locator("main").innerText()).not.toMatch(/our office/i);
  }
  // Portal links fall back to a human instruction, never a dead button.
  await page.goto("/tenants", { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: /Open tenant portal/ })).toHaveCount(0);
  await expect(page.getByText(/To get set up with your tenant portal, call/)).toBeVisible();
  await page.goto("/portal", { waitUntil: "networkidle" });
  await expect(page.getByText(/To get portal access, call/).first()).toBeVisible();
  // No listings, openings or benefits are invented: empty states tell people how to reach us.
  await page.goto("/spaces", { waitUntil: "networkidle" });
  await expect(page.getByText("Nothing is listed here right now.")).toBeVisible();
  await page.goto("/careers", { waitUntil: "networkidle" });
  await expect(page.getByText(/There are no openings posted right now/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Why work here?" })).toHaveCount(0);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Available now" })).toHaveCount(0);
});

test.describe("the reference site's structure", () => {
  test("primary navigation matches maxalley.net/tpm, in order", async ({ page, isMobile }) => {
    test.skip(isMobile, "the full nav row is a wide-screen layout; the drawer is covered separately");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const labels = await page.getByRole("navigation", { name: "Primary" }).getByRole("link").allInnerTexts();
    expect(labels).toEqual(["Home", "Services", "Join Our Team", "About", "Looking For a Space", "Newsletter", "Vendors", "Contact"]);
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  test("home follows the reference order: hero, statement, property types", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Total Property Management");
    const headings = await page.locator("main h2").allInnerTexts();
    expect(headings[0]).toMatch(/We are pitbulls about our client.s assets/);
    expect(headings[1]).toMatch(/Property types\s+we manage/);
    for (const t of ["Retail", "Industrial", "Marinas", "Hospitality", "Office", "Residential"]) {
      await expect(page.getByRole("heading", { level: 3, name: t, exact: true })).toBeVisible();
    }
  });

  test("services page shows the reference's three services first, with their chips", async ({ page }) => {
    await page.goto("/services", { waitUntil: "networkidle" });
    const titles = await page.locator("main h2").allInnerTexts();
    expect(titles.slice(0, 4)).toEqual(["Dedicated to providing the highest quality service", "Landlord Services", "Tenant Services", "Commercial Construction Services"]);
    await expect(page.getByText("Lot Sweeping")).toBeVisible();
    await expect(page.getByText("Final Punch Listing")).toBeVisible();
  });

  test("the hero slideshow can be paused and every slide has a describable label", async ({ page, isMobile }) => {
    test.skip(isMobile, "pause control is exercised on desktop");
    await page.goto("/", { waitUntil: "networkidle" });
    const pause = page.getByRole("button", { name: "Pause slideshow" });
    await expect(pause).toBeVisible();
    await pause.click();
    await expect(page.getByRole("button", { name: "Play slideshow" })).toHaveAttribute("aria-pressed", "true");
    for (const label of ["Office", "Retail", "Residential", "Industrial"]) {
      await expect(page.getByRole("button", { name: `Show ${label}` })).toBeVisible();
    }
  });
});

test.describe("search readiness", () => {
  test("structured data is valid JSON with the local business details and service catalogue", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts();
    const biz = blocks.map((b) => JSON.parse(b) as Record<string, unknown>).find((j) => JSON.stringify(j["@type"]).includes("RealEstateAgent"));
    expect(biz).toBeTruthy();
    const b = biz as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(b["@type"]).toEqual(["LocalBusiness", "RealEstateAgent"]);
    expect(b.telephone).toBe("+12025280140");
    const areas = (b.areaServed as { name: string }[]).map((a) => a.name);
    for (const expected of ["Purcellville, VA", "Loudoun County, VA", "Northern Virginia", "Virginia", "Maryland", "Pennsylvania", "Washington, DC"]) expect(areas).toContain(expected);
    const offers = (b.hasOfferCatalog.itemListElement as { itemOffered: { name: string } }[]).map((o) => o.itemOffered.name);
    expect(offers).toEqual(expect.arrayContaining(["Landlord Services", "Residential Owner Services", "Lender and REO Services"]));
  });

  test("each landing page has its own title, description and canonical", async ({ page }) => {
    const seen = new Set<string>();
    for (const route of ["/", "/owners", "/tenants", "/commercial", "/services", "/spaces"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      const title = await page.title();
      expect(title.length).toBeGreaterThan(20);
      expect(seen.has(title)).toBe(false);
      seen.add(title);
      expect(((await page.locator('meta[name="description"]').getAttribute("content")) ?? "").length).toBeGreaterThan(60);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    }
  });

  test("owners and tenants are ad-ready: keyword H1, a way to call, and the request form in reach", async ({ page }) => {
    await page.goto("/owners", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Rental property management");
    await expect(page.locator("main").getByRole("link", { name: /Call 202-528-0140/ }).first()).toBeVisible();
    await expect(page.locator("#analysis form")).toBeVisible();
    await page.goto("/tenants", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Tenant portal");
  });
});

test("unknown URL shows the helpful 404 with one h1", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Go to the homepage" })).toBeVisible();
});
