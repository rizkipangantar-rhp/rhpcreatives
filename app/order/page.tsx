'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
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

function fmt(price: number) {
  return `Rp${price.toLocaleString('id-ID')}`
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: unknown) => void
        onPending: (result: unknown) => void
        onError: (result: unknown) => void
        onClose: () => void
      }) => void
    }
  }
}

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
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const [voucherStatus, setVoucherStatus] = useState<'idle' | 'valid' | 'invalid' | 'checking'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name)
      if (session.user.email && !email) setEmail(session.user.email)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
    const snapUrl = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    const script = document.createElement('script')
    script.src = snapUrl
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? '')
    script.async = true
    document.head.appendChild(script)
    return () => { if (document.head.contains(script)) document.head.removeChild(script) }
  }, [])

  const selectedSvc = SERVICES.find(s => s.id === selectedService)
  const selectedPkg = selectedPackage ? (PACKAGES[selectedService] ?? []).find(p => p.id === selectedPackage) : null
  const originalPrice = selectedPkg?.price ?? 0
  const discountAmount = Math.round(originalPrice * voucherDiscount)
  const totalPrice = originalPrice - discountAmount

  async function applyVoucher() {
    if (!voucherCode.trim()) return
    setVoucherStatus('checking')
    try {
      const res = await fetch('/api/payment/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode.trim() }),
      })
      const data = await res.json()
      if (data.valid) {
        setVoucherDiscount(data.discount)
        setVoucherStatus('valid')
      } else {
        setVoucherDiscount(0)
        setVoucherStatus('invalid')
      }
    } catch {
      setVoucherStatus('invalid')
    }
  }

  async function handlePayment() {
    if (!selectedService || !selectedPackage || !name.trim() || !email.trim() || !wa.trim()) return
    setIsSubmitting(true)
    setError('')

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
          voucherCode: voucherStatus === 'valid' ? voucherCode.trim() : undefined,
        }),
      })

      if (res.status === 401) {
        router.push('/login?callbackUrl=/order')
        return
      }

      const data = await res.json()

      if (!res.ok || !data.snapToken || !data.orderId) {
        // Surface actual error from API if available
        const msg = data.detail || data.error || p.errorGeneral
        console.error('[order] create-transaction failed:', data)
        setError(msg)
        setIsSubmitting(false)
        return
      }

      if (typeof window.snap === 'undefined') {
        setError('Snap.js belum dimuat. Coba refresh halaman.')
        setIsSubmitting(false)
        return
      }

      window.snap.pay(data.snapToken, {
        onSuccess: () => router.push(`/order/sukses/${data.orderId}`),
        onPending: () => router.push(`/order/sukses/${data.orderId}`),
        onError: (result: unknown) => {
          console.error('[snap] onError:', result)
          setError(p.errorGeneral)
          setIsSubmitting(false)
        },
        onClose: () => setIsSubmitting(false),
      })
    } catch (err) {
      console.error('[order] handlePayment exception:', err)
      setError(p.errorGeneral)
      setIsSubmitting(false)
    }
  }

  const canPay = selectedService && selectedPackage && name.trim() && email.trim() && wa.trim() && !isSubmitting

  return (
    <main className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

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
                    <input className={styles.input} value={wa} onChange={e => setWa(e.target.value)} placeholder={p.waPlaceholder} />
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label}>{p.notesLabel}</label>
                    <textarea className={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} placeholder={p.notesPlaceholder} rows={3} />
                  </div>
                </div>
              </section>
            )}

            {/* Step 4 */}
            {selectedPackage && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionNum}>4</span>
                  {p.step4}
                </h2>
                <div className={styles.voucherRow}>
                  <input
                    className={`${styles.input} ${styles.voucherInput} ${voucherStatus === 'valid' ? styles.inputValid : ''} ${voucherStatus === 'invalid' ? styles.inputInvalid : ''}`}
                    value={voucherCode}
                    onChange={e => { setVoucherCode(e.target.value); setVoucherStatus('idle'); setVoucherDiscount(0) }}
                    placeholder={p.voucherPlaceholder}
                  />
                  <button
                    className={styles.voucherBtn}
                    onClick={applyVoucher}
                    disabled={voucherStatus === 'checking' || !voucherCode.trim()}
                  >
                    {voucherStatus === 'checking' ? '...' : p.voucherApply}
                  </button>
                </div>
                {voucherStatus === 'valid' && <p className={styles.voucherSuccess}>{p.voucherApplied}</p>}
                {voucherStatus === 'invalid' && <p className={styles.voucherError}>{p.voucherInvalid}</p>}
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
                    <span>{fmt(originalPrice)}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                      <span>{p.discount}</span>
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
                  onClick={handlePayment}
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
