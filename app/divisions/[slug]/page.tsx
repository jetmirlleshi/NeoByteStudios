import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DIVISIONS, SITE } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import Badge from '@/components/ui/Badge'
import DivisionIcon from '@/components/ui/DivisionIcon'
import FloatingOrbs from '@/components/ui/FloatingOrbs'
import WaitlistForm from '@/components/ui/WaitlistForm'

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
    title: division.metaTitle,
    description: division.metaDescription,
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

  const faqSchema = division.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: division.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null

  const softwareSchema = isActive && division.url
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: division.name,
        url: division.url,
        description: division.metaDescription,
        applicationCategory: 'Productivity',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }
    : null

  return (
    <section className="relative overflow-hidden">
      <FloatingOrbs seed={division.slug.length * 17} />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {softwareSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      )}

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

        {/* ── Long Description ─────────────────────────────────── */}
        <ScrollReveal delay={0.2}>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed mt-8">
            {division.longDescription}
          </p>
        </ScrollReveal>

        {/* ── Features ─────────────────────────────────────────── */}
        {division.features.length > 0 && (
          <ScrollReveal delay={0.25}>
            <div className="mt-12">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-6">
                <GradientText>Key Features</GradientText>
              </h2>
              <ul className="space-y-3">
                {division.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 flex-shrink-0 h-2 w-2 rounded-full"
                      style={{ backgroundColor: division.color }}
                    />
                    <span className="text-text-secondary text-sm md:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        )}

        {/* ── Use Cases ────────────────────────────────────────── */}
        {division.useCases.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="mt-12">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-6">
                <GradientText>Who Is It For</GradientText>
              </h2>
              <ul className="space-y-3">
                {division.useCases.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 flex-shrink-0 h-2 w-2 rounded-full"
                      style={{ backgroundColor: division.color, opacity: 0.6 }}
                    />
                    <span className="text-text-secondary text-sm md:text-base">
                      {useCase}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        )}

        {/* ── FAQ ──────────────────────────────────────────────── */}
        {division.faq.length > 0 && (
          <ScrollReveal delay={0.35}>
            <div className="mt-12">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-6">
                <GradientText>Frequently Asked Questions</GradientText>
              </h2>
              <div className="space-y-6">
                {division.faq.map((item) => (
                  <div key={item.question}>
                    <h3 className="font-display font-bold text-text-primary text-base md:text-lg">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-text-secondary text-sm md:text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ── CTA / Coming-soon teaser ─────────────────────────── */}
        <ScrollReveal delay={0.4}>
          {isActive && division.url ? (
            <div className="mt-10 flex flex-wrap gap-4">
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
                  Try {division.name}&nbsp;&rarr;
                </span>
              </a>
            </div>
          ) : (
            <div
              className="mt-10 rounded-2xl p-6 md:p-8 glass-card relative"
              style={{ borderLeft: `2px solid ${division.color}40` }}
            >
              <h2 className="font-display text-lg md:text-xl font-bold text-text-primary mb-3">
                Be Among the First
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                {division.name} is currently in active development.
                {division.expectedLaunch && (
                  <> We&apos;re targeting a <strong className="text-text-primary">{division.expectedLaunch}</strong> launch.</>
                )}
              </p>

              {/* Progress bar */}
              {division.developmentProgress != null && (
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Development Progress</span>
                    <span className="font-medium" style={{ color: division.color }}>
                      {division.developmentProgress}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${division.developmentProgress}%`,
                        background: `linear-gradient(90deg, ${division.color}, ${division.color}99)`,
                      }}
                    />
                  </div>
                </div>
              )}

              <p className="mt-5 text-text-muted text-xs md:text-sm">
                Join the waitlist to get early access and development updates.
              </p>
              <WaitlistForm division={division.slug} color={division.color} />
            </div>
          )}
        </ScrollReveal>

        {/* ── Back link ────────────────────────────────────────── */}
        <ScrollReveal delay={0.45}>
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
