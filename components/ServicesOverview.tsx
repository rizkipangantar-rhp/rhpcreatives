'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './ServicesOverview.module.css'

const DIGITAL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
)

const DESIGN_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

export default function ServicesOverview() {
  const { tr } = useLanguage()
  const o = tr.homeOverview

  return (
    <section id="layanan" className={styles.section}>
      <div className={styles.label}>{o.label}</div>
      <h2 className={styles.title}>{o.title}</h2>
      <p className={styles.sub}>{o.sub}</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>{DIGITAL_ICON}</div>
          <h3 className={styles.cardTitle}>{o.digitalTitle}</h3>
          <p className={styles.cardSub}>{o.digitalSub}</p>
          <ul className={styles.items}>
            {o.digitalItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <Link href="/layanan-digital" className={styles.cta}>{o.digitalCta}</Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>{DESIGN_ICON}</div>
          <h3 className={styles.cardTitle}>{o.designTitle}</h3>
          <p className={styles.cardSub}>{o.designSub}</p>
          <ul className={styles.items}>
            {o.designItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <Link href="/layanan-desain" className={styles.cta}>{o.designCta}</Link>
        </div>
      </div>
    </section>
  )
}
