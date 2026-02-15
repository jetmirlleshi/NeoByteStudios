import { Suspense } from 'react'
import Hero from '@/components/sections/Hero'
import SocialProof from '@/components/sections/SocialProof'
import DivisionsSection from '@/components/sections/DivisionsSection'
import VisionSection from '@/components/sections/VisionSection'
import IPShowcase from '@/components/sections/IPShowcase'
import SectionDivider from '@/components/ui/SectionDivider'

export default function Home() {
  return (
    <>
      <section className="snap-section" aria-label="Hero">
        <Suspense>
          <Hero />
        </Suspense>
      </section>
      <section className="snap-section" aria-label="Social proof">
        <SocialProof />
      </section>
      <SectionDivider variant="wave" />
      <section className="snap-section" aria-label="Divisions">
        <Suspense>
          <DivisionsSection />
        </Suspense>
      </section>
      <SectionDivider variant="gradient" />
      <section className="snap-section" aria-label="Vision">
        <Suspense>
          <VisionSection />
        </Suspense>
      </section>
      <SectionDivider variant="wave" flip />
      <section className="snap-section" aria-label="IP Showcase">
        <Suspense>
          <IPShowcase />
        </Suspense>
      </section>
    </>
  )
}
