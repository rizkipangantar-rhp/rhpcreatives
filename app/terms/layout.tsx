import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan Ketentuan penggunaan layanan RHP Creatives. Bacalah dengan saksama sebelum menggunakan layanan kami.',
  robots: { index: false, follow: false },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
