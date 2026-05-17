'use client'
import { useLanguage } from '@/context/LanguageContext'
import styles from './FloatingBadge.module.css'

export default function FloatingBadge() {
  const { tr } = useLanguage()
  const f = tr.floatingBadge

  return (
    <a
      href="#order"
      className={styles.badge}
      aria-label={f.text}
    >
      <span className={styles.pulse} />
      <span className={styles.text}>{f.text}</span>
      <span className={styles.sub}>{f.sub}</span>
    </a>
  )
}
