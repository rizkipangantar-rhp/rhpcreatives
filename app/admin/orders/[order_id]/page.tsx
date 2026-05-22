'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import s from '@/components/admin/admin.module.css'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'

type ProgressStepStatus = 'pending' | 'in_progress' | 'done'
type ProgressStep = { step: number; status: ProgressStepStatus; timestamp?: string; estimatedNext?: string; noteForCustomer?: string; internalNote?: string }

type Order = {
  orderId: string
  userId: string
  name: string
  email: string
  wa: string
  serviceNameId: string
  serviceNameEn: string
  packageNameId: string
  packageNameEn: string
  originalPrice: number
  discountAmount: number
  totalPrice: number
  voucherCode?: string
  discountType?: string
  notes?: string
  status: OrderStatus
  paymentMethod?: string
  paymentBank?: string
  paymentVa?: string
  paymentExpiry?: string
  adminNotes?: string
  resultUrl?: string
  statusHistory?: { status: OrderStatus; note: string; changedAt: string }[]
  progressSteps?: ProgressStep[]
  createdAt: string
  updatedAt: string
}

const STEP_LABELS = ['Pembayaran Diterima', 'Proses Pengerjaan', 'Revisi', 'Finalisasi', 'Selesai & Dikirim']

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'processing', 'completed', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu', paid: 'Dibayar', processing: 'Diproses',
  completed: 'Selesai', cancelled: 'Batal',
}

function fmt(n: number) { return `Rp${n.toLocaleString('id-ID')}` }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    pending: s.badgePending, paid: s.badgePaid, processing: s.badgeProcessing,
    completed: s.badgeCompleted, cancelled: s.badgeCancelled,
  }
  return <span className={`${s.badge} ${cls[status] ?? s.badgePending}`}>{STATUS_LABELS[status] ?? status}</span>
}

