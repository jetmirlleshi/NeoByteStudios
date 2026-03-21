import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load the landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/NeoByteWriter/);
  });

  test("should display the hero section", async ({ page }) => {
    await page.goto("/");

    // Check main heading is visible
    const heading = page.getByRole("heading", {
      name: /NeoByteWriter/i,
      level: 1,
    });
    await expect(heading).toBeVisible();

    // Check subtitle / description text
    const subtitle = page.getByText(/scrittori/i);
    await expect(subtitle).toBeVisible();
  });

  test("should display sign-in and sign-up buttons", async ({ page }) => {
    await page.goto("/");

    const signInLink = page.getByRole("link", { name: /Accedi/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute("href", "/auth/sign-in");

    const signUpLink = page.getByRole("link", { name: /Registrati/i });
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute("href", "/auth/sign-up");
  });

  test("should display the header with brand name", async ({ page }) => {
    await page.goto("/");

    const brandName = page.getByText("NeoByteWriter").first();
    await expect(brandName).toBeVisible();
  });

  test("should navigate to sign-in page when clicking Accedi", async ({
    page,
  }) => {
    await page.goto("/");

    const signInLink = page.getByRole("link", { name: /Accedi/i });
    await signInLink.click();

    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("should navigate to sign-up page when clicking Registrati", async ({
    page,
  }) => {
    await page.goto("/");

    const signUpLink = page.getByRole("link", { name: /Registrati/i });
    await signUpLink.click();

    await expect(page).toHaveURL(/\/auth\/sign-up/);
  });
});

test.describe("Landing Page - Mobile Responsive", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should display correctly on mobile viewport", async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", {
      name: /NeoByteWriter/i,
      level: 1,
    });
    await expect(heading).toBeVisible();

    const signInLink = page.getByRole("link", { name: /Accedi/i });
    await expect(signInLink).toBeVisible();

    const signUpLink = page.getByRole("link", { name: /Registrati/i });
    await expect(signUpLink).toBeVisible();
  });

  test("should have properly stacked layout on mobile", async ({ page }) => {
    await page.goto("/");

    // Verify main content is visible and not overflowing
    const main = page.locator("main");
    await expect(main).toBeVisible();

    const mainBox = await main.boundingBox();
    expect(mainBox).not.toBeNull();
    if (mainBox) {
      // Main content should fit within the viewport width
      expect(mainBox.width).toBeLessThanOrEqual(375);
    }
  });
});
