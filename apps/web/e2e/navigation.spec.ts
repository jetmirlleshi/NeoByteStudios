import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/NeoByteStudios/)
  })

  test('about page loads', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle(/About/)
  })

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveTitle(/Blog/)
  })

  test('division page loads', async ({ page }) => {
    await page.goto('/divisions/writer')
    await expect(page).toHaveTitle(/NeoByteWriter/)
  })

  test('404 page for invalid route', async ({ page }) => {
    const response = await page.goto('/nonexistent-page')
    expect(response?.status()).toBe(404)
  })

  test('navbar links navigate correctly', async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="/about"]')
    await expect(page).toHaveURL('/about')
  })

  test('blog post page loads', async ({ page }) => {
    await page.goto('/blog')
    const firstPost = page.locator('a[href^="/blog/"]').first()
    await firstPost.click()
    await expect(page.locator('article')).toBeVisible()
  })
})
