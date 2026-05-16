'use client'
import { useLanguage } from '@/context/LanguageContext'
import styles from './PageHero.module.css'

type PageKey = 'layananDigital' | 'layananDesain' | 'testimoni' | 'promo' | 'about'

export default function PageHero({ pageKey }: { pageKey: PageKey }) {
  const { tr } = useLanguage()
  const h = tr.pageHero[pageKey]

  return (
    <section className={styles.hero}>
      <div className={styles.label}>{h.label}</div>
      <h1 className={styles.title}>{h.title}</h1>
      <p className={styles.sub}>{h.sub}</p>
    </section>
  )
}
