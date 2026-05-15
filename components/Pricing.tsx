import Link from 'next/link'
import styles from './Pricing.module.css'

const digitalPlans = [
  {
    name: 'Undangan Online',
    price: 'Rp 150 Rb',
    period: 'per undangan',
    featured: false,
    features: [
      { text: 'Desain custom', included: true },
      { text: 'Countdown timer', included: true },
      { text: 'Form RSVP', included: true },
      { text: 'Link custom', included: true },
      { text: 'Musik latar', included: false },
    ],
    cta: 'Pesan Sekarang →',
  },
  {
    name: 'Landing Page',
    price: 'Rp 300 Rb',
    period: 'per halaman',
    featured: true,
    badge: 'Terlaris',
    features: [
      { text: 'Desain modern custom', included: true },
      { text: 'Mobile-first', included: true },
      { text: 'Tombol WA / CTA', included: true },
      { text: 'Domain gratis 1 tahun', included: true },
      { text: 'Revisi 2x', included: true },
    ],
    cta: 'Pesan Sekarang →',
  },
  {
    name: 'Website',
    price: 'Rp 750 Rb',
    period: 'mulai dari',
    featured: false,
    features: [
      { text: 'Multi-halaman', included: true },
      { text: 'SEO dasar', included: true },
      { text: 'Mobile responsive', included: true },
      { text: 'CMS / dashboard', included: true },
      { text: 'Revisi 3x', included: true },
    ],
    cta: 'Konsultasi Dulu →',
  },
]

const designPlans = [
  {
    name: 'Desain Instagram',
    price: 'Rp 25 Rb',
    period: 'per konten',
    features: [
      { text: 'Feed / story / highlight', included: true },
      { text: 'Revisi 1x', included: true },
      { text: 'File PNG / JPG', included: true },
    ],
    cta: 'Pesan →',
  },
  {
    name: 'Flyer & Banner',
    price: 'Rp 50 Rb',
    period: 'per desain',
    features: [
      { text: 'Format digital & cetak', included: true },
      { text: 'Revisi 1x', included: true },
      { text: 'File siap cetak', included: true },
    ],
    cta: 'Pesan →',
  },
  {
    name: 'Brosur',
    price: 'Rp 75 Rb',
    period: 'per desain',
    features: [
      { text: 'Lipat 2 atau lipat 3', included: true },
      { text: 'CMYK siap cetak', included: true },
      { text: 'Revisi 1x', included: true },
    ],
    cta: 'Pesan →',
  },
  {
    name: 'Edit Foto',
    price: 'Rp 20 Rb',
    period: 'per foto',
    features: [
      { text: 'Retouch & color grading', included: true },
      { text: 'Remove background', included: true },
      { text: 'Resolusi tinggi', included: true },
    ],
    cta: 'Pesan →',
  },
]

export default function Pricing() {
  return (
    <section id="harga" className={styles.pricing}>
      <div className={styles.header}>
        <div className={styles.label}>Harga Transparan</div>
        <h2 className={styles.title}>Paket & Harga Layanan</h2>
        <p className={styles.sub}>
          Harga dapat berubah sesuai kebutuhan proyek. Hubungi kami untuk penawaran terbaik.
        </p>
      </div>

      <div className={styles.categoryLabel}>✦ Layanan Digital</div>
      <div className={styles.gridDigital}>
        {digitalPlans.map((plan) => (
          <div key={plan.name} className={`${styles.card} ${plan.featured ? styles.featured : ''}`}>
            {plan.badge && <div className={styles.badge}>{plan.badge}</div>}
            <div className={styles.plan}>{plan.name}</div>
            <div className={styles.price}>{plan.price}</div>
            <div className={styles.period}>{plan.period}</div>
            <div className={styles.divider} />
            <ul className={styles.list}>
              {plan.features.map((f) => (
                <li key={f.text}>
                  <span className={f.included ? styles.check : styles.no}>
                    {f.included ? '✓' : '✕'}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
            <Link href="#order" className={styles.btn}>{plan.cta}</Link>
          </div>
        ))}
      </div>

      <div className={styles.categoryLabel} style={{ marginTop: '3rem' }}>✦ Layanan Desain</div>
      <div className={styles.gridDesign}>
        {designPlans.map((plan) => (
          <div key={plan.name} className={styles.card}>
            <div className={styles.plan}>{plan.name}</div>
            <div className={styles.price}>{plan.price}</div>
            <div className={styles.period}>{plan.period}</div>
            <div className={styles.divider} />
            <ul className={styles.list}>
              {plan.features.map((f) => (
                <li key={f.text}>
                  <span className={styles.check}>✓</span>
                  {f.text}
                </li>
              ))}
            </ul>
            <Link href="#order" className={styles.btn}>{plan.cta}</Link>
          </div>
        ))}
      </div>

      <div className={styles.note}>
        * Harga bersifat sementara dan dapat disesuaikan. Hubungi kami untuk diskusi lebih lanjut.
      </div>
    </section>
  )
}
