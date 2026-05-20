'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { formatWaDisplay, normalizeWa } from '@/lib/wa'
import styles from './order.module.css'

type ServiceOption = { id: string; nameId: string; nameEn: string; icon: string }
type PackageOption = { id: string; nameId: string; nameEn: string; price: number; periodId: string; periodEn: string }

const SERVICES: ServiceOption[] = [
  { id: 'undangan', nameId: 'Undangan Online', nameEn: 'Online Invitation', icon: '💌' },
  { id: 'landing-page', nameId: 'Landing Page', nameEn: 'Landing Page', icon: '🚀' },
  { id: 'desain-ig', nameId: 'Desain Instagram', nameEn: 'Instagram Design', icon: '✨' },
  { id: 'edit-foto', nameId: 'Edit Foto', nameEn: 'Photo Edit', icon: '📸' },
]

const PACKAGES: Record<string, PackageOption[]> = {
  undangan: [
    { id: 'undangan-simpel', nameId: 'Undangan Simpel', nameEn: 'Simple Invite', price: 79000, periodId: 'per undangan', periodEn: 'per invitation' },
    { id: 'undangan-aesthetic', nameId: 'Undangan Aesthetic', nameEn: 'Aesthetic Invite', price: 139000, periodId: 'per undangan', periodEn: 'per invitation' },
    { id: 'undangan-sultan', nameId: 'Undangan Sultan', nameEn: 'Sultan Invite', price: 219000, periodId: 'per undangan', periodEn: 'per invitation' },
  ],
  'landing-page': [
    { id: 'landing-santuy', nameId: 'Landing Page Santuy', nameEn: 'Chill Page', price: 299000, periodId: 'per halaman', periodEn: 'per page' },
    { id: 'landing-kece', nameId: 'Landing Page Kece', nameEn: 'Kece Page', price: 649000, periodId: 'per halaman', periodEn: 'per page' },
    { id: 'landing-sultan', nameId: 'Landing Page Sultan', nameEn: 'Sultan Page', price: 1099000, periodId: 'per halaman', periodEn: 'per page' },
  ],
  'desain-ig': [
    { id: 'ig-satu-post', nameId: 'Satu Post Dulu', nameEn: 'One Post First', price: 40000, periodId: 'per post', periodEn: 'per post' },
    { id: 'ig-feed-pemula', nameId: 'Feed Pemula', nameEn: 'Starter Feed', price: 175000, periodId: 'per 5 post', periodEn: 'per 5 posts' },
    { id: 'ig-feed-aesthetic', nameId: 'Feed Aesthetic', nameEn: 'Aesthetic Feed', price: 299000, periodId: 'per 10 post', periodEn: 'per 10 posts' },
    { id: 'ig-feed-sultan', nameId: 'Feed Sultan', nameEn: 'Sultan Feed', price: 699000, periodId: 'per bulan', periodEn: 'per month' },
  ],
  'edit-foto': [
    { id: 'foto-poles-dikit', nameId: 'Poles Dikit', nameEn: 'Quick Polish', price: 20000, periodId: 'per foto', periodEn: 'per photo' },
    { id: 'foto-poles-banyak', nameId: 'Poles Banyak', nameEn: 'Full Polish', price: 75000, periodId: 'per 5 foto', periodEn: 'per 5 photos' },
    { id: 'foto-poles-abis', nameId: 'Poles Abis', nameEn: 'Max Polish', price: 130000, periodId: 'per 10 foto', periodEn: 'per 10 photos' },
  ],
}

const PKG_TO_SERVICE: Record<string, string> = {
  'undangan-simpel': 'undangan', 'undangan-aesthetic': 'undangan', 'undangan-sultan': 'undangan',
  'landing-santuy': 'landing-page', 'landing-kece': 'landing-page', 'landing-sultan': 'landing-page',
  'ig-satu-post': 'desain-ig', 'ig-feed-pemula': 'desain-ig', 'ig-feed-aesthetic': 'desain-ig', 'ig-feed-sultan': 'desain-ig',
  'foto-poles-dikit': 'edit-foto', 'foto-poles-banyak': 'edit-foto', 'foto-poles-abis': 'edit-foto',
}

function fmt(price: number) {
  return `Rp${price.toLocaleString('id-ID')}`
}

type DiscountStatus = {
  inviteeDiscount: { available: boolean; code: string | null; percent: number }
  referrerReward: { available: boolean; count: number; percent: number; code: string }
  earlyBird: { available: boolean; used: boolean; percent: number }
}

type DiscountOption = 'none' | 'referrer_reward' | 'invitee' | 'early_bird'

