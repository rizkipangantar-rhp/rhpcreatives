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
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewRole, setReviewRole] = useState('')
  const [reviewState, setReviewState] = useState<'idle' | 'submitting' | 'done' | 'already'>('idle')
  const [reviewError, setReviewError] = useState('')

  function copyNote(text: string, stepIdx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStep(stepIdx)
      setTimeout(() => setCopiedStep(null), 2000)
    })
  }

  async function submitReview() {
    if (!reviewText.trim()) { setReviewError(lang === 'id' ? 'Tulis ulasanmu dulu' : 'Please write your review'); return }
    setReviewState('submitting')
    setReviewError('')
    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order_id, rating: reviewRating, text: reviewText, role: reviewRole }),
    })
    if (res.status === 409) { setReviewState('already'); return }
    if (!res.ok) { setReviewState('idle'); setReviewError(lang === 'id' ? 'Gagal mengirim ulasan' : 'Failed to submit'); return }
    setReviewState('done')
  }

  useEffect(() => {
    if (window.location.hash === '#review') {
      const el = document.getElementById('review')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [loading])

  useEffect(() => {
    if (authStatus !== 'authenticated') return
    fetch('/api/payment/my-orders')
      .then(r => r.ok ? r.json() : [])
      .then((orders: Order[]) => {
        const found = orders.find(o => o.orderId === order_id)
        if (found) setOrder(found)
        else setNotFound(true)
      })
    fetch(`/api/review?orderId=${order_id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.exists) setReviewState('already') })
      .catch(() => {})
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
            {lang === 'id' ? 'Kembali ke Riwayat Order' : 'Back to Order History'}
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
          {lang === 'id' ? 'Kembali ke Riwayat Order' : 'Back to Order History'}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                          <div className={styles.stepNote} style={{ flex: 1, marginTop: 0 }}>{step.noteForCustomer}</div>
                          <button
                            onClick={() => copyNote(step.noteForCustomer!, i)}
                            title={lang === 'id' ? 'Salin' : 'Copy'}
                            style={{
                              flexShrink: 0, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                              borderRadius: 6, padding: '0.3rem 0.55rem', cursor: 'pointer',
                              color: copiedStep === i ? '#34d399' : '#a78bfa', fontSize: '0.72rem', fontWeight: 600,
                              transition: 'color 0.2s',
                            }}
                          >
                            {copiedStep === i ? (lang === 'id' ? 'Disalin!' : 'Copied!') : (lang === 'id' ? 'Salin' : 'Copy')}
                          </button>
                        </div>
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
              {lang === 'id' ? 'Buka Link Hasil' : 'Open Result Link'}
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

        {/* Review form — shown when all steps done */}
        {(() => {
          const steps = order.progressSteps ?? []
          const allDone = steps.length === 5 && steps.every(s => s.status === 'done')
          const eligible = allDone || order.status === 'completed'
          if (!eligible) return null
          if (reviewState === 'already') return (
            <div className={styles.card} style={{ textAlign: 'center', color: '#34d399', padding: '1.5rem' }}>
              {lang === 'id' ? 'Terima kasih! Ulasanmu sudah terkirim.' : 'Thank you! Your review has been submitted.'}
            </div>
          )
          if (reviewState === 'done') return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 18, padding: '2.5rem 2rem', textAlign: 'center', maxWidth: 340, width: '100%', boxShadow: '0 0 60px rgba(52,211,153,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
                <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.5rem' }}>{lang === 'id' ? 'Ulasan terkirim!' : 'Review submitted!'}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>{lang === 'id' ? 'Makasih udah spill! Ulasanmu akan tampil di halaman testimoni.' : 'Thanks for dropping a review! It will appear on the testimonials page.'}</div>
                <button onClick={() => setReviewState('already')} style={{ marginTop: '1.25rem', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', borderRadius: 10, padding: '0.55rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                  {lang === 'id' ? 'Tutup' : 'Close'}
                </button>
              </div>
            </div>
          )
          return (
            <div className={styles.card} id="review">
              <div className={styles.cardLabel}>{lang === 'id' ? 'Beri Ulasan' : 'Leave a Review'}</div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>{lang === 'id' ? 'Rating' : 'Rating'}</div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setReviewRating(n)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '1.6rem', color: n <= reviewRating ? '#fbbf24' : '#334155',
                      transition: 'color 0.15s', padding: 0,
                    }}>★</button>
                  ))}
                </div>
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder={lang === 'id' ? 'Ceritakan pengalamanmu dengan layanan ini...' : 'Share your experience with this service...'}
                className={styles.reviewTextarea}
                maxLength={500}
              />
              <div style={{ fontSize: '0.72rem', color: '#475569', textAlign: 'right', marginTop: '0.2rem', marginBottom: '0.75rem' }}>{reviewText.length}/500</div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  {lang === 'id' ? 'Profesi / Peran (opsional)' : 'Role / Profession (optional)'}
                </div>
                <input
                  type="text"
                  value={reviewRole}
                  onChange={e => setReviewRole(e.target.value)}
                  placeholder={lang === 'id' ? 'Contoh: Business Owner, Content Creator...' : 'E.g. Business Owner, Content Creator...'}
                  maxLength={60}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10, color: 'var(--text)', fontSize: '0.85rem', padding: '0.55rem 0.9rem',
                    fontFamily: 'inherit', outline: 'none',
                  }}
                />
              </div>
              {reviewError && <div style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{reviewError}</div>}
              <button onClick={submitReview} disabled={reviewState === 'submitting'} className={styles.submitReviewBtn}>
                {reviewState === 'submitting' ? (lang === 'id' ? 'Mengirim...' : 'Submitting...') : (lang === 'id' ? 'Kirim Ulasan' : 'Submit Review')}
              </button>
            </div>
          )
        })()}

        <div className={styles.footer}>
          <Link href="/dashboard/profil?tab=orders" className={styles.backBtn}>
            {lang === 'id' ? 'Semua Order' : 'All Orders'}
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
