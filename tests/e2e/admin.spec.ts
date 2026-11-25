import AxeBuilder from "@axe-core/playwright";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";

/**
 * The editor, end to end: sign-in, saving every kind of content, the safety rules, and that what
 * is saved shows up on the public site. Runs last and serially (see playwright.config.ts) against
 * a throwaway content file, and puts every setting back as it finds it.
 */
const PASSWORD = "tpm-e2e-admin-pass-2026";

test.describe.configure({ mode: "serial" });

let context: BrowserContext;
let page: Page;

const tab = (name: string | RegExp) => page.getByRole("tab", { name });

async function save() {
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved.");
}

async function openEditor() {
  await page.goto("/admin");
  await expect(page.getByRole("tablist", { name: "Sections of the site" })).toBeVisible();
}

test.beforeAll(async ({ browser }, testInfo) => {
  context = await browser.newContext({ baseURL: testInfo.project.use.baseURL, viewport: { width: 1280, height: 900 } });
  page = await context.newPage();
});

test.afterAll(async () => {
  await context.close();
});

test("signed-out visitors are sent to a private login page", async ({ request }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Site editor" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const res = await request.get("/admin/login");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
  expect(res.headers()["cache-control"]).toContain("no-store");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /");
});

test("a login request from another site is refused", async ({ request }) => {
  const res = await request.post("/api/admin/login", { form: { password: PASSWORD }, headers: { origin: "https://evil.example" }, maxRedirects: 0 });
  expect(res.status()).toBe(403);
  expect(res.headers()["set-cookie"]).toBeUndefined();
});

test("a wrong password is refused, the right one signs in with an HttpOnly cookie", async () => {
  await page.goto("/admin/login");
  await page.getByLabel("Password").fill("not-the-password-at-all");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/e=bad/);
  await expect(page.getByText("That password wasn't right. Please try again.")).toBeVisible();

  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  const cookie = (await context.cookies()).find((c) => c.name === "tpm_admin");
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
  expect(cookie?.value.split(".")).toHaveLength(2);
});

test("a tampered session cookie is not accepted", async ({ browser }, testInfo) => {
  const other = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
  const good = (await context.cookies()).find((c) => c.name === "tpm_admin");
  await other.addCookies([{ name: "tpm_admin", value: `${good?.value.slice(0, -3)}abc`, url: String(testInfo.project.use.baseURL) }]);
  const p = await other.newPage();
  await p.goto("/admin");
  await expect(p).toHaveURL(/\/admin\/login$/);
  await other.close();
});

test("the editor has all sections and keeps the keyboard roving between tabs", async () => {
  await openEditor();
  for (const name of ["Announcement", "Homepage & hero", "Services", "Featured properties", "Company, reviews & portals", "SEO & page titles", "Careers"]) {
    await expect(tab(name)).toBeVisible();
  }
  await tab("Announcement").focus();
  await page.keyboard.press("ArrowRight");
  await expect(tab("Homepage & hero")).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(tab("Careers")).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(tab("Announcement")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("button", { name: "Save changes" })).toBeDisabled();
});

test("announcement bar: switch on, appears site-wide, switch off", async () => {
  await openEditor();
  await page.getByRole("switch", { name: /Show the announcement/ }).click();
  await page.getByLabel("Headline").fill("Now leasing in Loudoun County");
  await page.getByLabel("Message (optional)").fill("Retail and office space available.");
  await page.getByLabel("Button words (optional)").fill("See spaces");
  await page.getByLabel("Where the button goes").fill("/spaces");
  await expect(page.getByRole("status")).toContainText("unsaved");
  await save();

  await page.goto("/owners");
  const bar = page.getByTestId("announcement-bar");
  await expect(bar).toContainText("Now leasing in Loudoun County");
  await expect(bar.getByRole("link", { name: "See spaces" })).toHaveAttribute("href", "/spaces");
  await bar.getByRole("button", { name: "Dismiss announcement" }).click();
  await expect(bar).toBeHidden();

  await openEditor();
  await page.getByLabel("How should it appear?").selectOption("popup");
  await save();
  await page.goto("/", { waitUntil: "networkidle" });
  const popup = page.getByTestId("announcement-popup");
  await expect(popup).toBeVisible({ timeout: 8_000 });
  await expect(popup.getByRole("heading", { name: "Now leasing in Loudoun County" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).toBeHidden();

  await openEditor();
  await page.getByRole("switch", { name: /Show the announcement/ }).click();
  await save();
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByTestId("announcement-bar")).toHaveCount(0);
  await expect(page.getByTestId("announcement-popup")).toBeHidden();
});

test("unsafe links and pictures are rejected, and nothing is saved", async () => {
  await openEditor();
  await page.getByRole("switch", { name: /Show the announcement/ }).click();
  await page.getByLabel("Headline").fill("Unsafe test");
  await page.getByLabel("Button words (optional)").fill("Click");
  await page.getByLabel("Where the button goes").fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/Use a full link that starts with https/).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Save changes" })).toBeEnabled();
  await page.goto("/");
  await expect(page.getByText("Unsafe test")).toHaveCount(0);

  await openEditor();
  await tab("Featured properties").click();
  await page.getByRole("button", { name: "Add a property" }).click();
  await page.getByLabel("Title", { exact: true }).fill("Bad picture");
  await page.getByLabel("Picture", { exact: true }).fill("data:text/html,<script>alert(1)</script>");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/Use a picture link that starts with https/).first()).toBeVisible();
  await page.goto("/spaces");
  await expect(page.getByText("Bad picture")).toHaveCount(0);
});

