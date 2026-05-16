'use client'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { tr } = useLanguage()
  const f = tr.footer

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <div className={styles.logo}>RHP<span>Creatives</span></div>
        <p className={styles.tagline}>{f.tagline}</p>
      </div>
      <div className={styles.right}>
        <a href="https://wa.me/6285179992598" target="_blank" rel="noopener noreferrer" className={styles.contact}>
          WhatsApp: +62 851 7999 2598
        </a>
        <a href="mailto:rhpcreatives@gmail.com" className={styles.contact}>
          rhpcreatives@gmail.com
        </a>
      </div>
      <p className={styles.copy}>{f.copy}</p>
    </footer>
  )
}
