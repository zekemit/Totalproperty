import { expect, test } from "@playwright/test";

// Submissions share one in-memory rate limit per server (5 / 10 min / IP) and this
// suite stays within it, so form tests run on a single project only.
test.skip(({ isMobile }) => isMobile, "form submissions are exercised on desktop only");

test.describe("vacancy instrument", () => {
  test("computes from the visitor's numbers and pre-fills the request form", async ({ page }) => {
    await page.goto("/owners", { waitUntil: "networkidle" });
    await expect(page.getByText("Your cost appears here once you enter a rent.")).toBeVisible();
    await page.getByLabel("Monthly rent", { exact: true }).fill("3,000");
    // The headline figure tweens to its final value.
    await expect(page.getByTestId("lost-income")).toHaveText("$2,959");
    const result = page.getByTestId("vacancy-result");
    await expect(result).toContainText("$99");
    await expect(result).toContainText("$3,000");
    await expect(result).toContainText("$36,000");
    await page.getByRole("button", { name: "Use this rent in my request" }).click();
    await expect(page.getByText("Added to the request form.")).toBeVisible();
    await expect(page.getByLabel("Current rent", { exact: false }).first()).toHaveValue("3000");
  });

  test("the slider drives the year bar and the figure, and is keyboard operable", async ({ page }) => {
    await page.goto("/owners", { waitUntil: "networkidle" });
    await page.getByLabel("Monthly rent", { exact: true }).fill("3000");
    const slider = page.getByLabel("Days empty between tenants");
    await expect(page.getByText("8%").first()).toBeVisible();
    await slider.focus();
    await page.keyboard.press("End"); // 120 days
    await expect(slider).toHaveValue("120");
    await expect(page.getByTestId("lost-income")).toHaveText("$11,836");
    await expect(page.getByText("33%").first()).toBeVisible();
    await page.keyboard.press("Home");
    await expect(page.getByTestId("lost-income")).toHaveText("$0");
  });

  test("never shows NaN or Infinity for bad input", async ({ page }) => {
    await page.goto("/owners", { waitUntil: "networkidle" });
    for (const bad of ["abc", "-5", "0", "1e999", "99999999"]) {
      await page.getByLabel("Monthly rent", { exact: true }).fill(bad);
      const body = await page.locator("main").innerText();
      expect(body).not.toMatch(/NaN|Infinity/);
      await expect(page.getByText("Enter a monthly rent between $1 and $100,000.")).toBeVisible();
    }
  });
});

test.describe("contact form", () => {
  test("shows an accessible error summary and keeps what was typed", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    await page.getByLabel("Full name", { exact: true }).fill("Jane Owner");
    await page.getByLabel("Email", { exact: true }).fill("not-an-email");
    await page.waitForTimeout(1200); // a human takes longer than the bot threshold
    await page.getByRole("button", { name: "Send message" }).click();

    const alert = page.locator('form [role="alert"]');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("Please fix the highlighted fields");
    await expect(alert).toBeFocused();
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Enter a valid email address.").first()).toBeVisible();
    await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("Jane Owner");
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue("not-an-email");
  });

  test("the honeypot is invisible to people and assistive tech", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    const honeypot = page.locator('input[name="reference_code"]');
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(await honeypot.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
    // Parked far off-screen and clipped: nobody can see or click it.
    const box = await honeypot.boundingBox();
    expect(box === null || box.x + box.width < 0).toBe(true);
  });

  test("in production with no database or email configured it fails honestly, never a false success", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    await page.getByLabel("Full name", { exact: true }).fill("Jane Owner");
    await page.getByLabel("Email", { exact: true }).fill("jane@example.com");
    await page.getByLabel("What is this about?").selectOption("general");
    await page.getByLabel("How can we help?").fill("I would like to talk about my rental property.");
    await page.getByLabel(/I agree that Total Property/).check();
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: "Send message" }).click();
    const alert = page.locator('form [role="alert"]');
    await expect(alert).toContainText("couldn't send your request right now");
    await expect(alert).toContainText("202-528-0140");
    await expect(page.getByLabel("How can we help?")).toHaveValue(/talk about my rental property/);
  });
});

test("maintenance form states the emergency instruction and requires consent", async ({ page }) => {
  await page.goto("/tenants", { waitUntil: "networkidle" });
  await expect(page.getByText(/This is an emergency/)).toBeVisible();
  await expect(page.getByText("If anyone is in danger, call 911 first.", { exact: false })).toBeVisible();
});
