import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'
import { SITE } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import FloatingOrbs from '@/components/ui/FloatingOrbs'
import ShareBar from '@/components/ui/ShareBar'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: `Post Not Found — ${SITE.name}` }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags?.join(', '),
    author: {
      '@type': 'Organization',
      name: post.author,
      url: SITE.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE.url}/blog/${slug}`,
    },
  }

  return (
    <section className="relative overflow-hidden">
      <FloatingOrbs seed={slug.length * 13} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-32 md:py-48">
        {/* ── Header ─────────────────────────────────────────── */}
        <ScrollReveal>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span aria-hidden="true">&middot;</span>
            <span>{post.author}</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold">
            <GradientText>{post.title}</GradientText>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-4 text-text-secondary text-lg leading-relaxed">
            {post.description}
          </p>
        </ScrollReveal>

        {/* ── Tags ────────────────────────────────────────────── */}
        {post.tags.length > 0 && (
          <ScrollReveal delay={0.15}>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium text-text-muted border border-border-custom"
                >
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* ── Separator ──────────────────────────────────────── */}
        <div
          className="mt-8 h-px"
          style={{
            background: `linear-gradient(to right, ${post.coverColor ?? 'var(--brand-from)'}40, transparent)`,
          }}
        />

        {/* ── MDX Content ────────────────────────────────────── */}
        <ScrollReveal delay={0.2}>
          <article className="prose-custom mt-10">
            <MDXRemote source={post.content} />
          </article>
        </ScrollReveal>

        {/* ── Share ──────────────────────────────────────────── */}
        <ScrollReveal delay={0.25}>
          <ShareBar
            url={`${SITE.url}/blog/${slug}`}
            title={post.title}
          />
        </ScrollReveal>

        {/* ── CTA ───────────────────────────────────────────── */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 rounded-2xl border border-border-custom bg-bg-secondary/40 p-8 text-center backdrop-blur-sm">
            <p className="font-display text-lg font-semibold text-text-primary">
              Ready to start your creative journey?
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Try NeoByteWriter — the AI-powered writing tool built for fantasy authors.
            </p>
            <a
              href="https://neobytewriter.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-gradient-to-r from-brand-from to-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              Try NeoByteWriter&nbsp;&rarr;
            </a>
          </div>
        </ScrollReveal>

        {/* ── Navigation ─────────────────────────────────────── */}
        <ScrollReveal delay={0.35}>
          <div className="mt-12 flex flex-wrap gap-6">
            <Link
              href="/blog"
              className="text-text-muted hover:text-accent transition-colors duration-200 text-sm"
            >
              &larr; All Posts
            </Link>
            <Link
              href="/"
              className="text-text-muted hover:text-accent transition-colors duration-200 text-sm"
            >
              &larr; Home
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
