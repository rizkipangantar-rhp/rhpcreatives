'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'

type UserDetail = {
  id: string
  name: string
  email: string
  provider: 'google' | 'credentials'
  referralCode: string
  referredBy?: string
  totalOrders: number
  totalSpent: number
  rewardsAvailable: number
  rewardsUsed: number
  createdAt: string
  lastLogin: string
  isAdmin: boolean
  suspended: boolean
  orders?: OrderSummary[]
}

type OrderSummary = {
  orderId: string
  serviceNameId: string
  packageNameId: string
  totalPrice: number
  status: string
  createdAt: string
}

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

export default function UserDetailPage() {
  const { user_id } = useParams<{ user_id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [suspending, setSuspending] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/users/${encodeURIComponent(user_id)}`)
      .then(r => r.json())
      .then(d => { setUser(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user_id])

  async function toggleSuspend() {
    if (!user) return
    const confirmed = confirm(user.suspended
      ? `Aktifkan kembali akun ${user.name}?`
      : `Suspend akun ${user.name}? User tidak bisa login sampai diaktifkan kembali.`)
    if (!confirmed) return
    setSuspending(true)
    const res = await fetch(`/api/admin/users/${encodeURIComponent(user_id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspended: !user.suspended }),
    })
    if (res.ok) setUser(prev => prev ? { ...prev, suspended: !prev.suspended } : prev)
    setSuspending(false)
  }

  if (loading) return <AdminLoading />
  if (!user) return <div className={s.emptyState}>User tidak ditemukan.</div>

  return (
    <div>
      <div className={s.pageHeader} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <button onClick={() => router.back()} className={s.btnGhost} style={{ marginBottom: 8 }}>Kembali</button>
          <h1 className={s.pageTitle}>{user.name}</h1>
          <p className={s.pageSub}>
            {user.email} ·&nbsp;
            <span className={`${s.badge} ${user.provider === 'google' ? s.badgeGoogle : s.badgeCred}`}>
              {user.provider === 'google' ? 'Google' : 'Email'}
            </span>
            {user.suspended && <>&nbsp;<span className={`${s.badge} ${s.badgeCancelled}`}>Suspended</span></>}
            {user.isAdmin && <>&nbsp;<span className={`${s.badge} ${s.badgePaid}`}>Admin</span></>}
          </p>
        </div>
        {!user.isAdmin && (
          <button
            className={user.suspended ? s.btnPrimary : s.btnDanger}
            onClick={toggleSuspend}
            disabled={suspending}
          >
            {suspending ? '...' : user.suspended ? 'Aktifkan Akun' : 'Suspend Akun'}
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className={s.statGrid} style={{ marginBottom: 20 }}>
        {[
          { icon: '📦', label: 'Total Order', value: user.totalOrders, cls: '' },
          { icon: '💰', label: 'Total Belanja', value: fmt(user.totalSpent), cls: s.statValueGreen },
          { icon: '🎁', label: 'Rewards Tersedia', value: user.rewardsAvailable, cls: user.rewardsAvailable > 0 ? s.statValueYellow : '' },
          { icon: '✅', label: 'Rewards Dipakai', value: user.rewardsUsed, cls: '' },
        ].map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statIcon}>{st.icon}</div>
            <div className={`${s.statValue} ${st.cls}`}>{st.value}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.twoCol}>
        {/* Account info */}
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Informasi Akun</div>
          <InfoRow label="ID" value={user.id} mono />
          <InfoRow label="Kode Referral" value={user.referralCode} mono />
          {user.referredBy && <InfoRow label="Direferensikan oleh" value={user.referredBy} mono />}
          <InfoRow label="Daftar" value={fmtDate(user.createdAt)} />
          <InfoRow label="Login Terakhir" value={fmtDate(user.lastLogin)} />
        </div>

        {/* Placeholder for future referral usage by this user */}
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 16 }}>Referral</div>
          <InfoRow label="Kode Referral" value={user.referralCode} mono />
          <InfoRow label="Rewards Tersedia" value={String(user.rewardsAvailable)} />
          <InfoRow label="Rewards Dipakai" value={String(user.rewardsUsed)} />
          {user.referredBy
            ? <InfoRow label="Gunakan kode" value={user.referredBy} mono />
            : <div className={s.dim} style={{ marginTop: 8, fontSize: '0.82rem' }}>User tidak menggunakan kode referral</div>}
        </div>
      </div>

      {/* Orders */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Riwayat Order</span>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Order ID</th><th>Layanan</th><th>Paket</th><th>Total</th><th>Status</th><th>Tanggal</th>
            </tr></thead>
            <tbody>
              {(user.orders ?? []).map(o => (
                <tr key={o.orderId}>
                  <td><span className={`${s.mono} ${s.textBlue}`}>{o.orderId}</span></td>
                  <td>{o.serviceNameId}</td>
                  <td className={s.dim}>{o.packageNameId}</td>
                  <td className={s.textGreen}>{fmt(o.totalPrice)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className={s.dim}>{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
              {(user.orders ?? []).length === 0 && (
                <tr><td colSpan={6} className={s.emptyState}>Belum ada order</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.82rem', gap: 8 }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ color: mono ? '#94a3b8' : '#cbd5e1', fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}
