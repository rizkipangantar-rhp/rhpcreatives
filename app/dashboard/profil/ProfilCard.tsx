'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import type { Session } from 'next-auth'
import { useLanguage } from '@/context/LanguageContext'
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

type ReferralUsage = {
  userId: string
  referralCode: string
  referrerId: string
  orderId: string
  usedAt: string
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
  const initialTab = searchParams.get('tab') === 'orders' ? 'orders' : 'referral'

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'referral' | 'orders'>(initialTab)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(initialTab === 'orders')
  const [ordersLoaded, setOrdersLoaded] = useState(false)
  const [referralStats, setReferralStats] = useState<ReferralStatsData | null>(null)

  useEffect(() => {
    fetch('/api/referral/stats')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setReferralStats(data) })
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const referralCode = referralStats?.referralCode ?? '...'

  function copyCode() {
    if (referralCode === '...') return
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function shareWa() {
    const msg = `Bestie, aku pakai RHP Creatives buat jasa digital & desain — hasilnya kece banget! Daftar pakai kode referral aku dan dapet diskon 10% order pertama! Kode: *${referralCode}* → rhpcreatives.com/register`
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
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{user.name ?? 'User'}</h1>
            <p className={styles.email}>{user.email}</p>
          </div>
          <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })}>
            {p.logoutBtn}
          </button>
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
              <div className={styles.rewardCount}>
                <span className={styles.rewardNum}>{referralStats?.rewardsAvailable ?? '—'}</span>
                <span className={styles.rewardUnit}>reward</span>
              </div>
              <p className={styles.rewardDesc}>{p.rewardsAvailableDesc}</p>
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
                      <div className={styles.historyDot} />
                      <div className={styles.historyContent}>
                        <span className={styles.historyLabel}>{p.historyUsedBy} ···{usage.userId.slice(-6)}</span>
                        <span className={styles.historyDate}>{new Date(usage.usedAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <span className={styles.historyReward}>+1 {p.historyEarned}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How to use card */}
            <div className={styles.card}>
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
                <Link href="/order" className={styles.orderNowBtn}>Order Sekarang →</Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <div key={order.orderId} className={styles.orderCard}>
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
                      <Link href={`/order/sukses/${order.orderId}`} className={styles.orderViewBtn}>
                        {p.viewOrder} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
