'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import s from '@/components/admin/admin.module.css'
import type { Promo } from '@/lib/promos'

type Stats = { totalActive: number; totalEnded: number; totalClaims: number; totalDiscount: number }

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function promoStatus(p: Promo): { label: string; cls: string } {
  if (!p.is_active) return { label: 'Nonaktif', cls: s.badgeCancelled }
  if (p.end_date && new Date(p.end_date) < new Date()) return { label: 'Berakhir', cls: s.badgeCancelled }
  if (p.quota > 0 && p.claimed >= p.quota) return { label: 'Habis', cls: s.badgePending }
  return { label: 'Aktif', cls: s.badgeCompleted }
}

export default function AdminPromoPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [stats, setStats] = useState<Stats>({ totalActive: 0, totalEnded: 0, totalClaims: 0, totalDiscount: 0 })
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetch('/api/admin/promos')
      .then(r => r.json())
      .then(d => { setPromos(d.promos ?? []); setStats(d.stats ?? {}); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleToggle(id: string, current: boolean) {
    await fetch(`/api/admin/promos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    })
    load()
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus promo "${name}"? Aksi ini tidak dapat dibatalkan.`)) return
    setDeleting(id)
    await fetch(`/api/admin/promos/${id}`, { method: 'DELETE' })
    setDeleting(null)
    load()
  }

  if (loading) return <div className={s.loading}><div className={s.spinner} /></div>

  return (
    <div>
      <div className={s.pageHeader} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className={s.pageTitle}>Promo</h1>
          <p className={s.pageSub}>Kelola semua promo dan diskon yang tersedia</p>
        </div>
        <Link href="/admin/promo/buat" className={s.btnPrimary} style={{ textDecoration: 'none', display: 'inline-block' }}>
          + Buat Promo Baru
        </Link>
      </div>

      {/* Stats */}
      <div className={s.statGrid} style={{ marginBottom: 20 }}>
        {[
          { icon: '✅', label: 'Promo Aktif', value: stats.totalActive, cls: s.statValueGreen },
          { icon: '📴', label: 'Promo Berakhir', value: stats.totalEnded, cls: s.statValueYellow },
          { icon: '🎫', label: 'Total Klaim', value: stats.totalClaims, cls: s.statValueBlue },
          { icon: '💸', label: 'Klaim Dipakai', value: stats.totalDiscount, cls: '' },
        ].map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statIcon}>{st.icon}</div>
            <div className={`${s.statValue} ${st.cls}`}>{st.value}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Promo list */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Semua Promo ({promos.length})</span>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table} style={{ minWidth: 900 }}>
            <thead><tr>
              <th>Nama</th>
              <th>Tipe</th>
              <th>Nilai</th>
              <th>Kuota</th>
              <th>Klaim</th>
              <th>Tersisa</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr></thead>
            <tbody>
              {promos.map(p => {
                const st = promoStatus(p)
                const remaining = p.quota === 0 ? '∞' : String(Math.max(0, p.quota - p.claimed))
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 2 }}>
                        prefix: <span style={{ color: '#fbbf24' }}>{p.prefix}</span>
                        {p.show_on_website && <span style={{ marginLeft: 8, color: '#10b981' }}>• Tampil</span>}
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{p.discount_type === 'percent' ? 'Persentase' : 'Nominal'}</td>
                    <td style={{ fontWeight: 600, color: '#a78bfa' }}>
                      {p.discount_type === 'percent' ? `${p.discount_value}%` : `Rp${p.discount_value.toLocaleString('id-ID')}`}
                    </td>
                    <td style={{ color: '#94a3b8' }}>{p.quota === 0 ? '∞' : p.quota}</td>
                    <td style={{ color: '#60a5fa' }}>{p.claimed}</td>
                    <td style={{ color: p.quota > 0 && p.claimed >= p.quota ? '#f87171' : '#34d399' }}>{remaining}</td>
                    <td style={{ color: '#64748b', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {p.start_date ? fmtDate(p.start_date) : '—'}<br />
                      {p.end_date ? `s/d ${fmtDate(p.end_date)}` : '∞'}
                    </td>
                    <td><span className={`${s.badge} ${st.cls}`}>{st.label}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Link href={`/admin/promo/${p.id}`} className={s.btnExport} style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
                          Detail
                        </Link>
                        <Link href={`/admin/promo/${p.id}/edit`} className={s.btnExport} style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
                          Edit
                        </Link>
                        <button
                          className={s.btnExport}
                          style={{ fontSize: '0.75rem', padding: '5px 10px', color: p.is_active ? '#fbbf24' : '#34d399' }}
                          onClick={() => handleToggle(p.id, p.is_active)}
                        >
                          {p.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          className={s.btnDanger ?? s.btnExport}
                          style={{ fontSize: '0.75rem', padding: '5px 10px', color: '#f87171', opacity: deleting === p.id ? 0.5 : 1 }}
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleting === p.id}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {promos.length === 0 && (
                <tr><td colSpan={9} className={s.emptyState}>Belum ada promo. <Link href="/admin/promo/buat" style={{ color: '#60a5fa' }}>Buat sekarang →</Link></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
