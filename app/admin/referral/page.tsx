'use client'
import { useEffect, useState } from 'react'
import s from '@/components/admin/admin.module.css'

type Usage = {
  userId: string
  referralCode: string
  referrerId: string
  orderId: string
  usedAt: string
  inviteeName: string
  inviteeEmail: string
  referrerName: string
  referrerEmail: string
  orderTotal: number
  discountGiven: number
}

type TopReferrer = {
  id: string
  name: string
  email: string
  count: number
  rewardsEarned: number
}

type ReferralData = {
  totalUsages: number
  totalDiscountGiven: number
  usages: Usage[]
  topReferrers: TopReferrer[]
}

function fmt(n: number) { return `Rp${n.toLocaleString('id-ID')}` }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ReferralPage() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'usages' | 'top'>('top')

  useEffect(() => {
    fetch('/api/admin/referral')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !data) return <div className={s.loading}><div className={s.spinner} /></div>

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Program Referral</h1>
        <p className={s.pageSub}>Statistik penggunaan kode referral dan top referrer</p>
      </div>

      {/* Stats */}
      <div className={s.statGrid} style={{ marginBottom: 20 }}>
        {[
          { icon: '🔗', label: 'Total Penggunaan', value: data.totalUsages, cls: '' },
          { icon: '💸', label: 'Total Diskon Diberikan', value: fmt(data.totalDiscountGiven), cls: s.statValueYellow },
          { icon: '🏆', label: 'Referrer Aktif', value: data.topReferrers.length, cls: s.statValueBlue },
          { icon: '🎁', label: 'Avg Diskon/Penggunaan', value: data.totalUsages > 0 ? fmt(Math.round(data.totalDiscountGiven / data.totalUsages)) : 'Rp0', cls: '' },
        ].map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statIcon}>{st.icon}</div>
            <div className={`${s.statValue} ${st.cls}`}>{st.value}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.card}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {([
            { key: 'top', label: `Top Referrer (${data.topReferrers.length})` },
            { key: 'usages', label: `Riwayat Penggunaan (${data.totalUsages})` },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '12px 20px', background: 'none', border: 'none',
                borderBottom: tab === t.key ? '2px solid #3b82f6' : '2px solid transparent',
                color: tab === t.key ? '#f1f5f9' : '#64748b', cursor: 'pointer',
                fontSize: '0.84rem', fontWeight: tab === t.key ? 600 : 400, transition: 'color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={s.tableWrap}>
          {tab === 'top' ? (
            <table className={s.table}>
              <thead><tr>
                <th>#</th><th>Nama</th><th>Email</th><th>Total Referral</th><th>Rewards Didapat</th>
              </tr></thead>
              <tbody>
                {data.topReferrers.map((r, i) => (
                  <tr key={r.id}>
                    <td>
                      <span style={{ color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#f97316' : '#64748b', fontWeight: 700 }}>
                        #{i + 1}
                      </span>
                    </td>
                    <td className={s.bold}>{r.name}</td>
                    <td className={s.dim}>{r.email}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={s.textBlue} style={{ fontWeight: 600 }}>{r.count}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={s.textGreen} style={{ fontWeight: 600 }}>{r.rewardsEarned}</span>
                    </td>
                  </tr>
                ))}
                {data.topReferrers.length === 0 && (
                  <tr><td colSpan={5} className={s.emptyState}>Belum ada data referral</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className={s.table}>
              <thead><tr>
                <th>Pengundang</th><th>Diundang</th><th>Kode</th><th>Order ID</th><th>Total Order</th><th>Diskon</th><th>Tanggal</th>
              </tr></thead>
              <tbody>
                {data.usages.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div className={s.bold}>{u.referrerName}</div>
                      <div className={s.dim}>{u.referrerEmail}</div>
                    </td>
                    <td>
                      <div style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>{u.inviteeName}</div>
                      <div className={s.dim}>{u.inviteeEmail}</div>
                    </td>
                    <td><span className={s.mono} style={{ color: '#60a5fa' }}>{u.referralCode}</span></td>
                    <td><span className={s.mono}>{u.orderId}</span></td>
                    <td className={s.textGreen}>{fmt(u.orderTotal)}</td>
                    <td className={s.textYellow}>-{fmt(u.discountGiven)}</td>
                    <td className={s.dim} style={{ whiteSpace: 'nowrap' }}>{fmtDate(u.usedAt)}</td>
                  </tr>
                ))}
                {data.usages.length === 0 && (
                  <tr><td colSpan={7} className={s.emptyState}>Belum ada riwayat penggunaan</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
