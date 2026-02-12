import { DIVISIONS } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import DivisionCard from '@/components/ui/DivisionCard'
import TiltCard from '@/components/ui/TiltCard'

/**
 * Divisions section -- showcases all four NeoByteStudios divisions in a
 * responsive 2-column grid. Each card fades in with a staggered scroll reveal.
 *
 * Active cards get a 3D tilt effect via the `TiltCard` wrapper.
 * Coming-soon cards get a shimmer scan-line effect instead (CSS-only).
 *
 * This is a **server component**. Client interactivity is handled by the
 * `ScrollReveal` and `TiltCard` wrappers.
 */
export default function DivisionsSection() {
  /* Track a separate index for coming-soon cards so their shimmer delay staggers */
  let comingSoonIndex = 0

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
          {DIVISIONS.map((division, index) => {
            const isActive = division.status === 'active'
            const shimmerIdx = isActive ? 0 : comingSoonIndex++

            return (
              <ScrollReveal key={division.slug} delay={index * 0.1}>
                <TiltCard
                  enabled={isActive}
                  className="relative rounded-xl"
                >
                  <DivisionCard
                    division={division}
                    shimmerIndex={shimmerIdx}
                  />
                </TiltCard>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
