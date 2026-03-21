import type { Metadata } from 'next'
import { DIVISIONS } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import TiltCard from '@/components/ui/TiltCard'
import DivisionCard from '@/components/ui/DivisionCard'
import { User, Layers, Sparkles, Brain, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// ─── SEO Metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'About — NeoByteStudios',
  description:
    'One creator. Four divisions. Infinite worlds. Learn the story behind NeoByteStudios — an AI-first creative studio built to amplify a single human imagination.',
  openGraph: {
    title: 'About NeoByteStudios — Where AI Meets Imagination',
    description:
      'One creator. Four divisions. Infinite worlds. The story behind NeoByteStudios and the vision that powers it.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About NeoByteStudios',
    description:
      'One creator. Four divisions. Infinite worlds. The story behind NeoByteStudios.',
  },
}

// ─── Stats data ───────────────────────────────────────────────────────────────
const ABOUT_STATS = [
  {
    value: '1',
    label: 'Creator',
    description: 'Una mente umana al centro di tutto',
    icon: User,
    color: '#7c3aed',
  },
  {
    value: '4',
    label: 'Divisions',
    description: 'Quattro pilastri creativi, un\'unica visione',
    icon: Layers,
    color: '#3b82f6',
  },
  {
    value: '∞',
    label: 'Possibilities',
    description: 'Mondi da costruire, storie da raccontare',
    icon: Sparkles,
    color: '#06d6a0',
  },
  {
    value: 'AI',
    label: 'First',
    description: 'Ogni tool, ogni workflow — AI-powered',
    icon: Brain,
    color: '#f59e0b',
  },
] as const

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="about-hero"
        aria-label="About NeoByteStudios"
        className="section-glow-mixed mesh-pattern relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-32 text-center"
      >
        {/* Decorative blurred orbs */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-brand-from/20 blur-[120px]" />
          <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-accent/15 blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-to/10 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Badge */}
          <ScrollReveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-from/30 bg-brand-from/10 px-4 py-1.5 text-sm font-medium text-text-secondary backdrop-blur-sm">
              <Zap size={14} className="text-accent" aria-hidden="true" />
              AI-First Creative Studio
            </div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal delay={0.1}>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-text-primary md:text-7xl">
              Where{' '}
              <GradientText from="var(--brand-from)" to="var(--accent)">
                AI Meets
              </GradientText>
              <br />
              Imagination
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              NeoByteStudios è uno studio creativo AI-first gestito da un singolo
              creatore — un esperimento per dimostrare che{' '}
              <span className="text-text-primary font-medium">
                un&apos;unica mente amplificata dall&apos;AI
              </span>{' '}
              può costruire interi universi creativi.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── LA STORIA ───────────────────────────────────────────────────── */}
      <section
        id="about-story"
        aria-label="La storia di NeoByteStudios"
        className="relative px-4 py-24"
      >
        {/* Decorative orb */}
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-from/10 blur-[140px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            {/* Text content */}
            <div>
              <ScrollReveal direction="left">
                <span className="font-mono text-sm font-medium uppercase tracking-widest text-accent">
                  La Storia
                </span>
                <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-text-primary md:text-5xl">
                  Un creatore.
                  <br />
                  <GradientText>Infinite storie.</GradientText>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1} direction="left">
                <div className="mt-8 space-y-5 text-text-secondary leading-relaxed">
                  <p>
                    NeoByteStudios nasce da una domanda semplice:{' '}
                    <span className="italic text-text-primary">
                      &ldquo;Cosa può creare davvero una persona sola, con l&apos;AI come moltiplicatore?&rdquo;
                    </span>
                  </p>
                  <p>
                    Jetmir — fondatore e unico membro dello studio — ha iniziato come
                    scrittore di fantasy. Frustrato dagli strumenti esistenti, ha costruito
                    il primo tool per se stesso: <span className="text-text-primary font-medium">NeoByteWriter</span>,
                    un assistente AI per autori fantasy che tiene traccia di personaggi,
                    lore e trame senza interrompere il flusso creativo.
                  </p>
                  <p>
                    Quello che è iniziato come un tool personale è diventato la prova
                    di un concetto più grande: con l&apos;AI come co-pilota, un singolo
                    creatore può costruire non solo tool, ma interi ecosistemi creativi.
                    Così sono nate le altre divisioni — ciascuna un pilastro di una
                    visione cross-mediale che abbraccia narrativa, IP originali, videogiochi
                    e contenuto visivo.
                  </p>
                  <p>
                    NeoByteStudios non è un&apos;agenzia. Non è un team.
                    È un <span className="text-text-primary font-medium">esperimento in corso</span> —
                    per capire dove arriva l&apos;immaginazione quando l&apos;AI rimuove i limiti.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} direction="left">
                <Link
                  href="/#divisions"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-all duration-200 hover:gap-3 hover:text-text-primary"
                >
                  Esplora le divisioni
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </ScrollReveal>
            </div>

            {/* Visual card */}
            <ScrollReveal delay={0.15} direction="right">
              <TiltCard className="relative rounded-2xl">
                <div
                  className="glass-card relative overflow-hidden rounded-2xl p-8"
                  style={{
                    borderLeft: '2px solid var(--brand-from)',
                    borderTop: '1px solid rgba(124,58,237,0.3)',
                  }}
                >
                  {/* Top glow line */}
                  <div
                    className="pointer-events-none absolute -top-px left-1/2 h-px w-3/4 -translate-x-1/2"
                    style={{ background: 'linear-gradient(90deg, transparent, #7c3aed60, transparent)' }}
                    aria-hidden="true"
                  />

                  {/* Founder info */}
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
                      style={{ background: 'linear-gradient(135deg, #7c3aed22, #7c3aed08)', border: '1px solid #7c3aed35' }}
                      aria-hidden="true"
                    >
                      👤
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold text-text-primary">Jetmir</p>
                      <p className="text-sm text-text-secondary">Founder & Solo Creator</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                        <span className="text-xs text-accent">Building in public</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-px bg-white/5" aria-hidden="true" />

                  {/* Manifesto quote */}
                  <blockquote className="mt-6">
                    <p className="text-base italic leading-relaxed text-text-secondary">
                      &ldquo;L&apos;AI non sostituisce la creatività umana — la moltiplica.
                      Un singolo creatore oggi può fare quello che ieri richiedeva un intero studio.&rdquo;
                    </p>
                  </blockquote>

                  {/* Tags */}
                  <div className="mt-6 flex flex-wrap gap-2" aria-label="Tecnologie e strumenti">
                    {['Next.js', 'AI Tools', 'Framer Motion', 'Fantasy Writing', 'Indie Dev'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── LE DIVISIONI ────────────────────────────────────────────────── */}
      <section
        id="about-divisions"
        aria-label="Le quattro divisioni di NeoByteStudios"
        className="section-glow-mixed mesh-pattern relative px-4 py-24"
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-brand-to/15 blur-[120px]" />
          <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-16 text-center">
              <span className="font-mono text-sm font-medium uppercase tracking-widest text-accent">
                Le Divisioni
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold text-text-primary md:text-5xl">
                Quattro pilastri.
                <br />
                <GradientText from="var(--brand-from)" to="var(--brand-to)">
                  Un&apos;unica visione.
                </GradientText>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
                Ogni divisione è un universo creativo indipendente — progettata per crescere
                insieme alle altre in un ecosistema cross-mediale.
              </p>
            </div>
          </ScrollReveal>

          {/* Division cards grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIVISIONS.map((division, i) => (
              <ScrollReveal key={division.slug} delay={i * 0.08}>
                <DivisionCard division={division} shimmerIndex={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section
        id="about-stats"
        aria-label="I numeri di NeoByteStudios"
        className="relative px-4 py-24"
      >
        {/* Decorative orb */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-16 text-center">
              <span className="font-mono text-sm font-medium uppercase tracking-widest text-accent">
                In Numeri
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold text-text-primary md:text-5xl">
                <GradientText from="var(--accent)" to="var(--brand-from)">
                  Small studio.
                </GradientText>
                <br />
                Infinite ambition.
              </h2>
            </div>
          </ScrollReveal>

          {/* Stat cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <TiltCard className="h-full rounded-2xl">
                    <div
                      className="glass-card group relative flex h-full flex-col items-center overflow-hidden rounded-2xl p-8 text-center transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        borderLeft: `2px solid ${stat.color}60`,
                        borderTop: `1px solid ${stat.color}30`,
                      }}
                    >
                      {/* Top glow line */}
                      <div
                        className="pointer-events-none absolute -top-px left-1/2 h-px w-3/4 -translate-x-1/2 opacity-60"
                        style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }}
                        aria-hidden="true"
                      />

                      {/* Icon */}
                      <div
                        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}08)`,
                          border: `1px solid ${stat.color}35`,
                          boxShadow: `0 0 20px ${stat.color}12`,
                        }}
                        aria-hidden="true"
                      >
                        <Icon size={22} style={{ color: stat.color }} />
                      </div>

                      {/* Value */}
                      <div
                        className="font-display text-5xl font-bold leading-none"
                        style={{ color: stat.color }}
                        aria-label={`${stat.value} ${stat.label}`}
                      >
                        {stat.value}
                      </div>

                      {/* Label */}
                      <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-text-primary">
                        {stat.label}
                      </div>

                      {/* Separator */}
                      <div
                        className="my-4 h-px w-0 transition-all duration-500 group-hover:w-full"
                        style={{ background: `linear-gradient(to right, ${stat.color}4D, transparent)` }}
                        aria-hidden="true"
                      />

                      {/* Description */}
                      <p className="text-xs leading-relaxed text-text-muted">
                        {stat.description}
                      </p>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINALE ──────────────────────────────────────────────────── */}
      <section
        id="about-cta"
        aria-label="Unisciti alla community"
        className="section-glow-mixed relative overflow-hidden px-4 py-24 text-center"
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-from/15 blur-[100px]" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          <ScrollReveal>
            <h2 className="font-display text-4xl font-bold text-text-primary md:text-5xl">
              Pronto a esplorare{' '}
              <GradientText from="var(--brand-from)" to="var(--accent)">
                i mondi
              </GradientText>
              ?
            </h2>
            <p className="mx-auto mt-5 text-base leading-relaxed text-text-secondary">
              Inizia con NeoByteWriter — il primo strumento AI per autori fantasy.
              Gratis, senza limiti artificiali.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://neobytewriter.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-brand-from/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                Prova NeoByteWriter
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-text-secondary backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-from focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                Torna alla Home
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
