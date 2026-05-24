'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './EarlyBirdPopup.module.css'

type PromoInfo = {
  id: string; name: string
  discount_type: 'percent' | 'nominal'; discount_value: number
  quota: number; claimed: number; remaining: number | null; is_full: boolean
  requires_claim: boolean; announcement_text_id: string; announcement_text_en: string
}

export default function EarlyBirdPopup() {
  const { tr, lang } = useLanguage()
  const p = tr.earlyBirdPopup
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [visible, setVisible] = useState(false)
  const [promo, setPromo] = useState<PromoInfo | null>(null)
  const [hasClaim, setHasClaim] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') { setHasClaim(false); return }

    const uid = session?.user?.email ?? session?.user?.id ?? ''

    // User-specific localStorage check — safe across different accounts on same device
    if (uid && localStorage.getItem(`eb-claimed:${uid}`) === '1') {
      setHasClaim(true); return
    }

    // Check via API (authoritative)
    fetch('/api/promos/my-claims')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const claimed = (data.claims ?? []).length > 0
        if (claimed && uid) localStorage.setItem(`eb-claimed:${uid}`, '1')
        setHasClaim(claimed)
      })
      .catch(() => setHasClaim(false))
  }, [status, session?.user?.email, session?.user?.id])

  useEffect(() => {
    if (pathname !== '/') return
    if (hasClaim === null) return
    if (hasClaim) return
    const timer = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(timer)
  }, [pathname, hasClaim])

  useEffect(() => {
    if (!visible) return
    fetch('/api/promos')
      .then(r => r.json())
      .then(data => { setPromo(data.promos?.[0] ?? null) })
      .catch(() => {})
  }, [visible])

  function close() { setVisible(false) }

  function handleCta() {
    close()
    if (!promo) return
    const href = promo.requires_claim ? `/promo/klaim/${promo.id}` : '/order'
    if (status === 'authenticated') {
      router.push(href)
    } else {
      router.push(`/login?callbackUrl=${encodeURIComponent(href)}`)
    }
  }

  if (!visible || !promo) return null

  const discountDisplay = promo.discount_type === 'percent' ? `${promo.discount_value ?? 0}%` : `Rp${(promo.discount_value ?? 0).toLocaleString('id-ID')}`
  const slots = promo.quota > 0 ? promo.quota : null
  const slotsLeft = promo.remaining ?? (slots ? Math.max(0, slots - promo.claimed) : null)
  const taken = slots && slotsLeft !== null ? slots - slotsLeft : 0
  const isEarlyBird = promo.name.toLowerCase().includes('early bird')
  const subText = lang === 'id'
    ? slots
      ? `${promo.name} lagi jalan nih, diskon ${discountDisplay} buat ${slots} klien pertama doang. No cap, ini real.`
      : `${promo.name} lagi jalan nih, diskon ${discountDisplay}. No cap, ini real.`
    : slots
      ? `${promo.name} is live, ${discountDisplay} off for the first ${slots} clients only. No cap, for real.`
      : `${promo.name} is live, ${discountDisplay} off. No cap, for real.`
  const ctaText = promo.requires_claim
    ? (lang === 'id' ? 'Klaim Sekarang' : 'Claim Now')
    : (lang === 'id' ? 'Gasken Order Sekarang' : 'Order Now')

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={close} aria-label="Tutup">✕</button>

        <div className={styles.badge}>{isEarlyBird ? '🔥 ' : ''}{promo.name}</div>
        <h2 className={styles.headline}>{p.headline}</h2>
        <p className={styles.sub}>{subText}</p>

        {slots !== null && (
          <div className={styles.slots}>
            <div className={styles.slotBar}>
              {Array.from({ length: slots }).map((_, i) => (
                <div key={i} className={`${styles.slotDot} ${i < taken ? styles.slotDotTaken : ''}`} />
              ))}
            </div>
            <div className={styles.slotText}>
              {slotsLeft === null ? <span className={styles.slotNum}>…</span> : <span className={styles.slotNum}>{slotsLeft}</span>}
              {' '}{p.slotsLeft}
            </div>
          </div>
        )}

        <button className={styles.cta} onClick={handleCta}>{ctaText}</button>
        <button className={styles.dismiss} onClick={close}>{p.dismiss}</button>
      </div>
    </div>
  )
}
