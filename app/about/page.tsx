import type { Metadata } from 'next'
import Link from 'next/link'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description:
    'The vision behind NeoByteStudios: one creator, AI-amplified, building cross-media universes that span books, games, and visual media.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-24 md:py-32">
      {/* ── Page title ──────────────────────────────────────────── */}
      <ScrollReveal>
        <h1 className="text-3xl md:text-5xl font-bold">
          <GradientText>About NeoByteStudios</GradientText>
        </h1>
      </ScrollReveal>

      {/* ── Philosophy paragraphs ───────────────────────────────── */}
      <div className="mt-10 space-y-6">
        <ScrollReveal delay={0.1}>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed">
            NeoByteStudios was born from a simple conviction: with the right
            tools, one imagination is enough. What used to require entire teams
            — writers, designers, engineers, producers — can now be orchestrated
            by a single creator empowered by artificial intelligence. This
            studio exists to prove that model, building original intellectual
            properties that rival the depth and scope of traditional studios.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed">
            Every IP is designed from day one to span books, games, visual
            media, and licensing. There are no adaptations as an afterthought —
            every world is born multi-platform. The story comes first, and from
            that story a universe unfolds across every medium it naturally fits.
            This cross-media DNA is baked into the creative process itself, not
            bolted on later.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed">
            AI is not the creator — it is the amplifier. It handles the
            operational complexity so the human can focus on what matters: the
            story, the vision, the soul of the work. Every line of prose, every
            design decision, every game mechanic is guided by human intent. AI
            clears the path; the human walks it.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed">
            This is just the beginning. The first universe is being forged, and
            with it, a new model for independent creation. NeoByteStudios is
            not a studio that happens to use AI — it is a studio that could not
            exist without it. And that changes everything about what one person
            can build.
          </p>
        </ScrollReveal>
      </div>

      {/* ── Back link ───────────────────────────────────────────── */}
      <ScrollReveal delay={0.5}>
        <div className="mt-16">
          <Link
            href="/"
            className="text-text-muted hover:text-text-primary transition-colors duration-200 text-sm"
          >
            &larr; Back to Home
          </Link>
        </div>
      </ScrollReveal>
    </section>
  )
}
