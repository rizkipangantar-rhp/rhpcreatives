'use client'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Testimonials.module.css'

interface TestimonialsProps {
  showHeader?: boolean
}

export default function Testimonials({ showHeader = true }: TestimonialsProps) {
  const { tr } = useLanguage()
  const t = tr.testimonials

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
                <div className={styles.stars}>★★★★★</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