export default function OrderPage() {
  const { tr, lang } = useLanguage()
  const p = tr.orderPage
  const { data: session, status } = useSession()
  const router = useRouter()

  const [selectedService, setSelectedService] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [wa, setWa] = useState('')
  const [notes, setNotes] = useState('')

  // Discount state
  const [discountStatus, setDiscountStatus] = useState<DiscountStatus | null>(null)
  const [discountOption, setDiscountOption] = useState<DiscountOption>('none')

  const [savedWa, setSavedWa] = useState<string | null>(null)
  const [waMode, setWaMode] = useState<'display' | 'edit'>('edit')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  // Auto-fill from session
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name)
      if (session.user.email && !email) setEmail(session.user.email)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // Auto-select service+package from URL ?paket=
  useEffect(() => {
    const search = window.location.search
    if (!search) return
    const params = new URLSearchParams(search)
    const paket = params.get('paket')
    if (!paket) return
    const serviceId = PKG_TO_SERVICE[paket]
    if (serviceId) {
      setSelectedService(serviceId)
      setSelectedPackage(paket)
    }
  }, [])

  // Fetch discount status + saved WA once authenticated
  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/referral/discount-status')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        setDiscountStatus(data as DiscountStatus)
        if (data.referrerReward?.available) {
          setDiscountOption('referrer_reward')
        } else if (data.inviteeDiscount?.available) {
          setDiscountOption('invitee')
        } else if (data.earlyBird?.available) {
          setDiscountOption('early_bird')
        }
      })
      .catch(() => {})
    fetch('/api/user/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.whatsapp) {
          setSavedWa(data.whatsapp)
          setWa(data.whatsapp)
          setWaMode('display')
        }
      })
      .catch(() => {})
  }, [status])

  const selectedSvc = SERVICES.find(s => s.id === selectedService)
  const selectedPkg = selectedPackage ? (PACKAGES[selectedService] ?? []).find(p => p.id === selectedPackage) : null
  const originalPrice = selectedPkg?.price ?? 0

  // Compute discount based on selected option
  let discountPercent = 0
  let discountAmount = 0
  let discountLabel = ''

  if (discountOption === 'referrer_reward') {
    discountPercent = 0.15
    discountLabel = p.discountReferrerReward
  } else if (discountOption === 'invitee') {
    discountPercent = 0.10
    discountLabel = p.discountReferral
  } else if (discountOption === 'early_bird') {
    discountPercent = 0.25
    discountLabel = p.discount
  }
  discountAmount = Math.round(originalPrice * discountPercent)
  const totalPrice = originalPrice - discountAmount

  function handleDiscountOptionChange(opt: DiscountOption) {
    setDiscountOption(opt)
  }

  async function handlePayment() {
    if (!selectedService || !selectedPackage || !name.trim() || !email.trim() || !wa.trim()) return
    setIsSubmitting(true)
    setError('')
    // Auto-save WA if changed
    const normalizedWa = normalizeWa(wa.trim())
    if (normalizedWa !== savedWa) {
      fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: normalizedWa }),
      }).catch(() => {})
      setSavedWa(normalizedWa)
    }

    let discountMode: string | undefined

    if (discountOption === 'referrer_reward') {
      discountMode = 'referrer_reward'
    } else if (discountOption === 'invitee') {
      discountMode = 'invitee'
    } else if (discountOption === 'early_bird') {
      discountMode = 'ebird'
    } else {
      discountMode = 'none'
    }

    try {
      const res = await fetch('/api/payment/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          name: name.trim(),
          email: email.trim(),
          wa: wa.trim(),
          notes: notes.trim() || undefined,
          discountMode,
        }),
      })

      if (res.status === 401) {
        router.push('/login?callbackUrl=/order')
        return
      }

      const data = await res.json()

      if (!res.ok || !data.orderId) {
        const msg = data.detail || data.error || p.errorGeneral
        console.error('[order] create-transaction failed:', data)
        setError(msg)
        setIsSubmitting(false)
        return
      }

      router.push(`/order/payment/${data.orderId}`)
    } catch (err) {
      console.error('[order] handlePayment exception:', err)
      setError(p.errorGeneral)
      setIsSubmitting(false)
    }
  }

  const waConsultUrl = selectedPkg
    ? `https://wa.me/6285179992598?text=${encodeURIComponent(`Halo RHP Creatives! 👋 Mau konsultasi dulu sebelum order:\n\nLayanan: ${lang === 'id' ? (selectedSvc?.nameId ?? '') : (selectedSvc?.nameEn ?? '')}\nPaket: ${lang === 'id' ? selectedPkg.nameId : selectedPkg.nameEn}\nTotal: ${fmt(totalPrice)}`)}`
    : 'https://wa.me/6285179992598?text=Halo%20RHP%20Creatives!%20Mau%20konsultasi%20dulu%20nih%20%F0%9F%91%8B'

  const canPay = selectedService && selectedPackage && name.trim() && email.trim() && wa.trim() && !isSubmitting

  const hasAutoDiscount = !!(discountStatus?.earlyBird?.available || discountStatus?.inviteeDiscount?.available || discountStatus?.referrerReward?.available)

  return (
    <main className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* ── Confirm Modal ── */}
      {showConfirm && selectedPkg && (
        <div className={styles.modalBackdrop} onClick={() => setShowConfirm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowConfirm(false)}>✕</button>
            <p className={styles.modalTitle}>{p.confirmTitle}</p>
            <p className={styles.modalSub}>{p.confirmSub}</p>

            <div className={styles.modalDetails}>
              <div className={styles.modalRow}>
                <span className={styles.modalRowLabel}>{tr.paymentPage.serviceLabel}</span>
                <span className={styles.modalRowValue}>{lang === 'id' ? (selectedSvc?.nameId ?? '') : (selectedSvc?.nameEn ?? '')}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalRowLabel}>{tr.orderSuccess.packageLabel}</span>
                <span className={styles.modalRowValue}>{lang === 'id' ? selectedPkg.nameId : selectedPkg.nameEn}</span>
              </div>
              {discountAmount > 0 && (
                <div className={styles.modalRow}>
                  <span className={styles.modalRowLabel}>{discountLabel}</span>
                  <span className={styles.modalRowValue}>-{fmt(discountAmount)}</span>
                </div>
              )}
              <div className={styles.modalDivider} />
              <div className={`${styles.modalRow} ${styles.modalTotal}`}>
                <span className={styles.modalRowLabel}>{p.total}</span>
                <span className={styles.modalRowValue}>{fmt(totalPrice)}</span>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalPrimary}
                onClick={() => { setShowConfirm(false); handlePayment() }}
                disabled={isSubmitting}
              >
                {isSubmitting ? p.paying : p.confirmGasken}
              </button>
              <a
                href={waConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalSecondary}
                onClick={() => setShowConfirm(false)}
              >
                {p.confirmWa}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroTag}>{p.tag}</div>
          <h1 className={styles.heroTitle}>{p.title}</h1>
          <p className={styles.heroSub}>{p.sub}</p>
        </div>

        <div className={styles.layout}>
          {/* ── Form ── */}
          <div className={styles.form}>

            {/* Step 1 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNum}>1</span>
                {p.step1}
              </h2>
              <div className={styles.serviceGrid}>
                {SERVICES.map(svc => (
                  <button
                    key={svc.id}
                    className={`${styles.serviceCard} ${selectedService === svc.id ? styles.selected : ''}`}
                    onClick={() => { setSelectedService(svc.id); setSelectedPackage('') }}
                  >
                    <span className={styles.serviceIcon}>{svc.icon}</span>
                    <span className={styles.serviceName}>{lang === 'id' ? svc.nameId : svc.nameEn}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2 */}
            {selectedService && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionNum}>2</span>
                  {p.step2}
                </h2>
                <div className={styles.packageGrid}>
                  {(PACKAGES[selectedService] ?? []).map(pkg => (
                    <button
                      key={pkg.id}
                      className={`${styles.packageCard} ${selectedPackage === pkg.id ? styles.selected : ''}`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <span className={styles.packageName}>{lang === 'id' ? pkg.nameId : pkg.nameEn}</span>
                      <span className={styles.packagePrice}>{fmt(pkg.price)}</span>
                      <span className={styles.packagePeriod}>{lang === 'id' ? pkg.periodId : pkg.periodEn}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Step 3 */}
            {selectedPackage && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionNum}>3</span>
                  {p.step3}
                </h2>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>{p.nameLabel}</label>
                    <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder={p.namePlaceholder} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>{p.emailLabel}</label>
                    <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="kamu@email.com" />
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label}>{p.waLabel}</label>
                    {waMode === 'display' && savedWa ? (
                      <div className={styles.waSavedRow}>
                        <span className={styles.waSavedText}>{formatWaDisplay(savedWa)}</span>
                        <span className={styles.waBadge}>{p.waSavedBadge}</span>
                        <button type="button" className={styles.waChangeBtn} onClick={() => { setWaMode('edit'); setWa('') }}>
                          {p.waChangeLink}
                        </button>
                      </div>
                    ) : (
                      <>
                        <input className={styles.input} value={wa} onChange={e => setWa(e.target.value)} placeholder={p.waPlaceholder} />
                        {!savedWa && wa.trim() && (
                          <span className={styles.waHint}>{p.waWillSave}</span>
                        )}
                      </>
                    )}
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label}>{p.notesLabel}</label>
                    <textarea className={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} placeholder={p.notesPlaceholder} rows={3} />
                  </div>
                </div>
              </section>
            )}

            {/* Step 4 — Discounts */}
            {selectedPackage && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionNum}>4</span>
                  {p.step4}
                </h2>

                <div className={styles.discountOptions}>
                  {/* Early bird option */}
                  {discountStatus?.earlyBird?.available && (
                    <label className={`${styles.discountOption} ${discountOption === 'early_bird' ? styles.discountOptionSelected : ''}`}>
                      <input
                        type="radio"
                        name="discount"
                        value="early_bird"
                        checked={discountOption === 'early_bird'}
                        onChange={() => handleDiscountOptionChange('early_bird')}
                      />
                      <div className={styles.discountOptionContent}>
                        <span className={styles.discountOptionLabel}>{p.discountAutoEarlyBird}</span>
                        <span className={styles.discountOptionBadge}>{p.discountAutoEarlyBirdBadge}</span>
                      </div>
                    </label>
                  )}

                  {/* Referrer reward option */}
                  {discountStatus?.referrerReward?.available && (
                    <label className={`${styles.discountOption} ${discountOption === 'referrer_reward' ? styles.discountOptionSelected : ''}`}>
                      <input
                        type="radio"
                        name="discount"
                        value="referrer_reward"
                        checked={discountOption === 'referrer_reward'}
                        onChange={() => handleDiscountOptionChange('referrer_reward')}
                      />
                      <div className={styles.discountOptionContent}>
                        <span className={styles.discountOptionLabel}>{p.discountAutoReferrer}</span>
                        <span className={styles.discountOptionBadge}>{p.discountAutoReferrerBadge} ×{discountStatus.referrerReward.count}</span>
                      </div>
                    </label>
                  )}

                  {/* Invitee discount option */}
                  {discountStatus?.inviteeDiscount?.available && (
                    <label className={`${styles.discountOption} ${discountOption === 'invitee' ? styles.discountOptionSelected : ''}`}>
                      <input
                        type="radio"
                        name="discount"
                        value="invitee"
                        checked={discountOption === 'invitee'}
                        onChange={() => handleDiscountOptionChange('invitee')}
                      />
                      <div className={styles.discountOptionContent}>
                        <span className={styles.discountOptionLabel}>{p.discountAutoInvitee}</span>
                        <span className={styles.discountOptionBadge}>{p.discountAutoInviteeBadge}</span>
                      </div>
                    </label>
                  )}

                  {/* No discount */}
                  {hasAutoDiscount && (
                    <label className={`${styles.discountOption} ${discountOption === 'none' ? styles.discountOptionSelected : ''}`}>
                      <input
                        type="radio"
                        name="discount"
                        value="none"
                        checked={discountOption === 'none'}
                        onChange={() => handleDiscountOptionChange('none')}
                      />
                      <div className={styles.discountOptionContent}>
                        <span className={styles.discountOptionLabel}>{p.discountNone}</span>
                      </div>
                    </label>
                  )}
                </div>

                {!hasAutoDiscount && discountStatus !== null && (
                  <p className={styles.voucherError}>
                    {p.discountNone} — <Link href="/promo" className={styles.promoLink}>{p.noDiscountsPromo}</Link>
                  </p>
                )}
              </section>
            )}
          </div>

          {/* ── Summary ── */}
          <aside className={styles.summaryWrap}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>{p.summaryLabel}</h3>

              {selectedPkg ? (
                <>
                  <div className={styles.summaryService}>
                    {lang === 'id' ? (selectedSvc?.nameId ?? '') : (selectedSvc?.nameEn ?? '')}
                  </div>
                  <div className={styles.summaryPackage}>
                    {lang === 'id' ? selectedPkg.nameId : selectedPkg.nameEn}
                  </div>
                  <div className={styles.summaryDivider} />
                  <div className={styles.summaryRow}>
                    <span>{p.originalPrice}</span>
                    <span className={discountAmount > 0 ? styles.priceStrike : ''}>{fmt(originalPrice)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                      <span>{discountLabel}</span>
                      <span>-{fmt(discountAmount)}</span>
                    </div>
                  )}
                  <div className={styles.summaryDivider} />
                  <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                    <span>{p.total}</span>
                    <span>{fmt(totalPrice)}</span>
                  </div>
                </>
              ) : (
                <p className={styles.summaryEmpty}>{p.selectFirst}</p>
              )}

              {error && <p className={styles.errorMsg}>{error}</p>}

              {status === 'unauthenticated' ? (
                <div className={styles.loginPrompt}>
                  <p>{p.loginPrompt}</p>
                  <Link href="/login?callbackUrl=/order" className={styles.loginBtn}>{p.loginBtn}</Link>
                </div>
              ) : (
                <button
                  className={styles.payBtn}
                  onClick={() => { if (canPay) setShowConfirm(true) }}
                  disabled={!canPay}
                >
                  {isSubmitting ? p.paying : p.payBtn}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
