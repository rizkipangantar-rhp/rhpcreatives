'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from '../../klaim-early-bird/claim.module.css'

type PromoInfo = {
  id: string; name: string; description: string
  discount_type: 'percent' | 'nominal'; discount_value: number
  quota: number; claimed: number; remaining: number | null
  is_full: boolean; requires_claim: boolean; end_date: string | null
}

type ClaimInfo = {
  voucher_code: string; status: string; claimed_at: string; order_id: string | null
  expires_at: string | null
}

type View = 'loading' | 'form' | 'success' | 'already' | 'used' | 'full' | 'unavailable' | 'expired'

const SERVICES = {
  id: ['Undangan Online', 'Landing Page', 'Desain Instagram', 'Edit Foto', 'Layanan Lainnya'],
  en: ['Online Invitation', 'Landing Page', 'Instagram Design', 'Photo Editing', 'Other Services'],
}

const CONFETTI_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#ffffff']
type Piece = { id: number; left: string; delay: string; duration: string; color: string; size: number; shape: string }

function formatTimeLeft(expiresAt: string, lang: 'id' | 'en'): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return lang === 'id' ? 'sebentar lagi' : 'very soon'
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  if (lang === 'id') {
    if (hours >= 1) return `dalam ${hours} jam ${minutes} menit`
    return `dalam ${minutes} menit`
  }
  if (hours >= 1) return `in ${hours}h ${minutes}m`
  return `in ${minutes}m`
}

