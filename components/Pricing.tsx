'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Pricing.module.css'
import PricingBanner from './PricingBanner'

const TIER_TO_PKG: Record<string, string> = {
  'Undangan Simpel': 'undangan-simpel', 'Simple Invite': 'undangan-simpel',
  'Undangan Aesthetic': 'undangan-aesthetic', 'Aesthetic Invite': 'undangan-aesthetic',
  'Undangan Sultan': 'undangan-sultan', 'Sultan Invite': 'undangan-sultan',
  'Halaman Santuy': 'landing-santuy', 'Chill Page': 'landing-santuy',
  'Halaman Kece': 'landing-kece', 'Kece Page': 'landing-kece',
  'Halaman Sultan': 'landing-sultan', 'Sultan Page': 'landing-sultan',
  'Satu Post Dulu': 'ig-satu-post', 'One Post First': 'ig-satu-post',
  'Feed Pemula': 'ig-feed-pemula', 'Starter Feed': 'ig-feed-pemula',
  'Feed Aesthetic': 'ig-feed-aesthetic', 'Aesthetic Feed': 'ig-feed-aesthetic',
  'Feed Sultan': 'ig-feed-sultan', 'Sultan Feed': 'ig-feed-sultan',
  'Poles Dikit': 'foto-poles-dikit', 'Quick Polish': 'foto-poles-dikit',
  'Poles Banyak': 'foto-poles-banyak', 'Full Polish': 'foto-poles-banyak',
  'Poles Abis': 'foto-poles-abis', 'Max Polish': 'foto-poles-abis',
}

interface PricingProps {
  filter?: 'digital' | 'design' | 'all'
  showHeader?: boolean
}

export default function Pricing({ filter = 'all', showHeader = true }: PricingProps) {
  const { tr } = useLanguage()
  const p = tr.pricing

  const showDigital = filter === 'all' || filter === 'digital'
  const showDesign = filter === 'all' || filter === 'design'

  const DIGITAL_IDS = ['undangan-online', 'landing-page']
  const DESIGN_IDS  = ['desain-instagram', 'edit-foto']

  return (
    <section id="harga" className={styles.pricing}>
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.label}>{p.label}</div>
          <h2 className={styles.title}>{p.title}</h2>
          <p className={styles.sub}>{p.sub}</p>
        </div>
      )}

      <PricingBanner />

      {showDigital && (
        <div className={styles.category}>
          <div className={styles.categoryLabel}>{p.digitalLabel}</div>
          {p.digital.map((group, idx) => (
            <div key={group.name} id={DIGITAL_IDS[idx]} className={styles.serviceGroup}>
              <h3 className={styles.serviceGroupTitle}>{group.name}</h3>
              <div className={styles.tiersGrid}>
                {group.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`${styles.card} ${tier.highlighted ? styles.featured : ''} ${tier.isCustom ? styles.customCard : ''}`}
                  >
                    {tier.highlighted && <div className={styles.badge}>{p.popularBadge}</div>}
                    {tier.save && <div className={styles.saveBadge}>{tier.save}</div>}
                    <div className={styles.plan}>{tier.name}</div>
                    {tier.isCustom ? (
                      <div className={styles.priceCustom}>{tier.price}</div>
                    ) : (
                      <div className={styles.price}>{tier.price}</div>
                    )}
                    <div className={styles.period}>{tier.period}</div>
                    <div className={styles.delivery}>⏱ {tier.delivery}</div>
                    <div className={styles.divider} />
                    <ul className={styles.list}>
                      {tier.features.map((f) => (
                        <li key={f}>
                          <span className={styles.check}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {tier.isCustom ? (
                      <a
                        href="https://wa.me/6285179992598"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles.btnConsult}`}
                      >
                        {p.consultCta}
                      </a>
                    ) : (
                      <Link href={`/order?paket=${TIER_TO_PKG[tier.name] ?? ''}`} className={styles.btn}>{p.orderCta}</Link>
                    )}
                  </div>
                ))}
              </div>
              {group.consultNote && <p className={styles.consultNote}>{group.consultNote}</p>}
              {group.revisiNote && <p className={styles.revisiNote}>{group.revisiNote}</p>}
            </div>
          ))}
        </div>
      )}

      {showDesign && (
        <div className={styles.category}>
          <div className={styles.categoryLabel}>{p.designLabel}</div>
          {p.design.map((group, idx) => (
            <div key={group.name} id={DESIGN_IDS[idx]} className={styles.serviceGroup}>
              <h3 className={styles.serviceGroupTitle}>{group.name}</h3>
              <div className={styles.tiersGrid}>
                {group.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`${styles.card} ${tier.highlighted ? styles.featured : ''}`}
                  >
                    {tier.highlighted && <div className={styles.badge}>{p.popularBadge}</div>}
                    {tier.save && <div className={styles.saveBadge}>{tier.save}</div>}
                    <div className={styles.plan}>{tier.name}</div>
                    <div className={styles.price}>{tier.price}</div>
                    <div className={styles.period}>{tier.period}</div>
                    <div className={styles.delivery}>⏱ {tier.delivery}</div>
                    <div className={styles.divider} />
                    <ul className={styles.list}>
                      {tier.features.map((f) => (
                        <li key={f}>
                          <span className={styles.check}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/order?paket=${TIER_TO_PKG[tier.name] ?? ''}`} className={styles.btn}>{p.orderCta}</Link>
                  </div>
                ))}
              </div>
              {group.revisiNote && <p className={styles.revisiNote}>{group.revisiNote}</p>}
            </div>
          ))}
        </div>
      )}

      <div className={styles.note}>{p.note}</div>
    </section>
  )
}
