import { describe, it, expect } from 'vitest'
import { DIVISIONS, NAVIGATION_LINKS, SOCIAL_LINKS, SITE } from '@/lib/constants'

describe('SITE', () => {
  it('has required fields', () => {
    expect(SITE.name).toBeTruthy()
    expect(SITE.tagline).toBeTruthy()
    expect(SITE.description.length).toBeGreaterThan(100)
    expect(SITE.url).toMatch(/^https:\/\//)
  })
})

describe('DIVISIONS', () => {
  it('has exactly 4 divisions', () => {
    expect(DIVISIONS).toHaveLength(4)
  })

  it('has unique slugs', () => {
    const slugs = DIVISIONS.map((d) => d.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has at least one active division', () => {
    const active = DIVISIONS.filter((d) => d.status === 'active')
    expect(active.length).toBeGreaterThanOrEqual(1)
  })

  it('active divisions have a URL', () => {
    DIVISIONS.filter((d) => d.status === 'active').forEach((d) => {
      expect(d.url).toBeTruthy()
    })
  })

  it('all divisions have required fields', () => {
    DIVISIONS.forEach((d) => {
      expect(d.name).toBeTruthy()
      expect(d.icon).toBeTruthy()
      expect(d.color).toMatch(/^#/)
      expect(d.tagline).toBeTruthy()
      expect(d.description).toBeTruthy()
      expect(d.metaTitle).toBeTruthy()
      expect(d.metaDescription).toBeTruthy()
      expect(d.longDescription).toBeTruthy()
      expect(d.features.length).toBeGreaterThan(0)
      expect(d.useCases.length).toBeGreaterThan(0)
      expect(d.faq.length).toBeGreaterThan(0)
    })
  })

  it('coming-soon divisions have development progress', () => {
    DIVISIONS.filter((d) => d.status === 'coming-soon').forEach((d) => {
      expect(d.developmentProgress).toBeDefined()
      expect(d.expectedLaunch).toBeTruthy()
    })
  })
})

describe('NAVIGATION_LINKS', () => {
  it('has at least 3 links', () => {
    expect(NAVIGATION_LINKS.length).toBeGreaterThanOrEqual(3)
  })

  it('has Home as first link', () => {
    expect(NAVIGATION_LINKS[0].label).toBe('Home')
    expect(NAVIGATION_LINKS[0].href).toBe('/')
  })

  it('external links have external flag', () => {
    NAVIGATION_LINKS.filter((l) => l.href.startsWith('http')).forEach((l) => {
      expect(l.external).toBe(true)
    })
  })
})

describe('SOCIAL_LINKS', () => {
  it('has at least 2 social links', () => {
    expect(SOCIAL_LINKS.length).toBeGreaterThanOrEqual(2)
  })

  it('all links have required fields', () => {
    SOCIAL_LINKS.forEach((s) => {
      expect(s.label).toBeTruthy()
      expect(s.href).toMatch(/^https:\/\//)
      expect(s.icon).toBeTruthy()
      expect(s.brandColor).toMatch(/^#/)
    })
  })
})
