'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'
import ConfirmModal from '@/components/admin/ConfirmModal'
import type { Promo, PromoClaim } from '@/lib/promos'

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function promoStatus(p: Promo): { label: string; cls: string } {
  if (!p.is_active) return { label: 'Nonaktif', cls: s.badgeCancelled }
  if (p.end_date && new Date(p.end_date) < new Date()) return { label: 'Berakhir', cls: s.badgeCancelled }
  if (p.quota > 0 && p.claimed >= p.quota) return { label: 'Habis', cls: s.badgePending }
  return { label: 'Aktif', cls: s.badgeCompleted }
}

function exportCSV(promo: Promo, claims: PromoClaim[]) {
  const rows = [
    ['Nama', 'Email', 'WhatsApp', 'Layanan', 'Kode Voucher', 'Status', 'Diklaim', 'Dipakai', 'Order ID'],
    ...claims.map(c => [c.name, c.email, c.whatsapp, c.service_interest, c.voucher_code, c.status, fmtDate(c.claimed_at), fmtDate(c.used_at), c.order_id ?? ''])
  ]
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${promo.name.replace(/\s+/g, '_')}_claims.csv`; a.click()
  URL.revokeObjectURL(url)
}

export default function PromoDetailPage() {
  const { promo_id } = useParams<{ promo_id: string }>()
  const [promo, setPromo] = useState<Promo | null>(null)
  const [claims, setClaims] = useState<PromoClaim[]>([])
  const [loading, setLoading] = useState(true)

  const [editName, setEditName] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [editQuota, setEditQuota] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editSaved, setEditSaved] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  function load() {
    setLoading(true)
    fetch(`/api/admin/promos/${promo_id}`)
      .then(r => r.json())
      .then(d => {
        setPromo(d.promo)
        setClaims(d.claims ?? [])
        setEditName(d.promo.name)
        setEditEndDate(d.promo.end_date ? d.promo.end_date.slice(0, 10) : '')
        setEditQuota(String(d.promo.quota))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [promo_id])

  async function handleToggle() {
    if (!promo) return
    try {
      await fetch(`/api/admin/promos/${promo_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !promo.is_active }),
      })
      load()
    } catch {
      // silently ignore network errors; promo state unchanged
    }
  }

  async function handleResetClaims() {
    setResetting(true)
    try {
      await fetch(`/api/admin/promos/${promo_id}/reset-claims`, { method: 'POST' })
    } catch {
      // silently ignore network errors
    }
    setResetting(false)
    load()
  }

  async function handleSaveSettings() {
    setEditSaving(true)
    await fetch(`/api/admin/promos/${promo_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editName,
        end_date: editEndDate || null,
        quota: parseInt(editQuota) || 0,
      }),
    })
    setEditSaving(false)
    setEditSaved(true)
    setTimeout(() => setEditSaved(false), 2000)
    load()
  }

  if (loading || !promo) return <AdminLoading />

  const resetModal = showResetConfirm && (
    <ConfirmModal
      title="Reset Semua Klaim?"
      message={`Semua klaim promo "${promo.name}" akan direset. Slot kembali ke 0 dan semua voucher tidak berlaku.`}
      confirmLabel="Ya, Reset"
      onConfirm={() => { setShowResetConfirm(false); handleResetClaims() }}
      onCancel={() => setShowResetConfirm(false)}
    />
  )

  const st = promoStatus(promo)
  const pct = promo.quota > 0 ? Math.min(100, Math.round((promo.claimed / promo.quota) * 100)) : 0
  const remaining = promo.quota === 0 ? '∞' : String(Math.max(0, promo.quota - promo.claimed))
  const usedClaims = claims.filter(c => c.status === 'used')
  const activeClaims = claims.filter(c => c.status === 'active')
  const discountDisplay = promo.discount_type === 'percent' ? `${promo.discount_value}%` : `Rp${promo.discount_value.toLocaleString('id-ID')}`

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#f1f5f9', fontSize: '0.84rem', padding: '8px 12px',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div>
      {resetModal}
      <div className={s.pageHeader} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Link href="/admin/promo" style={{ fontSize: '0.82rem', color: '#60a5fa', textDecoration: 'none', display: 'inline-block', marginBottom: 8 }}>Semua Promo</Link>
          <h1 className={s.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {promo.name}
            <span className={`${s.badge} ${st.cls}`}>{st.label}</span>
          </h1>
          <p className={s.pageSub}>{promo.description}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={s.btnExport} onClick={handleToggle} style={{ color: promo.is_active ? '#fbbf24' : '#34d399' }}>
            {promo.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            disabled={resetting}
            style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', borderRadius: 8, padding: '8px 16px', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', opacity: resetting ? 0.6 : 1,
            }}
          >
            {resetting ? 'Mereset...' : 'Reset Klaim'}
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div className={s.statGrid} style={{ marginBottom: 20 }}>
        {[
          { icon: '🏷️', label: 'Nilai Diskon', value: discountDisplay, cls: s.statValueBlue },
          { icon: '🎫', label: 'Total Kuota', value: promo.quota === 0 ? '∞' : promo.quota, cls: '' },
          { icon: '✅', label: 'Total Klaim', value: promo.claimed, cls: s.statValueGreen },
          { icon: '💰', label: 'Dipakai', value: promo.used, cls: s.statValueYellow },
        ].map(st2 => (
          <div key={st2.label} className={s.statCard}>
            <div className={s.statIcon}>{st2.icon}</div>
            <div className={`${s.statValue} ${st2.cls}`}>{st2.value}</div>
            <div className={s.statLabel}>{st2.label}</div>
          </div>
        ))}
      </div>

      {/* Simple settings */}
      <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
        <div className={s.cardTitle} style={{ marginBottom: 16 }}>Pengaturan</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>Nama Promo</label>
            <input style={inputStyle} value={editName} onChange={e => setEditName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>Tanggal Berakhir</label>
            <input style={inputStyle} type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>Kuota (0 = tidak terbatas)</label>
            <input style={inputStyle} type="number" min={0} value={editQuota} onChange={e => setEditQuota(e.target.value)} />
          </div>
        </div>
        <button className={s.btnPrimary} onClick={handleSaveSettings} disabled={editSaving} style={{ padding: '8px 24px' }}>
          {editSaving ? 'Menyimpan...' : editSaved ? 'Tersimpan ✓' : 'Simpan'}
        </button>
      </div>

      {/* Progress bar */}
      {promo.quota > 0 && (
        <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8' }}>Penggunaan Kuota</span>
            <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{promo.claimed} / {promo.quota} ({pct}%)</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, background: pct >= 90 ? '#ef4444' : pct >= 70 ? '#fbbf24' : '#10b981', width: `${pct}%`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: '0.78rem', color: '#64748b' }}>
            <span>Dipakai: <strong style={{ color: '#34d399' }}>{usedClaims.length}</strong></span>
            <span>Aktif (belum dipakai): <strong style={{ color: '#60a5fa' }}>{activeClaims.length}</strong></span>
            <span>Tersisa: <strong style={{ color: '#94a3b8' }}>{remaining}</strong></span>
          </div>
        </div>
      )}

      {/* Claims table */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Klaim ({claims.length})</span>
          <button className={s.btnExport} onClick={() => exportCSV(promo, claims)}>Export CSV</button>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Nama</th><th>Email</th><th>WA</th><th>Layanan</th>
              <th>Kode Voucher</th><th>Diklaim</th><th>Order ID</th><th>Status</th>
            </tr></thead>
            <tbody>
              {claims.map(c => (
                <tr key={c.claim_id}>
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.name}</td>
                  <td style={{ color: '#94a3b8' }}>{c.email}</td>
                  <td style={{ color: '#94a3b8' }}>{c.whatsapp || '—'}</td>
                  <td>{c.service_interest || '—'}</td>
                  <td><span style={{ fontFamily: 'monospace', color: '#fbbf24' }}>{c.voucher_code}</span></td>
                  <td style={{ color: '#64748b', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{fmtDate(c.claimed_at)}</td>
                  <td style={{ color: '#64748b' }}>{c.order_id ? <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{c.order_id}</span> : '—'}</td>
                  <td>
                    {c.status === 'used'
                      ? <span className={`${s.badge} ${s.badgeCompleted}`}>Dipakai</span>
                      : <span className={`${s.badge} ${s.badgePending}`}>Aktif</span>}
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr><td colSpan={8} className={s.emptyState}>Belum ada klaim</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Waitlist */}
      {promo.waitlist && promo.waitlist.length > 0 && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>Waitlist ({promo.waitlist.length})</span>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead><tr><th>Email</th><th>WhatsApp</th><th>Daftar Pada</th></tr></thead>
              <tbody>
                {promo.waitlist.map((w, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{w.email}</td>
                    <td style={{ color: '#94a3b8' }}>{w.whatsapp}</td>
                    <td style={{ color: '#64748b', fontSize: '0.78rem' }}>{fmtDate(w.added_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
