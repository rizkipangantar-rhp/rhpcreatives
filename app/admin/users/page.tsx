'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import s from '@/components/admin/admin.module.css'

type User = {
  id: string
  name: string
  email: string
  provider: 'google' | 'credentials'
  referralCode: string
  referredBy?: string
  totalOrders: number
  totalSpent: number
  rewardsAvailable: number
  createdAt: string
  lastLogin: string
  isAdmin: boolean
  suspended: boolean
}

function fmt(n: number) { return `Rp${n.toLocaleString('id-ID')}` }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [providerFilter, setProviderFilter] = useState<'all' | 'google' | 'credentials'>('all')
  const [suspendedFilter, setSuspendedFilter] = useState<'all' | 'active' | 'suspended'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = users
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.referralCode.toLowerCase().includes(q)
      )
    }
    if (providerFilter !== 'all') list = list.filter(u => u.provider === providerFilter)
    if (suspendedFilter === 'active') list = list.filter(u => !u.suspended)
    if (suspendedFilter === 'suspended') list = list.filter(u => u.suspended)
    return list
  }, [users, search, providerFilter, suspendedFilter])

  async function handleDelete(u: User) {
    if (!confirm(`Hapus akun "${u.name}" (${u.email})?\n\nAksi ini permanen dan tidak bisa dibatalkan.`)) return
    setDeleting(u.id)
    const res = await fetch(`/api/admin/users/${encodeURIComponent(u.id)}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers(prev => prev.filter(x => x.id !== u.id))
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Gagal menghapus user.')
    }
    setDeleting(null)
  }

  if (loading) return <div className={s.loading}><div className={s.spinner} /></div>

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Manajemen User</h1>
        <p className={s.pageSub}>{users.length} user terdaftar</p>
      </div>

      <div className={s.card}>
        <div className={s.filterBar}>
          <input
            className={s.searchInput}
            placeholder="Cari nama, email, kode referral..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className={s.filterSelect} value={providerFilter} onChange={e => setProviderFilter(e.target.value as typeof providerFilter)}>
            <option value="all">Semua Provider</option>
            <option value="google">Google</option>
            <option value="credentials">Email/Password</option>
          </select>
          <select className={s.filterSelect} value={suspendedFilter} onChange={e => setSuspendedFilter(e.target.value as typeof suspendedFilter)}>
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Kode Referral</th>
              <th>Total Order</th>
              <th>Total Belanja</th>
              <th>Daftar</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className={s.bold}>{u.name}</div>
                    {u.isAdmin && <span className={`${s.badge} ${s.badgePaid}`} style={{ fontSize: '0.65rem', marginTop: 4 }}>Admin</span>}
                  </td>
                  <td className={s.dim}>{u.email}</td>
                  <td>
                    <span className={`${s.badge} ${u.provider === 'google' ? s.badgeGoogle : s.badgeCred}`}>
                      {u.provider === 'google' ? 'Google' : 'Email'}
                    </span>
                  </td>
                  <td><span className={s.mono}>{u.referralCode}</span></td>
                  <td style={{ textAlign: 'center' }}>{u.totalOrders}</td>
                  <td className={s.textGreen}>{fmt(u.totalSpent)}</td>
                  <td className={s.dim} style={{ whiteSpace: 'nowrap' }}>{fmtDate(u.createdAt)}</td>
                  <td>
                    {u.suspended
                      ? <span className={`${s.badge} ${s.badgeCancelled}`}>Suspended</span>
                      : <span className={`${s.badge} ${s.badgeActive}`}>Aktif</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <Link href={`/admin/users/${u.id}`} className={s.btnGhost}>Detail</Link>
                      {!u.isAdmin && (
                        <button
                          className={s.btnDanger}
                          style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleDelete(u)}
                          disabled={deleting === u.id}
                        >
                          {deleting === u.id ? '...' : 'Hapus'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className={s.emptyState}>Tidak ada user ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
