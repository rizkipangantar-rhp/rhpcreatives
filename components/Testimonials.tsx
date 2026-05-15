import styles from './Testimonials.module.css'

const testimonials = [
  {
    initials: 'NA',
    name: 'Nadia Aulia',
    role: 'Pengantin, Undangan Online',
    text: 'Undangan online-nya cantik banget! Banyak tamu yang compliment desainnya. Prosesnya cepat, revisi dilayani dengan sabar. Pokoknya rekomen banget!',
  },
  {
    initials: 'RP',
    name: 'Rizal Pratama',
    role: 'Owner, RP Clothing',
    text: 'Landing page yang dibuat RHP Creatives beneran ngaruh ke penjualan. Tampilannya profesional dan tombol WA-nya langsung banyak yang klik. Worth it!',
  },
  {
    initials: 'DS',
    name: 'Dina Sari',
    role: 'UMKM Kuliner',
    text: 'Feed Instagram saya jadi jauh lebih estetis dan konsisten. Banyak pelanggan yang DM nanya beli di mana setelah lihat konten yang sudah didesain RHP.',
  },
  {
    initials: 'AF',
    name: 'Andi Firmansyah',
    role: 'Event Organizer',
    text: 'Flyer dan banner event kami selalu dikerjakan RHP Creatives. Hasilnya selalu keren, pengerjaan cepat, dan harganya sangat masuk akal.',
  },
  {
    initials: 'MR',
    name: 'Maya Rahayu',
    role: 'Fotografer',
    text: 'Jasa edit foto-nya rapi dan natural banget. Warna foto saya jadi lebih hidup tanpa terlihat over-edited. Langsung jadi langganan tetap!',
  },
  {
    initials: 'BN',
    name: 'Bagas Nugroho',
    role: 'Startup Founder',
    text: 'Website company profile kami selesai tepat waktu dan hasilnya melebihi ekspektasi. Responsif di semua device dan loading-nya cepat. Sangat puas!',
  },
]

export default function Testimonials() {
  return (
    <section id="testimoni" className={styles.section}>
      <div className={styles.label}>Kata Klien Kami</div>
      <h2 className={styles.title}>Mereka Sudah Merasakannya</h2>
      <p className={styles.sub}>Kepercayaan klien adalah prioritas utama RHP Creatives.</p>

      <div className={styles.grid}>
        {testimonials.map((t) => (
          <div key={t.initials} className={styles.card}>
            <div className={styles.quote}>&ldquo;</div>
            <p className={styles.text}>{t.text}</p>
            <div className={styles.author}>
              <div className={styles.avatar}>{t.initials}</div>
              <div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.role}>{t.role}</div>
                <div className={styles.stars}>★★★★★</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
