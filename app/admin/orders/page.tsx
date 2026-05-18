'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import s from '@/components/admin/admin.module.css'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'

type Order = {
  orderId: string
  name: string
  email: string
  wa: string
  serviceNameId: string
  packageNameId: string
  notes?: string
  voucherCode?: string
  discountType?: string
  originalPrice: number
  discountAmount: number
  totalPrice: number
  status: OrderStatus
  createdAt: string
}

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'processing', 'completed', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu', paid: 'Dibayar', processing: 'Diproses',
  completed: 'Selesai', cancelled: 'Batal',
}
const SERVICE_OPTIONS = [
  { value: '', label: 'Semua Layanan' },
  { value: 'Undangan', label: 'Undangan' },
  { value: 'Landing Page', label: 'Landing Page' },
  { value: 'Desain IG', label: 'Desain IG' },
  { value: 'Edit Foto', label: 'Edit Foto' },
]

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

function exportCsv(orders: Order[]) {
  const header = ['Order ID', 'Tanggal', 'Nama', 'Email', 'WA', 'Layanan', 'Paket', 'Keterangan', 'Voucher', 'Harga Asli', 'Diskon', 'Total Bayar', 'Status']
  const rows = orders.map(o => [
    o.orderId,
    new Date(o.createdAt).toLocaleString('id-ID'),
    o.name, o.email, o.wa,
    o.serviceNameId, o.packageNameId,
    o.notes ?? '',
    o.voucherCode ?? '',
    o.originalPrice, o.discountAmount, o.totalPrice,
    o.status,
  ])
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = orders
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.wa.includes(q)
      )
    }
    if (statusFilter) list = list.filter(o => o.status === statusFilter)
    if (serviceFilter) list = list.filter(o => o.serviceNameId.includes(serviceFilter))
    return [...list].sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sort === 'highest') return b.totalPrice - a.totalPrice
      return a.totalPrice - b.totalPrice
    })
  }, [orders, search, statusFilter, serviceFilter, sort])

  const paidRevenue = orders.filter(o => ['paid', 'processing', 'completed'].includes(o.status)).reduce((s, o) => s + o.totalPrice, 0)

  if (loading) return <div className={s.loading}><div className={s.spinner} /></div>

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Manajemen Order</h1>
        <p className={s.pageSub}>{orders.length} total order · Pendapatan: <strong style={{ color: '#34d399' }}>{fmt(paidRevenue)}</strong></p>
      </div>

      <div className={s.card}>
        {/* Filter bar */}
        <div className={s.filterBar}>
          <input
            className={s.searchInput}
            placeholder="Cari Order ID, nama, email, WA..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className={s.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value as OrderStatus | '')}>
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map(st => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}
          </select>
          <select className={s.filterSelect} value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
            {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select className={s.filterSelect} value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="highest">Harga Tertinggi</option>
            <option value="lowest">Harga Terendah</option>
          </select>
          <button className={s.btnExport} onClick={() => exportCsv(filtered)}>Export CSV</button>
        </div>

        {/* Table */}
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Order ID</th>
              <th>Tanggal</th>
              <th>Customer</th>
              <th>Layanan & Paket</th>
              <th>Voucher</th>
              <th>Harga Asli</th>
              <th>Diskon</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.orderId}>
                  <td><span className={s.mono}>{o.orderId}</span></td>
                  <td className={s.dim} style={{ whiteSpace: 'nowrap' }}>{fmtDate(o.createdAt)}</td>
                  <td>
                    <div className={s.bold}>{o.name}</div>
                    <div className={s.dim}>{o.email}</div>
                    <div className={s.dim}>{o.wa}</div>
                  </td>
                  <td>
                    <div style={{ color: '#f1f5f9', fontSize: '0.82rem' }}>{o.serviceNameId}</div>
                    <div className={s.dim}>{o.packageNameId}</div>
                    {o.notes && <div className={s.dim} title={o.notes} style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.notes}</div>}
                  </td>
                  <td>{o.voucherCode ? <span className={s.mono} style={{ color: '#fbbf24' }}>{o.voucherCode}</span> : <span className={s.dim}>—</span>}</td>
                  <td className={s.dim}>{fmt(o.originalPrice)}</td>
                  <td className={s.textRed}>{o.discountAmount > 0 ? `-${fmt(o.discountAmount)}` : '—'}</td>
                  <td className={s.textGreen} style={{ fontWeight: 600 }}>{fmt(o.totalPrice)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <Link href={`/admin/orders/${o.orderId}`} className={s.btnGhost}>Detail →</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className={s.emptyState}>Tidak ada order ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
