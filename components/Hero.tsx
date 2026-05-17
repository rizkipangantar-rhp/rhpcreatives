'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import ServicePickerModal from './ServicePickerModal'
import styles from './Hero.module.css'

export default function Hero() {
  const { tr } = useLanguage()
  const h = tr.hero
  const [showModal, setShowModal] = useState(false)

  return (
    <section className={styles.hero}>
      {showModal && <ServicePickerModal onClose={() => setShowModal(false)} />}
      <div className={styles.content}>
        <div className={styles.tag}>{h.tag}</div>
        <h1>
          {h.titleBefore}<em>{h.titleEm}</em><br />
          {h.titleAfter}
        </h1>
        <p className={styles.sub}>{h.sub}</p>
        <div className={styles.actions}>
          <button onClick={() => setShowModal(true)} className={styles.btnPrimary}>{h.cta1}</button>
          <Link href="#layanan" className={styles.btnOutline}>{h.cta2}</Link>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>5</span>
            <span className={styles.statLabel}>{h.stat1Label}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>Fast</span>
            <span className={styles.statLabel}>{h.stat2Label}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>✓</span>
            <span className={styles.statLabel}>{h.stat3Label}</span>
          </div>
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.cardStack}>
          <div className={`${styles.card} ${styles.cardBack2}`} />
          <div className={`${styles.card} ${styles.cardBack1}`} />
          <div className={`${styles.card} ${styles.cardMain}`}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className={styles.cardTitle}>RHP Creatives</div>
            <div className={styles.cardDesc}>{h.cardDesc}</div>
            <div className={styles.cardPrice}>{h.cardPrice}</div>
            <div className={styles.cardBadge}>{h.cardBadge}</div>
            <div className={styles.cardStars}>
              ★★★★★ <span>{h.cardSatisfaction}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
