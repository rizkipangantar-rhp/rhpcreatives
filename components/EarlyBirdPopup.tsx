'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './EarlyBirdPopup.module.css'

const SLOTS_TOTAL = 20

export default function EarlyBirdPopup() {
  const { tr } = useLanguage()
  const p = tr.earlyBirdPopup
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useSession()
  const [visible, setVisible] = useState(false)
  const [slotsLeft, setSlotsLeft] = useState(17)
  const [hasClaim, setHasClaim] = useState<boolean | null>(null)

  // Check if authenticated user already claimed — suppress popup if so
  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') { setHasClaim(false); return }
    fetch('/api/early-bird/status')
      .then(r => r.json())
      .then(data => setHasClaim(!!data.claim))
      .catch(() => setHasClaim(false))
  }, [status])

  useEffect(() => {
    if (pathname !== '/') return
    if (hasClaim === null) return  // wait until claim status is known
    if (hasClaim) return           // already claimed — never show
    const timer = setTimeout(() => setVisible(true), 2_000)
    return () => clearTimeout(timer)
  }, [pathname, hasClaim])

  useEffect(() => {
    if (!visible) return
    fetch('/api/early-bird/quota')
      .then(r => r.json())
      .then(data => setSlotsLeft(data.remaining ?? 17))
      .catch(() => {})
  }, [visible])

  function close() {
    setVisible(false)
  }

  function handleCta() {
    close()
    if (status === 'authenticated') {
      router.push('/promo/klaim-early-bird')
    } else {
      router.push('/login?callbackUrl=%2Fpromo%2Fklaim-early-bird')
    }
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
                className={`${styles.slotDot} ${i < SLOTS_TOTAL - slotsLeft ? styles.slotDotTaken : ''}`}
              />
            ))}
          </div>
          <div className={styles.slotText}>
            <span className={styles.slotNum}>{slotsLeft}</span>
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
