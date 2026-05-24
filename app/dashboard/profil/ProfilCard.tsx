'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import type { Session } from 'next-auth'
import { useLanguage } from '@/context/LanguageContext'
import { formatWaDisplay, normalizeWa, isValidWa } from '@/lib/wa'
import styles from './profil.module.css'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'

type Order = {
  orderId: string
  serviceNameId: string
  serviceNameEn: string
  packageNameId: string
  packageNameEn: string
  totalPrice: number
  status: OrderStatus
  createdAt: string
}

type RequestStatus =
  | 'waiting_review' | 'price_sent' | 'negotiating' | 'accepted' | 'payment_pending'
  | 'paid' | 'in_progress' | 'done' | 'rejected_by_admin' | 'rejected_by_customer'

type NegotiationEntry = {
  by: 'customer' | 'admin'
  note: string
  counter_price?: number | null
  created_at: string
}

type CustomRequest = {
  request_id: string
  order_id?: string | null
  service: { name: string; package: string }
  pricing: { base_price: number | null; final_price: number | null; estimated_days: number | null; discount_amount: number }
  notes: { for_customer?: string; rejection_reason?: string }
  status: RequestStatus
  offer_expires_at: string | null
  created_at: string
  negotiation_history?: NegotiationEntry[]
}


const REQ_STATUS_CLS: Partial<Record<RequestStatus, string>> = {
  waiting_review: styles.statusPending,
  price_sent: styles.statusPaid,
  negotiating: styles.statusProcessing,
  accepted: styles.statusProcessing,
  payment_pending: styles.statusPending,
  paid: styles.statusPaid,
  in_progress: styles.statusProcessing,
  done: styles.statusCompleted,
  rejected_by_admin: styles.statusCancelled,
  rejected_by_customer: styles.statusCancelled,
}

type ReferralUsage = {
  userId: string
  referralCode: string
  referrerId: string
  orderId: string
  usedAt: string
  userName?: string | null
}

function getInitials(name?: string | null, userId?: string): string {
  if (name) return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  // Deterministic 2-letter code from userId when name is unavailable
  const seed = userId ?? 'u'
  let h1 = 0, h2 = 0
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i)
    h1 = (h1 * 31 + c) & 0xffff
    h2 = (h2 * 37 + c) & 0xffff
  }
  return String.fromCharCode(65 + (h1 % 26)) + String.fromCharCode(65 + (h2 % 26))
}

type ReferralStatsData = {
  referralCode: string
  count: number
  usages: ReferralUsage[]
  rewardsAvailable: number
  rewardsUsed: number
}

function AvatarDisplay({ src, name }: { src?: string | null; name?: string | null }) {
  const [imgError, setImgError] = useState(false)
  useEffect(() => { setImgError(false) }, [src])
  const initials = name ? name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : '?'
  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={name ?? 'User'}
        width={96}
        height={96}
        className={styles.avatarImg}
        onError={() => setImgError(true)}
      />
    )
  }
  return <span className={styles.avatarInitials}>{initials}</span>
}

function StatusBadge({ status, labels }: { status: OrderStatus; labels: Record<string, string> }) {
  const colorClass: Record<OrderStatus, string> = {
    pending: styles.statusPending,
    paid: styles.statusPaid,
    processing: styles.statusProcessing,
    completed: styles.statusCompleted,
    cancelled: styles.statusCancelled,
  }
  return <span className={`${styles.statusBadge} ${colorClass[status]}`}>{labels[status]}</span>
}

