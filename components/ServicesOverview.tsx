'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './ServicesOverview.module.css'

const SERVICES = [
  {
    icon: '💌',
    nameId: 'Undangan Online',
    nameEn: 'Online Invitation',
    descId: 'Undangan digital buat nikah, ultah, atau gathering. Share link aja, tamu langsung takjub!',
    descEn: 'Digital invites for weddings, birthdays & events. Share a link, guests instantly impressed!',
    priceId: 'Mulai Rp79.000',
    priceEn: 'From Rp79.000',
    hot: true,
    href: '/layanan-digital',
    paket: 'undangan-simpel',
  },
  {
    icon: '🚀',
    nameId: 'Landing Page',
    nameEn: 'Landing Page',
    descId: 'Halaman web profesional yang bikin produk/bisnis kamu langsung dipercaya. Konversi naik, DM masuk!',
    descEn: 'Professional web page that makes your biz instantly trustworthy. More conversions, more DMs!',
    priceId: 'Mulai Rp299.000',
    priceEn: 'From Rp299.000',
    hot: false,
    href: '/layanan-digital',
    paket: 'landing-santuy',
  },
  {
    icon: '✨',
    nameId: 'Desain IG',
    nameEn: 'IG Design',
    descId: 'Feed Instagram estetis, konsisten, dan bikin orang stop scroll. Vibe-nya langsung naik level!',
    descEn: 'Aesthetic, consistent IG feed that makes people stop scrolling. Instant vibe upgrade!',
    priceId: 'Mulai Rp40.000',
    priceEn: 'From Rp40.000',
    hot: true,
    href: '/layanan-desain',
    paket: 'ig-satu-post',
  },
  {
    icon: '📸',
    nameId: 'Edit Foto',
    nameEn: 'Photo Edit',
    descId: 'Foto formal yang rapi, bersih, dan profesional. Pas buat KTP, lamaran kerja, atau LinkedIn!',
    descEn: 'Clean, professional photo edits. Perfect for ID photos, job apps, or LinkedIn!',
    priceId: 'Mulai Rp20.000',
    priceEn: 'From Rp20.000',
    hot: false,
    href: '/layanan-desain',
    paket: 'foto-poles-dikit',
  },
]

export default function ServicesOverview() {
  const { tr, lang } = useLanguage()
  const o = tr.homeOverview

  return (
    <section id="layanan" className={styles.section}>
      <div className={styles.label}>{o.label}</div>
      <h2 className={styles.title}>{o.title}</h2>
      <p className={styles.sub}>{o.sub}</p>

      <div className={styles.bento}>
        {SERVICES.map(svc => (
          <div key={svc.paket} className={styles.card}>
            {svc.hot && <span className={styles.hotBadge}>{o.hotBadge}</span>}
            <div className={styles.cardTop}>
              <span className={styles.icon}>{svc.icon}</span>
              <div>
                <h3 className={styles.cardName}>{lang === 'id' ? svc.nameId : svc.nameEn}</h3>
                <p className={styles.cardDesc}>{lang === 'id' ? svc.descId : svc.descEn}</p>
              </div>
            </div>
            <div className={styles.cardPrice}>{lang === 'id' ? svc.priceId : svc.priceEn}</div>
            <div className={styles.cardActions}>
              <Link href={svc.href} className={styles.btnOutline}>{o.viewPackageBtn}</Link>
              <Link href={`/order?paket=${svc.paket}`} className={styles.btnPrimary}>{o.orderNowBtn}</Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.viewAll}>
        <Link href="/layanan-digital" className={styles.viewAllBtn}>{o.viewAllBtn}</Link>
      </div>
    </section>
  )
}
