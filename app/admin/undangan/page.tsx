'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'

type InvitationPackage = 'simpel' | 'aesthetic' | 'sultan'

type Invitation = {
  id: string
  orderId?: string
  slug: string
  template: string
  package: InvitationPackage
  groomName: string
  brideName: string
  date: string
  venue: string
  isPublished: boolean
  rsvpResponses: { id: string }[]
  createdAt: string
}

const PKG_LABEL: Record<InvitationPackage, string> = {
  simpel: 'Simpel',
  aesthetic: 'Aesthetic',
  sultan: 'Sultan',
}

const PKG_COLOR: Record<InvitationPackage, string> = {
  simpel: s.badgePaid,
  aesthetic: s.badgeProcessing,
  sultan: s.badgeCompleted,
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminUndanganPage() {
  const [list, setList] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pkgFilter, setPkgFilter] = useState<InvitationPackage | ''>('')
  const [publishedFilter, setPublishedFilter] = useState<'' | 'published' | 'draft'>('')
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    fetch('/api/admin/invitations')
      .then(r => r.json())
      .then(d => { setList(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = list.filter(i => {
    const q = search.toLowerCase()
    if (q && !`${i.groomName} ${i.brideName} ${i.slug} ${i.orderId ?? ''}`.toLowerCase().includes(q)) return false
    if (pkgFilter && i.package !== pkgFilter) return false
    if (publishedFilter === 'published' && !i.isPublished) return false
    if (publishedFilter === 'draft' && i.isPublished) return false
    return true
  })

  async function handleDelete(id: string) {
    if (!confirm('Hapus undangan ini? Tindakan tidak bisa dibatalkan.')) return
    setDeleting(id)
    await fetch(`/api/admin/invitations/${id}`, { method: 'DELETE' })
    load()
    setDeleting(null)
  }

  async function togglePublish(inv: Invitation) {
    await fetch(`/api/admin/invitations/${inv.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !inv.isPublished }),
    })
    load()
  }

  if (loading) return <AdminLoading />

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Manajemen Undangan</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <p className={s.pageSub}>{list.length} undangan · {list.filter(i => i.isPublished).length} live</p>
          <Link href="/admin/undangan/buat" className={s.btnPrimary} style={{ padding: '7px 16px', fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            + Buat Undangan
          </Link>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.filterBar}>
          <input
            className={s.searchInput}
            placeholder="Cari nama, slug, order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className={s.filterSelect} value={pkgFilter} onChange={e => setPkgFilter(e.target.value as InvitationPackage | '')}>
            <option value="">Semua Paket</option>
            <option value="simpel">Simpel</option>
            <option value="aesthetic">Aesthetic</option>
            <option value="sultan">Sultan</option>
          </select>
          <select className={s.filterSelect} value={publishedFilter} onChange={e => setPublishedFilter(e.target.value as typeof publishedFilter)}>
            <option value="">Semua Status</option>
            <option value="published">Live</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Tanggal Buat</th>
              <th>Mempelai / Judul</th>
              <th>Template</th>
              <th>Paket</th>
              <th>RSVP</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr></thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td className={s.dim} style={{ whiteSpace: 'nowrap' }}>{fmtDate(i.createdAt)}</td>
                  <td>
                    <div className={s.bold}>{i.groomName} & {i.brideName}</div>
                    <div className={s.dim}>{i.slug} · {i.date}</div>
                    {i.orderId && <div className={s.dim}>Order: {i.orderId}</div>}
                  </td>
                  <td><span className={s.mono}>{i.template}</span></td>
                  <td><span className={`${s.badge} ${PKG_COLOR[i.package]}`}>{PKG_LABEL[i.package]}</span></td>
                  <td className={s.dim}>{i.rsvpResponses?.length ?? 0} tamu</td>
                  <td>
                    <span className={`${s.badge} ${i.isPublished ? s.badgeCompleted : s.badgePending}`}>
                      {i.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                      <Link href={`/admin/undangan/${i.id}/edit`} className={s.btnGhost}>Edit</Link>
                      {i.isPublished && (
                        <a
                          href={`/undangan/${i.template}/${i.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={s.btnGhost}
                          style={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.3)' }}
                        >
                          Preview
                        </a>
                      )}
                      <button
                        className={s.btnGhost}
                        style={{ color: i.isPublished ? '#fbbf24' : '#34d399', borderColor: i.isPublished ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.3)' }}
                        onClick={() => togglePublish(i)}
                      >
                        {i.isPublished ? 'Draft' : 'Publish'}
                      </button>
                      <button
                        className={s.btnGhost}
                        style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                        onClick={() => handleDelete(i.id)}
                        disabled={deleting === i.id}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className={s.emptyState}>Belum ada undangan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}