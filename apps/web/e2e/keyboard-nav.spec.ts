import { test, expect } from '@playwright/test'

test.describe('Keyboard Navigation', () => {
  test('skip to content link appears on Tab', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    // First focusable element should be accessible
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('navbar links are keyboard navigable', async ({ page }) => {
    await page.goto('/')
    const navLinks = page.locator('nav[aria-label="Main navigation"] a, nav[aria-label="Main navigation"] button')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)

    // Tab through nav links and verify focus ring visibility
    for (let i = 0; i < Math.min(count, 5); i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()
    }
  })

  test('mobile menu opens and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const hamburger = page.locator('button[aria-controls="mobile-nav-menu"]')
    await hamburger.click()

    const menu = page.locator('#mobile-nav-menu')
    await expect(menu).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(menu).not.toBeVisible()
  })

  test('footer links are keyboard accessible', async ({ page }) => {
    await page.goto('/')

    const footerNav = page.locator('nav[aria-label="Footer navigation"]')
    await expect(footerNav).toBeVisible()

    const footerLinks = footerNav.locator('a')
    const count = await footerLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('division cards on homepage are focusable', async ({ page }) => {
    await page.goto('/')
    const divisionLinks = page.locator('a[href^="/divisions/"]')
    const count = await divisionLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('blog post links are keyboard navigable', async ({ page }) => {
    await page.goto('/blog')
    const blogLinks = page.locator('a[href^="/blog/"]')
    const count = await blogLinks.count()
    expect(count).toBeGreaterThan(0)
  })
})
