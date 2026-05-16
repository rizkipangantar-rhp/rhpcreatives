import PageHero from '@/components/PageHero'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'

export default function LayananDesain() {
  return (
    <>
      <PageHero pageKey="layananDesain" />
      <Services filter="design" showHeader={false} />
      <Pricing filter="design" />
    </>
  )
}
