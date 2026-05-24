'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Testimonials.module.css'
import type { Review } from '@/lib/reviews'

interface TestimonialsProps {
  showHeader?: boolean
}

export default function Testimonials({ showHeader = true }: TestimonialsProps) {
  const { tr, lang } = useLanguage()
  const t = tr.testimonials
  const [dbReviews, setDbReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch('/api/review')
      .then(r => r.ok ? r.json() : { reviews: [] })
      .then(data => setDbReviews(data.reviews ?? []))
      .catch(() => {})
  }, [])

  return (
    <section className={styles.section}>
      {showHeader && (
        <>
          <div className={styles.label}>{t.label}</div>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.sub}>{t.sub}</p>
        </>
      )}

      <div className={styles.grid}>
        {t.items.map((item) => (
          <div key={item.initials} className={styles.card}>
            <div className={styles.quote}>&ldquo;</div>
            <p className={styles.text}>{item.text}</p>
            <div className={styles.author}>
              <div className={styles.avatar}>{item.initials}</div>
              <div>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.role}>{item.role}</div>
                <div className={styles.stars}>
                  {'★'.repeat(item.rating)}
                  {'☆'.repeat(5 - item.rating)}
                </div>
              </div>
            </div>
          </div>
        ))}
        {dbReviews.map((r) => (
          <div key={r.id} className={styles.card}>
            <div className={styles.quote}>&ldquo;</div>
            <p className={styles.text}>{r.text}</p>
            <div className={styles.author}>
              <div className={styles.avatar}>{r.initials}</div>
              <div>
                <div className={styles.name}>{r.name}</div>
                <div className={styles.role}>{lang === 'id' ? `Pengguna layanan ${r.service}` : `${r.service} client`}</div>
                <div className={styles.stars}>
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
