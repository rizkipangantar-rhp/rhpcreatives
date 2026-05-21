'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './AnnouncementBar.module.css'

export type PromoBarInfo = {
  id: string
  name: string
  announcement_text_id: string
  announcement_text_en: string
  end_date: string | null
  requires_claim: boolean
  discount_type: 'percent' | 'nominal'
  discount_value: number
  quota: number
  claimed: number
  remaining: number | null
}

function getTimeLeft(deadline: Date) {
  const diff = deadline.getTime() - Date.now()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff % 86_400_000) / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return { d, h, m, s }
}

function pad(n: number) { return String(n).padStart(2, '0') }

export default function AnnouncementBar({ initialPromo }: { initialPromo: PromoBarInfo | null }) {
  const { lang, tr } = useLanguage()
  const p = tr.promoBar
  const barRef = useRef<HTMLDivElement>(null)
  const [dismissed, setDismissed] = useState(false)
  // Start with SSR data — no undefined/loading state needed
  const [promo, setPromo] = useState<PromoBarInfo | null>(initialPromo)
  const [time, setTime] = useState<{ d: number; h: number; m: number; s: number } | null>(null)
  // Guard: only hide for expired after client has computed the countdown
  const [countdownReady, setCountdownReady] = useState(false)

  useLayoutEffect(() => {
    function sync() {
      const h = barRef.current?.offsetHeight ?? 0
      document.documentElement.style.setProperty('--bar-h', `${h}px`)
    }
    sync()
    const ro = new ResizeObserver(sync)
    if (barRef.current) ro.observe(barRef.current)
    return () => ro.disconnect()
  }, [dismissed, promo])

  // Background refresh — keeps data fresh after SSR
  useEffect(() => {
    fetch('/api/promos')
      .then(r => r.json())
      .then(data => {
        const first: PromoBarInfo | null = data.promos?.[0] ?? null
        setPromo(first)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!promo?.end_date) {
      setCountdownReady(true)
      return
    }
    const deadline = new Date(promo.end_date)
    function tick() {
      setTime(getTimeLeft(deadline))
      setCountdownReady(true)
    }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [promo?.end_date])

  function dismiss() {
    setDismissed(true)
    document.documentElement.style.setProperty('--bar-h', '0px')
  }

  if (dismissed || promo === null) return null
  // Only hide for expiry after countdown is computed (avoids flicker on hydration)
  if (promo.end_date && countdownReady && time === null) return null

  const href = promo.requires_claim ? `/promo/klaim/${promo.id}` : '/promo'
  const discountDisplay = promo.discount_type === 'percent' ? `${promo.discount_value}%` : `Rp${promo.discount_value.toLocaleString('id-ID')}`
  const quotaText = promo.quota > 0 ? String(promo.quota) : null
  // First 2 words of promo name for compact layouts
  const shortName = promo.name.split(' ').slice(0, 2).join(' ')
  const text = lang === 'id'
    ? quotaText
      ? `🔥 ${promo.name} ${discountDisplay} OFF — Cuma buat ${quotaText} klien pertama! Jangan sampe nyesel ya bestie`
      : `🔥 ${promo.name} ${discountDisplay} OFF — Jangan sampe nyesel ya bestie`
    : quotaText
      ? `🔥 ${promo.name} ${discountDisplay} OFF — First ${quotaText} clients only! Don't sleep on this bestie`
      : `🔥 ${promo.name} ${discountDisplay} OFF — Don't sleep on this bestie`
  // Mobile bar text — kept short so it never overflows alongside the countdown
  const shortText = `🔥 ${shortName} ${discountDisplay} OFF`

  return (
    <div ref={barRef} className={styles.bar}>
      <div className={styles.shimmer} />
      <span className={styles.textFull}>{text}</span>
      <Link href={href} className={styles.textShort}>{shortText}</Link>
      <Link href={href} className={styles.ctaLink}>{lang === 'id' ? 'Klaim →' : 'Claim →'}</Link>
      {time && (
        <span className={styles.countdown}>
          <span className={styles.unit}>{pad(time.d)}<span className={styles.label}>{p.days}</span></span>
          <span className={styles.sep}>:</span>
          <span className={styles.unit}>{pad(time.h)}<span className={styles.label}>{p.hrs}</span></span>
          <span className={styles.sep}>:</span>
          <span className={styles.unit}>{pad(time.m)}<span className={styles.label}>{p.mins}</span></span>
          <span className={styles.sep}>:</span>
          <span className={styles.unit}>{pad(time.s)}<span className={styles.label}>{p.secs}</span></span>
        </span>
      )}
      <button className={styles.close} onClick={dismiss} aria-label="Tutup">✕</button>
    </div>
  )
}
