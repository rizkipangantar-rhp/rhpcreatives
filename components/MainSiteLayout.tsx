'use client'
import { usePathname } from 'next/navigation'
import AnnouncementBar, { type PromoBarInfo } from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import EarlyBirdPopup from '@/components/EarlyBirdPopup'
import FirstLoginModal from '@/components/FirstLoginModal'
import FloatingBadge from '@/components/FloatingBadge'
import Analytics from '@/components/Analytics'

export default function MainSiteLayout({
  children,
  initialPromo,
}: {
  children: React.ReactNode
  initialPromo: PromoBarInfo | null
}) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return <>{children}</>
  return (
    <>
      <AnnouncementBar initialPromo={initialPromo} />
      <Navbar />
      {children}
      <CTA />
      <Footer />
      <EarlyBirdPopup />
      <FirstLoginModal />
      <FloatingBadge />
      <Analytics />
    </>
  )
}
