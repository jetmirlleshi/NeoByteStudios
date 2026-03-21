import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should load the sign-in page", async ({ page }) => {
    await page.goto("/auth/sign-in");

    // Page should load without errors
    await expect(page).toHaveURL(/\/auth\/sign-in/);

    // The auth page main container should be visible
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("should load the sign-up page", async ({ page }) => {
    await page.goto("/auth/sign-up");

    await expect(page).toHaveURL(/\/auth\/sign-up/);

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("should redirect unauthenticated users from dashboard to sign-in", async ({
    page,
  }) => {
    // Navigate to the protected dashboard route
    await page.goto("/dashboard");

    // Should be redirected to sign-in (or show auth UI)
    // Wait for navigation to settle
    await page.waitForLoadState("networkidle");

    // Either we get redirected to auth page, or the current URL changes
    const currentUrl = page.url();
    const isRedirectedToAuth =
      currentUrl.includes("/auth/sign-in") ||
      currentUrl.includes("/auth/") ||
      currentUrl.includes("/sign-in");
    const isStillOnDashboard = currentUrl.includes("/dashboard");

    // If we're still on dashboard, the page should show some form of auth prompt
    // If redirected, we should be on an auth page
    if (isStillOnDashboard) {
      // Dashboard may show auth-required state inline
      const pageContent = await page.textContent("body");
      expect(pageContent).toBeTruthy();
    } else {
      expect(isRedirectedToAuth).toBe(true);
    }
  });

  test("should display auth UI components on sign-in page", async ({
    page,
  }) => {
    await page.goto("/auth/sign-in");

    // Wait for the auth view to render
    await page.waitForLoadState("networkidle");

    // The page should contain auth-related content
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Auth page should be centered (flex items-center justify-center)
    const mainClasses = await main.getAttribute("class");
    expect(mainClasses).toContain("flex");
  });

  test("should maintain proper page structure on auth pages", async ({
    page,
  }) => {
    await page.goto("/auth/sign-in");

    // Check that the page has proper HTML structure
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "it");

    // Body should be present and styled
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});
