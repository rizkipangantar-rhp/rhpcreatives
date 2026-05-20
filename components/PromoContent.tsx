'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './PromoContent.module.css'

const STEP_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
  </svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>,
]


export default function PromoContent() {
  const { tr } = useLanguage()
  const promo = tr.promo

  return (
    <>
      {/* ── Early Bird ── */}
      <section className={styles.earlyBirdSection}>
        <div className={styles.earlyBirdInner}>
          <div className={styles.earlyBirdBadge}>{promo.earlyBird.badge}</div>
          <div className={styles.earlyBirdLabel}>{promo.earlyBird.label}</div>
          <h2 className={styles.earlyBirdTitle}>{promo.earlyBird.title}</h2>
          <p className={styles.earlyBirdDesc}>{promo.earlyBird.desc}</p>

          <div className={styles.earlyBirdStats}>
            <div className={styles.earlyBirdStat}>
              <div className={styles.earlyBirdStatNum}>{promo.earlyBird.discount}</div>
              <div className={styles.earlyBirdStatLabel}>Diskon</div>
            </div>
            <div className={styles.earlyBirdDivider} />
            <div className={styles.earlyBirdStat}>
              <div className={styles.earlyBirdStatNum}>{promo.earlyBird.quota}</div>
              <div className={styles.earlyBirdStatLabel}>Kuota</div>
            </div>
          </div>

          <Link href="/promo/klaim-early-bird" className={styles.earlyBirdCta}>
            {promo.earlyBird.cta}
          </Link>
        </div>
      </section>

      {/* ── Bundling ── */}
      <section className={styles.bundlingSection}>
        <div className={styles.sectionLabel}>{promo.bundling.label}</div>
        <h2 className={styles.sectionTitle}>{promo.bundling.title}</h2>
        <p className={styles.sectionSub}>{promo.bundling.sub}</p>

        <div className={styles.bundleGrid}>
          {promo.bundling.items.map((item, i) => (
            <div key={item.name} className={`${styles.bundleCard} ${i === 3 ? styles.bundleCardFeatured : ''}`}>
              <div className={styles.bundleName}>{item.name}</div>
              <div className={styles.bundleIncludes}>{item.includes}</div>
              <div className={styles.bundlePriceRow}>
                <div className={styles.bundlePrice}>{item.price}</div>
                <div className={styles.bundleOriginal}>{item.originalPrice}</div>
              </div>
              <div className={styles.bundleSave}>{item.save}</div>
              <a
                href="https://wa.me/6285179992598?text=Halo%20RHP%20Creatives!%20Mau%20konsultasi%20paket%20bundling%20nih"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bundleBtn}
              >
                {promo.bundling.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Referral ── */}
      <section className={styles.referralSection}>
        <div className={styles.sectionLabel}>{promo.referral.label}</div>
        <h2 className={styles.sectionTitle}>{promo.referral.title}</h2>
        <p className={styles.sectionSub}>{promo.referral.sub}</p>

        <div className={styles.referralGrid}>
          <div className={styles.referralCard}>
            <div className={styles.referralDiscount}>{promo.referral.referrerDiscount}</div>
            <div className={styles.referralCardTitle}>{promo.referral.referrerTitle}</div>
            <p className={styles.referralCardDesc}>{promo.referral.referrerDesc}</p>
          </div>
          <div className={styles.referralArrow}>⇄</div>
          <div className={styles.referralCard}>
            <div className={styles.referralDiscount}>{promo.referral.inviteeDiscount}</div>
            <div className={styles.referralCardTitle}>{promo.referral.inviteeTitle}</div>
            <p className={styles.referralCardDesc}>{promo.referral.inviteeDesc}</p>
          </div>
        </div>

        <div className={styles.howBox}>
          <div className={styles.howTitle}>{promo.referral.howTitle}</div>
          <div className={styles.howSteps}>
            {promo.referral.steps.map((step, i) => (
              <div key={i} className={styles.howStep}>
                <div className={styles.howStepIcon}>{STEP_ICONS[i]}</div>
                <div className={styles.howStepNum}>{i + 1}</div>
                <div className={styles.howStepText}>{step}</div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/profil" className={styles.howCta}>
            {promo.referral.cta}
          </Link>
        </div>
      </section>

    </>
  )
}
