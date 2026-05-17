'use client'
import { useLanguage } from '@/context/LanguageContext'
import styles from './CTA.module.css'

const TRUST_ICONS = [
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  <svg key="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>,
  <svg key="chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>,
  <svg key="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>,
]

export default function CTA() {
  const { tr } = useLanguage()
  const c = tr.cta

  return (
    <section id="order" className={styles.section}>
      <div className={styles.label}>{c.label}</div>
      <h2 className={styles.title}>{c.title}</h2>
      <p className={styles.sub}>{c.sub}</p>
      <div className={styles.actions}>
        <a
          href="https://wa.me/6285179992598?text=Halo%20RHP%20Creatives!%20Mau%20konsultasi%20dulu%20nih%20sebelum%20order%20%F0%9F%91%8B"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primary}
        >
          💬 Konsultasi via WhatsApp
        </a>
        <a href="mailto:rhpcreativesid@gmail.com" className={styles.secondary}>
          rhpcreativesid@gmail.com →
        </a>
      </div>

      <div className={styles.trust}>
        {c.trust.map((item, i) => (
          <div key={item} className={styles.trustItem}>
            {TRUST_ICONS[i]}
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}
