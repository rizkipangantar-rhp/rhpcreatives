import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RHP Creatives — Jasa Digital & Desain Kreatif',
  description: 'Layanan digital profesional: Undangan Online, Landing Page, Website, dan Desain Grafis. Hubungi kami untuk konsultasi gratis.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
