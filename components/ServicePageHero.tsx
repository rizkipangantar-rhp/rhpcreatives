'use client'
import { useLanguage } from '@/context/LanguageContext'
import styles from './ServicePageHero.module.css'

type PageType = 'layananDigital' | 'layananDesain'

interface Props {
  pageType: PageType
}

const CHIP_HREFS: Record<PageType, string[]> = {
  layananDigital: ['undangan-online', 'landing-page'],
  layananDesain:  ['desain-instagram', 'edit-foto'],
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function ServicePageHero({ pageType }: Props) {
  const { tr } = useLanguage()
  const h  = tr.pageHero[pageType]
  const sp = tr.servicePage[pageType === 'layananDigital' ? 'digital' : 'design']
  const chipHrefs = CHIP_HREFS[pageType]

  return (
    <section className={styles.hero}>
      <div className={styles.label}>{h.label}</div>
      <h1 className={styles.title}>{h.title}</h1>
      <p className={styles.sub}>{h.sub}</p>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={() => scrollToId('harga')}>
          {sp.ctaPrimary}
        </button>
        {/* Desktop: direct link to /order */}
        <a href="/order" className={`${styles.btnSecondary} ${styles.desktopOnly}`}>
          {sp.ctaSecondaryDesktop}
        </a>
        {/* Mobile: scroll to pricing section */}
        <button
          className={`${styles.btnSecondary} ${styles.mobileOnly}`}
          onClick={() => scrollToId('harga')}
        >
          {sp.ctaSecondaryMobile}
        </button>
      </div>

      <div className={styles.chips}>
        {sp.chips.map((label, i) => (
          <button
            key={label}
            className={styles.chip}
            onClick={() => scrollToId(chipHrefs[i])}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
