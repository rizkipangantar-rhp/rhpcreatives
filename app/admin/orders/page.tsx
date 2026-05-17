'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './admin-orders.module.css'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'

type Order = {
  orderId: string
  userId: string
  name: string
  email: string
  wa: string
  serviceNameId: string
  packageNameId: string
  originalPrice: number
  discountAmount: number
  totalPrice: number
  voucherCode?: string
  notes?: string
  status: OrderStatus
  createdAt: string
}

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'processing', 'completed', 'cancelled']

function fmt(price: number) {
  return `Rp${price.toLocaleString('id-ID')}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function exportCsv(orders: Order[]) {
  const header = ['Order ID', 'Nama', 'Email', 'WA', 'Layanan', 'Paket', 'Total', 'Voucher', 'Status', 'Tanggal']
  const rows = orders.map(o => [
    o.orderId, o.name, o.email, o.wa,
    o.serviceNameId, o.packageNameId,
    o.totalPrice, o.voucherCode ?? '',
    o.status, o.createdAt,
  ])
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminOrdersPage() {
  const { tr } = useLanguage()
  const p = tr.adminOrders
  const sp = tr.orderSuccess

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => {
        if (r.status === 403) { setAccessDenied(true); return null }
        return r.json()
      })
      .then(data => { if (data) setOrders(data) })
      .catch(() => setAccessDenied(true))
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status } : o))
      }
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingBox}><div className={styles.spinner} /></div>
        </div>
      </main>
    )
  }

  if (accessDenied) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.deniedCard}>
            <span className={styles.deniedIcon}>🔒</span>
            <p className={styles.deniedText}>{p.accessDenied}</p>
          </div>
        </div>
      </main>
    )
  }

  const statusLabels: Record<string, string> = {
    pending: sp.statusPending,
    paid: sp.statusPaid,
    processing: sp.statusProcessing,
    completed: sp.statusCompleted,
    cancelled: sp.statusCancelled,
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const totalRevenue = orders
    .filter(o => ['paid', 'processing', 'completed'].includes(o.status))
    .reduce((sum, o) => sum + o.totalPrice, 0)

  const filters: Array<{ key: OrderStatus | 'all'; label: string; count: number }> = [
    { key: 'all', label: p.filterAll, count: orders.length },
    { key: 'pending', label: p.filterPending, count: orders.filter(o => o.status === 'pending').length },
    { key: 'paid', label: p.filterPaid, count: orders.filter(o => o.status === 'paid').length },
    { key: 'processing', label: p.filterProcessing, count: orders.filter(o => o.status === 'processing').length },
    { key: 'completed', label: p.filterCompleted, count: orders.filter(o => o.status === 'completed').length },
    { key: 'cancelled', label: p.filterCancelled, count: orders.filter(o => o.status === 'cancelled').length },
  ]

  return (
    <main className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{p.title}</h1>
            <p className={styles.sub}>{p.sub}</p>
          </div>
          <button className={styles.exportBtn} onClick={() => exportCsv(filtered)}>
            {p.exportCsv}
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{orders.length}</span>
            <span className={styles.statLabel}>{p.totalOrders}</span>
          </div>
          <div className={styles.stat}>
            <span className={`${styles.statNum} ${styles.statGrad}`}>{fmt(totalRevenue)}</span>
            <span className={styles.statLabel}>{p.totalRevenue}</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className={styles.filterRow}>
          {filters.map(f => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label} <span className={styles.filterCount}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>{p.noOrders}</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{p.colId}</th>
                  <th>{p.colCustomer}</th>
                  <th>{p.colService}</th>
                  <th>{p.colAmount}</th>
                  <th>{p.colStatus}</th>
                  <th>{p.colDate}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.orderId}>
                    <td>
                      <span className={styles.orderId}>{order.orderId}</span>
                      {order.voucherCode && <span className={styles.voucherBadge}>{order.voucherCode}</span>}
                    </td>
                    <td>
                      <div className={styles.customerName}>{order.name}</div>
                      <div className={styles.customerSub}>{order.email}</div>
                      <a href={`https://wa.me/${order.wa.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.waLink}>
                        {order.wa}
                      </a>
                    </td>
                    <td>
                      <div className={styles.serviceName}>{order.serviceNameId}</div>
                      <div className={styles.packageName}>{order.packageNameId}</div>
                      {order.notes && <div className={styles.notes} title={order.notes}>{order.notes.slice(0, 40)}{order.notes.length > 40 ? '…' : ''}</div>}
                    </td>
                    <td>
                      <div className={styles.amount}>{fmt(order.totalPrice)}</div>
                      {order.discountAmount > 0 && (
                        <div className={styles.discount}>-{fmt(order.discountAmount)}</div>
                      )}
                    </td>
                    <td>
                      <select
                        className={`${styles.statusSelect} ${styles[`status_${order.status}`]}`}
                        value={order.status}
                        disabled={updating === order.orderId}
                        onChange={e => updateStatus(order.orderId, e.target.value as OrderStatus)}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className={styles.date}>{fmtDate(order.createdAt)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
