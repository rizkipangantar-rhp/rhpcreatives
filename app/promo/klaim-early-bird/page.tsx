'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './claim.module.css'

type ClaimEntry = {
  userId: string; name: string; email: string
  service: string; voucherCode: string; claimedAt: string
}
const QUOTA = 20
const EXPIRY_MS = 24 * 60 * 60 * 1000

const SERVICE_TO_PAKET: Record<string, string> = {
  'Undangan Online': 'undangan-simpel',
  'Online Invitation': 'undangan-simpel',
  'Landing Page': 'landing-santuy',
  'Desain Instagram': 'ig-satu-post',
  'Instagram Design': 'ig-satu-post',
  'Edit Foto': 'foto-poles-dikit',
  'Photo Editing': 'foto-poles-dikit',
}

function waShareUrl(code: string) {
  const msg = `Bestie, aku baru aja klaim voucher Early Bird RHP Creatives diskon 25%! Kode: *${code}*. Buruan klaim juga sebelum habis 🔥 → rhpcreatives.com/promo/klaim-early-bird`
  return `https://wa.me/?text=${encodeURIComponent(msg)}`
}

function formatExpiry(claimedAt: string, lang: string): string {
  const expiresAt = new Date(new Date(claimedAt).getTime() + EXPIRY_MS)
  return expiresAt.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  })
}

// ── Confetti ────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#ffffff']
type Piece = { id: number; left: string; delay: string; duration: string; color: string; size: number; shape: string }

function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([])
  useEffect(() => {
    setPieces(Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 100).toFixed(1)}%`,
      delay: `${(Math.random() * 2.5).toFixed(2)}s`,
      duration: `${(2.5 + Math.random() * 2).toFixed(2)}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.floor(7 + Math.random() * 8),
      shape: i % 3 === 0 ? '50%' : '2px',
    })))
  }, [])
  return (
    <div className={styles.confetti} aria-hidden>
      {pieces.map(p => (
        <div
          key={p.id}
          className={styles.confettiPiece}
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, background: p.color, width: p.size, height: p.size, borderRadius: p.shape }}
        />
      ))}
    </div>
  )
}

// ── Voucher display ──────────────────────────────────────────────────────────
function VoucherBox({ code, label, copyBtn, copied }: { code: string; label: string; copyBtn: string; copied: string }) {
  const [didCopy, setDidCopy] = useState(false)
  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setDidCopy(true)
      setTimeout(() => setDidCopy(false), 2000)
    })
  }
  return (
    <div className={styles.voucherWrap}>
      <div className={styles.voucherLabel}>{label}</div>
      <div className={styles.voucherCode}>{code}</div>
      <button className={styles.copyBtn} onClick={copy}>{didCopy ? copied : copyBtn}</button>
    </div>
  )
}

