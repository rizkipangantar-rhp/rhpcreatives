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

  // Suppress popup for users who have already claimed.
  // Uses three layers so it survives Vercel lambda isolation (ephemeral /tmp):
  //   1. Cookie eb_claimed=1 — set by the claim page, no session-email dependency
  //   2. localStorage keyed by user email — user-specific, cleared with browser data
  //   3. API call — ground truth, may be stale on a cold lambda
  useEffect(() => {
    if (status === 'loading') return

    // Unauthenticated users always see the popup (cookie may be stale from a previous session)
    if (status === 'unauthenticated') { setHasClaim(false); return }

    // Layer 1: cookie (fastest, most reliable) — only checked for authenticated users
    if (document.cookie.includes('eb_claimed=1')) {
      setHasClaim(true)
      return
    }

    // Layer 2: localStorage
    const uid = session?.user?.email ?? session?.user?.id ?? ''
    if (uid && localStorage.getItem(claimCacheKey(uid)) === '1') {
      setHasClaim(true)
      return
    }

    // Layer 3: API
    fetch('/api/early-bird/status')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const claimed = !!data.claim
        if (claimed) {
          document.cookie = 'eb_claimed=1; max-age=31536000; path=/; SameSite=Lax'
          if (uid) localStorage.setItem(claimCacheKey(uid), '1')
        }
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
    // Initialise from localStorage cache so we never flash a higher number
    const cached = parseInt(localStorage.getItem('eb-remaining') ?? String(SLOTS_TOTAL), 10)
    setSlotsLeft(cached)

    fetch('/api/early-bird/quota')
      .then(r => r.json())
      .then(data => {
        if (typeof data.remaining !== 'number') return
        // Always show the lower of the two values — stale lambdas can only over-count
        const shown = Math.min(data.remaining, cached)
        setSlotsLeft(shown)
        if (data.remaining < cached) {
          localStorage.setItem('eb-remaining', String(data.remaining))
        }
      })
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
