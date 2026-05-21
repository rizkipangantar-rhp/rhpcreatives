import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { LanguageProvider } from '@/context/LanguageContext'
import MainSiteLayout from '@/components/MainSiteLayout'
import { getActivePublicPromos } from '@/lib/promos'
import type { PromoBarInfo } from '@/components/AnnouncementBar'

export const metadata: Metadata = {
  title: 'RHP Creatives — Jasa Digital & Desain Kreatif',
  description: 'Layanan digital profesional: Undangan Online, Landing Page, Website, dan Desain Grafis. Hubungi kami untuk konsultasi gratis.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialPromo: PromoBarInfo | null = null
  try {
    const promos = await getActivePublicPromos()
    const p = promos[0]
    if (p) {
      initialPromo = {
        id: p.id,
        announcement_text_id: p.announcement_text_id,
        announcement_text_en: p.announcement_text_en,
        end_date: p.end_date,
        requires_claim: p.requires_claim,
      }
    }
  } catch { /* Redis unavailable — bar loads client-side */ }

  // Set --bar-h before first paint so navbar is never mispositioned
  const barH = initialPromo ? 44 : 0
  const barScript = `document.documentElement.style.setProperty('--bar-h','${barH}px')`

  return (
    <html lang="id">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: barScript }} />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <MainSiteLayout initialPromo={initialPromo}>{children}</MainSiteLayout>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
