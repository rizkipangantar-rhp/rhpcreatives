'use client'
import { useEffect, useState } from 'react'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'
import type { Review } from '@/lib/reviews'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/review')
      .then(r => r.json())
      .then(data => setReviews(data.reviews ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(confirmId)
    setConfirmId(null)
    await fetch('/api/review', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: confirmId }) })
    setReviews(prev => prev.filter(r => r.id !== confirmId))
    setDeleting(null)
  }

  if (loading) return <AdminLoading />

  return (
    <div className={s.page}>
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1a1f2e', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: '2rem 1.75rem', maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗑️</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', color: '#f1f5f9' }}>Hapus ulasan ini?</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>Ulasan akan dihapus permanen dan tidak bisa dikembalikan.</div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                Batal
              </button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.85)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Ulasan Customer</h1>
        <span className={s.badge}>{reviews.length} ulasan</span>
      </div>

      {reviews.length === 0 ? (
        <div className={s.emptyState}>Belum ada ulasan masuk.</div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Layanan</th>
                <th>Rating</th>
                <th>Ulasan</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    {r.role && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.role}</div>}
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{r.service}</td>
                  <td>
                    <span style={{ color: '#fbbf24', letterSpacing: 1 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </td>
                  <td style={{ maxWidth: 320 }}>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{r.text}</p>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap' }}>{fmtDate(r.created_at)}</td>
                  <td>
                    <button
                      onClick={() => setConfirmId(r.id)}
                      disabled={deleting === r.id}
                      className={s.btnDanger}
                      style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
                    >
                      {deleting === r.id ? '...' : 'Hapus'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
