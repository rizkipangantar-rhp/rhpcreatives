'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './StickyServiceBar.module.css'

const WA_URL = 'https://wa.me/6285179992598'

function scrollToHarga() {
  const el = document.getElementById('harga')
  if (!el) return
  const rect = el.getBoundingClientRect()
  const barH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-h') || '44')
  const headerH = barH + 64
  const availableH = window.innerHeight - headerH
  const visibleElH = Math.min(rect.height, availableH)
  const offsetTop = window.scrollY + rect.top - headerH - (availableH - visibleElH) / 2
  window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' })
}

export default function StickyServiceBar() {
  const { tr } = useLanguage()
  const s = tr.servicePage.stickyBar
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function check() {
      const hargaEl = document.getElementById('harga')
      const scrollY = window.scrollY
      if (scrollY < 400) { setVisible(false); return }
      if (hargaEl) {
        const rect = hargaEl.getBoundingClientRect()
        if (rect.top < window.innerHeight) { setVisible(false); return }
      }
      setVisible(true)
    }
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ''}`} aria-hidden={!visible}>
      <span className={`${styles.label} ${styles.desktopLabel}`}>{s.label}</span>
      {/* Desktop actions */}
      <div className={`${styles.actions} ${styles.desktopActions}`}>
        <a href="/order" className={styles.orderBtn}>{s.orderBtn}</a>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={styles.consultBtn}>{s.consultBtn}</a>
      </div>
      {/* Mobile actions */}
      <div className={`${styles.actions} ${styles.mobileActions}`}>
        <button className={styles.scrollBtn} onClick={scrollToHarga}>{s.scrollBtn}</button>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={styles.consultBtn}>{s.consultBtn}</a>
      </div>
    </div>
  )
}
