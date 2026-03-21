import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    })
  })

  test('homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    })
  })

  test('about page', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('about.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    })
  })

  test('blog listing', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('blog.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    })
  })

  test('division page - writer', async ({ page }) => {
    await page.goto('/divisions/writer')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('division-writer.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    })
  })

  test('division page - coming soon', async ({ page }) => {
    await page.goto('/divisions/forge')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('division-forge.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    })
  })

  test('404 page', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('404.png', {
      maxDiffPixelRatio: 0.05,
    })
  })

  test('homepage - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    })
  })
})
