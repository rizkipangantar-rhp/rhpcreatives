import type { Metadata } from 'next'
import ServicePageHero from '@/components/ServicePageHero'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'
import StickyServiceBar from '@/components/StickyServiceBar'
import FloatingScrollBtn from '@/components/FloatingScrollBtn'

export const metadata: Metadata = {
  title: 'Layanan Desain',
  description: 'Jasa desain grafis profesional: Logo, Poster, Banner, Konten Media Sosial, dan lebih banyak lagi. Kreasi visual yang memukau untuk brand Anda.',
  openGraph: {
    url: 'https://rhpcreatives.com/layanan-desain',
    title: 'Layanan Desain | RHP Creatives',
    description: 'Jasa desain grafis profesional: Logo, Poster, Banner, Konten Media Sosial, dan lebih banyak lagi.',
  },
  alternates: { canonical: 'https://rhpcreatives.com/layanan-desain' },
}

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
