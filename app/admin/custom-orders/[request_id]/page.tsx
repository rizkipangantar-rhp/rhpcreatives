'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'
import type { CustomOrderRequest, RequestStatus } from '@/lib/custom-orders'

const STATUS_LABELS: Record<RequestStatus, string> = {
  waiting_review: 'Menunggu Review',
  price_sent: 'Harga Dikirim',
  negotiating: 'Negosiasi',
  accepted: 'Diterima',
  payment_pending: 'Menunggu Bayar',
  paid: 'Dibayar',
  in_progress: 'Diproses',
  done: 'Selesai',
  rejected_by_admin: 'Ditolak Admin',
  rejected_by_customer: 'Ditolak Customer',
}

const STATUS_BADGE_CLS: Partial<Record<RequestStatus, string>> = {
  waiting_review: s.badgePending,
  price_sent: s.badgePaid,
  negotiating: s.badgeProcessing,
  accepted: s.badgeProcessing,
  payment_pending: s.badgePending,
  paid: s.badgePaid,
  in_progress: s.badgeProcessing,
  done: s.badgeCompleted,
  rejected_by_admin: s.badgeCancelled,
  rejected_by_customer: s.badgeCancelled,
}

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`${s.badge} ${STATUS_BADGE_CLS[status] ?? s.badgePending}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

function InfoRow({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.82rem', gap: 8 }}>
      <span style={{ color: '#64748b', flexShrink: 0 }}>{label}</span>
      <span style={{ color: color ?? (bold ? '#f1f5f9' : '#cbd5e1'), fontWeight: bold ? 600 : 400, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function fmt(n: number) { return `Rp${n.toLocaleString('id-ID')}` }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const textareaStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#f1f5f9', fontSize: '0.84rem', padding: '8px 12px',
  outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
}
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#f1f5f9', fontSize: '0.84rem', padding: '8px 12px',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }

export default function AdminCustomOrderDetailPage() {
  const { request_id } = useParams<{ request_id: string }>()
  const router = useRouter()
  const [request, setRequest] = useState<CustomOrderRequest | null>(null)
  const [loading, setLoading] = useState(true)

  // Price form state
  const [basePrice, setBasePrice] = useState('')
  const [estimatedDays, setEstimatedDays] = useState('')
  const [noteForCustomer, setNoteForCustomer] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [showNewPriceForm, setShowNewPriceForm] = useState(false)

  // Reject state
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  // Advance status
  const [advanceNote, setAdvanceNote] = useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/custom-order/${request_id}`)
      .then(r => r.json())
      .then((d: CustomOrderRequest) => {
        setRequest(d)
        if (d.notes?.for_customer) setNoteForCustomer(d.notes.for_customer)
        if (d.notes?.internal) setInternalNote(d.notes.internal)
        if (d.pricing?.base_price) setBasePrice(String(d.pricing.base_price))
        if (d.pricing?.estimated_days) setEstimatedDays(String(d.pricing.estimated_days))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [request_id])

  const basePriceNum = parseFloat(basePrice.replace(/\D/g, '')) || 0

  async function sendPrice(overridePrice?: number) {
    const price = overridePrice ?? basePriceNum
    if (!price) { setError('Masukkan harga terlebih dahulu'); return }
    setSaving(true); setError('')
    const res = await fetch(`/api/admin/custom-order/${request_id}/price`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_price: price,
        discount_type: null,
        discount_value: 0,
        estimated_days: parseInt(estimatedDays) || 0,
        for_customer: noteForCustomer || undefined,
        internal: internalNote || undefined,
      }),
    })
    setSaving(false)
    if (!res.ok) { setError('Gagal menyimpan. Coba lagi.'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    fetch(`/api/custom-order/${request_id}`).then(r => r.json()).then(setRequest)
  }

  async function rejectRequest() {
    if (!rejectReason.trim()) { setError('Masukkan alasan penolakan'); return }
    setSaving(true); setError('')
    await fetch(`/api/admin/custom-order/${request_id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectReason }),
    })
    setSaving(false)
    setShowRejectModal(false)
    fetch(`/api/custom-order/${request_id}`).then(r => r.json()).then(setRequest)
  }

  async function advanceStatus(status: RequestStatus) {
    setSaving(true); setError('')
    await fetch(`/api/admin/custom-order/${request_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note: advanceNote || undefined }),
    })
    setSaving(false)
    setAdvanceNote('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    fetch(`/api/custom-order/${request_id}`).then(r => r.json()).then(setRequest)
  }

  if (loading) return <AdminLoading />
  if (!request) return <div className={s.emptyState}>Request tidak ditemukan.</div>

  const waUrl = `https://wa.me/${request.customer.whatsapp}?text=${encodeURIComponent(`Halo ${request.customer.name}, mengenai Custom Order ${request_id}`)}`
  const isTerminal = ['done', 'rejected_by_admin', 'rejected_by_customer'].includes(request.status)
  const canSendPrice = request.status === 'waiting_review' || request.status === 'price_sent' || request.status === 'negotiating'
  const isNegotiating = request.status === 'negotiating'
  const canAdvance = ['paid', 'in_progress'].includes(request.status)
  const nextStatus: RequestStatus = request.status === 'paid' ? 'in_progress' : 'done'
  const nextLabel = request.status === 'paid' ? 'Tandai Diproses' : 'Tandai Selesai'

  return (
    <div>
      {/* Header */}
      <div className={s.pageHeader} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <button onClick={() => router.back()} className={s.btnGhost} style={{ marginBottom: 8 }}>Kembali</button>
          <h1 className={s.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className={s.mono} style={{ color: '#a78bfa', fontSize: '1.2rem' }}>{request_id}</span>
            <StatusBadge status={request.status} />
          </h1>
          <p className={s.pageSub}>Dibuat {fmtDate(request.created_at)} · Diperbarui {fmtDate(request.updated_at)}</p>
        </div>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className={s.btnPrimary} style={{ textDecoration: 'none' }}>
          Hubungi via WA
        </a>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 16px', color: '#f87171', fontSize: '0.84rem', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Customer & Service info */}
      <div className={s.twoCol}>
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Info Customer</div>
          <InfoRow label="Nama" value={request.customer.name} bold />
          <InfoRow label="Email" value={request.customer.email} />
          <InfoRow label="WhatsApp" value={request.customer.whatsapp} />
          {request.voucher_code && <InfoRow label="Voucher" value={request.voucher_code} color="#fbbf24" />}
        </div>

        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Detail Layanan</div>
          <InfoRow label="Kategori" value={request.service.category} />
          <InfoRow label="Layanan" value={request.service.name} bold />
          <InfoRow label="Paket / Spek" value={request.service.package} />
          {request.service.deadline && <InfoRow label="Deadline" value={request.service.deadline} />}
        </div>
      </div>

      {/* Description & reference */}
      <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
        <div className={s.cardTitle} style={{ marginBottom: 16 }}>Deskripsi Kebutuhan</div>
        <p style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
          {request.service.description}
        </p>
        {request.service.reference && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 6 }}>Referensi</div>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
              {request.service.reference}
            </p>
          </div>
        )}
      </div>

      {/* Pricing section */}
      {canSendPrice && (() => {
        const latestCounter = request.negotiation_history?.filter(e => e.by === 'customer').at(-1)
        const counterPrice = latestCounter?.counter_price

        return (
          <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
            <div className={s.cardTitle} style={{ marginBottom: 16, color: isNegotiating ? '#fbbf24' : undefined }}>
              {isNegotiating ? 'Negosiasi Harga' : request.status === 'price_sent' ? 'Edit Penawaran Harga' : 'Input Penawaran Harga'}
            </div>

            {/* Negotiation: show customer counter + accept/counter buttons */}
            {isNegotiating && counterPrice && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>Customer minta harga</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>{fmt(counterPrice)}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => sendPrice(counterPrice)}
                    disabled={saving}
                    style={{
                      background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)',
                      color: '#34d399', borderRadius: 8, padding: '10px 20px', fontSize: '0.85rem',
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {saving ? 'Menyimpan...' : saved ? 'Tersimpan ✓' : `Setujui ${fmt(counterPrice)}`}
                  </button>
                  <button
                    onClick={() => setShowNewPriceForm(v => !v)}
                    style={{
                      background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
                      color: '#60a5fa', borderRadius: 8, padding: '10px 20px', fontSize: '0.85rem',
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {showNewPriceForm ? 'Tutup' : 'Kasih Harga Lain'}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171', borderRadius: 8, padding: '10px 20px', fontSize: '0.85rem',
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Batalkan Request
                  </button>
                </div>
              </div>
            )}

            {/* Price form — always visible when not negotiating, toggled when negotiating */}
            {(!isNegotiating || showNewPriceForm) && (
              <>
                <div className={s.twoCol} style={{ marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Harga <span style={{ color: '#f87171' }}>*</span></label>
                    <input
                      style={inputStyle}
                      type="text"
                      inputMode="numeric"
                      placeholder="Contoh: 150000"
                      value={basePrice}
                      onChange={e => setBasePrice(e.target.value.replace(/\D/g, ''))}
                    />
                    {basePriceNum > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>{fmt(basePriceNum)}</div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Estimasi Pengerjaan (hari)</label>
                    <input
                      style={inputStyle}
                      type="number"
                      min={1}
                      placeholder="Contoh: 3"
                      value={estimatedDays}
                      onChange={e => setEstimatedDays(e.target.value)}
                    />
                  </div>
                </div>

                <div className={s.twoCol} style={{ marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Catatan untuk Customer</label>
                    <textarea
                      style={textareaStyle}
                      rows={3}
                      placeholder="Catatan yang akan terlihat oleh customer..."
                      value={noteForCustomer}
                      onChange={e => setNoteForCustomer(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Catatan Internal Admin</label>
                    <textarea
                      style={textareaStyle}
                      rows={3}
                      placeholder="Catatan hanya untuk admin..."
                      value={internalNote}
                      onChange={e => setInternalNote(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className={s.btnPrimary} onClick={() => sendPrice()} disabled={saving || !basePriceNum}>
                    {saving ? 'Menyimpan...' : saved ? 'Tersimpan ✓' : 'Kirim Penawaran'}
                  </button>
                  {!isTerminal && (
                    <button className={s.btnDanger} onClick={() => setShowRejectModal(true)} disabled={saving}>
                      Tolak Request
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })()}

      {/* Pricing summary (when price already sent) */}
      {request.pricing.final_price != null && !canSendPrice && (
        <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Penawaran Harga</div>
          <div className={s.twoCol} style={{ marginBottom: 0 }}>
            <div>
              <InfoRow label="Harga Dasar" value={fmt(request.pricing.base_price!)} />
              {request.pricing.discount_amount > 0 && (
                <InfoRow
                  label={`Diskon ${request.pricing.discount_type === 'percent' ? `${request.pricing.discount_value}%` : ''}`}
                  value={`-${fmt(request.pricing.discount_amount)}`}
                  color="#f87171"
                />
              )}
              <InfoRow label="Harga Final" value={fmt(request.pricing.final_price)} bold color="#34d399" />
              {request.pricing.estimated_days && (
                <InfoRow label="Estimasi" value={`${request.pricing.estimated_days} hari`} />
              )}
              {request.offer_expires_at && request.status === 'price_sent' && (
                <InfoRow label="Offer berlaku s/d" value={fmtDate(request.offer_expires_at)} />
              )}
            </div>
            <div>
              {request.notes.for_customer && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>Catatan untuk Customer</div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{request.notes.for_customer}</p>
                </div>
              )}
              {request.notes.internal && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>Catatan Internal</div>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{request.notes.internal}</p>
                </div>
              )}
            </div>
          </div>
          {request.order_id && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Order ID terkait: </span>
              <span className={s.mono} style={{ color: '#60a5fa' }}>{request.order_id}</span>
            </div>
          )}
        </div>
      )}

      {/* Rejection info */}
      {(request.status === 'rejected_by_admin' || request.status === 'rejected_by_customer') && request.notes.rejection_reason && (
        <div className={s.card} style={{ padding: 20, marginBottom: 20, borderColor: 'rgba(239,68,68,0.2)' }}>
          <div className={s.cardTitle} style={{ marginBottom: 12, color: '#f87171' }}>Alasan Penolakan</div>
          <p style={{ color: '#f87171', fontSize: '0.84rem', lineHeight: 1.7, margin: 0 }}>{request.notes.rejection_reason}</p>
        </div>
      )}

      {/* Status advance controls */}
      {canAdvance && (
        <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Update Status</div>
          <textarea
            style={{ ...textareaStyle, marginBottom: 10 }}
            rows={2}
            placeholder="Catatan perubahan status (opsional)..."
            value={advanceNote}
            onChange={e => setAdvanceNote(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className={s.btnPrimary} onClick={() => advanceStatus(nextStatus)} disabled={saving}>
              {saving ? 'Menyimpan...' : saved ? 'Tersimpan ✓' : nextLabel}
            </button>
            {!isTerminal && (
              <button className={s.btnDanger} onClick={() => setShowRejectModal(true)} disabled={saving}>
                Tolak Request
              </button>
            )}
          </div>
        </div>
      )}

      {/* Negotiation history */}
      {request.negotiation_history && request.negotiation_history.length > 0 && (
        <div className={s.card} style={{ padding: 20, marginBottom: 20, borderColor: isNegotiating ? 'rgba(251,191,36,0.3)' : undefined }}>
          <div className={s.cardTitle} style={{ marginBottom: 16, color: '#fbbf24' }}>Riwayat Negosiasi</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {request.negotiation_history.map((entry, i) => (
              <div key={i} style={{
                background: entry.by === 'customer' ? 'rgba(251,191,36,0.06)' : 'rgba(139,92,246,0.06)',
                border: `1px solid ${entry.by === 'customer' ? 'rgba(251,191,36,0.2)' : 'rgba(139,92,246,0.2)'}`,
                borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: entry.by === 'customer' ? '#fbbf24' : '#a78bfa' }}>
                    {entry.by === 'customer' ? '[Customer]' : '[Admin]'}
                    {entry.counter_price ? ` — Counter: Rp${entry.counter_price.toLocaleString('id-ID')}` : ''}
                  </span>
                  <span style={{ color: '#475569', fontSize: '0.76rem' }}>{fmtDate(entry.created_at)}</span>
                </div>
                <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>{entry.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status history */}
      {request.status_history.length > 0 && (
        <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Riwayat Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...request.status_history].reverse().map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, fontSize: '0.82rem' }}>
                <div style={{ paddingTop: 2 }}><StatusBadge status={h.status} /></div>
                <div>
                  {h.note && <div style={{ color: '#f1f5f9' }}>{h.note}</div>}
                  <div className={s.dim}>{fmtDate(h.changed_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
        }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480 }}>
            <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 12, fontSize: '1rem' }}>Tolak Request</div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.6 }}>
              Masukkan alasan penolakan. Alasan ini akan terlihat oleh customer.
            </p>
            <textarea
              style={{ ...textareaStyle, marginBottom: 16 }}
              rows={4}
              placeholder="Alasan penolakan request..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              autoFocus
            />
            {error && <div style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: 12 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className={s.btnGhost} onClick={() => { setShowRejectModal(false); setRejectReason(''); setError('') }}>
                Batal
              </button>
              <button className={s.btnDanger} onClick={rejectRequest} disabled={saving || !rejectReason.trim()}>
                {saving ? 'Menyimpan...' : 'Tolak Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
