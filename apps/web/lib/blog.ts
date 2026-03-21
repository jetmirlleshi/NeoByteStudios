import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function resolveBlogDir(): string {
  // Priority 1: env var esplicita (set in next.config.ts) — solo se il path esiste davvero
  const envDir = process.env.BLOG_CONTENT_DIR
  if (envDir && fs.existsSync(envDir)) return envDir

  // Priority 2: content/blog relativo a cwd (funziona quando cwd = apps/web)
  const cwdDir = path.join(process.cwd(), 'content', 'blog')
  if (fs.existsSync(cwdDir)) return cwdDir

  // Priority 3: apps/web/content/blog relativo a cwd (funziona quando cwd = monorepo root)
  return path.join(process.cwd(), 'apps', 'web', 'content', 'blog')
}

const BLOG_DIR = resolveBlogDir()

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  coverColor?: string
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

function parseFrontmatter(slug: string, fileContent: string): BlogPost {
  const { data, content } = matter(fileContent)
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? '',
    author: data.author ?? 'NeoByteStudios',
    tags: data.tags ?? [],
    coverColor: data.coverColor,
    content,
  }
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { content: _, ...meta } = parseFrontmatter(slug, raw)
    return meta
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(slug, raw)
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}
