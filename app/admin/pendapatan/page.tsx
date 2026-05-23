'use client'
import { useEffect, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'

type DayRevenue = { date: string; revenue: number }
type Order = {
  orderId: string
  serviceNameId: string
  originalPrice: number
  totalPrice: number
  discountAmount: number
  status: string
  createdAt: string
}

type StatsData = {
  totalRevenue: number
  monthRevenue: number
  totalOrders: number
  monthOrders: number
  revenueByDay: DayRevenue[]
  ordersByService: Record<string, number>
}

const SERVICE_LABELS: Record<string, string> = {
  undangan: 'Undangan', 'landing-page': 'Landing Page',
  'desain-ig': 'Desain IG', 'edit-foto': 'Edit Foto',
}
const SERVICE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7']

function fmt(n: number) { return `Rp${n.toLocaleString('id-ID')}` }
function fmtK(n: number) {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}jt` : n >= 1000 ? `${(n / 1000).toFixed(0)}rb` : String(n)
}

function exportCsv(orders: Order[]) {
  const header = ['Order ID', 'Layanan', 'Total', 'Diskon', 'Status', 'Tanggal']
  const rows = orders.map(o => [o.orderId, o.serviceNameId, o.totalPrice, o.discountAmount, o.status, new Date(o.createdAt).toLocaleString('id-ID')])
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pendapatan-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const tooltipStyle = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }
const labelStyle = { color: '#94a3b8' }
const tickStyle = { fontSize: 10, fill: '#475569' }

export default function PendapatanPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json()),
    ]).then(([s, o]) => {
      setStats(s)
      setOrders(Array.isArray(o) ? o : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading || !stats) return <AdminLoading />

  const revenueData = stats.revenueByDay.map(d => ({ ...d, label: d.date.slice(5) }))

  const serviceData = Object.entries(stats.ordersByService).map(([k, v], i) => ({
    name: SERVICE_LABELS[k] ?? k,
    orders: v,
    fill: SERVICE_COLORS[i % SERVICE_COLORS.length],
  }))

  const paidOrders = orders.filter(o => ['paid', 'processing', 'completed'].includes(o.status))
  const totalDiscount = paidOrders.reduce((sum, o) => sum + o.discountAmount, 0)
  const grossRevenue = paidOrders.reduce((sum, o) => sum + o.originalPrice, 0)

  return (
    <div>
      <div className={s.pageHeader} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className={s.pageTitle}>Laporan Pendapatan</h1>
          <p className={s.pageSub}>Analisis keuangan dan tren pendapatan</p>
        </div>
        <button className={s.btnExport} onClick={() => exportCsv(paidOrders)}>Export CSV</button>
      </div>

      {/* Stat cards */}
      <div className={s.statGrid} style={{ marginBottom: 20 }}>
        {[
          { icon: '💰', label: 'Total Pendapatan Bersih', value: fmt(stats.totalRevenue), cls: s.statValueGreen },
          { icon: '📈', label: 'Revenue Bulan Ini', value: fmt(stats.monthRevenue), cls: s.statValueBlue },
          { icon: '🏷️', label: 'Total Diskon Diberikan', value: fmt(totalDiscount), cls: s.statValueYellow },
          { icon: '📦', label: 'Order Terbayar', value: paidOrders.length, cls: '' },
        ].map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statIcon}>{st.icon}</div>
            <div className={`${s.statValue} ${st.cls}`}>{st.value}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Line chart: 30-day revenue */}
      <div className={s.chartCard} style={{ marginBottom: 20 }}>
        <div className={s.chartTitle}>Pendapatan 30 Hari Terakhir</div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={tickStyle} interval={4} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={tickStyle} axisLine={false} tickLine={false} width={45} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
                formatter={(v: unknown) => [fmt(v as number), 'Pendapatan']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar + breakdown */}
      <div className={s.twoCol}>
        {/* Bar: orders per service */}
        <div className={s.chartCard}>
          <div className={s.chartTitle}>Order per Layanan</div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} barSize={24}>
                <XAxis dataKey="name" tick={{ ...tickStyle, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={20} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Bar dataKey="orders" name="Order" radius={[4, 4, 0, 0]}>
                  {serviceData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className={s.card} style={{ padding: 20 }}>
          <div className={s.chartTitle}>Ringkasan Keuangan</div>
          {[
            { label: 'Gross Revenue (sebelum diskon)', value: fmt(grossRevenue), color: '#94a3b8' },
            { label: 'Total Diskon', value: `-${fmt(totalDiscount)}`, color: '#f87171' },
            { label: 'Net Revenue (setelah diskon)', value: fmt(stats.totalRevenue), color: '#34d399' },
            { label: 'Order Terbayar', value: String(paidOrders.length), color: '#60a5fa' },
            { label: 'Order Bulan Ini', value: String(stats.monthOrders), color: '#60a5fa' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.82rem' }}>
              <span style={{ color: '#64748b' }}>{row.label}</span>
              <span style={{ color: row.color, fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
