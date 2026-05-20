'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './order-detail.module.css'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
type ProgressStepStatus = 'pending' | 'in_progress' | 'done'

type ProgressStep = {
  step: 1 | 2 | 3 | 4 | 5
  status: ProgressStepStatus
  timestamp?: string
  estimatedNext?: string
  noteForCustomer?: string
}

type Order = {
  orderId: string
  serviceNameId: string
  serviceNameEn: string
  packageNameId: string
  packageNameEn: string
  name: string
  totalPrice: number
  status: OrderStatus
  createdAt: string
  progressSteps?: ProgressStep[]
  progressUpdatedAt?: string
  resultUrl?: string
  notes?: string
}

const STEP_LABELS_ID = ['Pembayaran Diterima', 'Proses Pengerjaan', 'Revisi', 'Finalisasi', 'Selesai & Dikirim']
const STEP_LABELS_EN = ['Payment Received', 'Working on It', 'Revision', 'Finalization', 'Completed & Delivered']

function fmt(n: number) { return `Rp${n.toLocaleString('id-ID')}` }

function fmtDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function OrderDetailPage() {
  const { order_id } = useParams<{ order_id: string }>()
  const { data: session, status: authStatus } = useSession()
  const { lang } = useLanguage()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (authStatus !== 'authenticated') return
    fetch('/api/payment/my-orders')
      .then(r => r.ok ? r.json() : [])
      .then((orders: Order[]) => {
        const found = orders.find(o => o.orderId === order_id)
        if (found) setOrder(found)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [authStatus, order_id])

  if (authStatus === 'loading' || loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingWrap}><div className={styles.spinner} /></div>
      </main>
    )
  }

  if (notFound || !order) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.notFound}>{lang === 'id' ? 'Order tidak ditemukan.' : 'Order not found.'}</p>
          <Link href="/dashboard/profil?tab=orders" className={styles.backLink}>
            {lang === 'id' ? '← Kembali ke Riwayat Order' : '← Back to Order History'}
          </Link>
        </div>
      </main>
    )
  }

  const stepLabels = lang === 'id' ? STEP_LABELS_ID : STEP_LABELS_EN
  const steps: ProgressStep[] = order.progressSteps ?? ([1, 2, 3, 4, 5] as const).map(n => ({ step: n, status: 'pending' as ProgressStepStatus }))
  const hasProgress = order.progressSteps && order.progressSteps.length > 0

  const statusColors: Record<OrderStatus, string> = {
    pending: '#f59e0b', paid: '#3b82f6', processing: '#8b5cf6',
    completed: '#10b981', cancelled: '#ef4444',
  }
  const statusLabels: Record<OrderStatus, string> = lang === 'id'
    ? { pending: 'Menunggu Bayar', paid: 'Dibayar', processing: 'Diproses', completed: 'Selesai', cancelled: 'Dibatalkan' }
    : { pending: 'Awaiting Payment', paid: 'Paid', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled' }

  return (
    <main className={styles.page}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <div className={styles.container}>
        <Link href="/dashboard/profil?tab=orders" className={styles.backLink}>
          {lang === 'id' ? '← Kembali ke Riwayat Order' : '← Back to Order History'}
        </Link>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.orderId}>{order.orderId}</p>
            <h1 className={styles.serviceName}>
              {lang === 'id' ? order.serviceNameId : order.serviceNameEn}
            </h1>
            <p className={styles.packageName}>
              {lang === 'id' ? order.packageNameId : order.packageNameEn}
            </p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.totalPrice}>{fmt(order.totalPrice)}</div>
            <span className={styles.statusBadge} style={{ background: `${statusColors[order.status]}22`, color: statusColors[order.status], border: `1px solid ${statusColors[order.status]}44` }}>
              {statusLabels[order.status]}
            </span>
          </div>
        </div>

        <p className={styles.createdAt}>
          {lang === 'id' ? 'Dipesan' : 'Ordered'} {fmtDate(order.createdAt, lang)}
        </p>

        {/* Progress timeline */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            {lang === 'id' ? 'Progress Pengerjaan' : 'Order Progress'}
            {order.progressUpdatedAt && (
              <span className={styles.updatedAt}>
                {lang === 'id' ? 'Diperbarui' : 'Updated'} {fmtDate(order.progressUpdatedAt, lang)}
              </span>
            )}
          </div>
          {!hasProgress ? (
            <p className={styles.noProgress}>
              {lang === 'id'
                ? 'Progress pengerjaan belum diupdate. Kami akan update setelah pembayaran dikonfirmasi.'
                : 'Progress has not been updated yet. We will update it after payment is confirmed.'}
            </p>
          ) : (
            <div className={styles.timeline}>
              {steps.map((step, i) => {
                const isDone = step.status === 'done'
                const isActive = step.status === 'in_progress'
                const isPending = step.status === 'pending'
                return (
                  <div key={i} className={`${styles.timelineStep} ${isDone ? styles.stepDone : isActive ? styles.stepActive : styles.stepPending}`}>
                    <div className={styles.stepLeft}>
                      <div className={styles.stepDot}>
                        {isDone && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {isActive && <div className={styles.stepPulse} />}
                      </div>
                      {i < steps.length - 1 && <div className={`${styles.stepLine} ${isDone ? styles.lineDone : ''}`} />}
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepLabel}>{stepLabels[i]}</div>
                      {step.timestamp && (
                        <div className={styles.stepDate}>{fmtDate(step.timestamp, lang)}</div>
                      )}
                      {step.noteForCustomer && (
                        <div className={styles.stepNote}>{step.noteForCustomer}</div>
                      )}
                      {isActive && step.estimatedNext && (
                        <div className={styles.stepEst}>
                          {lang === 'id' ? `Estimasi selesai: ${step.estimatedNext}` : `Est. completion: ${step.estimatedNext}`}
                        </div>
                      )}
                      {isPending && i > 0 && !steps.slice(0, i).some(s => s.status === 'done') && (
                        <div className={styles.stepWaiting}>
                          {lang === 'id' ? 'Menunggu' : 'Waiting'}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Result link */}
        {order.resultUrl && (
          <div className={styles.card}>
            <div className={styles.cardLabel}>{lang === 'id' ? 'Hasil Pekerjaan' : 'Deliverable'}</div>
            <a href={order.resultUrl} target="_blank" rel="noopener noreferrer" className={styles.resultLink}>
              {lang === 'id' ? 'Buka Link Hasil →' : 'Open Result Link →'}
            </a>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className={styles.card}>
            <div className={styles.cardLabel}>{lang === 'id' ? 'Catatan Order' : 'Order Notes'}</div>
            <p className={styles.notes}>{order.notes}</p>
          </div>
        )}

        <div className={styles.footer}>
          <Link href="/dashboard/profil?tab=orders" className={styles.backBtn}>
            {lang === 'id' ? '← Semua Order' : '← All Orders'}
          </Link>
          {!['completed', 'cancelled'].includes(order.status) && (
            <a
              href={`https://wa.me/6285179992598?text=${encodeURIComponent(`Halo RHP Creatives! Mau tanya soal order ${order.orderId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBtn}
            >
              {lang === 'id' ? 'Tanya via WA' : 'Ask via WA'}
            </a>
          )}
        </div>
      </div>
    </main>
  )
}
