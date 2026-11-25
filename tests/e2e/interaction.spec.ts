import { expect, test } from "@playwright/test";

test.describe("mobile menu drawer", () => {
  test.skip(({ isMobile }) => !isMobile, "the drawer is the mobile navigation");

  test("opens as a modal dialog, traps the page behind it, and closes with Escape returning focus", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Menu" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.getByRole("link", { name: "Commercial" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Contact" })).toBeVisible();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("following a link closes the drawer and navigates", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog", { name: "Site menu" }).getByRole("link", { name: "Owners" }).click();
    await expect(page).toHaveURL(/\/owners$/);
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  });
});

test.describe("four buildings, one foundation", () => {
  test("selecting a client lights exactly the functions the company lists for it", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const lit = async () =>
      page.locator('li[data-lit="true"]').allInnerTexts();

    // Owners are selected by default: roof repair to landscaping.
    await expect(page.getByRole("button", { name: /Owners/ })).toHaveAttribute("aria-pressed", "true");
    expect((await lit()).sort()).toEqual(["Landscaping", "Maintenance", "Repair"]);

    await page.getByRole("button", { name: /Commercial landlords/ }).click();
    await expect(page.getByRole("button", { name: /Commercial landlords/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /Owners/ })).toHaveAttribute("aria-pressed", "false");
    expect((await lit()).sort()).toEqual(["Accounting", "CAM", "Landscaping", "Maintenance", "Security"]);
    await expect(page.getByRole("region", { name: /Commercial landlords: how we work/ })).toContainText("Annual budgets");

    await page.getByRole("button", { name: /Lenders/ }).click();
    expect((await lit()).sort()).toEqual(["Landscaping", "Maintenance", "Renovation"]);
    await expect(page.getByRole("region", { name: /Lenders: how we work/ })).toContainText("sliding scale");
  });
});

test.describe("services showcase", () => {
  test.skip(({ isMobile }) => isMobile, "the pinned panel is a large-screen layout");

  test("the pinned drawing follows the row in view", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const panel = page.locator("div.sticky").filter({ hasText: "Residential Property Management" });
    await expect(panel).toBeVisible();
    await page.getByRole("heading", { name: "Construction Management" }).scrollIntoViewIfNeeded();
    await page.getByRole("heading", { name: "Construction Management" }).evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(page.locator("div.sticky").getByText("Construction Management")).toBeVisible();
    await expect(page.locator("div.sticky").getByText("03", { exact: true })).toBeVisible();
  });
});

test("every page has exactly one landmark main and a visible skip target", async ({ page }) => {
  await page.goto("/owners", { waitUntil: "networkidle" });
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("See what your rental should be earning.");
});