function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([])
  useEffect(() => {
    setPieces(Array.from({ length: 55 }, (_, i) => ({
      id: i, left: `${(Math.random() * 100).toFixed(1)}%`,
      delay: `${(Math.random() * 2.5).toFixed(2)}s`,
      duration: `${(2.5 + Math.random() * 2).toFixed(2)}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.floor(7 + Math.random() * 8), shape: i % 3 === 0 ? '50%' : '2px',
    })))
  }, [])
  return (
    <div className={styles.confetti} aria-hidden>
      {pieces.map(p => (
        <div key={p.id} className={styles.confettiPiece} style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, background: p.color, width: p.size, height: p.size, borderRadius: p.shape }} />
      ))}
    </div>
  )
}


export default function KlaimPromoPage() {
  const { promo_id } = useParams<{ promo_id: string }>()
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const { lang } = useLanguage()

  const [view, setView] = useState<View>('loading')
  const [promo, setPromo] = useState<PromoInfo | null>(null)
  const [claim, setClaim] = useState<ClaimInfo | null>(null)
  const [justClaimed, setJustClaimed] = useState(false)

  const [name, setName] = useState('')
  const [wa, setWa] = useState('')
  const [service, setService] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [wlEmail, setWlEmail] = useState('')
  const [wlWa, setWlWa] = useState('')
  const [wlSubmitting, setWlSubmitting] = useState(false)
  const [wlDone, setWlDone] = useState(false)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push(`/login?callbackUrl=%2Fpromo%2Fklaim%2F${promo_id}`)
    }
  }, [authStatus, promo_id, router])

  useEffect(() => {
    if (authStatus !== 'authenticated') return

    // Fetch promo info + user's claim status in parallel
    Promise.all([
      fetch(`/api/promos`).then(r => r.json()),
      fetch('/api/promos/my-claims').then(r => r.json()),
      fetch('/api/user/profile').then(r => r.ok ? r.json() : null),
    ]).then(([promosData, claimsData, profileData]) => {
      const found = (promosData.promos ?? []).find((p: PromoInfo) => p.id === promo_id)
      if (!found) { setView('unavailable'); return }
      setPromo(found)

      if (profileData?.name) setName(profileData.name)
      if (profileData?.whatsapp) setWa(profileData.whatsapp)
      if (session?.user?.name && !name) setName(session.user.name)

      const userClaim = (claimsData.claims ?? []).find((c: ClaimInfo & { promo_id: string }) => c.promo_id === promo_id)
      if (userClaim) {
        setClaim(userClaim)
        if (userClaim.status === 'used') { setView('used'); return }
        if (userClaim.status === 'expired') { setView('expired'); return }
        // Client-side expiry check (in case server hasn't processed yet)
        if (userClaim.expires_at && new Date(userClaim.expires_at) < new Date()) {
          setView('expired'); return
        }
        setView('already')
        return
      }

      if (found.is_full) { setView('full'); return }
      setView('form')
    }).catch(() => setView('form'))
  }, [authStatus, promo_id, session?.user?.name])

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)

    if (wa.trim()) {
      fetch('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ whatsapp: wa.trim() }) }).catch(() => {})
    }

    const res = await fetch(`/api/promos/${promo_id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), whatsapp: wa.trim(), service_interest: service }),
    })
    const data = await res.json() as { claim?: ClaimInfo; error?: string }
    setSubmitting(false)

    if (!res.ok) {
      if (data.error === 'already_claimed') { router.refresh(); return }
      if (data.error === 'promo_unavailable') { setView('full'); return }
      setFormError('Gagal klaim, coba lagi ya.')
      return
    }

    setClaim(data.claim!)
    setJustClaimed(true)
    setView('success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    setWlSubmitting(true)
    setFormError('')

    const res = await fetch(`/api/promos/${promo_id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waitlist: true, email: wlEmail, whatsapp: wlWa }),
    }).catch(() => null)

    let ok = res?.ok ?? false

    // fallback: use early-bird waitlist endpoint for promo_early_bird
    if (promo_id === 'promo_early_bird') {
      const res2 = await fetch('/api/early-bird/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: wlEmail, wa: wlWa }),
      }).catch(() => null)
      ok = ok || (res2?.ok ?? false)
    }

    setWlSubmitting(false)
    if (ok) {
      setWlDone(true)
    } else {
      setFormError(lang === 'id' ? 'Gagal masuk waitlist, coba lagi ya.' : 'Failed to join waitlist, please try again.')
    }
  }

  const discountDisplay = promo
    ? promo.discount_type === 'percent' ? `${promo.discount_value ?? 0}%` : `Rp${(promo.discount_value ?? 0).toLocaleString('id-ID')}`
    : ''

  if (view === 'loading' || authStatus === 'loading') {
    return (
      <main className={styles.page}>
        <div className={styles.loadingWrap}><div className={styles.spinner} /><p>Loading...</p></div>
      </main>
    )
  }

  if (view === 'unavailable') {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.sadIcon}>😕</div>
          <h1 className={styles.title}>{lang === 'id' ? 'Promo tidak ditemukan' : 'Promo not found'}</h1>
          <p className={styles.sub}>{lang === 'id' ? 'Promo ini mungkin sudah tidak aktif.' : 'This promo may no longer be active.'}</p>
          <div className={styles.ctaGroup}>
            <Link href="/promo" className={styles.primaryCta}>{lang === 'id' ? 'Lihat Promo Lain' : 'See Other Promos'}</Link>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'success' && claim) {
    return (
      <main className={styles.page}>
        {justClaimed && <Confetti />}
        <div className={styles.card}>
          <div className={styles.successIcon}>🎉</div>
          <h1 className={styles.title}>{lang === 'id' ? `Yeay, diskon ${discountDisplay} aktif!` : `Discount ${discountDisplay} activated!`}</h1>
          <p className={styles.sub}>{lang === 'id' ? `Diskon ${discountDisplay} kamu otomatis aktif pas checkout nanti. Gasken order sekarang bestie!` : `Your ${discountDisplay} discount kicks in automatically at checkout. Let's go bestie!`}</p>
          <p className={styles.expiryWarning}>
            {lang === 'id'
              ? '⏰ Psst — voucher ini cuma berlaku 24 jam dari sekarang. Jangan sampe hangus ya bestie!'
              : '⏰ Psst — this voucher is only valid for 24 hours. Don\'t let it expire bestie!'}
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/order" className={styles.primaryCta}>{lang === 'id' ? 'Gasken Order Sekarang' : 'Order Now'}</Link>
            <Link href="/dashboard/profil?tab=orders" className={styles.secondaryCta}>{lang === 'id' ? 'Riwayat Order' : 'Order History'}</Link>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'already' && claim) {
    const timeLeft = claim.expires_at ? formatTimeLeft(claim.expires_at, lang) : null
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.topBadge}>✅ {promo?.name}</div>
          <h1 className={styles.title}>{lang === 'id' ? `Diskon ${discountDisplay} kamu masih aktif! 🔥` : `Your ${discountDisplay} discount is still live! 🔥`}</h1>
          <p className={styles.sub}>{lang === 'id' ? `Tenang, diskon ${discountDisplay} kamu otomatis aktif pas checkout. Tinggal order aja!` : `Chill, your ${discountDisplay} discount applies automatically at checkout. Just order!`}</p>
          {timeLeft && (
            <p className={styles.expiryWarning}>
              {lang === 'id'
                ? `⏰ Voucher ini hangus ${timeLeft}. Jangan ditunda-tunda bestie!`
                : `⏰ This voucher expires ${timeLeft}. Don't sleep on it bestie!`}
            </p>
          )}
          <div className={styles.ctaGroup}>
            <Link href="/order" className={styles.primaryCta}>{lang === 'id' ? 'Gasken Order Sekarang' : 'Order Now'}</Link>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'used') {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon}>🎊</div>
          <h1 className={styles.title}>{lang === 'id' ? `Diskon ${discountDisplay} udah kepake! 🎊` : `${discountDisplay} discount used! 🎊`}</h1>
          <p className={styles.sub}>{lang === 'id' ? `Diskon ${discountDisplay} kamu udah berhasil dipake di order sebelumnya. Hasilnya pasti worth it banget!` : `Your ${discountDisplay} discount was used in a previous order. Bet the results are totally worth it!`}</p>
          <div className={styles.ctaGroup}>
            <Link href="/dashboard/profil?tab=orders" className={styles.primaryCta}>{lang === 'id' ? 'Lihat Order Kamu' : 'View Your Orders'}</Link>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'expired') {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.sadIcon}>⌛</div>
          <h1 className={styles.title}>{lang === 'id' ? `Voucher ${discountDisplay} kamu hangus` : `Your ${discountDisplay} voucher expired`}</h1>
          <p className={styles.sub}>
            {lang === 'id'
              ? `Sayang banget, voucher kamu udah kedaluwarsa karena melewati batas 24 jam. Tapi tenang — kamu bisa klaim lagi kok!`
              : `Yikes, your voucher expired after the 24-hour window. No stress though — you can claim a new one!`}
          </p>
          <div className={styles.ctaGroup}>
            <button
              className={styles.primaryCta}
              style={{ border: 'none', cursor: 'pointer', width: '100%' }}
              onClick={() => { setClaim(null); setView('form') }}
            >
              {lang === 'id' ? 'Klaim Lagi Sekarang 🚀' : 'Claim Again Now 🚀'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'full') {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.sadIcon}>😢</div>
          <h1 className={styles.title}>{lang === 'id' ? 'Slot habis' : 'Quota full'}</h1>
          <p className={styles.sub}>{lang === 'id' ? 'Kuota promo ini sudah habis. Masuk waitlist untuk dapat notifikasi jika ada slot baru.' : 'This promo quota is full. Join the waitlist to be notified if new slots open.'}</p>
          {wlDone ? (
            <p style={{ textAlign: 'center', color: '#34d399', marginTop: 16 }}>{lang === 'id' ? 'Kamu sudah masuk waitlist!' : "You're on the waitlist!"}</p>
          ) : (
            <form onSubmit={handleWaitlist} className={styles.form}>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" value={wlEmail} onChange={e => setWlEmail(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label>WhatsApp</label>
                <input type="tel" placeholder="08xx" value={wlWa} onChange={e => setWlWa(e.target.value)} required />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={wlSubmitting}>
                {wlSubmitting ? '...' : (lang === 'id' ? 'Masuk Waitlist' : 'Join Waitlist')}
              </button>
            </form>
          )}
        </div>
      </main>
    )
  }

  // Form view
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.topBadge}>{promo?.name ?? 'Promo'}</div>
        <h1 className={styles.title}>{lang === 'id' ? `Klaim Diskon ${discountDisplay}` : `Claim ${discountDisplay} Discount`}</h1>
        <p className={styles.sub}>{promo?.description}</p>

        {promo && promo.quota > 0 && (
          <div className={styles.slotRow}>
            <div className={styles.slotText}>
              <span className={styles.slotNum}>{promo.remaining ?? 0}</span>
              {' '}{lang === 'id' ? 'slot tersisa' : 'slots left'}
            </div>
          </div>
        )}

        <h2 className={styles.formTitle}>{lang === 'id' ? 'Isi Data Kamu' : 'Your Details'}</h2>
        <form onSubmit={handleClaim} className={styles.form}>
          {formError && <p className={styles.formError}>{formError}</p>}

          <div className={styles.field}>
            <label>{lang === 'id' ? 'Nama Lengkap' : 'Full Name'} *</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input value={session?.user?.email ?? ''} readOnly className={styles.readOnly} />
          </div>

          <div className={styles.field}>
            <label>WhatsApp ({lang === 'id' ? 'Opsional' : 'Optional'})</label>
            <input value={wa} onChange={e => setWa(e.target.value.replace(/\D/g, ''))} placeholder="08xx atau 628xx" />
          </div>

          <div className={styles.field}>
            <label>{lang === 'id' ? 'Layanan yang Diminati' : 'Service of Interest'}</label>
            <select value={service} onChange={e => setService(e.target.value)}>
              <option value="">{lang === 'id' ? 'Pilih layanan (opsional)' : 'Choose service (optional)'}</option>
              {SERVICES[lang].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? (lang === 'id' ? 'Mengklaim...' : 'Claiming...') : (lang === 'id' ? `Klaim Diskon ${discountDisplay}` : `Claim ${discountDisplay} Discount`)}
          </button>
        </form>
      </div>
    </main>
  )
}
