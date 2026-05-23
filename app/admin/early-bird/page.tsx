'use client'
import { useEffect, useState } from 'react'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'

type ClaimEntry = {
  userId: string
  name: string
  email: string
  wa?: string
  service: string
  voucherCode: string
  claimedAt: string
  usedOrderId?: string
  usedAt?: string
}

type WaitlistEntry = {
  email: string
  wa: string
  addedAt: string
}

type EBData = {
  quota: { total: number; used: number; remaining: number }
  claims: ClaimEntry[]
  waitlist: WaitlistEntry[]
}

const EXPIRY_MS = 24 * 60 * 60 * 1000

function isExpired(c: ClaimEntry): boolean {
  if (c.usedAt) return false
  return Date.now() - new Date(c.claimedAt).getTime() > EXPIRY_MS
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function EarlyBirdPage() {
  const [data, setData] = useState<EBData | null>(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [tab, setTab] = useState<'claims' | 'waitlist'>('claims')

  function load() {
    setLoading(true)
    fetch('/api/admin/early-bird')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleReset() {
    const confirmed = confirm('Reset semua klaim early bird? Aksi ini tidak dapat dibatalkan.')
    if (!confirmed) return
    setResetting(true)
    await fetch('/api/admin/early-bird/reset', { method: 'POST' })
    setResetting(false)
    load()
  }

  if (loading || !data) return <AdminLoading />

  const { quota, claims, waitlist } = data
  const usedClaims = claims.filter(c => c.usedAt)
  const activeClaims = claims.filter(c => !c.usedAt && !isExpired(c))
  const expiredClaims = claims.filter(c => !c.usedAt && isExpired(c))
  const pct = quota.total > 0 ? Math.round((quota.used / quota.total) * 100) : 0

  return (
    <div>
      <div className={s.pageHeader} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className={s.pageTitle}>Early Bird</h1>
          <p className={s.pageSub}>Kelola kuota dan klaim voucher early bird</p>
        </div>
        <button className={s.btnDanger} onClick={handleReset} disabled={resetting}>
          {resetting ? 'Mereset...' : 'Reset Semua Klaim'}
        </button>
      </div>

      {/* Stats */}
      <div className={s.statGrid} style={{ marginBottom: 20 }}>
        {[
          { icon: '🎫', label: 'Total Kuota', value: quota.total, cls: '' },
          { icon: '✅', label: 'Slot Terpakai', value: quota.used, cls: s.statValueBlue },
          { icon: '📦', label: 'Slot Tersisa', value: quota.remaining, cls: quota.remaining <= 5 ? s.statValueYellow : s.statValueGreen },
          { icon: '⏳', label: 'Waitlist', value: waitlist.length, cls: '' },
        ].map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statIcon}>{st.icon}</div>
            <div className={`${s.statValue} ${st.cls}`}>{st.value}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className={s.card} style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem' }}>
          <span style={{ color: '#94a3b8' }}>Penggunaan Kuota</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{quota.used} / {quota.total} ({pct}%)</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: pct >= 90 ? '#ef4444' : pct >= 70 ? '#fbbf24' : '#10b981',
            width: `${pct}%`, transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: '0.78rem', color: '#64748b' }}>
          <span>Dipakai: <strong style={{ color: '#34d399' }}>{usedClaims.length}</strong></span>
          <span>Aktif (belum dipakai): <strong style={{ color: '#60a5fa' }}>{activeClaims.length}</strong></span>
          <span>Expired: <strong style={{ color: '#94a3b8' }}>{expiredClaims.length}</strong></span>
        </div>
      </div>

      {/* Tabs */}
      <div className={s.card}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {(['claims', 'waitlist'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 20px', background: 'none', border: 'none',
                borderBottom: tab === t ? '2px solid #3b82f6' : '2px solid transparent',
                color: tab === t ? '#f1f5f9' : '#64748b', cursor: 'pointer',
                fontSize: '0.84rem', fontWeight: tab === t ? 600 : 400, transition: 'color 0.15s',
              }}
            >
              {t === 'claims' ? `Klaim (${claims.length})` : `Waitlist (${waitlist.length})`}
            </button>
          ))}
        </div>

        <div className={s.tableWrap}>
          {tab === 'claims' ? (
            <table className={s.table}>
              <thead><tr>
                <th>Nama</th><th>Email</th><th>WA</th><th>Layanan</th>
                <th>Kode Voucher</th><th>Klaim Pada</th><th>Order ID</th><th>Status</th>
              </tr></thead>
              <tbody>
                {claims.map(c => (
                  <tr key={c.voucherCode}>
                    <td className={s.bold}>{c.name}</td>
                    <td className={s.dim}>{c.email}</td>
                    <td className={s.dim}>{c.wa ?? '—'}</td>
                    <td>{c.service}</td>
                    <td><span className={s.mono} style={{ color: '#fbbf24' }}>{c.voucherCode}</span></td>
                    <td className={s.dim} style={{ whiteSpace: 'nowrap' }}>{fmtDate(c.claimedAt)}</td>
                    <td className={s.dim}>{c.usedOrderId ? <span className={s.mono}>{c.usedOrderId}</span> : '—'}</td>
                    <td>
                      {c.usedAt
                        ? <span className={`${s.badge} ${s.badgeCompleted}`}>Dipakai</span>
                        : isExpired(c)
                          ? <span className={`${s.badge} ${s.badgeCancelled}`}>Expired</span>
                          : <span className={`${s.badge} ${s.badgePending}`}>Aktif</span>}
                    </td>
                  </tr>
                ))}
                {claims.length === 0 && (
                  <tr><td colSpan={8} className={s.emptyState}>Belum ada klaim</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className={s.table}>
              <thead><tr>
                <th>Email</th><th>WhatsApp</th><th>Daftar Pada</th>
              </tr></thead>
              <tbody>
                {waitlist.map((w, i) => (
                  <tr key={i}>
                    <td className={s.bold}>{w.email}</td>
                    <td className={s.dim}>{w.wa}</td>
                    <td className={s.dim}>{fmtDate(w.addedAt)}</td>
                  </tr>
                ))}
                {waitlist.length === 0 && (
                  <tr><td colSpan={3} className={s.emptyState}>Waitlist kosong</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
