'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './AnnouncementBar.module.css'

type PromoInfo = {
  id: string
  announcement_text_id: string
  announcement_text_en: string
  end_date: string | null
  requires_claim: boolean
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

export default function AnnouncementBar() {
  const { lang, tr } = useLanguage()
  const p = tr.promoBar
  const barRef = useRef<HTMLDivElement>(null)
  const [dismissed, setDismissed] = useState(false)
  const [promo, setPromo] = useState<PromoInfo | null | undefined>(undefined) // undefined = loading
  const [time, setTime] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

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

  useEffect(() => {
    fetch('/api/promos')
      .then(r => r.json())
      .then(data => {
        const first: PromoInfo | null = data.promos?.[0] ?? null
        setPromo(first)
      })
      .catch(() => setPromo(null))
  }, [])

  useEffect(() => {
    if (!promo?.end_date) return
    const deadline = new Date(promo.end_date)
    function tick() { setTime(getTimeLeft(deadline)) }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [promo?.end_date])

  function dismiss() {
    setDismissed(true)
    document.documentElement.style.setProperty('--bar-h', '0px')
  }

  // Still loading or no active promo — set bar-h to 0 and render nothing
  if (dismissed || promo === null) return null
  if (promo === undefined) return null  // loading — will re-render once fetched

  // If promo has an end_date and it's expired, hide
  if (promo.end_date && time === null) return null

  const href = promo.requires_claim ? `/promo/klaim/${promo.id}` : '/promo'
  const text = lang === 'id' ? promo.announcement_text_id : promo.announcement_text_en

  return (
    <div ref={barRef} className={styles.bar}>
      <div className={styles.shimmer} />
      <span className={styles.textFull}>{text}</span>
      <Link href={href} className={styles.textShort}>{text}</Link>
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
