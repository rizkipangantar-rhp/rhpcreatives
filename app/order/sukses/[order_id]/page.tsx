'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './sukses.module.css'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'

type OrderData = {
  orderId: string
  serviceNameId: string
  serviceNameEn: string
  packageNameId: string
  packageNameEn: string
  name: string
  email: string
  wa: string
  totalPrice: number
  originalPrice: number
  discountAmount: number
  voucherCode?: string
  notes?: string
  status: OrderStatus
  createdAt: string
}

const ADMIN_WA = '6285179992598'

function fmt(price: number) {
  return `Rp${price.toLocaleString('id-ID')}`
}

function StatusBadge({ status, labels }: { status: OrderStatus; labels: Record<string, string> }) {
  const colorMap: Record<OrderStatus, string> = {
    pending: styles.statusPending,
    paid: styles.statusPaid,
    processing: styles.statusProcessing,
    completed: styles.statusCompleted,
    cancelled: styles.statusCancelled,
  }
  return <span className={`${styles.statusBadge} ${colorMap[status]}`}>{labels[status]}</span>
}

export default function SuksesPage() {
  const params = useParams()
  const orderId = params.order_id as string
  const router = useRouter()
  const { tr, lang } = useLanguage()
  const p = tr.orderSuccess

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ x: number; y: number; color: string; size: number; delay: number }>>([])

  useEffect(() => {
    if (!orderId) return
    fetch(`/api/payment/status/${orderId}`)
      .then(r => {
        if (r.status === 404 || r.status === 401) { setNotFound(true); return null }
        return r.json()
      })
      .then(data => { if (data) setOrder(data) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [orderId])

  useEffect(() => {
    if (!order || order.status === 'cancelled') return
    const items = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 60,
      color: ['#8b5cf6', '#ec4899', '#a78bfa', '#f9a8d4', '#fbbf24'][Math.floor(Math.random() * 5)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 1.5,
    }))
    setConfetti(items)
  }, [order])

  const statusLabels: Record<string, string> = {
    pending: p.statusPending,
    paid: p.statusPaid,
    processing: p.statusProcessing,
    completed: p.statusCompleted,
    cancelled: p.statusCancelled,
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingBox}>
            <div className={styles.spinner} />
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !order) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.notFoundIcon}>❌</div>
            <h1 className={styles.notFoundTitle}>{p.notFoundTitle}</h1>
            <p className={styles.notFoundSub}>{p.notFoundSub}</p>
            <Link href="/" className={styles.homeBtn}>{p.homeBtn}</Link>
          </div>
        </div>
      </main>
    )
  }

  const waMessage = encodeURIComponent(
    `${lang === 'id' ? 'Halo RHP Creatives! Saya mau follow up order:' : 'Hi RHP Creatives! I want to follow up on my order:'}\n\nOrder ID: ${order.orderId}\n${lang === 'id' ? 'Layanan' : 'Service'}: ${lang === 'id' ? order.serviceNameId : order.serviceNameEn} — ${lang === 'id' ? order.packageNameId : order.packageNameEn}\n${lang === 'id' ? 'Nama' : 'Name'}: ${order.name}\nTotal: ${fmt(order.totalPrice)}${order.voucherCode ? `\nVoucher: ${order.voucherCode}` : ''}${order.notes ? `\n${lang === 'id' ? 'Catatan' : 'Notes'}: ${order.notes}` : ''}`
  )

  return (
    <main className={styles.page}>
      {confetti.map((c, i) => (
        <div
          key={i}
          className={styles.confetti}
          style={{ left: `${c.x}%`, top: `${c.y}%`, width: c.size, height: c.size, background: c.color, animationDelay: `${c.delay}s` }}
        />
      ))}

      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>🎉</div>
          <h1 className={styles.title}>{p.title}</h1>
          <p className={styles.sub}>{p.sub}</p>

          <div className={styles.orderIdBox}>
            <span className={styles.orderIdLabel}>{p.orderIdLabel}</span>
            <span className={styles.orderId}>{order.orderId}</span>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{p.serviceLabel}</span>
              <span className={styles.detailValue}>{lang === 'id' ? order.serviceNameId : order.serviceNameEn}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{p.packageLabel}</span>
              <span className={styles.detailValue}>{lang === 'id' ? order.packageNameId : order.packageNameEn}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{p.amountLabel}</span>
              <span className={`${styles.detailValue} ${styles.detailAmount}`}>{fmt(order.totalPrice)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{p.statusLabel}</span>
              <StatusBadge status={order.status} labels={statusLabels} />
            </div>
          </div>

          <div className={styles.actions}>
            <a
              href={`https://wa.me/${ADMIN_WA}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBtn}
            >
              {p.waBtn}
            </a>
            <button onClick={() => router.push('/dashboard/profil?tab=orders')} className={styles.historyBtn}>
              {p.orderHistoryBtn}
            </button>
            <Link href="/" className={styles.homeBtn}>{p.homeBtn}</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