test("homepage headline changes the H1, and clearing it returns the standard wording", async () => {
  await openEditor();
  await tab("Homepage & hero").click();
  await page.getByLabel("Line 1").fill("Protecting");
  await page.getByLabel("Line 2").fill("Your Assets");
  await save();
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toContainText("Protecting Your Assets");

  await openEditor();
  await tab("Homepage & hero").click();
  await expect(page.getByLabel("Line 1")).toHaveValue("Protecting");
  await page.getByLabel("Line 1").fill("Total Property");
  await page.getByLabel("Line 2").fill("Management");
  await save();
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toContainText("Total Property Management");
});

test("services: hide one, reorder another, and the services page follows", async () => {
  await openEditor();
  await tab("Services").click();
  await page.getByRole("switch", { name: /Show this service on the site/ }).first().click();
  await save();
  await page.goto("/services", { waitUntil: "networkidle" });
  const titles = await page.locator("main h2").allInnerTexts();
  expect(titles).not.toContain("Landlord Services");
  expect(titles[1]).toBe("Tenant Services");

  await openEditor();
  await tab("Services").click();
  await page.getByRole("button", { name: "Move Tenant Services down" }).click();
  await save();
  await page.goto("/services", { waitUntil: "networkidle" });
  expect((await page.locator("main h2").allInnerTexts()).slice(1, 3)).toEqual(["Commercial Construction Services", "Tenant Services"]);

  // Put everything back.
  await openEditor();
  await tab("Services").click();
  await page.getByRole("switch", { name: /Show this service on the site/ }).first().click();
  await page.getByRole("button", { name: "Move Tenant Services up" }).click();
  await save();
  await page.goto("/services", { waitUntil: "networkidle" });
  expect((await page.locator("main h2").allInnerTexts()).slice(1, 4)).toEqual(["Landlord Services", "Tenant Services", "Commercial Construction Services"]);
});

test("featured properties: add with a library photo, show on /spaces and the home page, then remove", async () => {
  await openEditor();
  await tab("Featured properties").click();
  await page.getByRole("button", { name: "Add a property" }).click();
  await page.getByLabel("Title", { exact: true }).fill("2,400 sq ft retail suite");
  await page.getByLabel("Status badge").selectOption("coming_soon");
  await page.getByLabel("Location").fill("Purcellville, VA");
  await page.getByLabel("Rent").fill("$4,200/mo");
  await page.getByLabel("Details").fill("2,400 sq ft");
  await page.getByText("Choose from the photo library").click();
  await page.getByRole("button", { name: "Use the Retail photo" }).click();
  await expect(page.getByAltText("Preview")).toBeVisible();
  await save();

  await page.goto("/spaces", { waitUntil: "networkidle" });
  const card = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: "2,400 sq ft retail suite" }) });
  await expect(card).toContainText("Coming soon");
  await expect(card).toContainText("$4,200/mo");
  await expect(card.getByRole("img")).toHaveAttribute("alt", /retail/i);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Available now" })).toBeVisible();

  await openEditor();
  await tab("Featured properties").click();
  await page.getByRole("button", { name: "Remove 2,400 sq ft retail suite" }).click();
  await page.getByRole("button", { name: /Yes, remove/ }).click();
  await save();
  await page.goto("/spaces", { waitUntil: "networkidle" });
  await expect(page.getByText("Nothing is listed here right now.")).toBeVisible();
});

test("company: phone, hours and a review flow into the footer, the contact page and structured data", async () => {
  await openEditor();
  await tab("Company, reviews & portals").click();
  await page.getByLabel("Main phone").fill("12345");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/10-digit US phone number/).first()).toBeVisible();

  await page.getByLabel("Main phone").fill("703-555-0199");
  const opens = page.getByLabel("Opens");
  const closes = page.getByLabel("Closes");
  for (let i = 0; i < 5; i++) {
    await opens.nth(i).fill("08:30");
    await closes.nth(i).fill("17:00");
  }
  await page.getByRole("button", { name: "Add a review" }).click();
  await page.getByLabel("What they said").fill("They handled everything for us.");
  await page.getByLabel("Name", { exact: true }).fill("J. Doe");
  await save();

  await page.goto("/contact", { waitUntil: "networkidle" });
  await expect(page.locator("footer").getByRole("link", { name: "703-555-0199" })).toBeVisible();
  await expect(page.locator("main")).toContainText("Monday to Friday, 8:30 a.m. to 5 p.m.");
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "What clients say" })).toBeVisible();
  const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts();
  const biz = blocks.map((b) => JSON.parse(b)).find((j) => JSON.stringify(j["@type"]).includes("RealEstateAgent"));
  expect(biz.telephone).toBe("+17035550199");
  expect(biz.openingHoursSpecification[0]).toMatchObject({ opens: "08:30", closes: "17:00", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] });

  // Put it all back.
  await openEditor();
  await tab("Company, reviews & portals").click();
  await page.getByLabel("Main phone").fill("");
  for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]) await page.getByRole("button", { name: `Closed on ${day}` }).click();
  await page.getByRole("button", { name: /^Remove J\. Doe/ }).click();
  await page.getByRole("button", { name: /Yes, remove/ }).click();
  await save();
  await expect(page.getByLabel("Main phone")).toHaveValue("202-528-0140");
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("footer").getByRole("link", { name: "202-528-0140" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "What clients say" })).toHaveCount(0);
});

