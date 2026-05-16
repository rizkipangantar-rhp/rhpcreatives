import PageHero from '@/components/PageHero'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'

export default function LayananDigital() {
  return (
    <>
      <PageHero pageKey="layananDigital" />
      <Services filter="digital" showHeader={false} />
      <Pricing filter="digital" />
    </>
  )
}
