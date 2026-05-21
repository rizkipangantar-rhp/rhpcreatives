'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './FloatingBadge.module.css'
import type { PromoBarInfo } from './AnnouncementBar'

export default function FloatingBadge({ initialPromo }: { initialPromo: PromoBarInfo | null }) {
  const { tr } = useLanguage()
  const f = tr.floatingBadge
  const [promo, setPromo] = useState<PromoBarInfo | null>(initialPromo)

  // Background refresh
  useEffect(() => {
    fetch('/api/promos')
      .then(r => r.json())
      .then(data => setPromo(data.promos?.[0] ?? null))
      .catch(() => {})
  }, [])

  if (!promo) return null

  const href = promo.requires_claim ? `/promo/klaim/${promo.id}` : '/promo'

  return (
    <Link href={href} className={styles.badge} aria-label={f.text}>
      <span className={styles.pulse} />
      <span className={styles.text}>{f.text}</span>
      <span className={styles.sub}>{f.sub}</span>
    </Link>
  )
}
