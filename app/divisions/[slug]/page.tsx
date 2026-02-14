import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DIVISIONS, SITE } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import Badge from '@/components/ui/Badge'
import DivisionIcon from '@/components/ui/DivisionIcon'
import FloatingOrbs from '@/components/ui/FloatingOrbs'

export function generateStaticParams() {
  return DIVISIONS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const division = DIVISIONS.find((d) => d.slug === slug)

  if (!division) {
    return { title: `Division Not Found — ${SITE.name}` }
  }

  return {
    title: `${division.name} — ${SITE.name}`,
    description: `${division.tagline}. ${division.description}`,
    alternates: {
      canonical: `/divisions/${slug}`,
    },
  }
}

export default async function DivisionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const division = DIVISIONS.find((d) => d.slug === slug)

  if (!division) notFound()

  const isActive = division.status === 'active'

  return (
    <section className="relative overflow-hidden">
      <FloatingOrbs seed={division.slug.length * 17} />

      <div className="relative max-w-3xl mx-auto px-4 py-32 md:py-48">
        {/* ── Icon + Name ──────────────────────────────────────── */}
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${division.color}20, ${division.color}08)`,
                border: `1px solid ${division.color}30`,
              }}
            >
              <DivisionIcon slug={division.slug} color={division.color} size={28} />
            </div>
            <h1
              className="font-display text-3xl md:text-4xl font-bold"
              style={{ color: division.color }}
            >
              {division.name}
            </h1>
          </div>
        </ScrollReveal>

        {/* ── Tagline ──────────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <p className="text-xl text-text-secondary mt-3">
            {division.tagline}
          </p>
        </ScrollReveal>

        {/* ── Status badge ─────────────────────────────────────── */}
        <ScrollReveal delay={0.15}>
          <div className="mt-4">
            <Badge status={division.status} color={division.color} />
          </div>
        </ScrollReveal>

        {/* ── Description ──────────────────────────────────────── */}
        <ScrollReveal delay={0.2}>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed mt-8">
            {division.description}
          </p>
        </ScrollReveal>

        {/* ── CTA / Coming-soon teaser ─────────────────────────── */}
        <ScrollReveal delay={0.3}>
          {isActive && division.url ? (
            <div className="mt-10">
              <a
                href={division.url}
                target="_blank"
                rel="noopener noreferrer"
                data-division-cta
                className="
                  group relative inline-block rounded-full p-[1px]
                  bg-gradient-to-r from-brand-from to-accent
                  transition-shadow duration-300
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-brand-from focus-visible:ring-offset-2
                  focus-visible:ring-offset-bg-primary
                "
                style={{
                  '--glow-color': division.color,
                } as React.CSSProperties}
              >
                <span
                  className="
                    block rounded-full px-8 py-3
                    bg-bg-primary text-text-primary font-medium
                    transition-colors duration-300
                    group-hover:bg-bg-primary/90
                  "
                >
                  Visit {division.name}&nbsp;&rarr;
                </span>
                <style>{`
                  [data-division-cta]:hover {
                    box-shadow: 0 0 24px 4px ${division.color}73;
                  }
                `}</style>
              </a>
            </div>
          ) : (
            <div
              className="mt-10 rounded-2xl p-6 glass-card relative"
              style={{ borderLeft: `2px solid ${division.color}40` }}
            >
              <p className="text-text-muted text-sm md:text-base">
                This division is currently in development. Stay tuned for
                updates.
              </p>
            </div>
          )}
        </ScrollReveal>

        {/* ── Back link ────────────────────────────────────────── */}
        <ScrollReveal delay={0.4}>
          <div className="mt-20">
            <Link
              href="/#divisions"
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
