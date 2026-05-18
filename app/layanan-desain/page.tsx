import ServicePageHero from '@/components/ServicePageHero'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'
import StickyServiceBar from '@/components/StickyServiceBar'
import FloatingScrollBtn from '@/components/FloatingScrollBtn'

export default function LayananDesain() {
  return (
    <>
      <ServicePageHero pageType="layananDesain" />
      <Services filter="design" showHeader={false} />
      <Pricing filter="design" />
      <StickyServiceBar />
      <FloatingScrollBtn />
    </>
  )
}