test("SEO: a page title and description set in the editor reach the page", async () => {
  await openEditor();
  await tab("SEO & page titles").click();
  const owners = page.locator("details", { hasText: "Owners (ads landing page)" });
  await owners.getByText(/Owners \(ads landing page\)/).click();
  await owners.getByLabel("Page title").fill("Loudoun County Landlord Services | Total Property Management");
  await owners.getByLabel("Page description").fill("Free rental analysis and full-service rental management for Loudoun County landlords.");
  await save();
  await page.goto("/owners", { waitUntil: "networkidle" });
  await expect(page).toHaveTitle("Loudoun County Landlord Services | Total Property Management");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Loudoun County landlords/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Loudoun County Landlord Services | Total Property Management");

  await openEditor();
  await tab("SEO & page titles").click();
  const ownersAgain = page.locator("details", { hasText: "Owners (ads landing page)" });
  await ownersAgain.getByText(/Owners \(ads landing page\)/).click();
  await ownersAgain.getByLabel("Page title").fill("");
  await ownersAgain.getByLabel("Page description").fill("");
  await save();
  await page.goto("/owners", { waitUntil: "networkidle" });
  await expect(page).toHaveTitle(/Landlord & Rental Property Management/);
});

test("careers: an opening shows with an apply link, then goes away", async () => {
  await openEditor();
  await tab("Careers").click();
  await page.getByRole("button", { name: "Add an opening" }).click();
  await page.getByLabel("Job title").fill("Property Manager");
  await page.getByLabel("Short description").fill("Run a portfolio of commercial properties.");
  await page.getByLabel("Benefits").fill("Paid time off\nHealth coverage");
  await save();
  await page.goto("/careers", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Property Manager" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Apply for Property Manager/ })).toHaveAttribute("href", /^mailto:info@totalproperty\.us\?subject=Application/);
  await expect(page.getByRole("heading", { name: "Why work here?" })).toBeVisible();

  await openEditor();
  await tab("Careers").click();
  await page.getByRole("button", { name: "Remove Property Manager" }).click();
  await page.getByRole("button", { name: /Yes, remove/ }).click();
  await page.getByLabel("Benefits").fill("");
  await save();
  await page.goto("/careers", { waitUntil: "networkidle" });
  await expect(page.getByText(/There are no openings posted right now/)).toBeVisible();
});

test("two windows can't silently overwrite each other", async ({ browser }, testInfo) => {
  const second = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
  const p2 = await second.newPage();
  await p2.goto("/admin/login");
  await p2.getByLabel("Password").fill(PASSWORD);
  await p2.getByRole("button", { name: "Sign in" }).click();
  await expect(p2.getByRole("tablist")).toBeVisible();

  await openEditor();
  await p2.getByRole("switch", { name: /Show the announcement/ }).click();
  await p2.getByLabel("Headline").fill("Window two");
  await p2.getByRole("button", { name: "Save changes" }).click();
  await expect(p2.getByRole("status")).toContainText("Saved.");

  await page.getByRole("switch", { name: /Show the announcement/ }).click();
  await page.getByLabel("Headline").fill("Window one");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("saved from another window");

  // Clean up from window two.
  await p2.getByRole("switch", { name: /Show the announcement/ }).click();
  await p2.getByRole("button", { name: "Save changes" }).click();
  await expect(p2.getByRole("status")).toContainText("Saved.");
  await second.close();
  // Leave window one's unsaved edit behind: accept the browser's "leave site?" prompt.
  page.once("dialog", (d) => d.accept());
  await page.goto("/admin");
});

test("the login page and every editor section pass axe", async () => {
  const check = async (label: string) => {
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const summary = results.violations.map((v) => `${label} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
    expect(summary).toEqual([]);
  };
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openEditor();
  for (const name of ["Announcement", "Homepage & hero", "Services", "Featured properties", "Company, reviews & portals", "SEO & page titles", "Careers"]) {
    await tab(name).click();
    await check(name);
  }
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login\?e=out/);
  await check("login");
});

test("signing out ends the session", async () => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
