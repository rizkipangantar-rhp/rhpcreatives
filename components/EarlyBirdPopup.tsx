'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import styles from './EarlyBirdPopup.module.css'

const SLOTS_TOTAL = 20
const SLOTS_LEFT = 17

export default function EarlyBirdPopup() {
  const { tr } = useLanguage()
  const p = tr.earlyBirdPopup
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pathname !== '/') return
    if (sessionStorage.getItem('eb_popup_seen')) return
    const timer = setTimeout(() => setVisible(true), 2_000)
    return () => clearTimeout(timer)
  }, [pathname])

  function close() {
    sessionStorage.setItem('eb_popup_seen', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={close} aria-label="Tutup">✕</button>

        <div className={styles.badge}>🔥 Early Bird</div>
        <h2 className={styles.headline}>{p.headline}</h2>
        <p className={styles.sub}>{p.sub}</p>

        <div className={styles.slots}>
          <div className={styles.slotBar}>
            {Array.from({ length: SLOTS_TOTAL }).map((_, i) => (
              <div
                key={i}
                className={`${styles.slotDot} ${i < SLOTS_TOTAL - SLOTS_LEFT ? styles.slotDotTaken : ''}`}
              />
            ))}
          </div>
          <div className={styles.slotText}>
            <span className={styles.slotNum}>{SLOTS_LEFT}</span>
            {' '}{p.slotsLeft}
          </div>
        </div>

        <a
          href="https://wa.me/6285179992598"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
          onClick={close}
        >
          {p.cta}
        </a>
        <button className={styles.dismiss} onClick={close}>{p.dismiss}</button>
      </div>
    </div>
  )
}
