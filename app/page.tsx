import Hero from '@/components/sections/Hero'
import DivisionsSection from '@/components/sections/DivisionsSection'
import VisionSection from '@/components/sections/VisionSection'
import IPShowcase from '@/components/sections/IPShowcase'
import SectionDivider from '@/components/ui/SectionDivider'

export default function Home() {
  return (
    <>
      <Hero />
      <SectionDivider variant="wave" />
      <DivisionsSection />
      <SectionDivider variant="gradient" />
      <VisionSection />
      <SectionDivider variant="wave" flip />
      <IPShowcase />
    </>
  )
}
