import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'

import { getAllPosts, getPostBySlug, getAllSlugs } from '@/lib/blog'

const SAMPLE_MDX = `---
title: Test Post
description: A test post description
date: "2025-03-15"
author: TestAuthor
tags:
  - testing
  - vitest
coverColor: "#7c3aed"
---

This is the post content.
`

const SAMPLE_MDX_2 = `---
title: Second Post
description: Another test post
date: "2025-04-01"
author: TestAuthor
tags:
  - second
---

Second post content.
`

const SAMPLE_MDX_MINIMAL = `---
title: Minimal Post
---

Minimal content.
`

let existsSyncSpy: ReturnType<typeof vi.spyOn>
let readdirSyncSpy: ReturnType<typeof vi.spyOn>
let readFileSyncSpy: ReturnType<typeof vi.spyOn>

describe('lib/blog', () => {
  beforeEach(() => {
    existsSyncSpy = vi.spyOn(fs, 'existsSync')
    readdirSyncSpy = vi.spyOn(fs, 'readdirSync')
    readFileSyncSpy = vi.spyOn(fs, 'readFileSync')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAllPosts', () => {
    it('returns empty array when blog directory does not exist', () => {
      existsSyncSpy.mockReturnValue(false)
      const posts = getAllPosts()
      expect(posts).toEqual([])
    })

    it('returns posts sorted by date (newest first)', () => {
      existsSyncSpy.mockReturnValue(true)
      readdirSyncSpy.mockReturnValue(['first.mdx', 'second.mdx'] as unknown as fs.Dirent[])
      readFileSyncSpy.mockImplementation((filePath) => {
        const p = String(filePath)
        if (p.includes('first')) return SAMPLE_MDX
        return SAMPLE_MDX_2
      })

      const posts = getAllPosts()
      expect(posts).toHaveLength(2)
      expect(posts[0].title).toBe('Second Post')
      expect(posts[1].title).toBe('Test Post')
    })

    it('filters only .mdx files', () => {
      existsSyncSpy.mockReturnValue(true)
      readdirSyncSpy.mockReturnValue(['post.mdx', 'readme.md', 'notes.txt'] as unknown as fs.Dirent[])
      readFileSyncSpy.mockReturnValue(SAMPLE_MDX)

      const posts = getAllPosts()
      expect(posts).toHaveLength(1)
      expect(posts[0].slug).toBe('post')
    })

    it('does not include content in returned metadata', () => {
      existsSyncSpy.mockReturnValue(true)
      readdirSyncSpy.mockReturnValue(['test.mdx'] as unknown as fs.Dirent[])
      readFileSyncSpy.mockReturnValue(SAMPLE_MDX)

      const posts = getAllPosts()
      expect(posts[0]).not.toHaveProperty('content')
    })

    it('parses all frontmatter fields correctly', () => {
      existsSyncSpy.mockReturnValue(true)
      readdirSyncSpy.mockReturnValue(['test.mdx'] as unknown as fs.Dirent[])
      readFileSyncSpy.mockReturnValue(SAMPLE_MDX)

      const posts = getAllPosts()
      expect(posts[0]).toEqual({
        slug: 'test',
        title: 'Test Post',
        description: 'A test post description',
        date: '2025-03-15',
        author: 'TestAuthor',
        tags: ['testing', 'vitest'],
        coverColor: '#7c3aed',
      })
    })

    it('uses defaults for missing frontmatter fields', () => {
      existsSyncSpy.mockReturnValue(true)
      readdirSyncSpy.mockReturnValue(['minimal.mdx'] as unknown as fs.Dirent[])
      readFileSyncSpy.mockReturnValue(SAMPLE_MDX_MINIMAL)

      const posts = getAllPosts()
      expect(posts[0].author).toBe('NeoByteStudios')
      expect(posts[0].description).toBe('')
      expect(posts[0].tags).toEqual([])
    })
  })

  describe('getPostBySlug', () => {
    it('returns null when file does not exist', () => {
      existsSyncSpy.mockReturnValue(false)
      const post = getPostBySlug('nonexistent')
      expect(post).toBeNull()
    })

    it('returns full post with content when file exists', () => {
      existsSyncSpy.mockReturnValue(true)
      readFileSyncSpy.mockReturnValue(SAMPLE_MDX)

      const post = getPostBySlug('test-post')
      expect(post).not.toBeNull()
      expect(post!.title).toBe('Test Post')
      expect(post!.content).toContain('This is the post content.')
      expect(post!.slug).toBe('test-post')
    })

    it('sets slug from the parameter, not the filename', () => {
      existsSyncSpy.mockReturnValue(true)
      readFileSyncSpy.mockReturnValue(SAMPLE_MDX)

      const post = getPostBySlug('custom-slug')
      expect(post!.slug).toBe('custom-slug')
    })
  })

  describe('getAllSlugs', () => {
    it('returns empty array when directory does not exist', () => {
      existsSyncSpy.mockReturnValue(false)
      const slugs = getAllSlugs()
      expect(slugs).toEqual([])
    })

    it('returns slugs without .mdx extension', () => {
      existsSyncSpy.mockReturnValue(true)
      readdirSyncSpy.mockReturnValue(['first-post.mdx', 'second-post.mdx'] as unknown as fs.Dirent[])

      const slugs = getAllSlugs()
      expect(slugs).toEqual(['first-post', 'second-post'])
    })

    it('filters out non-mdx files', () => {
      existsSyncSpy.mockReturnValue(true)
      readdirSyncSpy.mockReturnValue(['post.mdx', 'readme.md'] as unknown as fs.Dirent[])

      const slugs = getAllSlugs()
      expect(slugs).toEqual(['post'])
    })
  })
})