// ── Slot bar ─────────────────────────────────────────────────────────────────
function SlotBar({ used, slotsLeft }: { used: number; slotsLeft: string }) {
  return (
    <div className={styles.slotRow}>
      <div className={styles.slotDots}>
        {Array.from({ length: QUOTA }).map((_, i) => (
          <div key={i} className={`${styles.dot} ${i < used ? styles.dotTaken : ''}`} />
        ))}
      </div>
      <div className={styles.slotText}>
        <span className={styles.slotNum}>{QUOTA - used}</span> {slotsLeft}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
type View = 'loading' | 'form' | 'success' | 'already' | 'used' | 'expired' | 'full'

export default function KlaimEarlyBirdPage() {
  const { tr, lang } = useLanguage()
  const c = tr.claimPage
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()

  const [view, setView] = useState<View>('loading')
  const [quota, setQuota] = useState({ used: 0, remaining: QUOTA })
  const [claim, setClaim] = useState<ClaimEntry | null>(null)
  const [justClaimed, setJustClaimed] = useState(false)

  // form state
  const [name, setName] = useState('')
  const [service, setService] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // waitlist state
  const [wlEmail, setWlEmail] = useState('')
  const [wlWa, setWlWa] = useState('')
  const [wlSubmitting, setWlSubmitting] = useState(false)
  const [wlDone, setWlDone] = useState(false)

  // redirect if unauthenticated
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login?callbackUrl=%2Fpromo%2Fklaim-early-bird')
    }
  }, [authStatus, router])

  // fetch status once authenticated
  useEffect(() => {
    if (authStatus !== 'authenticated') return
    fetch(`/api/early-bird/status?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data.quota) setQuota(data.quota)
        setName(data.userName ?? '')
        if (data.claim) {
          setClaim(data.claim)
          setView(data.claim.usedAt ? 'used' : 'already')
        } else if (data.claimExpired) {
          setView('expired')
        } else if (data.quota?.remaining <= 0) {
          setView('full')
        } else {
          setView('form')
        }
      })
      .catch(() => setView('form'))
  }, [authStatus])

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!service) { setFormError('Pilih layanan dulu ya!'); return }
    setSubmitting(true)
    const res = await fetch('/api/early-bird/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, service }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      if (data.error === 'quota_full') { setView('full'); return }
      if (data.error === 'already_claimed') { router.refresh(); return }
      setFormError('Gagal klaim, coba lagi ya.')
      return
    }
    setClaim(data.claim)
    setJustClaimed(true)
    setView('success')
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    setWlSubmitting(true)
    await fetch('/api/early-bird/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: wlEmail, wa: wlWa }),
    })
    setWlSubmitting(false)
    setWlDone(true)
  }

  // ── Render ──────────────────────────────────────────────────────────────
  if (view === 'loading' || authStatus === 'loading') {
    return (
      <main className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>{c.loading}</p>
        </div>
      </main>
    )
  }

  if (view === 'form') {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.topBadge}>🔥 Early Bird</div>
          <h1 className={styles.title}>{c.title}</h1>
          <p className={styles.sub}>{c.sub}</p>
          <SlotBar used={quota.used} slotsLeft={c.slotsLeft} />

          <h2 className={styles.formTitle}>{c.formTitle}</h2>
          <form onSubmit={handleClaim} className={styles.form}>
            {formError && <p className={styles.formError}>{formError}</p>}

            <div className={styles.field}>
              <label>{c.nameLabel}</label>
              <input value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className={styles.field}>
              <label>{c.emailLabel}</label>
              <input value={session?.user?.email ?? ''} readOnly className={styles.readOnly} />
            </div>

            <div className={styles.field}>
              <label>{c.serviceLabel}</label>
              <select value={service} onChange={e => setService(e.target.value)} required>
                <option value="">Pilih layanan</option>
                {c.serviceOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? c.submitting : c.submitBtn}
            </button>
          </form>
        </div>
      </main>
    )
  }

  if (view === 'success' && claim) {
    return (
      <main className={styles.page}>
        {justClaimed && <Confetti />}
        <div className={styles.card}>
          <div className={styles.successIcon}>🎊</div>
          <h1 className={styles.title}>{c.successTitle}</h1>
          <p className={styles.sub}>{c.successSub}</p>

          <div className={styles.expiryWarning}>{c.expiryWarning}</div>

          <VoucherBox code={claim.voucherCode} label={c.voucherLabel} copyBtn={c.copyBtn} copied={c.copied} />

          <div className={styles.howBox}>
            <div className={styles.howTitle}>{c.howTitle}</div>
            <p className={styles.howText}>{c.howText}</p>
          </div>

          <div className={styles.ctaGroup}>
            <Link href={`/order?paket=${SERVICE_TO_PAKET[claim.service] ?? ''}`} className={styles.primaryCta}>
              {c.orderWaBtn}
            </Link>
            <a href={waShareUrl(claim.voucherCode)} target="_blank" rel="noopener noreferrer" className={styles.secondaryCta}>
              {c.shareWaBtn}
            </a>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'used' && claim) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon}>🎊</div>
          <h1 className={styles.title}>{c.usedTitle}</h1>
          <p className={styles.sub}>{c.usedSub}</p>
          <VoucherBox code={claim.voucherCode} label={c.voucherLabel} copyBtn={c.copyBtn} copied={c.copied} />
          <div className={styles.ctaGroup}>
            <Link href="/dashboard/profil" className={styles.primaryCta}>
              {c.usedOrderBtn}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'already' && claim) {
    const claimedDate = new Date(claim.claimedAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    const expiryStr = formatExpiry(claim.claimedAt, lang)
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.topBadge}>🎉 Voucher Aktif</div>
          <h1 className={styles.title}>{c.alreadyTitle}</h1>
          <p className={styles.sub}>{c.alreadySub}</p>
          <p className={styles.claimedAt}>{c.claimedAtLabel}: <strong>{claimedDate}</strong></p>
          <p className={styles.claimedAt}>{c.expiresAtLabel}: <strong>{expiryStr}</strong></p>

          <div className={styles.expiryWarning}>{c.expiryWarning}</div>

          <VoucherBox code={claim.voucherCode} label={c.voucherLabel} copyBtn={c.copyBtn} copied={c.copied} />

          <div className={styles.ctaGroup}>
            <Link href={`/order?paket=${SERVICE_TO_PAKET[claim.service] ?? ''}`} className={styles.primaryCta}>
              {c.orderWaBtn}
            </Link>
            <a href={waShareUrl(claim.voucherCode)} target="_blank" rel="noopener noreferrer" className={styles.secondaryCta}>
              {c.shareWaBtn}
            </a>
          </div>
        </div>
      </main>
    )
  }

  if (view === 'expired') {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.sadIcon}>😭</div>
          <h1 className={styles.title}>{c.expiredTitle}</h1>
          <p className={styles.sub}>{c.expiredSub}</p>
          <SlotBar used={quota.used} slotsLeft={c.slotsLeft} />
          <div className={styles.ctaGroup}>
            {quota.remaining > 0 ? (
              <button className={styles.primaryCta} onClick={() => setView('form')}>
                {c.reclaimBtn}
              </button>
            ) : (
              <p className={styles.sub}>{c.quotaFullSub}</p>
            )}
          </div>
        </div>
      </main>
    )
  }

  // quota full
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.sadIcon}>😢</div>
        <h1 className={styles.title}>{c.quotaFullTitle}</h1>
        <p className={styles.sub}>{c.quotaFullSub}</p>

        <h2 className={styles.formTitle}>{c.waitlistTitle}</h2>
        {wlDone ? (
          <p className={styles.waitlistSuccess}>{c.waitlistSuccess}</p>
        ) : (
          <form onSubmit={handleWaitlist} className={styles.form}>
            <div className={styles.field}>
              <label>{c.waitlistEmailLabel}</label>
              <input type="email" value={wlEmail} onChange={e => setWlEmail(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>{c.waitlistWaLabel}</label>
              <input type="tel" placeholder={c.waitlistWaPlaceholder} value={wlWa} onChange={e => setWlWa(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={wlSubmitting}>
              {wlSubmitting ? '...' : c.waitlistSubmit}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
