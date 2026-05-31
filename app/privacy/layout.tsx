import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan Privasi RHP Creatives. Kami berkomitmen menjaga keamanan dan privasi data Anda.',
  robots: { index: false, follow: false },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
