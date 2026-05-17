'use client'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './ServicePickerModal.module.css'

const WA_URL = `https://wa.me/6285179992598?text=${encodeURIComponent('Halo RHP Creatives! Aku mau konsultasi nih soal layanan kalian 😊')}`

const SERVICES = [
  {
    icon: '💌',
    nameId: 'Undangan Online', nameEn: 'Online Invitation',
    descId: 'Undangan digital aesthetic buat nikah, ultah & gathering',
    descEn: 'Aesthetic digital invites for weddings, birthdays & gatherings',
    priceId: 'Mulai Rp79.000', priceEn: 'From Rp79.000',
    hot: true,
    href: '/layanan-digital#undangan-online',
    colorClass: 'cardPurple' as const,
  },
  {
    icon: '🚀',
    nameId: 'Landing Page', nameEn: 'Landing Page',
    descId: 'Halaman web keren buat jualan, event, atau portofolio',
    descEn: 'Cool web page for selling, events, or your portfolio',
    priceId: 'Mulai Rp299.000', priceEn: 'From Rp299.000',
    hot: false,
    href: '/layanan-digital#landing-page',
    colorClass: 'cardBlue' as const,
  },
  {
    icon: '✨',
    nameId: 'Desain Instagram', nameEn: 'Instagram Design',
    descId: 'Feed & story estetis yang bikin orang stop scrolling',
    descEn: 'Aesthetic feed & stories that make people stop scrolling',
    priceId: 'Mulai Rp40.000', priceEn: 'From Rp40.000',
    hot: true,
    href: '/layanan-desain#desain-instagram',
    colorClass: 'cardPink' as const,
  },
  {
    icon: '📸',
    nameId: 'Edit Foto', nameEn: 'Photo Edit',
    descId: 'Ganti background & retouch foto buat KTP, lamaran, LinkedIn',
    descEn: 'Background swap & retouch for ID photos, job apps, LinkedIn',
    priceId: 'Mulai Rp20.000', priceEn: 'From Rp20.000',
    hot: false,
    href: '/layanan-desain#edit-foto',
    colorClass: 'cardGreen' as const,
  },
]

export default function ServicePickerModal({ onClose }: { onClose: () => void }) {
  const { tr, lang } = useLanguage()
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

  return (
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

        <div className={styles.grid}>
          {SERVICES.map(svc => (
            <button
              key={svc.href}
              className={`${styles.card} ${styles[svc.colorClass]}`}
              onClick={() => navigate(svc.href)}
            >
              {svc.hot && <span className={styles.hotBadge}>{m.hotBadge}</span>}
              <span className={styles.cardIcon}>{svc.icon}</span>
              <span className={styles.cardName}>{lang === 'id' ? svc.nameId : svc.nameEn}</span>
              <span className={styles.cardDesc}>{lang === 'id' ? svc.descId : svc.descEn}</span>
              <span className={styles.cardPrice}>{lang === 'id' ? svc.priceId : svc.priceEn}</span>
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/layanan-digital" className={styles.footerLink} onClick={onClose}>
            {m.viewAll}
          </Link>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
            onClick={onClose}
          >
            {m.consultWa}
          </a>
        </div>
      </div>
    </div>
  )
}
