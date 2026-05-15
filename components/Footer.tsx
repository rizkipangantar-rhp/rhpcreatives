import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <div className={styles.logo}>RHP<span>Creatives</span></div>
        <p className={styles.tagline}>Jasa Digital & Desain Kreatif Profesional</p>
      </div>
      <div className={styles.right}>
        <a href="https://wa.me/6285179992598" target="_blank" rel="noopener noreferrer" className={styles.contact}>
          WhatsApp: +62 851 7999 2598
        </a>
        <a href="mailto:rhpcreatives@gmail.com" className={styles.contact}>
          rhpcreatives@gmail.com
        </a>
      </div>
      <p className={styles.copy}>© 2026 RHP Creatives. All rights reserved.</p>
    </footer>
  )
}
