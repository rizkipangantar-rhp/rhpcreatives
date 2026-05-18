import ServicePageHero from '@/components/ServicePageHero'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'
import StickyServiceBar from '@/components/StickyServiceBar'
import FloatingScrollBtn from '@/components/FloatingScrollBtn'

export default function LayananDigital() {
  return (
    <>
      <ServicePageHero pageType="layananDigital" />
      <Services filter="digital" showHeader={false} />
      <Pricing filter="digital" />
      <StickyServiceBar />
      <FloatingScrollBtn />
    </>
  )
}
