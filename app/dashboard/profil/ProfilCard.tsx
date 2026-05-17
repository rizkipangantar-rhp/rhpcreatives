'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
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

function generateReferralCode(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i)
    hash |= 0
  }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  let n = Math.abs(hash)
  for (let i = 0; i < 5; i++) {
    code += chars[n % chars.length]
    n = Math.floor(n / chars.length)
  }
  return `RHP-${code}`
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

  const referralCode = generateReferralCode(user.email ?? user.name ?? 'user')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'referral' | 'orders'>('referral')
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersLoaded, setOrdersLoaded] = useState(false)

  function copyCode() {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
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
            <div className={styles.card}>
              <div className={styles.cardLabel}>{p.referralLabel}</div>
              <div className={styles.referralCode}>{referralCode}</div>
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
              <p className={styles.cardNote}>{p.shareNote}</p>
            </div>

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

            <div className={styles.card}>
              <div className={styles.cardLabel}>{p.statsLabel}</div>
              <div className={styles.statGrid}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>0</span>
                  <span className={styles.statLabel}>{p.statPeople}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>Rp 0</span>
                  <span className={styles.statLabel}>{p.statReward}</span>
                </div>
              </div>
              <p className={styles.cardNote}>{p.statsNote}</p>
            </div>

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
