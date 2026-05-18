import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { LanguageProvider } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import AnnouncementBar from '@/components/AnnouncementBar'
import EarlyBirdPopup from '@/components/EarlyBirdPopup'
import FirstLoginModal from '@/components/FirstLoginModal'
import FloatingBadge from '@/components/FloatingBadge'

export const metadata: Metadata = {
  title: 'RHP Creatives — Jasa Digital & Desain Kreatif',
  description: 'Layanan digital profesional: Undangan Online, Landing Page, Website, dan Desain Grafis. Hubungi kami untuk konsultasi gratis.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <AnnouncementBar />
            <Navbar />
            {children}
            <CTA />
            <Footer />
            <EarlyBirdPopup />
            <FirstLoginModal />
            <FloatingBadge />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
