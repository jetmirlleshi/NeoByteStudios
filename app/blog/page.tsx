import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { SITE } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import FloatingOrbs from '@/components/ui/FloatingOrbs'

export const metadata: Metadata = {
  title: `Blog — ${SITE.name}`,
  description:
    'Insights on AI-assisted creativity, cross-media IP design, and the one-person studio model. The NeoByteStudios blog.',
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <section className="relative overflow-hidden">
      <FloatingOrbs seed={55} />

      <div className="relative max-w-3xl mx-auto px-4 py-32 md:py-48">
        <ScrollReveal>
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            <GradientText>Blog</GradientText>
          </h1>
          <p className="mt-4 text-text-secondary text-lg">
            Insights on AI-assisted creativity, the one-person studio model, and building cross-media worlds.
          </p>
        </ScrollReveal>

        {posts.length === 0 ? (
          <ScrollReveal delay={0.1}>
            <p className="mt-16 text-text-muted text-center">
              No posts yet. Check back soon.
            </p>
          </ScrollReveal>
        ) : (
          <div className="mt-16 space-y-8">
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={0.1 * (i + 1)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl p-6 glass-card transition-all duration-300 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                  style={{
                    borderLeft: `2px solid ${post.coverColor ?? 'var(--brand-from)'}`,
                  }}
                >
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    {post.tags.length > 0 && (
                      <>
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.tags[0]}</span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-xl md:text-2xl font-bold text-text-primary group-hover:text-accent transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-text-secondary text-sm md:text-base line-clamp-2">
                    {post.description}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal delay={0.5}>
          <div className="mt-20">
            <Link
              href="/"
              className="text-text-muted hover:text-accent transition-colors duration-200 text-sm"
            >
              &larr; Back to Home
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
