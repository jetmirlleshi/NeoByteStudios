import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pages = [
  { name: 'Homepage', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Division Writer', path: '/divisions/writer' },
  { name: 'Division Forge', path: '/divisions/forge' },
]

for (const { name, path } of pages) {
  test(`${name} should have no accessibility violations`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('domcontentloaded')

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })
}
