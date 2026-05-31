import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import Testimonials from '@/components/Testimonials'

export const metadata: Metadata = {
  title: 'Testimoni',
  description: 'Baca ulasan dan testimoni dari klien RHP Creatives. Kepuasan pelanggan adalah prioritas utama kami.',
  openGraph: {
    url: 'https://rhpcreatives.com/testimoni',
    title: 'Testimoni | RHP Creatives',
    description: 'Baca ulasan dan testimoni dari klien RHP Creatives. Kepuasan pelanggan adalah prioritas utama kami.',
  },
  alternates: { canonical: 'https://rhpcreatives.com/testimoni' },
}

export default function TestimoniPage() {
  return (
    <>
      <PageHero pageKey="testimoni" />
      <Testimonials showHeader={false} />
    </>
  )
}
