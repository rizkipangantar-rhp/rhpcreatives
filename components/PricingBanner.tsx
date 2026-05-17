'use client'
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
      <a
        href="https://wa.me/6285179992598"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
      >
        Order →
      </a>
    </div>
  )
}
