'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './PricingBanner.module.css'

export default function PricingBanner() {
  const { tr } = useLanguage()
  const b = tr.pricingBanner

  return (
    <div className={styles.banner}>
      <span className={styles.badge}>{b.badge}</span>
      <div className={styles.content}>
        <strong className={styles.title}>{b.title}</strong>
        <span className={styles.sub}>{b.sub}</span>
      </div>
      <Link href="/promo/klaim-early-bird" className={styles.cta}>
        {b.cta}
      </Link>
    </div>
  )
}
