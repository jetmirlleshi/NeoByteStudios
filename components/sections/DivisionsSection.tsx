import { DIVISIONS } from '@/lib/constants'
import GradientText from '@/components/ui/GradientText'
import ScrollReveal from '@/components/ui/ScrollReveal'
import DivisionCard from '@/components/ui/DivisionCard'
import TiltCard from '@/components/ui/TiltCard'
import FloatingOrbs from '@/components/ui/FloatingOrbs'

export default function DivisionsSection() {
  let comingSoonIndex = 0

  return (
    <section id="divisions" className="relative overflow-hidden py-32 md:py-48">
      <FloatingOrbs seed={42} />
      <div className="relative mx-auto max-w-6xl px-4">
        {/* ── Section header ──────────────────────────────────────── */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              <GradientText>Our Divisions</GradientText>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-text-secondary text-lg">
              Four pillars, one vision. Each division serves a unique role in
              bringing our intellectual properties to life.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Bento grid layout — Writer (active) gets featured spot ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
          {DIVISIONS.map((division, index) => {
            const isActive = division.status === 'active'
            const shimmerIdx = isActive ? 0 : comingSoonIndex++

            // Writer (active) spans 4 cols, 2 rows — featured card
            const isWriter = division.slug === 'writer'
            const gridClass = isWriter
              ? 'md:col-span-4 md:row-span-2'
              : 'md:col-span-2'

            return (
              <ScrollReveal key={division.slug} delay={index * 0.1}>
                <div className={gridClass + ' h-full'}>
                  <TiltCard
                    enabled={isActive}
                    className="relative rounded-2xl h-full"
                  >
                    <DivisionCard
                      division={division}
                      shimmerIndex={shimmerIdx}
                      featured={isWriter}
                    />
                  </TiltCard>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
