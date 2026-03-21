import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock, Calendar, ArrowRight, Rocket, ExternalLink } from 'lucide-react'
import { ROADMAP_ITEMS, SITE } from '@/lib/constants'
import type { RoadmapItem } from '@/lib/constants'
import ScrollReveal from '@/components/ui/ScrollReveal'
import GradientText from '@/components/ui/GradientText'
import DivisionIcon from '@/components/ui/DivisionIcon'
import FloatingOrbs from '@/components/ui/FloatingOrbs'

// ─── Metadata ─────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `Roadmap — ${SITE.name}`,
  description:
    'Follow the NeoByteStudios roadmap: NeoByteWriter is live now, with NeoByteForge, NeoByteGames, and NeoByteVision coming soon. Four divisions, one creative vision.',
  alternates: { canonical: '/roadmap' },
  openGraph: {
    title: `Roadmap — ${SITE.name}`,
    description:
      'Follow the NeoByteStudios roadmap: four AI-powered creative divisions building the future of cross-media storytelling.',
    url: '/roadmap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Roadmap — ${SITE.name}`,
    description:
      'Follow the NeoByteStudios roadmap: four AI-powered creative divisions building the future of cross-media storytelling.',
  },
}

// ─── Helpers ──────────────────────────────────────────────────
const SLUG_MAP: Record<string, string> = {
  NeoByteWriter: 'writer',
  NeoByteForge: 'forge',
  NeoByteGames: 'games',
  NeoByteVision: 'vision',
}

type StatusConfig = {
  label: string
  dotClass: string
  badgeClass: string
  Icon: React.ComponentType<{ className?: string }>
}

function getStatusConfig(status: RoadmapItem['status']): StatusConfig {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        dotClass: 'bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.5)]',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        Icon: CheckCircle2,
      }
    case 'development':
      return {
        label: 'In Development',
        dotClass: 'bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.4)]',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        Icon: Clock,
      }
    case 'planned':
      return {
        label: 'Planned',
        dotClass: 'bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.3)]',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        Icon: Calendar,
      }
  }
}

// ─── Timeline Item ────────────────────────────────────────────
function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: RoadmapItem
  index: number
  isLast: boolean
}) {
  const slug = SLUG_MAP[item.name]
  const { label, dotClass, badgeClass, Icon } = getStatusConfig(item.status)
  const isActive = item.status === 'active'

  return (
    <ScrollReveal delay={index * 0.12}>
      <div className="relative flex gap-6 md:gap-10">
        {/* ── Left: Line + Dot ──────────────────────────────── */}
        <div className="flex flex-col items-center">
          {/* Dot */}
          <div
            className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-bg-primary ${dotClass}`}
          />
          {/* Connector line (hidden on last item) */}
          {!isLast && (
            <div className="mt-1 w-[2px] flex-1 bg-gradient-to-b from-border-custom to-transparent" />
          )}
        </div>

        {/* ── Right: Card ───────────────────────────────────── */}
        <div className="mb-12 flex-1">
          {/* Year label */}
          {item.expectedDate && (
            <span className="mb-3 inline-block text-xs font-medium text-text-muted">
              {item.expectedDate}
            </span>
          )}
          {!item.expectedDate && isActive && (
            <span className="mb-3 inline-block text-xs font-medium text-emerald-400">
              2026 — Live now
            </span>
          )}

          {/* Card */}
          <div
            className={`relative overflow-hidden rounded-2xl border bg-bg-card p-6 transition-all duration-300 hover:shadow-[0_0_40px_-10px_var(--card-glow,rgba(124,58,237,0.15))] ${
              isActive
                ? 'border-emerald-500/20 hover:border-emerald-500/40'
                : 'border-border-custom hover:border-brand-from/20'
            }`}
            style={
              {
                '--card-glow': isActive
                  ? 'rgba(52,211,153,0.15)'
                  : 'rgba(124,58,237,0.12)',
              } as React.CSSProperties
            }
          >
            {/* Active shimmer accent */}
            {isActive && (
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
            )}

            {/* Header: icon + badge */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
              >
                <DivisionIcon slug={slug} color="white" size={22} />
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${badgeClass}`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </span>
            </div>

            {/* Name */}
            <h3 className="font-display text-xl font-bold">
              <GradientText>{item.name}</GradientText>
            </h3>

            {/* Tagline */}
            <p className="mt-1 text-sm text-text-secondary">{item.tagline}</p>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {item.description}
            </p>

            {/* Progress bar (non-active items) */}
            {!isActive && (
              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
                  <span>Development progress</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-bg-primary">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Feature tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {item.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-border-custom bg-bg-secondary px-3 py-1 text-xs text-text-secondary"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-5">
              {isActive ? (
                <a
                  href="https://neobytewriter.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open NeoByteWriter
                </a>
              ) : (
                <Link
                  href={`/divisions/${slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border-custom bg-bg-secondary px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-brand-from/30 hover:text-text-primary"
                >
                  Join waitlist
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

// ─── Page ─────────────────────────────────────────────────────
export default function RoadmapPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-primary">
      <FloatingOrbs />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="section-glow-mixed mesh-pattern relative pb-12 pt-32 md:pb-16 md:pt-40"
        aria-label="Roadmap hero"
      >
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <ScrollReveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-custom bg-bg-card/60 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-sm">
              <Rocket className="h-4 w-4 text-accent" />
              Our Journey
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="font-display text-4xl font-bold text-text-primary md:text-5xl lg:text-6xl">
              <GradientText>Roadmap</GradientText>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
              Four divisions. One creative universe. Here&apos;s where we are
              and where we&apos;re going — built step by step, powered by AI and
              human imagination.
            </p>
          </ScrollReveal>

          {/* Status summary pills */}
          <ScrollReveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />1 Active
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1 text-blue-400">
                <Clock className="h-3.5 w-3.5" />1 In Development
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-amber-400">
                <Calendar className="h-3.5 w-3.5" />2 Planned
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <section
        className="relative mx-auto max-w-2xl px-4 py-16 md:py-20"
        aria-label="Division timeline"
      >
        <div className="relative">
          {ROADMAP_ITEMS.map((item, index) => (
            <TimelineItem
              key={item.name}
              item={item}
              index={index}
              isLast={index === ROADMAP_ITEMS.length - 1}
            />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="relative pb-24 pt-0">
        <ScrollReveal>
          <div className="mx-auto max-w-xl px-4 text-center">
            <div className="rounded-2xl border border-border-custom bg-bg-card/60 p-8 backdrop-blur-sm">
              <p className="font-display text-lg font-semibold text-text-primary">
                Stay in the loop
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Join the waitlist for upcoming divisions and be the first to
                know when they launch.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/divisions/forge"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
                >
                  Forge waitlist
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/divisions/games"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  Games waitlist
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/divisions/vision"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
                >
                  Vision waitlist
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
