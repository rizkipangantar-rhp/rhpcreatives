import styles from './CTA.module.css'

export default function CTA() {
  return (
    <section id="order" className={styles.section}>
      <div className={styles.label}>Mulai Sekarang</div>
      <h2 className={styles.title}>Siap Tampil Profesional di Dunia Digital?</h2>
      <p className={styles.sub}>
        Konsultasi gratis, tanpa komitmen. Ceritakan kebutuhan Anda dan kami siapkan solusinya dengan cepat.
      </p>
      <div className={styles.actions}>
        <a
          href="https://wa.me/6285179992598"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primary}
        >
          ⚡ Order via WhatsApp
        </a>
        <a href="mailto:rhpcreatives@gmail.com" className={styles.secondary}>
          rhpcreatives@gmail.com →
        </a>
      </div>

      <div className={styles.trust}>
        <div className={styles.trustItem}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Kualitas Terjamin
        </div>
        <div className={styles.trustItem}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Pengerjaan Cepat
        </div>
        <div className={styles.trustItem}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          Revisi Inklusif
        </div>
        <div className={styles.trustItem}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Harga Transparan
        </div>
      </div>
    </section>
  )
}
