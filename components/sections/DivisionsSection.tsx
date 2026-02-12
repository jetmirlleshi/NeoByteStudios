import { DIVISIONS } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import DivisionCard from '@/components/ui/DivisionCard'

/**
 * Divisions section -- showcases all four NeoByteStudios divisions in a
 * responsive 2-column grid. Each card fades in with a staggered scroll reveal.
 *
 * This is a **server component**. The client-side scroll animation is handled
 * entirely by the `ScrollReveal` wrapper, and hover interactions live inside
 * `DivisionCard`.
 */
export default function DivisionsSection() {
  return (
    <section id="divisions" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        {/* ── Section header ──────────────────────────────────────── */}
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            <GradientText>Our Divisions</GradientText>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Four pillars, one vision. Each division serves a unique role in
            bringing our intellectual properties to life.
          </p>
        </div>

        {/* ── Division cards grid ─────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {DIVISIONS.map((division, index) => (
            <ScrollReveal key={division.slug} delay={index * 0.1}>
              <DivisionCard division={division} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
