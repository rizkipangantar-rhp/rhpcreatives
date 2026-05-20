'use client'
import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import styles from './ServicePickerModal.module.css'

const WA_URL = `https://wa.me/6285179992598?text=${encodeURIComponent('Halo RHP Creatives! Aku mau konsultasi nih soal layanan kalian')}`

export default function ServicePickerModal({ onClose }: { onClose: () => void }) {
  const { tr } = useLanguage()
  const m = tr.serviceModal
  const router = useRouter()

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [handleEscape])

  function navigate(href: string) {
    onClose()
    router.push(href)
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Tutup">✕</button>

        <h2 className={styles.title}>{m.title}</h2>
        <p className={styles.sub}>{m.sub}</p>

        <div className={styles.cards}>
          <button
            className={`${styles.card} ${styles.cardDigital}`}
            onClick={() => navigate('/layanan-digital')}
          >
            <span className={styles.cardEmoji}>💻</span>
            <span className={styles.cardName}>{m.digitalName}</span>
            <ul className={styles.cardItems}>
              {m.digitalItems.map((item, i) => (
                <li key={i}>✦ {item}</li>
              ))}
            </ul>
            <span className={styles.cardTagline}>{m.digitalTagline}</span>
          </button>

          <button
            className={`${styles.card} ${styles.cardDesign}`}
            onClick={() => navigate('/layanan-desain')}
          >
            <span className={styles.cardEmoji}>🎨</span>
            <span className={styles.cardName}>{m.designName}</span>
            <ul className={styles.cardItems}>
              {m.designItems.map((item, i) => (
                <li key={i}>✦ {item}</li>
              ))}
            </ul>
            <span className={styles.cardTagline}>{m.designTagline}</span>
          </button>
        </div>

        <div className={styles.footer}>
          <span className={styles.unsureText}>{m.unsure}</span>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waLink}
            onClick={onClose}
          >
            {m.consultWa}
          </a>
        </div>
      </div>
    </div>,
    document.body
  )
}
