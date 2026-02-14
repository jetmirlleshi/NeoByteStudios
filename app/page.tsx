import Hero from '@/components/sections/Hero'
import DivisionsSection from '@/components/sections/DivisionsSection'
import VisionSection from '@/components/sections/VisionSection'
import IPShowcase from '@/components/sections/IPShowcase'
import SectionDivider from '@/components/ui/SectionDivider'

export default function Home() {
  return (
    <>
      <div className="snap-section">
        <Hero />
      </div>
      <SectionDivider variant="wave" />
      <div className="snap-section">
        <DivisionsSection />
      </div>
      <SectionDivider variant="gradient" />
      <div className="snap-section">
        <VisionSection />
      </div>
      <SectionDivider variant="wave" flip />
      <div className="snap-section">
        <IPShowcase />
      </div>
    </>
  )
}
