import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.tag}>✦ Jasa Digital & Desain Kreatif</div>
        <h1>
          Wujudkan Kehadiran <em>Digital</em><br />yang Berkesan
        </h1>
        <p className={styles.sub}>
          RHP Creatives hadir untuk membantu Anda tampil profesional di dunia digital —
          dari undangan online, landing page, website, hingga desain grafis berkualitas.
        </p>
        <div className={styles.actions}>
          <Link href="#order" className={styles.btnPrimary}>Mulai Proyek ↗</Link>
          <Link href="#layanan" className={styles.btnOutline}>Lihat Layanan →</Link>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>5</span>
            <span className={styles.statLabel}>Layanan Tersedia</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>Fast</span>
            <span className={styles.statLabel}>Pengerjaan Cepat</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>✓</span>
            <span className={styles.statLabel}>Revisi Inklusif</span>
          </div>
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.cardStack}>
          <div className={`${styles.card} ${styles.cardBack2}`} />
          <div className={`${styles.card} ${styles.cardBack1}`} />
          <div className={`${styles.card} ${styles.cardMain}`}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className={styles.cardTitle}>RHP Creatives</div>
            <div className={styles.cardDesc}>
              Undangan Online · Landing Page · Website · Desain Instagram · Flyer · Banner · Brosur · Edit Foto
            </div>
            <div className={styles.cardPrice}>Mulai Terjangkau</div>
            <div className={styles.cardBadge}>⚡ Pengerjaan Profesional</div>
            <div className={styles.cardStars}>
              ★★★★★ <span>Kepuasan Klien #1</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
