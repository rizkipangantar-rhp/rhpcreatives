'use client'
import { useEffect, useState } from 'react'
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

type PromoInfo = {
  id: string; name: string; description: string
  discount_type: 'percent' | 'nominal'; discount_value: number
  quota: number; claimed: number; remaining: number | null; is_full: boolean
  end_date: string | null; requires_claim: boolean
}

function PromoCard({ promo, lang }: { promo: PromoInfo; lang: string }) {
  const discountDisplay = promo.discount_type === 'percent'
    ? `${promo.discount_value}%`
    : `Rp${promo.discount_value.toLocaleString('id-ID')}`

  const href = promo.requires_claim ? `/promo/klaim/${promo.id}` : '/order'
  const isFull = promo.is_full

  return (
    <div className={styles.earlyBirdInner} style={{ opacity: isFull ? 0.65 : 1 }}>
      {isFull && <div className={styles.earlyBirdBadge} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
        {lang === 'id' ? '🚫 HABIS' : '🚫 SOLD OUT'}
      </div>}
      {!isFull && <div className={styles.earlyBirdBadge}>🔥 PROMO AKTIF</div>}
      <div className={styles.earlyBirdLabel}>{promo.name}</div>
      <h2 className={styles.earlyBirdTitle}>Diskon {discountDisplay}</h2>
      <p className={styles.earlyBirdDesc}>{promo.description}</p>

      <div className={styles.earlyBirdStats}>
        <div className={styles.earlyBirdStat}>
          <div className={styles.earlyBirdStatNum}>{discountDisplay}</div>
          <div className={styles.earlyBirdStatLabel}>{lang === 'id' ? 'Diskon' : 'Discount'}</div>
        </div>
        {promo.quota > 0 && (
          <>
            <div className={styles.earlyBirdDivider} />
            <div className={styles.earlyBirdStat}>
              <div className={styles.earlyBirdStatNum}>{promo.remaining ?? Math.max(0, promo.quota - promo.claimed)}</div>
              <div className={styles.earlyBirdStatLabel}>{lang === 'id' ? 'Slot Tersisa' : 'Slots Left'}</div>
            </div>
          </>
        )}
        {promo.end_date && (
          <>
            <div className={styles.earlyBirdDivider} />
            <div className={styles.earlyBirdStat}>
              <div className={styles.earlyBirdStatNum}>
                {new Date(promo.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </div>
              <div className={styles.earlyBirdStatLabel}>{lang === 'id' ? 'Berakhir' : 'Ends'}</div>
            </div>
          </>
        )}
      </div>

      {!isFull && (
        <Link href={href} className={styles.earlyBirdCta}>
          {promo.requires_claim
            ? (lang === 'id' ? 'Klaim Sekarang' : 'Claim Now')
            : (lang === 'id' ? 'Order Sekarang' : 'Order Now')}
        </Link>
      )}
      {isFull && (
        <span className={styles.earlyBirdCta} style={{ opacity: 0.4, cursor: 'not-allowed' }}>
          {lang === 'id' ? 'Slot Habis' : 'Sold Out'}
        </span>
      )}
    </div>
  )
}

export default function PromoContent() {
  const { tr, lang } = useLanguage()
  const promo = tr.promo
  const [promos, setPromos] = useState<PromoInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/promos')
      .then(r => r.json())
      .then(data => setPromos(data.promos ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── Dynamic Promos ── */}
      {promos.map(p => (
        <section key={p.id} className={styles.earlyBirdSection}>
          <PromoCard promo={p} lang={lang} />
        </section>
      ))}

      {/* Fallback if no promos loaded yet */}
      {!loading && promos.length === 0 && (
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
            <Link href="/promo/klaim/promo_early_bird" className={styles.earlyBirdCta}>
              {promo.earlyBird.cta}
            </Link>
          </div>
        </section>
      )}

      {/* ── Bundling ── */}
      <section className={styles.bundlingSection}>
        <div className={styles.sectionLabel}>{promo.bundling.label}</div>
        <h2 className={styles.sectionTitle}>{promo.bundling.title}</h2>
        <p className={styles.sectionSub}>{promo.bundling.sub}</p>

        <div className={styles.bundleGrid}>
          {promo.bundling.items.map((item, i) => (
            <div key={item.name} className={`${styles.bundleCard} ${i === promo.bundling.items.length - 1 ? styles.bundleCardFeatured : ''}`}>
              <div className={styles.bundleName}>{item.name}</div>
              <div className={styles.bundleIncludes}>{item.includes}</div>
              <div className={styles.bundlePriceRow}>
                <div className={styles.bundlePrice}>{item.price}</div>
                <div className={styles.bundleOriginal}>{item.originalPrice}</div>
              </div>
              <div className={styles.bundleSave}>{item.save}</div>
              <a
                href={`https://wa.me/6285179992598?text=${encodeURIComponent(lang === 'id' ? 'Halo RHP Creatives! Mau konsultasi paket bundling nih' : 'Hi RHP Creatives! I want to know more about the bundle package')}`}
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
