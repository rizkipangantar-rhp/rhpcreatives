import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import AboutContent from '@/components/AboutContent'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Kenali RHP Creatives — tim kreatif yang berdedikasi menghadirkan solusi digital berkualitas tinggi untuk bisnis dan individu.',
  openGraph: {
    url: 'https://rhpcreatives.com/about',
    title: 'Tentang Kami | RHP Creatives',
    description: 'Kenali RHP Creatives — tim kreatif yang berdedikasi menghadirkan solusi digital berkualitas tinggi.',
  },
  alternates: { canonical: 'https://rhpcreatives.com/about' },
}

export default function AboutPage() {
  return (
    <>
      <PageHero pageKey="about" />
      <AboutContent />
    </>
  )
}