export default function OrderDetailPage() {
  const { order_id } = useParams<{ order_id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const [newStatus, setNewStatus] = useState<OrderStatus>('pending')
  const [statusNote, setStatusNote] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([])
  const [progressSaving, setProgressSaving] = useState(false)
  const [progressSaved, setProgressSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/orders/${order_id}`)
      .then(r => r.json())
      .then(d => {
        setOrder(d)
        setNewStatus(d.status)
        setAdminNotes(d.adminNotes ?? '')
        setResultUrl(d.resultUrl ?? '')
        setProgressSteps(
          d.progressSteps ?? [1, 2, 3, 4, 5].map((n: number) => ({ step: n, status: 'pending', noteForCustomer: '', estimatedNext: '' }))
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [order_id])

  function updateStep(idx: number, field: keyof ProgressStep, value: string) {
    setProgressSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  async function saveProgress() {
    setProgressSaving(true)
    const stepsWithTimestamps = progressSteps.map(s => ({
      ...s,
      timestamp: s.status !== 'pending' && !s.timestamp ? new Date().toISOString() : s.timestamp,
    }))
    await fetch(`/api/admin/orders/${order_id}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steps: stepsWithTimestamps }),
    })
    setProgressSteps(stepsWithTimestamps)
    setProgressSaving(false)
    setProgressSaved(true)
    setTimeout(() => setProgressSaved(false), 2000)
  }

  async function saveStatus() {
    if (!order) return
    setSaving(true)
    const body: Record<string, string> = { status: newStatus }
    if (statusNote.trim()) body.note = statusNote.trim()
    await fetch(`/api/admin/orders/${order_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setOrder(prev => prev ? {
      ...prev,
      status: newStatus,
      statusHistory: statusNote.trim()
        ? [...(prev.statusHistory ?? []), { status: newStatus, note: statusNote.trim(), changedAt: new Date().toISOString() }]
        : prev.statusHistory,
    } : prev)
    setStatusNote('')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveAdminData() {
    setSaving(true)
    await fetch(`/api/admin/orders/${order_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNotes, resultUrl }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className={s.loading}><div className={s.spinner} /></div>
  if (!order) return <div className={s.emptyState}>Order tidak ditemukan.</div>

  const waUrl = `https://wa.me/${order.wa.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(order.name)}%2C%20mengenai%20order%20${order.orderId}`

  return (
    <div>
      <div className={s.pageHeader} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <button onClick={() => router.back()} className={s.btnGhost} style={{ marginBottom: 8 }}>Kembali</button>
          <h1 className={s.pageTitle}>{order.orderId}</h1>
          <p className={s.pageSub}>Dibuat {fmtDate(order.createdAt)} · Diperbarui {fmtDate(order.updatedAt)}</p>
        </div>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className={s.btnPrimary} style={{ textDecoration: 'none' }}>
          Hubungi via WA
        </a>
      </div>

      <div className={s.twoCol}>
        {/* Customer info */}
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Info Customer</div>
          <InfoRow label="Nama" value={order.name} bold />
          <InfoRow label="Email" value={order.email} />
          <InfoRow label="WhatsApp" value={order.wa} />
        </div>

        {/* Order summary */}
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Ringkasan Order</div>
          <InfoRow label="Layanan" value={order.serviceNameId} bold />
          <InfoRow label="Paket" value={order.packageNameId} />
          {order.notes && <InfoRow label="Keterangan" value={order.notes} />}
          <InfoRow label="Harga Asli" value={fmt(order.originalPrice)} />
          {order.discountAmount > 0 && (
            <InfoRow label={`Diskon${order.voucherCode ? ` (${order.voucherCode})` : ''}`} value={`-${fmt(order.discountAmount)}`} color="#f87171" />
          )}
          <InfoRow label="Total Bayar" value={fmt(order.totalPrice)} bold color="#34d399" />
        </div>
      </div>

      <div className={s.twoCol}>
        {/* Payment info */}
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Info Pembayaran</div>
          <InfoRow label="Metode" value={order.paymentMethod ?? '—'} />
          {order.paymentBank && <InfoRow label="Bank" value={order.paymentBank} />}
          {order.paymentVa && <InfoRow label="VA" value={order.paymentVa} />}
          {order.paymentExpiry && <InfoRow label="Expired" value={fmtDate(order.paymentExpiry)} />}
          <div style={{ marginTop: 12 }}>
            <InfoRow label="Status" value="" />
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Status update */}
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Update Status</div>
          <select
            className={s.filterSelect}
            style={{ width: '100%', marginBottom: 10 }}
            value={newStatus}
            onChange={e => setNewStatus(e.target.value as OrderStatus)}
          >
            {STATUS_OPTIONS.map(st => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}
          </select>
          <textarea
            placeholder="Catatan perubahan status (opsional)..."
            value={statusNote}
            onChange={e => setStatusNote(e.target.value)}
            rows={3}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#f1f5f9', fontSize: '0.84rem', padding: '8px 12px',
              outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10,
            }}
          />
          <button className={s.btnPrimary} onClick={saveStatus} disabled={saving || newStatus === order.status}>
            {saving ? 'Menyimpan...' : saved ? 'Tersimpan ✓' : 'Simpan Status'}
          </button>
        </div>
      </div>

      {/* Admin notes + result URL */}
      <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
        <div className={s.cardTitle} style={{ marginBottom: 16 }}>Catatan Admin & Link Hasil</div>
        <div className={s.twoCol} style={{ marginBottom: 0 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>Catatan Internal</label>
            <textarea
              placeholder="Catatan admin (tidak terlihat customer)..."
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              rows={4}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#f1f5f9', fontSize: '0.84rem', padding: '8px 12px',
                outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>Link Hasil Pekerjaan</label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={resultUrl}
              onChange={e => setResultUrl(e.target.value)}
              className={s.searchInput}
              style={{ marginBottom: 10 }}
            />
            {resultUrl && (
              <a href={resultUrl} target="_blank" rel="noopener noreferrer" className={s.textBlue} style={{ fontSize: '0.78rem' }}>
                Buka link
              </a>
            )}
          </div>
        </div>
        <button className={s.btnPrimary} style={{ marginTop: 12 }} onClick={saveAdminData} disabled={saving}>
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan ✓' : 'Simpan'}
        </button>
      </div>

      {/* Progress tracking */}
      <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
        <div className={s.cardTitle} style={{ marginBottom: 20 }}>Update Progress Pengerjaan</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {progressSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < progressSteps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
                  background: step.status === 'done' ? 'rgba(52,211,153,0.15)' : step.status === 'in_progress' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                  border: step.status === 'done' ? '2px solid #34d399' : step.status === 'in_progress' ? '2px solid #8b5cf6' : '2px solid rgba(255,255,255,0.1)',
                  color: step.status === 'done' ? '#34d399' : step.status === 'in_progress' ? '#a78bfa' : '#64748b',
                }}>
                  {i + 1}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>{STEP_LABELS[i]}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {(['pending', 'in_progress', 'done'] as ProgressStepStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => updateStep(i, 'status', st)}
                      style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                        background: step.status === st ? (st === 'done' ? '#34d399' : st === 'in_progress' ? '#8b5cf6' : '#475569') : 'rgba(255,255,255,0.05)',
                        border: step.status === st ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        color: step.status === st ? '#fff' : '#64748b',
                      }}
                    >
                      {st === 'pending' ? 'Pending' : st === 'in_progress' ? 'Sedang Dikerjakan' : 'Selesai'}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Catatan untuk customer (opsional)..."
                  value={step.noteForCustomer ?? ''}
                  onChange={e => updateStep(i, 'noteForCustomer', e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f1f5f9', fontSize: '0.8rem', padding: '6px 10px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 6 }}
                />
                {step.status === 'in_progress' && (
                  <input
                    type="text"
                    placeholder="Estimasi selesai (misal: 2 hari lagi / 25 Mei 2026)..."
                    value={step.estimatedNext ?? ''}
                    onChange={e => updateStep(i, 'estimatedNext', e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f1f5f9', fontSize: '0.8rem', padding: '6px 10px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <button className={s.btnPrimary} style={{ marginTop: 16 }} onClick={saveProgress} disabled={progressSaving}>
          {progressSaving ? 'Menyimpan...' : progressSaved ? 'Progress Tersimpan ✓' : 'Simpan Progress'}
        </button>
      </div>

      {/* Status history */}
      {(order.statusHistory?.length ?? 0) > 0 && (
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Riwayat Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...(order.statusHistory ?? [])].reverse().map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, fontSize: '0.82rem' }}>
                <div style={{ paddingTop: 2 }}><StatusBadge status={h.status} /></div>
                <div>
                  <div style={{ color: '#f1f5f9' }}>{h.note || '(tanpa catatan)'}</div>
                  <div className={s.dim}>{fmtDate(h.changedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.82rem', gap: 8 }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ color: color ?? (bold ? '#f1f5f9' : '#cbd5e1'), fontWeight: bold ? 600 : 400, textAlign: 'right' }}>{value}</span>
    </div>
  )
}
