import { Suspense } from 'react'
import VideoHero from '@/components/sections/VideoHero'
import Stats from '@/components/sections/Stats'
import SocialProof from '@/components/sections/SocialProof'
import Roadmap from '@/components/sections/Roadmap'
import VisionSection from '@/components/sections/VisionSection'
import ReferralProgram from '@/components/sections/ReferralProgram'
import Countdown from '@/components/sections/Countdown'
import NewsletterArchive from '@/components/sections/NewsletterArchive'
import Changelog from '@/components/sections/Changelog'

export default function Home() {
  return (
    <>
      <section className="snap-section" aria-label="Hero">
        <Suspense>
          <VideoHero />
        </Suspense>
      </section>
      <section className="snap-section" aria-label="Stats">
        <Stats />
      </section>
      <section className="snap-section" aria-label="Social proof">
        <SocialProof />
      </section>
      <section className="snap-section" aria-label="Roadmap">
        <Suspense>
          <Roadmap />
        </Suspense>
      </section>
      <section className="snap-section" aria-label="Vision">
        <Suspense>
          <VisionSection />
        </Suspense>
      </section>
<section className="snap-section" aria-label="Referral Program">
        <Suspense>
          <ReferralProgram />
        </Suspense>
      </section>
      <section className="snap-section" aria-label="Countdown">
        <Countdown />
      </section>
      <section className="snap-section" aria-label="Newsletter">
        <Suspense>
          <NewsletterArchive />
        </Suspense>
      </section>
      <section className="snap-section" aria-label="Changelog">
        <Suspense>
          <Changelog />
        </Suspense>
      </section>
    </>
  )
}
