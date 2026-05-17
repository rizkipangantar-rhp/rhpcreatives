'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './AnnouncementBar.module.css'

const DEADLINE = new Date('2026-06-16T23:59:59')

function getTimeLeft() {
  const diff = DEADLINE.getTime() - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff % 86_400_000) / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return { d, h, m, s }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function AnnouncementBar() {
  const { tr } = useLanguage()
  const p = tr.promoBar
  const barRef = useRef<HTMLDivElement>(null)
  const [dismissed, setDismissed] = useState(false)
  const [time, setTime] = useState(getTimeLeft)

  useLayoutEffect(() => {
    function sync() {
      const h = barRef.current?.offsetHeight ?? 44
      document.documentElement.style.setProperty('--bar-h', `${h}px`)
    }
    sync()
    const ro = new ResizeObserver(sync)
    if (barRef.current) ro.observe(barRef.current)
    return () => ro.disconnect()
  }, [dismissed])

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1_000)
    return () => clearInterval(id)
  }, [])

  function dismiss() {
    setDismissed(true)
    document.documentElement.style.setProperty('--bar-h', '0px')
  }

  if (dismissed || time.d === 0 && time.h === 0 && time.m === 0 && time.s === 0) return null

  return (
    <div ref={barRef} className={styles.bar}>
      <div className={styles.shimmer} />
      <span className={styles.text}>{p.text}</span>
      <span className={styles.countdown}>
        <span className={styles.unit}>{pad(time.d)}<span className={styles.label}>{p.days}</span></span>
        <span className={styles.sep}>:</span>
        <span className={styles.unit}>{pad(time.h)}<span className={styles.label}>{p.hrs}</span></span>
        <span className={styles.sep}>:</span>
        <span className={styles.unit}>{pad(time.m)}<span className={styles.label}>{p.mins}</span></span>
        <span className={styles.sep}>:</span>
        <span className={styles.unit}>{pad(time.s)}<span className={styles.label}>{p.secs}</span></span>
      </span>
      <button className={styles.close} onClick={dismiss} aria-label="Tutup">✕</button>
    </div>
  )
}
