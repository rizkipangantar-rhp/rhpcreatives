import PageHero from '@/components/PageHero'
import Testimonials from '@/components/Testimonials'

export default function TestimoniPage() {
  return (
    <>
      <PageHero pageKey="testimoni" />
      <Testimonials showHeader={false} />
    </>
  )
}
