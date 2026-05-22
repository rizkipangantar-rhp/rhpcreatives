'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import s from '@/components/admin/admin.module.css'

function fmt(n: number) { return `Rp${n.toLocaleString('id-ID')}` }
function fmtK(n: number) { return n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}jt` : n >= 1000 ? `${(n/1000).toFixed(0)}rb` : String(n) }

const STATUS_COLORS: Record<string, string> = {
  pending: '#fbbf24', paid: '#3b82f6', processing: '#a855f7',
  completed: '#10b981', cancelled: '#ef4444',
}
const SERVICE_LABELS: Record<string, string> = {
  undangan: 'Undangan', 'landing-page': 'Landing Page',
  'desain-ig': 'Desain IG', 'edit-foto': 'Edit Foto',
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu', paid: 'Dibayar', processing: 'Diproses',
  completed: 'Selesai', cancelled: 'Batal',
}

type AnalyticsSummary = {
  totalViews: number
  todayViews: number
  last7Days: { date: string; views: number }[]
  topPaths: { path: string; views: number }[]
}

type StatsData = {
  totalOrders: number; totalRevenue: number; monthOrders: number; monthRevenue: number
  totalUsers: number; monthUsers: number; ebSlotsLeft: number; ebTotal: number
  activeReferralCodes: number
  revenueByDay: { date: string; revenue: number }[]
  ordersByService: Record<string, number>
  ordersByStatus: Record<string, number>
  recentOrders: { orderId: string; serviceNameId: string; packageNameId: string; name: string; totalPrice: number; status: string; createdAt: string }[]
  recentUsers: { id: string; name: string; email: string; provider: string; referralCode?: string; createdAt: string }[]
  analytics?: AnalyticsSummary
}

function StatusBadge({ status }: { status: string }) {
  const cls = { pending: s.badgePending, paid: s.badgePaid, processing: s.badgeProcessing, completed: s.badgeCompleted, cancelled: s.badgeCancelled }
  return <span className={`${s.badge} ${(cls as Record<string,string>)[status] ?? s.badgePending}`}>{STATUS_LABELS[status] ?? status}</span>
}

export default function AdminOverview() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className={s.loading}><div className={s.spinner} /></div>
  if (!data) return <div className={s.emptyState}>Gagal memuat data.</div>

  const serviceData = Object.entries(data.ordersByService).map(([k, v]) => ({ name: SERVICE_LABELS[k] ?? k, value: v }))
  const statusData = Object.entries(data.ordersByStatus).map(([k, v]) => ({ name: STATUS_LABELS[k] ?? k, value: v, color: STATUS_COLORS[k] ?? '#94a3b8' }))
  const revenueData = data.revenueByDay.map(d => ({ ...d, label: d.date.slice(5) }))

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Dashboard Overview</h1>
        <p className={s.pageSub}>Ringkasan bisnis RHP Creatives hari ini</p>
      </div>

      {/* Row 1: order + revenue stats */}
      <div className={s.statGrid}>
        {[
          { icon: '📦', label: 'Total Order', value: data.totalOrders, cls: '' },
          { icon: '💰', label: 'Total Pendapatan', value: fmt(data.totalRevenue), cls: s.statValueGreen },
          { icon: '📅', label: 'Order Bulan Ini', value: data.monthOrders, cls: s.statValueBlue },
          { icon: '📈', label: 'Revenue Bulan Ini', value: fmt(data.monthRevenue), cls: s.statValueYellow },
        ].map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statIcon}>{st.icon}</div>
            <div className={`${s.statValue} ${st.cls}`}>{st.value}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Row 2: user + system stats */}
      <div className={s.statGrid}>
        {[
          { icon: '👥', label: 'Total User', value: data.totalUsers, cls: '' },
          { icon: '🆕', label: 'User Baru Bulan Ini', value: data.monthUsers, cls: s.statValueBlue },
          { icon: '🎫', label: 'Slot Early Bird Tersisa', value: `${data.ebSlotsLeft} / ${data.ebTotal}`, cls: data.ebSlotsLeft <= 5 ? s.statValueYellow : s.statValueGreen },
          { icon: '🔗', label: 'Kode Referral Aktif', value: data.activeReferralCodes, cls: '' },
        ].map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statIcon}>{st.icon}</div>
            <div className={`${s.statValue} ${st.cls}`}>{st.value}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className={s.chartGrid}>
        {/* Line chart: revenue 30 days */}
        <div className={s.chartCard}>
          <div className={s.chartTitle}>Pendapatan 30 Hari Terakhir</div>
          <div className={s.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#475569' }} interval={4} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(v: unknown) => [fmt(v as number), 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart: orders by service */}
        <div className={s.chartCard}>
          <div className={s.chartTitle}>Order per Layanan</div>
          <div className={s.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} barSize={20}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="value" name="Order" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie: status distribution */}
        <div className={s.chartCard}>
          <div className={s.chartTitle}>Status Order</div>
          <div className={s.chartArea} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ResponsiveContainer width={100} height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={48}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {statusData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span>{d.name}</span>
                  <span style={{ marginLeft: 'auto', color: '#f1f5f9', fontWeight: 600 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Order Terbaru</span>
          <Link href="/admin/orders" className={s.cardLink}>Lihat Semua</Link>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Order ID</th><th>Layanan</th><th>Customer</th>
              <th>Total</th><th>Status</th><th>Waktu</th>
            </tr></thead>
            <tbody>
              {data.recentOrders.map(o => (
                <tr key={o.orderId}>
                  <td><Link href={`/admin/orders/${o.orderId}`} className={`${s.mono} ${s.textBlue}`}>{o.orderId}</Link></td>
                  <td><span className={s.dim}>{o.serviceNameId}</span></td>
                  <td className={s.bold}>{o.name}</td>
                  <td className={s.textGreen}>{fmt(o.totalPrice)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className={s.dim}>{new Date(o.createdAt).toLocaleDateString('id-ID', { day:'2-digit', month:'short' })}</td>
                </tr>
              ))}
              {data.recentOrders.length === 0 && <tr><td colSpan={6} className={s.emptyState}>Belum ada order</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Users */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>User Terbaru</span>
          <Link href="/admin/users" className={s.cardLink}>Lihat Semua</Link>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Nama</th><th>Email</th><th>Provider</th>
              <th>Kode Referral</th><th>Daftar</th>
            </tr></thead>
            <tbody>
              {data.recentUsers.map(u => (
                <tr key={u.id}>
                  <td className={s.bold}>{u.name}</td>
                  <td className={s.dim}>{u.email}</td>
                  <td><span className={`${s.badge} ${u.provider === 'google' ? s.badgeGoogle : s.badgeCred}`}>{u.provider}</span></td>
                  <td><span className={s.mono}>{u.referralCode ?? '—'}</span></td>
                  <td className={s.dim}>{new Date(u.createdAt).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })}</td>
                </tr>
              ))}
              {data.recentUsers.length === 0 && <tr><td colSpan={5} className={s.emptyState}>Belum ada user</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics */}
      {data.analytics && (
        <div className={s.card} style={{ padding: 24 }}>
          <div className={s.cardHeader} style={{ marginBottom: 20 }}>
            <span className={s.cardTitle}>Analitik Pageview</span>
          </div>
          <div className={s.statGrid} style={{ marginBottom: 20 }}>
            {[
              { icon: '👁️', label: 'Total Pageview', value: data.analytics.totalViews },
              { icon: '📅', label: 'Hari Ini', value: data.analytics.todayViews },
            ].map(st => (
              <div key={st.label} className={s.statCard}>
                <div className={s.statIcon}>{st.icon}</div>
                <div className={s.statValue}>{st.value}</div>
                <div className={s.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
          <div className={s.chartArea} style={{ height: 120, marginBottom: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.analytics.last7Days.map(d => ({ ...d, label: d.date.slice(5) }))} barSize={20}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="views" name="Views" fill="#a855f7" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={s.cardTitle} style={{ fontSize: '0.78rem', marginBottom: 8, color: '#64748b' }}>Top Halaman (All-Time)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {data.analytics.topPaths.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{p.path}</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{p.views}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