export default function ProfilCard({ session }: { session: Session }) {
  const { user } = session
  const { tr, lang } = useLanguage()
  const p = tr.profile
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawTab = searchParams.get('tab')
  const initialTab: 'referral' | 'orders' | 'custom' =
    rawTab === 'orders' ? 'orders' : rawTab === 'custom' ? 'custom' : 'referral'

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'referral' | 'orders' | 'custom'>(initialTab)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(initialTab === 'orders')
  const [ordersLoaded, setOrdersLoaded] = useState(false)
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([])
  const [customLoading, setCustomLoading] = useState(initialTab === 'custom')
  const [customLoaded, setCustomLoaded] = useState(false)
  const [referralStats, setReferralStats] = useState<ReferralStatsData | null>(null)
  const [ebirdStatus, setEbirdStatus] = useState<{ available: boolean; used: boolean } | null>(null)
  const [userWa, setUserWa] = useState<string | null>(null)
  const [waEditing, setWaEditing] = useState(false)
  const [waInput, setWaInput] = useState('')
  const [waSaving, setWaSaving] = useState(false)
  const [waError, setWaError] = useState('')
  const [waToast, setWaToast] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [negoOpen, setNegoOpen] = useState<string | null>(null)
  const [negoNote, setNegoNote] = useState('')
  const [negoPrice, setNegoPrice] = useState('')
  const [negoError, setNegoError] = useState('')
  const [negoSuccessId, setNegoSuccessId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/referral/stats')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setReferralStats(data) })
      .catch(() => {})
    fetch('/api/referral/discount-status')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.earlyBird) setEbirdStatus(data.earlyBird) })
      .catch(() => {})
    fetch('/api/user/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.whatsapp) setUserWa(data.whatsapp) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (initialTab === 'orders' && !ordersLoaded) {
      fetch('/api/payment/my-orders')
        .then(r => r.json())
        .then(data => { setOrders(Array.isArray(data) ? data : []); setOrdersLoaded(true) })
        .catch(() => setOrdersLoaded(true))
        .finally(() => setOrdersLoading(false))
    }
    if (initialTab === 'custom' && !customLoaded) {
      fetch('/api/custom-order/my-requests')
        .then(r => r.json())
        .then(data => { setCustomRequests(Array.isArray(data) ? data : []); setCustomLoaded(true) })
        .catch(() => setCustomLoaded(true))
        .finally(() => setCustomLoading(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const referralCode = referralStats?.referralCode ?? '...'

  async function handleWaSave() {
    if (!isValidWa(waInput)) { setWaError(p.waInvalid); return }
    setWaSaving(true); setWaError('')
    const normalized = normalizeWa(waInput)
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp: normalized }),
    })
    setWaSaving(false)
    if (res.ok) {
      setUserWa(normalized); setWaEditing(false)
      setWaToast(true); setTimeout(() => setWaToast(false), 3000)
    } else {
      const d = await res.json().catch(() => ({}))
      setWaError(d.error ?? p.waInvalid)
    }
  }

  function copyCode() {
    if (referralCode === '...') return
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function shareWa() {
    const msg = `Bestie, aku pakai RHP Creatives buat jasa digital & desain, hasilnya kece banget! Daftar pakai kode referral aku dan langsung dapat diskon 10% di order pertama. Kode: *${referralCode}* Daftar di sini: rhpcreatives.com/register`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  function handleOrdersTab() {
    setActiveTab('orders')
    if (!ordersLoaded) {
      setOrdersLoading(true)
      fetch('/api/payment/my-orders')
        .then(r => r.json())
        .then(data => { setOrders(Array.isArray(data) ? data : []); setOrdersLoaded(true) })
        .catch(() => setOrdersLoaded(true))
        .finally(() => setOrdersLoading(false))
    }
  }

  function handleCustomTab() {
    setActiveTab('custom')
    if (!customLoaded) {
      setCustomLoading(true)
      fetch('/api/custom-order/my-requests')
        .then(r => r.json())
        .then(data => { setCustomRequests(Array.isArray(data) ? data : []); setCustomLoaded(true) })
        .catch(() => setCustomLoaded(true))
        .finally(() => setCustomLoading(false))
    }
  }

  async function acceptOffer(requestId: string) {
    setActionLoading(requestId + '-accept')
    try {
      const res = await fetch(`/api/custom-order/${requestId}/accept`, { method: 'PUT' })
      const data = await res.json() as { order_id?: string; error?: string }
      if (res.ok && data.order_id) {
        router.push(`/order/payment/${data.order_id}`)
      } else {
        setNegoError(data.error ?? (lang === 'id' ? 'Gagal memproses. Coba lagi.' : 'Failed to process. Try again.'))
      }
    } catch {
      setNegoError(lang === 'id' ? 'Terjadi kesalahan. Coba lagi.' : 'An error occurred. Try again.')
    } finally {
      setActionLoading(null)
    }
  }

  async function rejectOffer(requestId: string) {
    setActionLoading(requestId + '-reject')
    try {
      const res = await fetch(`/api/custom-order/${requestId}/reject`, { method: 'PUT' })
      if (res.ok) {
        setCustomRequests(prev => prev.map(r =>
          r.request_id === requestId ? { ...r, status: 'rejected_by_customer' as RequestStatus } : r
        ))
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string }
        setNegoError(data.error ?? (lang === 'id' ? 'Gagal membatalkan. Coba lagi.' : 'Failed to cancel. Try again.'))
      }
    } catch {
      setNegoError(lang === 'id' ? 'Terjadi kesalahan. Coba lagi.' : 'An error occurred. Try again.')
    } finally {
      setActionLoading(null)
    }
  }

  async function submitNego(requestId: string) {
    if (!negoNote.trim()) { setNegoError(lang === 'id' ? 'Tulis alasan/catatan dulu ya!' : 'Please add a note first!'); return }
    setActionLoading(requestId + '-nego')
    setNegoError('')
    try {
      const res = await fetch(`/api/custom-order/${requestId}/negotiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: negoNote.trim(), counter_price: negoPrice || undefined }),
      })
      const data = await res.json() as { ok?: boolean; adminWaUrl?: string; error?: string }
      if (!res.ok) { setNegoError(data.error ?? 'Gagal nego. Coba lagi.'); return }
      const newEntry: NegotiationEntry = {
        by: 'customer',
        note: negoNote.trim(),
        counter_price: negoPrice ? (parseInt(negoPrice.replace(/\D/g, ''), 10) || null) : null,
        created_at: new Date().toISOString(),
      }
      setCustomRequests(prev => prev.map(r =>
        r.request_id === requestId ? {
          ...r,
          status: 'negotiating' as RequestStatus,
          negotiation_history: [...(r.negotiation_history ?? []), newEntry],
        } : r
      ))
      setNegoOpen(null); setNegoNote(''); setNegoPrice('')
      setNegoSuccessId(requestId)
      setTimeout(() => setNegoSuccessId(null), 4000)
      if (data.adminWaUrl) setTimeout(() => window.open(data.adminWaUrl, '_blank'), 500)
    } finally {
      setActionLoading(null)
    }
  }

  const statusLabels: Record<string, string> = {
    pending: p.statusPending,
    paid: p.statusPaid,
    processing: p.statusProcessing,
    completed: p.statusCompleted,
    cancelled: p.statusCancelled,
  }

  return (
    <main className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />

      <div className={styles.container}>
        {/* Profile card */}
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <AvatarDisplay src={user.image} name={user.name} />
          </div>
          <div className={styles.profileRight}>
            <div className={styles.profileInfo}>
              <h1 className={styles.name}>{user.name ?? 'User'}</h1>
              <p className={styles.email}>{user.email}</p>
              <div className={styles.waRow}>
                {waEditing ? (
                  <div className={styles.waEditRow}>
                    <input
                      className={styles.waInput}
                      value={waInput}
                      onChange={e => setWaInput(e.target.value)}
                      placeholder="08xx atau 628xx"
                      autoFocus
                    />
                    {waError && <span className={styles.waError}>{waError}</span>}
                    <div className={styles.waActions}>
                      <button className={styles.waSaveBtn} onClick={handleWaSave} disabled={waSaving}>
                        {waSaving ? p.waSaving : p.waSave}
                      </button>
                      <button className={styles.waCancelBtn} onClick={() => { setWaEditing(false); setWaError('') }}>
                        {p.waCancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.waDisplayRow}>
                    <span className={styles.waIcon}>📱</span>
                    <span className={styles.waValue}>
                      {userWa ? formatWaDisplay(userWa) : p.waEmpty}
                    </span>
                    <button className={styles.waEditBtn} onClick={() => { setWaEditing(true); setWaInput(userWa ?? ''); setWaError('') }}>
                      {p.waEdit}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })}>
              {p.logoutBtn}
            </button>
          </div>
          {waToast && <div className={styles.waToast}>{p.waSaved}</div>}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'referral' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('referral')}
          >
            {p.tabReferral}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            onClick={handleOrdersTab}
          >
            {p.tabOrders}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'custom' ? styles.tabActive : ''}`}
            onClick={handleCustomTab}
          >
            {p.tabCustom}
          </button>
        </div>

        {/* Referral tab */}
        {activeTab === 'referral' && (
          <div className={styles.grid}>
            {/* My code card */}
            <div className={styles.card}>
              <div className={styles.cardLabel}>{p.referralLabel}</div>
              <div className={styles.referralCode}>{referralCode}</div>
              <div className={styles.referralActions}>
                <button className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`} onClick={copyCode}>
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {p.copied}
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                      {p.copyBtn}
                    </>
                  )}
                </button>
                <button className={styles.shareWaBtn} onClick={shareWa}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.524 5.855L.057 23.476a.5.5 0 00.624.612l5.722-1.499A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.941 9.941 0 01-5.176-1.449l-.371-.22-3.393.888.903-3.297-.242-.38A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  {p.shareWaBtn}
                </button>
              </div>
              <p className={styles.cardNote}>{p.shareNote}</p>
            </div>

            {/* Rewards card */}
            <div className={styles.card}>
              <div className={styles.cardLabel}>{p.rewardsAvailableLabel}</div>
              <div className={styles.activeDiscountList}>
                {(referralStats?.rewardsAvailable ?? 0) > 0 && (
                  <div className={styles.activeDiscountItem}>
                    <span className={styles.activeDiscountCount}>{referralStats!.rewardsAvailable}×</span>
                    <span className={styles.activeDiscountName}>{p.referrerTitle}</span>
                    <span className={styles.activeDiscountPct}>15%</span>
                  </div>
                )}
                {ebirdStatus?.available && (
                  <div className={styles.activeDiscountItem}>
                    <span className={styles.activeDiscountIcon}>🔥</span>
                    <span className={styles.activeDiscountName}>{p.earlyBirdLabel}</span>
                    <span className={styles.activeDiscountPct}>25%</span>
                  </div>
                )}
                {!ebirdStatus?.available && (referralStats?.rewardsAvailable ?? 0) === 0 && (
                  <p className={styles.historyEmpty}>{p.noActiveDiscounts}</p>
                )}
              </div>
              {(referralStats?.rewardsUsed ?? 0) > 0 && (
                <p className={styles.rewardUsed}>{p.rewardsUsedLabel}: {referralStats!.rewardsUsed}</p>
              )}
            </div>

            {/* How it works card */}
            <div className={styles.card}>
              <div className={styles.cardLabel}>{p.rewardLabel}</div>
              <div className={styles.rewardList}>
                <div className={styles.rewardItem}>
                  <div className={styles.rewardBadge}>15%</div>
                  <div>
                    <p className={styles.rewardTitle}>{p.referrerTitle}</p>
                    <p className={styles.rewardDesc}>{p.referrerDesc}</p>
                  </div>
                </div>
                <div className={styles.rewardDivider} />
                <div className={styles.rewardItem}>
                  <div className={`${styles.rewardBadge} ${styles.rewardBadgePink}`}>10%</div>
                  <div>
                    <p className={styles.rewardTitle}>{p.inviteeTitle}</p>
                    <p className={styles.rewardDesc}>{p.inviteeDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className={styles.card}>
              <div className={styles.cardLabel}>{p.statsLabel}</div>
              <div className={styles.statGrid}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{referralStats?.count ?? '—'}</span>
                  <span className={styles.statLabel}>{p.statPeople}</span>
                </div>
              </div>
              <p className={styles.cardNote}>{p.statsNote}</p>
            </div>

            {/* Usage history card */}
            <div className={`${styles.card} ${styles.cardWide}`}>
              <div className={styles.cardLabel}>{p.historyLabel}</div>
              {!referralStats || referralStats.usages.length === 0 ? (
                <p className={styles.historyEmpty}>{p.historyEmpty}</p>
              ) : (
                <div className={styles.historyList}>
                  {referralStats.usages.map((usage, i) => (
                    <div key={i} className={styles.historyItem}>
                      <div className={styles.historyAvatar}>{getInitials(usage.userName, usage.userId)}</div>
                      <div className={styles.historyContent}>
                        <span className={styles.historyLabel}>{usage.orderId ? p.historyOrdered : p.historyJoined}</span>
                        <span className={styles.historyDate}>{new Date(usage.usedAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <span className={styles.historyVoucher}>+1 Voucher</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How to use card */}
            <div className={`${styles.card} ${styles.cardWide}`}>
              <div className={styles.cardLabel}>{p.howToLabel}</div>
              <ol className={styles.stepList}>
                {p.steps.map((step, i) => (
                  <li key={i} className={styles.step}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Orders tab */}
        {activeTab === 'orders' && (
          <div className={styles.ordersSection}>
            {ordersLoading ? (
              <div className={styles.ordersLoading}><div className={styles.spinner} /></div>
            ) : orders.length === 0 ? (
              <div className={styles.ordersEmpty}>
                <p>{p.noOrders}</p>
                <Link href="/order" className={styles.orderNowBtn}>{p.orderNowBtn}</Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <div key={order.orderId}>
                    <Link href={`/dashboard/profil/orders/${order.orderId}`} className={styles.orderCard} style={{ textDecoration: 'none', display: 'flex' }}>
                      <div className={styles.orderLeft}>
                        <div className={styles.orderService}>
                          {lang === 'id' ? order.serviceNameId : order.serviceNameEn}
                        </div>
                        <div className={styles.orderPackage}>
                          {lang === 'id' ? order.packageNameId : order.packageNameEn}
                        </div>
                        <div className={styles.orderDate}>
                          {p.orderDate}: {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div className={styles.orderRight}>
                        <div className={styles.orderAmount}>Rp{order.totalPrice.toLocaleString('id-ID')}</div>
                        <StatusBadge status={order.status} labels={statusLabels} />
                        <span className={styles.orderViewBtn}>{p.viewOrder}</span>
                      </div>
                    </Link>
                    {order.status === 'pending' && (
                      <Link href={`/order/payment/${order.orderId}`} style={{ display: 'block', margin: '0.4rem 0 0.75rem', padding: '0.55rem 1rem', background: 'linear-gradient(135deg,#7c3aed,#be185d)', color: '#fff', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none' }}>
                        {lang === 'id' ? 'Lanjut Bayar' : 'Continue Payment'}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom requests tab */}
        {activeTab === 'custom' && (
          <div className={styles.ordersSection}>
            {customLoading ? (
              <div className={styles.ordersLoading}><div className={styles.spinner} /></div>
            ) : customRequests.length === 0 ? (
              <div className={styles.ordersEmpty}>
                <p>{lang === 'id' ? 'Belum ada custom order request.' : 'No custom order requests yet.'}</p>
                <Link href="/order/custom" className={styles.orderNowBtn}>
                  {lang === 'id' ? 'Buat Request' : 'Create Request'}
                </Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {customRequests.map(req => {
                  const isPriceSent = req.status === 'price_sent'
                  const offerExpired = isPriceSent && req.offer_expires_at
                    ? new Date(req.offer_expires_at) < new Date()
                    : false
                  const offerActive = isPriceSent && !offerExpired
                  const msLeft = req.offer_expires_at ? Math.max(0, new Date(req.offer_expires_at).getTime() - Date.now()) : 0
                  const hoursLeft = Math.floor(msLeft / 3600000)
                  const minutesLeft = Math.floor((msLeft % 3600000) / 60000)

                  return (
                    <div key={req.request_id} className={styles.orderCard} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div className={styles.orderService}>{req.service.name}</div>
                          <div className={styles.orderPackage}>{req.service.package}</div>
                          <div className={styles.orderDate}>
                            {new Date(req.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            <span style={{ marginLeft: 6, fontFamily: 'monospace', fontSize: '0.68rem', color: '#475569' }}>{req.request_id}</span>
                          </div>
                        </div>
                        <span className={`${styles.statusBadge} ${REQ_STATUS_CLS[req.status] ?? styles.statusPending}`}>
                          {p.customReqStatuses[req.status] ?? req.status}
                        </span>
                      </div>

                      {/* Offer card */}
                      {offerActive && req.pricing.final_price != null && (
                        <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 12, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              {lang === 'id' ? 'Penawaran Harga' : 'Price Offer'}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>
                              {hoursLeft}j {minutesLeft}m {lang === 'id' ? 'tersisa' : 'left'}
                            </span>
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>
                            Rp{req.pricing.final_price.toLocaleString('id-ID')}
                          </div>
                          {req.pricing.estimated_days && (
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: req.notes.for_customer ? 8 : 12 }}>
                              {lang === 'id' ? `Estimasi ${req.pricing.estimated_days} hari` : `Est. ${req.pricing.estimated_days} days`}
                            </div>
                          )}
                          {req.notes.for_customer && (
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>
                              {req.notes.for_customer}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button
                              onClick={() => acceptOffer(req.request_id)}
                              disabled={!!actionLoading}
                              style={{
                                flex: 1, minWidth: 120, background: 'linear-gradient(135deg, #7c3aed, #be185d)', color: '#fff',
                                border: 'none', borderRadius: 8, padding: '9px 0', fontSize: '0.84rem',
                                fontWeight: 700, cursor: 'pointer', opacity: actionLoading === req.request_id + '-accept' ? 0.6 : 1,
                              }}
                            >
                              {actionLoading === req.request_id + '-accept'
                                ? (lang === 'id' ? 'Memproses...' : 'Processing...')
                                : (lang === 'id' ? 'Terima & Bayar' : 'Accept & Pay')}
                            </button>
                            <button
                              onClick={() => { setNegoOpen(req.request_id); setNegoNote(''); setNegoPrice(''); setNegoError('') }}
                              disabled={!!actionLoading}
                              style={{
                                background: 'rgba(251,191,36,0.1)', color: '#fbbf24',
                                border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8,
                                padding: '9px 14px', fontSize: '0.84rem', fontWeight: 600,
                                cursor: 'pointer', opacity: !!actionLoading ? 0.6 : 1,
                              }}
                            >
                              {lang === 'id' ? 'Nego Harga' : 'Negotiate'}
                            </button>
                            <button
                              onClick={() => rejectOffer(req.request_id)}
                              disabled={!!actionLoading}
                              style={{
                                background: 'rgba(239,68,68,0.1)', color: '#f87171',
                                border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                                padding: '9px 14px', fontSize: '0.84rem', fontWeight: 600,
                                cursor: 'pointer', opacity: actionLoading === req.request_id + '-reject' ? 0.6 : 1,
                              }}
                            >
                              {lang === 'id' ? 'Batalkan' : 'Cancel'}
                            </button>
                          </div>

                          {/* Nego form */}
                          {negoOpen === req.request_id && (
                            <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10 }}>
                              <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600, marginBottom: 8 }}>
                                {lang === 'id' ? 'Ajukan Nego Harga' : 'Negotiate Price'}
                              </div>
                              <textarea
                                rows={3}
                                value={negoNote}
                                onChange={e => setNegoNote(e.target.value)}
                                placeholder={lang === 'id' ? 'Tulis alasan atau catatan nego kamu...' : 'Write your negotiation reason or note...'}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9', fontSize: '0.82rem', padding: '8px 10px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: 8, boxSizing: 'border-box' }}
                              />
                              <input
                                type="text"
                                inputMode="numeric"
                                value={negoPrice}
                                onChange={e => setNegoPrice(e.target.value.replace(/\D/g, ''))}
                                placeholder={lang === 'id' ? 'Harga harapan (opsional, contoh: 150000)' : 'Expected price (optional, e.g. 150000)'}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9', fontSize: '0.82rem', padding: '8px 10px', outline: 'none', fontFamily: 'inherit', marginBottom: 8, boxSizing: 'border-box' }}
                              />
                              {negoError && <div style={{ color: '#f87171', fontSize: '0.78rem', marginBottom: 8 }}>{negoError}</div>}
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  onClick={() => submitNego(req.request_id)}
                                  disabled={actionLoading === req.request_id + '-nego'}
                                  style={{ flex: 1, background: '#fbbf24', color: '#0f172a', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  {actionLoading === req.request_id + '-nego' ? '...' : (lang === 'id' ? 'Kirim Nego' : 'Send Nego')}
                                </button>
                                <button
                                  onClick={() => { setNegoOpen(null); setNegoError('') }}
                                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: 8, padding: '8px 12px', fontSize: '0.82rem', cursor: 'pointer' }}
                                >
                                  {lang === 'id' ? 'Batal' : 'Cancel'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Payment pending — customer accepted, waiting payment */}
                      {req.status === 'payment_pending' && req.order_id && req.pricing.final_price != null && (
                        <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 12, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              {lang === 'id' ? 'Harga Disetujui' : 'Price Approved'}
                            </span>
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: req.pricing.estimated_days ? 4 : 12 }}>
                            Rp{req.pricing.final_price.toLocaleString('id-ID')}
                          </div>
                          {req.pricing.estimated_days && (
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: req.notes.for_customer ? 8 : 12 }}>
                              {lang === 'id' ? `Estimasi ${req.pricing.estimated_days} hari` : `Est. ${req.pricing.estimated_days} days`}
                            </div>
                          )}
                          {req.notes.for_customer && (
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>
                              {req.notes.for_customer}
                            </div>
                          )}
                          <Link href={`/order/payment/${req.order_id}`} style={{
                            display: 'block', textAlign: 'center',
                            background: 'linear-gradient(135deg, #7c3aed, #be185d)', color: '#fff',
                            borderRadius: 8, padding: '10px 0', fontSize: '0.9rem', fontWeight: 700,
                            textDecoration: 'none',
                          }}>
                            {lang === 'id' ? 'Bayar Sekarang' : 'Pay Now'}
                          </Link>
                        </div>
                      )}

                      {/* Nego success toast */}
                      {negoSuccessId === req.request_id && (
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem', color: '#34d399', fontWeight: 600, marginBottom: 8 }}>
                          {lang === 'id' ? 'Nego kamu udah terkirim! Tunggu respons admin ya.' : "Your counter-offer has been sent! Wait for the admin's response."}
                        </div>
                      )}

                      {/* Negotiating status — waiting message */}
                      {req.status === 'negotiating' && (
                        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 12, padding: '12px 16px' }}>
                          <div style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 600 }}>
                            {lang === 'id' ? 'Negosiasi sedang diproses admin, tunggu ya!' : 'Negotiation is being reviewed by admin, please wait!'}
                          </div>
                        </div>
                      )}

                      {/* Price history — shown for all statuses that have pricing data */}
                      {req.status !== 'waiting_review' && (req.pricing.base_price != null || (req.negotiation_history?.length ?? 0) > 0) && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
                          <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                            {lang === 'id' ? 'Riwayat Harga' : 'Price History'}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {/* Admin initial offer */}
                            {req.pricing.base_price != null && (
                              <div style={{ fontSize: '0.78rem', padding: '8px 10px', borderRadius: 8, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                                <span style={{ fontWeight: 700, color: '#a78bfa' }}>[Admin]</span>
                                <span style={{ color: '#94a3b8', marginLeft: 6 }}>
                                  {lang === 'id' ? 'Penawaran awal' : 'Initial offer'}:
                                  {req.pricing.discount_amount > 0
                                    ? <> <s style={{ opacity: 0.5 }}>Rp{req.pricing.base_price.toLocaleString('id-ID')}</s> → Rp{req.pricing.final_price?.toLocaleString('id-ID')}</>
                                    : <> Rp{req.pricing.base_price.toLocaleString('id-ID')}</>
                                  }
                                </span>
                              </div>
                            )}
                            {/* Negotiation entries */}
                            {req.negotiation_history?.map((entry, ni) => (
                              <div key={ni} style={{
                                fontSize: '0.78rem', padding: '8px 10px', borderRadius: 8,
                                background: entry.by === 'customer' ? 'rgba(251,191,36,0.08)' : 'rgba(139,92,246,0.08)',
                                border: `1px solid ${entry.by === 'customer' ? 'rgba(251,191,36,0.2)' : 'rgba(139,92,246,0.2)'}`,
                              }}>
                                <span style={{ fontWeight: 700, color: entry.by === 'customer' ? '#fbbf24' : '#a78bfa' }}>
                                  {entry.by === 'customer' ? (lang === 'id' ? '[Kamu]' : '[You]') : '[Admin]'}
                                  {entry.counter_price ? ` · Rp${entry.counter_price.toLocaleString('id-ID')}` : ''}
                                </span>
                                <span style={{ color: '#94a3b8', marginLeft: 6 }}>{entry.note}</span>
                                <span style={{ color: '#475569', marginLeft: 6 }}>
                                  · {new Date(entry.created_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expired offer warning */}
                      {offerExpired && (
                        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem', color: '#f87171' }}>
                          {lang === 'id' ? 'Penawaran sudah kedaluwarsa.' : 'Offer has expired.'}
                        </div>
                      )}

                      {/* Rejection reason */}
                      {(req.status === 'rejected_by_admin') && req.notes.rejection_reason && (
                        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem', color: '#f87171' }}>
                          {lang === 'id' ? 'Alasan: ' : 'Reason: '}{req.notes.rejection_reason}
                        </div>
                      )}
                    </div>
                  )
                })}
                <div style={{ textAlign: 'center', paddingTop: 8 }}>
                  <Link href="/order/custom" style={{ fontSize: '0.82rem', color: '#a78bfa', textDecoration: 'none' }}>
                    + {lang === 'id' ? 'Buat Request Baru' : 'New Request'}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
