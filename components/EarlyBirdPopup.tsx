'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './EarlyBirdPopup.module.css'

const SLOTS_TOTAL = 20
const SLOTS_LEFT = 17

export default function EarlyBirdPopup() {
  const { tr } = useLanguage()
  const p = tr.earlyBirdPopup
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pathname !== '/') return
    const timer = setTimeout(() => setVisible(true), 2_000)
    return () => clearTimeout(timer)
  }, [pathname])

  function close() {
    setVisible(false)
  }

  function handleCta() {
    close()
    router.push(status === 'authenticated' ? '/layanan-digital' : '/login')
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

        <button className={styles.cta} onClick={handleCta}>
          {p.cta}
        </button>
        <button className={styles.dismiss} onClick={close}>{p.dismiss}</button>
      </div>
    </div>
  )
}
