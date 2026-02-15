import type { MetadataRoute } from 'next'
import { SITE, DIVISIONS } from '@/lib/constants'
import { getAllPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url

  const divisionPages: MetadataRoute.Sitemap = DIVISIONS.map((d) => ({
    url: `${baseUrl}/divisions/${d.slug}`,
    lastModified: new Date('2025-06-01'),
    changeFrequency: d.status === 'active' ? 'weekly' : 'monthly',
    priority: d.status === 'active' ? 0.9 : 0.4,
  }))

  const blogPosts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date('2025-06-01'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: blogPosts.length > 0 ? new Date(blogPosts[0].lastModified as Date) : new Date('2025-06-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2025-06-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...divisionPages,
    ...blogPosts,
  ]
}
