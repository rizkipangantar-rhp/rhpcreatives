'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './FloatingBadge.module.css'
import type { PromoBarInfo } from './AnnouncementBar'

export default function FloatingBadge({ initialPromo }: { initialPromo: PromoBarInfo | null }) {
  const { lang } = useLanguage()
  const [promo, setPromo] = useState<PromoBarInfo | null>(initialPromo)

  // Background refresh
  useEffect(() => {
    fetch('/api/promos')
      .then(r => r.json())
      .then(data => setPromo(data.promos?.[0] ?? null))
      .catch(() => {})
  }, [])

  if (!promo) return null

  const discountDisplay = promo.discount_type === 'percent' ? `${promo.discount_value}%` : `Rp${promo.discount_value.toLocaleString('id-ID')}`
  const slotsLeft = promo.remaining ?? (promo.quota > 0 ? Math.max(0, promo.quota - promo.claimed) : null)
  const shortName = promo.name.split(' ').slice(0, 2).join(' ')
  const badgeText = `🔥 ${shortName} ${discountDisplay} OFF`
  const subText = slotsLeft !== null
    ? (lang === 'id' ? `Sisa ${slotsLeft} slot` : `${slotsLeft} slots left`)
    : (lang === 'id' ? 'Terbatas' : 'Limited')
  const href = promo.requires_claim ? `/promo/klaim/${promo.id}` : '/promo'

  return (
    <Link href={href} className={styles.badge} aria-label={badgeText}>
      <span className={styles.pulse} />
      <span className={styles.text}>{badgeText}</span>
      <span className={styles.sub}>{subText}</span>
    </Link>
  )
}
