import type { Metadata } from 'next'
import ServicePageHero from '@/components/ServicePageHero'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'
import StickyServiceBar from '@/components/StickyServiceBar'
import FloatingScrollBtn from '@/components/FloatingScrollBtn'

export const metadata: Metadata = {
  title: 'Layanan Digital',
  description: 'Jasa pembuatan Undangan Online, Landing Page, dan Website profesional. Desain modern, responsif, dan siap pakai. Lihat paket harga kami.',
  openGraph: {
    url: 'https://rhpcreatives.com/layanan-digital',
    title: 'Layanan Digital | RHP Creatives',
    description: 'Jasa pembuatan Undangan Online, Landing Page, dan Website profesional. Desain modern, responsif, dan siap pakai.',
  },
  alternates: { canonical: 'https://rhpcreatives.com/layanan-digital' },
}

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
