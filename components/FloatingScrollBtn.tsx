'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './FloatingScrollBtn.module.css'

export default function FloatingScrollBtn() {
  const { tr } = useLanguage()
  const label = tr.servicePage.stickyBar.scrollBtn
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function check() {
      const hargaEl = document.getElementById('harga')
      const scrollY = window.scrollY
      if (scrollY < 200) { setVisible(false); return }
      if (hargaEl) {
        const rect = hargaEl.getBoundingClientRect()
        if (rect.top < window.innerHeight) { setVisible(false); return }
      }
      setVisible(true)
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])

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

  return (
    <button
      className={`${styles.fab} ${visible ? '' : styles.hidden}`}
      onClick={scrollToHarga}
      aria-label={label}
    >
      <span className={styles.icon}>↓</span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
