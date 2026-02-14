import type { Metadata } from 'next'
import Link from 'next/link'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import CountUp from '@/components/ui/CountUp'
import FloatingOrbs from '@/components/ui/FloatingOrbs'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description:
    'The vision behind NeoByteStudios: one creator, AI-amplified, building cross-media universes that span books, games, and visual media.',
  alternates: {
    canonical: '/about',
  },
}

const TIMELINE = [
  { year: '2024', title: 'The Spark', description: 'NeoByteStudios is founded with a radical idea: one creator, amplified by AI, can rival entire studios.' },
  { year: '2025', title: 'NeoByteWriter', description: 'The first division launches — an AI-powered writing tool designed for fantasy authors and worldbuilders.' },
  { year: '2026', title: 'The First Universe', description: 'Our debut IP enters production — a fantasy world built for cross-media from day zero.' },
  { year: 'Next', title: 'Forge, Games, Vision', description: 'The remaining divisions activate, completing the four-pillar ecosystem for IP creation.' },
]

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden">
      <FloatingOrbs seed={77} />

      <div className="relative max-w-4xl mx-auto px-4 py-32 md:py-48">
        {/* ── Page title ──────────────────────────────────────────── */}
        <ScrollReveal>
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            <GradientText>About NeoByteStudios</GradientText>
          </h1>
        </ScrollReveal>

        {/* ── Stats bar ───────────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-6 rounded-2xl glass-card relative">
            <CountUp end={4} label="Divisions" />
            <CountUp end={1} label="Active" />
            <CountUp end={2024} label="Founded" duration={2500} />
            <CountUp end={100} suffix="%" label="AI-Powered" />
          </div>
        </ScrollReveal>

        {/* ── Styled pull quote ────────────────────────────────────── */}
        <ScrollReveal delay={0.15}>
          <blockquote className="mt-16 relative pl-6 border-l-2 border-accent">
            <p className="text-xl md:text-2xl font-light text-text-secondary italic leading-relaxed">
              &ldquo;With the right tools, one imagination is enough.&rdquo;
            </p>
            <cite className="mt-3 block text-sm text-accent not-italic font-medium">
              — NeoByteStudios Manifesto
            </cite>
          </blockquote>
        </ScrollReveal>

        {/* ── Philosophy paragraphs ───────────────────────────────── */}
        <div className="mt-16 space-y-6">
          <ScrollReveal delay={0.2}>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              NeoByteStudios was born from a simple conviction: what used to
              require entire teams — writers, designers, engineers, producers —
              can now be orchestrated by a single creator empowered by artificial
              intelligence. This studio exists to prove that model, building
              original intellectual properties that rival the depth and scope of
              traditional studios.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              Every IP is designed from day one to span books, games, visual
              media, and licensing. There are no adaptations as an afterthought —
              every world is born multi-platform. The story comes first, and from
              that story a universe unfolds across every medium it naturally fits.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              AI is not the creator — it is the amplifier. It handles the
              operational complexity so the human can focus on what matters: the
              story, the vision, the soul of the work. Every line of prose, every
              design decision, every game mechanic is guided by human intent.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Visual Timeline ──────────────────────────────────────── */}
        <div className="mt-20">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-12">
              <GradientText>Our Journey</GradientText>
            </h2>
          </ScrollReveal>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[19px] top-0 bottom-0 w-px"
              style={{
                background: 'linear-gradient(to bottom, var(--brand-from), var(--accent), transparent)',
              }}
            />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <ScrollReveal key={item.year} delay={0.1 * i}>
                  <div className="flex gap-6 items-start">
                    {/* Timeline dot */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold font-display"
                        style={{
                          background: 'linear-gradient(135deg, var(--brand-from), var(--accent))',
                          boxShadow: '0 0 20px 4px rgba(124, 58, 237, 0.2)',
                        }}
                      >
                        {item.year === 'Next' ? '...' : item.year.slice(2)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-xs uppercase tracking-widest text-accent font-medium">
                          {item.year}
                        </span>
                        <h3 className="font-display text-lg font-bold text-text-primary">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* ── Back link ───────────────────────────────────────────── */}
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
