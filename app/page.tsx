import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import ServicesOverview from '@/components/ServicesOverview'

export const metadata: Metadata = {
  title: 'RHP Creatives - Jasa Digital & Desain Kreatif',
  description: 'Jasa digital kreatif terpercaya: Undangan Online, Landing Page, Website, dan Desain Grafis. Kualitas profesional, harga terjangkau.',
  openGraph: {
    url: 'https://rhpcreatives.com',
    title: 'RHP Creatives - Jasa Digital & Desain Kreatif',
    description: 'Jasa digital kreatif terpercaya: Undangan Online, Landing Page, Website, dan Desain Grafis.',
  },
  alternates: { canonical: 'https://rhpcreatives.com' },
}

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
    </>
  )
}
