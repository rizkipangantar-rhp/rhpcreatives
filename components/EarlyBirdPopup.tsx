'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './EarlyBirdPopup.module.css'

const SLOTS_TOTAL = 20

function claimCacheKey(uid: string) {
  return `eb-claimed:${uid}`
}

export default function EarlyBirdPopup() {
  const { tr } = useLanguage()
  const p = tr.earlyBirdPopup
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [visible, setVisible] = useState(false)
  const [slotsLeft, setSlotsLeft] = useState<number | null>(null)
  const [hasClaim, setHasClaim] = useState<boolean | null>(null)

  // Check if authenticated user already has an active claim — suppress popup if so.
  // Uses localStorage as a client-side cache to survive serverless cold starts where
  // a different lambda instance may not have the same /tmp data.
  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') { setHasClaim(false); return }

    const uid = session?.user?.email ?? session?.user?.id ?? ''
    if (uid && localStorage.getItem(claimCacheKey(uid)) === '1') {
      setHasClaim(true)
      return
    }

    fetch('/api/early-bird/status')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const claimed = !!data.claim
        if (claimed && uid) localStorage.setItem(claimCacheKey(uid), '1')
        setHasClaim(claimed)
      })
      .catch(() => {}) // keep null on error — popup stays suppressed
  }, [status, session?.user?.email, session?.user?.id])

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
      .then(data => setSlotsLeft(typeof data.remaining === 'number' ? data.remaining : SLOTS_TOTAL))
      .catch(() => setSlotsLeft(SLOTS_TOTAL))
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

  const displaySlots = slotsLeft ?? SLOTS_TOTAL
  const taken = SLOTS_TOTAL - displaySlots

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
                className={`${styles.slotDot} ${i < taken ? styles.slotDotTaken : ''}`}
              />
            ))}
          </div>
          <div className={styles.slotText}>
            {slotsLeft === null ? (
              <span className={styles.slotNum}>…</span>
            ) : (
              <span className={styles.slotNum}>{displaySlots}</span>
            )}
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
