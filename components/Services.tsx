import Link from 'next/link'
import styles from './Services.module.css'

const digitalServices = [
  {
    num: '01',
    name: 'Undangan Online',
    desc: 'Undangan pernikahan, ulang tahun, dan acara spesial lainnya dalam format digital yang elegan dan mudah dibagikan.',
    features: ['Desain custom & personal', 'Link mudah dibagikan via WA', 'Countdown timer & RSVP'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5z" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    num: '02',
    name: 'Landing Page',
    desc: 'Halaman promosi satu halaman yang fokus pada konversi — cocok untuk produk, event, atau kampanye bisnis Anda.',
    features: ['Desain modern & persuasif', 'Mobile-first', 'Tombol WhatsApp / CTA'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    num: '03',
    name: 'Website',
    desc: 'Website profesional multi-halaman untuk bisnis, portofolio, atau toko online yang merepresentasikan brand Anda.',
    features: ['Company profile / toko online', 'SEO ready & cepat', 'CMS mudah dikelola'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
  },
]

const designServices = [
  {
    num: '04',
    name: 'Desain Instagram',
    desc: 'Feed, story, highlight cover, dan konten Instagram yang konsisten, estetis, dan sesuai identitas brand Anda.',
    features: ['Feed & story template', 'Konsisten dengan branding', 'Format siap upload'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: '05',
    name: 'Flyer & Banner',
    desc: 'Desain flyer promosi dan banner digital atau cetak yang menarik perhatian dan efektif menyampaikan pesan.',
    features: ['Desain eye-catching', 'Format digital & cetak', 'Revisi inklusif'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    num: '06',
    name: 'Brosur',
    desc: 'Brosur profesional untuk keperluan pemasaran, profil usaha, atau event — siap cetak dengan layout yang rapi.',
    features: ['Layout lipat 2 / lipat 3', 'Siap cetak (CMYK)', 'Desain informatif & menarik'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    num: '07',
    name: 'Jasa Edit Foto',
    desc: 'Editing foto profesional untuk produk, portrait, atau konten media sosial yang tampil bersih dan berkelas.',
    features: ['Retouch & color grading', 'Remove background', 'Output resolusi tinggi'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
]

export default function Services() {
  return (
    <section id="layanan" className={styles.services}>
      <div className={styles.header}>
        <div>
          <div className={styles.label}>Apa yang Kami Kerjakan</div>
          <h2 className={styles.title}>Layanan RHP Creatives</h2>
          <p className={styles.sub}>Solusi digital dan desain kreatif untuk tampil profesional di era digital.</p>
        </div>
        <Link href="#order" className={styles.headerCta}>Konsultasi Gratis ↗</Link>
      </div>

      <div className={styles.categoryLabel}>✦ Layanan Digital</div>
      <div className={styles.gridDigital}>
        {digitalServices.map((s) => (
          <div key={s.num} className={styles.card}>
            <div className={styles.num}>{s.num}</div>
            <div className={styles.icon}>{s.icon}</div>
            <div className={styles.name}>{s.name}</div>
            <div className={styles.desc}>{s.desc}</div>
            <ul className={styles.features}>
              {s.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.categoryLabel} style={{ marginTop: '3rem' }}>✦ Layanan Desain</div>
      <div className={styles.gridDesign}>
        {designServices.map((s) => (
          <div key={s.num} className={styles.card}>
            <div className={styles.num}>{s.num}</div>
            <div className={styles.icon}>{s.icon}</div>
            <div className={styles.name}>{s.name}</div>
            <div className={styles.desc}>{s.desc}</div>
            <ul className={styles.features}>
              {s.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
