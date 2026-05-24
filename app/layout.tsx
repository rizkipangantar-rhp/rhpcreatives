import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { LanguageProvider } from '@/context/LanguageContext'
import MainSiteLayout from '@/components/MainSiteLayout'
import TextareaAutoResize from '@/components/TextareaAutoResize'
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
        name: p.name,
        announcement_text_id: p.announcement_text_id,
        announcement_text_en: p.announcement_text_en,
        end_date: p.end_date,
        requires_claim: p.requires_claim,
        discount_type: p.discount_type,
        discount_value: p.discount_value,
        quota: p.quota,
        claimed: p.claimed,
        remaining: p.quota === 0 ? null : Math.max(0, p.quota - p.claimed),
      }
    }
  } catch { /* Redis unavailable — bar loads client-side */ }

  // Always reserve 44px so the navbar is never covered when the bar appears.
  // useLayoutEffect in AnnouncementBar corrects this to 0px before first paint if no promo.
  const barScript = `document.documentElement.style.setProperty('--bar-h','44px')`

  return (
    <html lang="id" data-theme="dark">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#06060f" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: barScript }} />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <TextareaAutoResize />
            <MainSiteLayout initialPromo={initialPromo}>{children}</MainSiteLayout>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
