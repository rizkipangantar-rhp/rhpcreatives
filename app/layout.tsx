import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { LanguageProvider } from '@/context/LanguageContext'
import type { Lang } from '@/lib/i18n'
import MainSiteLayout from '@/components/MainSiteLayout'
import TextareaAutoResize from '@/components/TextareaAutoResize'
import { getActivePublicPromos } from '@/lib/promos'
import type { PromoBarInfo } from '@/components/AnnouncementBar'

const SITE_URL = process.env.NEXTAUTH_URL?.startsWith('http://localhost')
  ? 'https://rhpcreatives.com'
  : (process.env.NEXTAUTH_URL ?? 'https://rhpcreatives.com')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RHP Creatives - Jasa Digital & Desain Kreatif',
    template: '%s | RHP Creatives',
  },
  description: 'Layanan digital profesional: Undangan Online, Landing Page, Website, dan Desain Grafis. Hubungi kami untuk konsultasi gratis.',
  keywords: ['jasa digital', 'desain grafis', 'undangan online', 'landing page', 'website', 'RHP Creatives'],
  authors: [{ name: 'RHP Creatives', url: SITE_URL }],
  creator: 'RHP Creatives',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: 'RHP Creatives',
    title: 'RHP Creatives - Jasa Digital & Desain Kreatif',
    description: 'Layanan digital profesional: Undangan Online, Landing Page, Website, dan Desain Grafis. Hubungi kami untuk konsultasi gratis.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'RHP Creatives' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RHP Creatives - Jasa Digital & Desain Kreatif',
    description: 'Layanan digital profesional: Undangan Online, Landing Page, Website, dan Desain Grafis.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16', type: 'image/x-icon' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-48.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rawLang = cookies().get('rhp-lang')?.value
  const initialLang: Lang = rawLang === 'en' ? 'en' : 'id'

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

  // Always reserve 44px so navbar stays below the bar from the first paint.
  // AnnouncementBar's useLayoutEffect corrects this once the client fetch confirms promo state.
  const barScript = `document.documentElement.style.setProperty('--bar-h','44px')`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RHP Creatives',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-48.png`,
    description: 'Layanan digital profesional: Undangan Online, Landing Page, Website, dan Desain Grafis.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
    sameAs: [],
  }

  return (
    <html lang={initialLang} data-theme="dark">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#06060f" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: barScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider initialLang={initialLang}>
            <TextareaAutoResize />
            <MainSiteLayout initialPromo={initialPromo}>{children}</MainSiteLayout>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
