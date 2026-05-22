'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import s from '@/components/admin/admin.module.css'
import type { CustomOrderRequest, RequestStatus } from '@/lib/custom-orders'

const STATUS_LABELS: Record<RequestStatus, string> = {
  waiting_review: 'Menunggu Review',
  price_sent: 'Harga Dikirim',
  negotiating: 'Negosiasi',
  accepted: 'Diterima',
  payment_pending: 'Menunggu Bayar',
  paid: 'Dibayar',
  in_progress: 'Diproses',
  done: 'Selesai',
  rejected_by_admin: 'Ditolak Admin',
  rejected_by_customer: 'Ditolak Customer',
}

const STATUS_BADGE_CLS: Partial<Record<RequestStatus, string>> = {
  waiting_review: s.badgePending,
  price_sent: s.badgePaid,
  accepted: s.badgeProcessing,
  payment_pending: s.badgePending,
  paid: s.badgePaid,
  in_progress: s.badgeProcessing,
  done: s.badgeCompleted,
  rejected_by_admin: s.badgeCancelled,
  rejected_by_customer: s.badgeCancelled,
}

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`${s.badge} ${STATUS_BADGE_CLS[status] ?? s.badgePending}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export default function AdminCustomOrdersPage() {
  const [requests, setRequests] = useState<CustomOrderRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('')

  useEffect(() => {
    fetch('/api/admin/custom-orders')
      .then(r => r.json())
      .then(d => { setRequests(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = requests
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        r.request_id.toLowerCase().includes(q) ||
        r.customer.name.toLowerCase().includes(q) ||
        r.customer.email.toLowerCase().includes(q) ||
        r.service.name.toLowerCase().includes(q)
      )
    }
    if (statusFilter) list = list.filter(r => r.status === statusFilter)
    return list
  }, [requests, search, statusFilter])

  const waitingCount = requests.filter(r => r.status === 'waiting_review').length

  if (loading) return <div className={s.loading}><div className={s.spinner} /></div>

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Custom Orders</h1>
        <p className={s.pageSub}>
          {requests.length} total request
          {waitingCount > 0 && (
            <span style={{ marginLeft: 8, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '2px 10px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700 }}>
              {waitingCount} menunggu review
            </span>
          )}
        </p>
      </div>

      <div className={s.card}>
        <div className={s.filterBar}>
          <input
            className={s.searchInput}
            placeholder="Cari Request ID, nama, email, layanan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className={s.filterSelect}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as RequestStatus | '')}
          >
            <option value="">Semua Status</option>
            {(Object.keys(STATUS_LABELS) as RequestStatus[]).map(st => (
              <option key={st} value={st}>{STATUS_LABELS[st]}</option>
            ))}
          </select>
        </div>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Request ID</th>
              <th>Tanggal</th>
              <th>Customer</th>
              <th>Layanan</th>
              <th>Paket</th>
              <th>Harga Final</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.request_id}>
                  <td><span className={s.mono} style={{ color: '#a78bfa' }}>{r.request_id}</span></td>
                  <td className={s.dim} style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                    {new Date(r.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <div className={s.bold}>{r.customer.name}</div>
                    <div className={s.dim}>{r.customer.email}</div>
                    <div className={s.dim}>{r.customer.whatsapp}</div>
                  </td>
                  <td style={{ color: '#f1f5f9', fontSize: '0.82rem' }}>{r.service.name}</td>
                  <td className={s.dim}>{r.service.package}</td>
                  <td>
                    {r.pricing.final_price != null
                      ? <span className={s.textGreen} style={{ fontWeight: 600 }}>Rp{r.pricing.final_price.toLocaleString('id-ID')}</span>
                      : <span className={s.dim}>—</span>
                    }
                  </td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <Link href={`/admin/custom-orders/${r.request_id}`} className={s.btnGhost}>
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className={s.emptyState}>Tidak ada custom order ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
