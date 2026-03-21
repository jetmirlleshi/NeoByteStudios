import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles, Layers, Telescope, BookOpen, Gamepad2, Eye, Zap, Globe, Star } from 'lucide-react'
import { SITE } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import FloatingOrbs from '@/components/ui/FloatingOrbs'

export const metadata: Metadata = {
  title: `Our Vision — ${SITE.name}`,
  description:
    'One creator, AI-amplified. Learn how NeoByteStudios builds cross-media universes — books, games, and visual media — powered by artificial intelligence.',
  alternates: {
    canonical: '/vision',
  },
  openGraph: {
    title: `Our Vision — ${SITE.name}`,
    description:
      'One creator, AI-amplified. Building universes that span books, games, and visual media.',
    url: '/vision',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Our Vision — ${SITE.name}`,
    description:
      'One creator, AI-amplified. Building universes that span books, games, and visual media.',
  },
}

/* ─── Static content data ─────────────────────────────────────── */

const AI_PRINCIPLES = [
  {
    icon: Sparkles,
    title: 'AI as Co-Creator',
    description:
      'We treat AI not as a shortcut but as a creative partner — a tool that expands what a single mind can imagine and ship.',
    color: 'from-violet-500 to-violet-700',
    glow: 'rgba(124, 58, 237, 0.2)',
  },
  {
    icon: Zap,
    title: 'Speed Without Compromise',
    description:
      'AI collapses the production cycle from years to months, letting a one-person studio punch far above its weight.',
    color: 'from-blue-500 to-blue-700',
    glow: 'rgba(59, 130, 246, 0.2)',
  },
  {
    icon: Star,
    title: 'Human Heart, Machine Scale',
    description:
      'Every story, every world still begins with a human idea. AI scales the craft — it never replaces the soul.',
    color: 'from-emerald-500 to-emerald-700',
    glow: 'rgba(16, 185, 129, 0.2)',
  },
]

const MEDIA_PILLARS = [
  {
    icon: BookOpen,
    label: 'Books & Stories',
    description: 'The universe is born on the page — rich lore, deep characters, immersive worlds.',
    color: 'from-violet-500 to-violet-600',
    border: 'border-division-writer/30',
    glow: 'rgba(124, 58, 237, 0.15)',
  },
  {
    icon: Gamepad2,
    label: 'Games',
    description: 'Players step inside the story — interactive worlds built on the same IP canon.',
    color: 'from-emerald-500 to-emerald-600',
    border: 'border-division-games/30',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  {
    icon: Eye,
    label: 'Visual Media',
    description: 'Concept art, motion content, and visual licensing bring the universe to life visually.',
    color: 'from-amber-500 to-orange-600',
    border: 'border-division-vision/30',
    glow: 'rgba(245, 158, 11, 0.15)',
  },
]

const FUTURE_MILESTONES = [
  {
    year: '2026',
    title: 'First Universe Ships',
    description: 'NeoByteWriter reaches full release — the first NeoByteStudios IP goes public in book form.',
    active: true,
  },
  {
    year: '2027',
    title: 'Cross-Media Expansion',
    description: 'NeoByteForge and NeoByteGames launch, bringing the first IP into interactive and visual form.',
    active: false,
  },
  {
    year: '2028+',
    title: 'Licensing & Beyond',
    description: 'NeoByteVision opens IP licensing to other creators — the model becomes a platform.',
    active: false,
  },
]

/* ─── Page ────────────────────────────────────────────────────── */

export default function VisionPage() {
  return (
    <>
      {/* ── Structured Data ─────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `Our Vision — ${SITE.name}`,
            description:
              'One creator, AI-amplified. Building universes that span books, games, and visual media.',
            url: `${SITE.url}/vision`,
            isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
          }),
        }}
      />

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-28 md:py-36"
        aria-label="Vision hero"
      >
        <FloatingOrbs seed={7} />

        {/* Blurred glow circles */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute -left-48 top-0 h-[600px] w-[600px] rounded-full bg-brand-from/15 blur-[140px]" />
          <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-brand-to/10 blur-[140px]" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]" />
        </div>

        {/* Subtle mesh grid */}
        <div className="mesh-pattern absolute inset-0 z-0 opacity-30" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          {/* Eyebrow badge */}
          <ScrollReveal delay={0}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-from/30 bg-brand-from/10 px-4 py-1.5 text-sm font-medium text-brand-from">
              <Telescope className="h-4 w-4" />
              Our Vision
            </div>
          </ScrollReveal>

          {/* Main headline */}
          <ScrollReveal delay={0.1}>
            <h1 className="font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl lg:text-7xl">
              <GradientText>One creator,</GradientText>
              <br />
              <span className="text-text-primary">AI-amplified.</span>
            </h1>
          </ScrollReveal>

          {/* Manifesto */}
          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Building universes that span{' '}
              <span className="font-semibold text-text-primary">books</span>,{' '}
              <span className="font-semibold text-text-primary">games</span>, and{' '}
              <span className="font-semibold text-text-primary">visual media</span> — all from a single creative mind, amplified by artificial intelligence.
            </p>
          </ScrollReveal>

          {/* Manifesto quote */}
          <ScrollReveal delay={0.3}>
            <blockquote className="mx-auto mt-10 max-w-xl rounded-2xl border border-border-custom bg-bg-card/60 px-6 py-5 backdrop-blur-sm">
              <p className="text-base font-light italic leading-relaxed text-text-secondary md:text-lg">
                &ldquo;AI doesn&rsquo;t replace creativity — it amplifies it.&rdquo;
              </p>
              <footer className="mt-2 text-sm text-text-muted">— NeoByteStudios Manifesto</footer>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          AI-FIRST PHILOSOPHY
      ════════════════════════════════════════════════════════ */}
      <section
        className="section-glow-violet relative overflow-hidden py-24"
        aria-labelledby="ai-philosophy-heading"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-from/10 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2
                id="ai-philosophy-heading"
                className="font-display text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl"
              >
                <GradientText>AI-First</GradientText>{' '}
                <span className="text-text-primary">Philosophy</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                We didn't build AI into our workflow as an afterthought. We built our entire studio around the premise that AI changes what one person can create.
              </p>
            </div>
          </ScrollReveal>

          {/* 3-column principles grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {AI_PRINCIPLES.map((principle, i) => {
              const Icon = principle.icon
              return (
                <ScrollReveal key={principle.title} delay={i * 0.1}>
                  <article
                    className="group relative overflow-hidden rounded-2xl border border-border-custom bg-bg-card p-7 transition-all duration-300 hover:border-brand-from/30 hover:shadow-lg"
                    style={{
                      boxShadow: `0 0 0 0 ${principle.glow}`,
                      transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    }}
                  >
                    {/* Card shimmer on hover */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(ellipse at top left, ${principle.glow} 0%, transparent 60%)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Icon */}
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${principle.color}`}
                    >
                      <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>

                    <h3 className="mb-3 font-display text-lg font-bold text-text-primary">
                      {principle.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {principle.description}
                    </p>
                  </article>
                </ScrollReveal>
              )
            })}
          </div>

          {/* Divider quote */}
          <ScrollReveal delay={0.3}>
            <div className="mt-16 text-center">
              <p className="font-display text-xl font-semibold text-text-primary md:text-2xl">
                A one-person studio that ships like a team of ten.
              </p>
              <p className="mt-2 text-text-secondary">
                That&rsquo;s the promise of building AI-first from day one.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CROSS-MEDIA UNIVERSES
      ════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24"
        aria-labelledby="cross-media-heading"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-brand-to/10 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2
                id="cross-media-heading"
                className="font-display text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl"
              >
                Cross-Media{' '}
                <GradientText from="var(--accent)" to="var(--brand-to)">Universes</GradientText>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                A story that lives only in one medium is a story half-told. We build IP designed from the start to expand across every creative format.
              </p>
            </div>
          </ScrollReveal>

          {/* Flow diagram: IP Hub → 3 media pillars */}
          <div className="flex flex-col items-center gap-8">
            {/* Central IP Hub */}
            <ScrollReveal>
              <div className="relative flex items-center justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-from to-brand-to shadow-glow-brand">
                  <span className="font-display text-3xl font-bold text-white">IP</span>
                  {/* Pulsing ring */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
                      animation: 'pulse 3s ease-in-out infinite',
                    }}
                    aria-hidden="true"
                  />
                </div>
                <p className="absolute -bottom-7 font-display text-xs font-semibold uppercase tracking-widest text-text-muted">
                  Core Universe
                </p>
              </div>
            </ScrollReveal>

            {/* Connecting lines */}
            <ScrollReveal delay={0.1}>
              <div className="flex items-center gap-0">
                {/* Left branch */}
                <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-brand-from/60 md:w-40" />
                {/* Center vertical */}
                <div className="flex flex-col items-center">
                  <div className="h-8 w-[2px] bg-gradient-to-b from-brand-from/60 to-brand-to/60" />
                </div>
                {/* Right branch */}
                <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-brand-to/60 md:w-40" />
              </div>
            </ScrollReveal>

            {/* Media pillars */}
            <div className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
              {MEDIA_PILLARS.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <ScrollReveal key={pillar.label} delay={i * 0.12}>
                    <article
                      className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border ${pillar.border} bg-bg-card p-7 text-center transition-all duration-300 hover:shadow-lg`}
                      style={{
                        boxShadow: `0 0 0 0 ${pillar.glow}`,
                      }}
                    >
                      {/* Hover glow */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(ellipse at center top, ${pillar.glow} 0%, transparent 65%)`,
                        }}
                        aria-hidden="true"
                      />
                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.color}`}
                      >
                        <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="mb-2 font-display text-base font-bold text-text-primary">
                        {pillar.label}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {pillar.description}
                      </p>
                    </article>
                  </ScrollReveal>
                )
              })}
            </div>

            {/* Output label */}
            <ScrollReveal delay={0.4}>
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-[2px] bg-gradient-to-b from-brand-to to-accent" aria-hidden="true" />
                <div className="flex items-center gap-2 rounded-full border border-border-custom bg-bg-card px-5 py-2.5">
                  <Globe className="h-4 w-4 text-accent" aria-hidden="true" />
                  <span className="font-display text-sm font-semibold text-text-primary">
                    Cross-Media Universe
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Explanatory text */}
          <ScrollReveal delay={0.2}>
            <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border-custom bg-bg-card/50 p-8 backdrop-blur-sm">
              <h3 className="mb-4 font-display text-xl font-bold text-text-primary">
                Why cross-media?
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                The most enduring creative properties in history — Tolkien&rsquo;s Middle-earth, Miyazaki&rsquo;s worlds, the Marvel universe — live across multiple formats. Each medium adds a new layer of depth: novels build lore, games create agency, visual media creates emotional anchors.
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                At NeoByteStudios, every IP we create is designed with this in mind from day one. The lore is structured to be interactive. The characters are written to be playable. The world is illustrated to be licensable.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          THE FUTURE
      ════════════════════════════════════════════════════════ */}
      <section
        className="section-glow-mixed relative overflow-hidden py-24"
        aria-labelledby="future-heading"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-brand-from/15 blur-[130px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
        </div>
        <div className="mesh-pattern absolute inset-0 z-0 opacity-20" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2
                id="future-heading"
                className="font-display text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl"
              >
                The{' '}
                <GradientText from="var(--brand-from)" to="var(--accent)">Future</GradientText>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
                We&rsquo;re not building a product. We&rsquo;re building a model — proof that the AI era makes truly independent creative studios viable.
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <div className="relative mx-auto max-w-2xl">
            {/* Vertical line */}
            <div
              className="absolute left-4 top-0 h-full w-[2px] bg-gradient-to-b from-brand-from via-brand-to to-accent md:left-1/2 md:-translate-x-px"
              aria-hidden="true"
            />

            <ol className="space-y-10">
              {FUTURE_MILESTONES.map((milestone, i) => (
                <ScrollReveal key={milestone.year} delay={i * 0.15}>
                  <li className="relative flex gap-6 pl-12 md:pl-0">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 md:left-1/2 md:-translate-x-1/2 ${
                        milestone.active
                          ? 'border-brand-from bg-brand-from shadow-glow-brand'
                          : 'border-border-custom bg-bg-card'
                      }`}
                      aria-hidden="true"
                    >
                      {milestone.active && (
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Content card — alternates sides on desktop */}
                    <div
                      className={`w-full rounded-2xl border border-border-custom bg-bg-card p-6 md:w-[calc(50%-2rem)] ${
                        i % 2 === 0 ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'
                      }`}
                    >
                      <span
                        className={`mb-2 inline-block font-display text-xs font-bold uppercase tracking-widest ${
                          milestone.active ? 'text-brand-from' : 'text-text-muted'
                        }`}
                      >
                        {milestone.year}
                        {milestone.active && (
                          <span className="ml-2 rounded-full bg-brand-from/15 px-2 py-0.5 text-[10px]">
                            Active
                          </span>
                        )}
                      </span>
                      <h3 className="mb-2 font-display text-lg font-bold text-text-primary">
                        {milestone.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {milestone.description}
                      </p>
                    </div>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>

          {/* Closing statement */}
          <ScrollReveal delay={0.3}>
            <div className="mt-20 text-center">
              <p className="mx-auto max-w-2xl font-display text-xl font-semibold text-text-primary md:text-2xl">
                The solo creator era has arrived.
                <br />
                <GradientText>We&rsquo;re just the first chapter.</GradientText>
              </p>
            </div>
          </ScrollReveal>

          {/* CTA row */}
          <ScrollReveal delay={0.4}>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="https://neobytewriter.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-7 py-3.5 font-semibold text-white shadow-glow-brand transition-all duration-300 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from"
              >
                Start Building Your Universe
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#roadmap"
                className="inline-flex items-center gap-2 rounded-xl border border-border-custom bg-bg-card px-7 py-3.5 font-semibold text-text-primary transition-all duration-300 hover:border-brand-from/50 hover:text-brand-from focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from"
              >
                <Layers className="h-4 w-4" aria-hidden="true" />
                See the Roadmap
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
