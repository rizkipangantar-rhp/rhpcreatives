'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'

type InvitationPackage = 'simpel' | 'aesthetic' | 'sultan'

const TEMPLATES = [
  { value: 'pernikahan-minimalis', label: 'Pernikahan Minimalis' },
]

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function EditUndanganPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [rsvpCount, setRsvpCount] = useState(0)

  const [form, setForm] = useState({
    orderId: '',
    template: 'pernikahan-minimalis',
    package: 'aesthetic' as InvitationPackage,
    slug: '',
    groomName: '',
    brideName: '',
    groomParents: '',
    brideParents: '',
    date: '',
    time: '10:00',
    venue: '',
    venueAddress: '',
    mapsUrl: '',
    loveStory: '',
    rsvpEnabled: true,
    countdownEnabled: true,
    photos: '',
    musicUrl: '',
    animationsEnabled: true,
    isPublished: false,
  })

  useEffect(() => {
    fetch(`/api/admin/invitations/${id}`)
      .then(r => r.json())
      .then(d => {
        setRsvpCount(d.rsvpResponses?.length ?? 0)
        setForm({
          orderId: d.orderId ?? '',
          template: d.template ?? 'pernikahan-minimalis',
          package: d.package ?? 'aesthetic',
          slug: d.slug ?? '',
          groomName: d.groomName ?? '',
          brideName: d.brideName ?? '',
          groomParents: d.groomParents ?? '',
          brideParents: d.brideParents ?? '',
          date: d.date ?? '',
          time: d.time ?? '10:00',
          venue: d.venue ?? '',
          venueAddress: d.venueAddress ?? '',
          mapsUrl: d.mapsUrl ?? '',
          loveStory: d.loveStory ?? '',
          rsvpEnabled: d.rsvpEnabled ?? true,
          countdownEnabled: d.countdownEnabled ?? true,
          photos: (d.photos ?? []).join('\n'),
          musicUrl: d.musicUrl ?? '',
          animationsEnabled: d.animationsEnabled ?? true,
          isPublished: d.isPublished ?? false,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  function set(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const isAesthetic = form.package === 'aesthetic' || form.package === 'sultan'
  const isSultan = form.package === 'sultan'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      ...form,
      orderId: form.orderId || undefined,
      photos: isSultan ? form.photos.split('\n').map(s => s.trim()).filter(Boolean) : [],
      musicUrl: isSultan ? form.musicUrl || undefined : undefined,
      mapsUrl: isAesthetic ? form.mapsUrl || undefined : undefined,
      loveStory: isAesthetic ? form.loveStory || undefined : undefined,
      rsvpEnabled: isAesthetic ? form.rsvpEnabled : false,
      countdownEnabled: isAesthetic ? form.countdownEnabled : false,
      animationsEnabled: isSultan ? form.animationsEnabled : false,
    }

    const res = await fetch(`/api/admin/invitations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Gagal menyimpan')
      return
    }

    router.push('/admin/undangan')
  }

  if (loading) return <AdminLoading />

  return (
    <div style={{ maxWidth: 720 }}>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Edit Undangan</h1>
        <p className={s.pageSub}>
          {form.groomName} & {form.brideName}
          {rsvpCount > 0 && <> · <span style={{ color: '#34d399' }}>{rsvpCount} RSVP masuk</span></>}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Info Dasar ── */}
        <div className={s.card} style={{ padding: 24, marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Info Dasar</h2>

          <div className={s.twoCol}>
            <label style={labelStyle}>
              Template
              <select className={s.filterSelect} style={inputStyle} value={form.template} onChange={e => set('template', e.target.value)} required>
                {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
            <label style={labelStyle}>
              Paket
              <select className={s.filterSelect} style={inputStyle} value={form.package} onChange={e => set('package', e.target.value as InvitationPackage)} required>
                <option value="simpel">Simpel (Rp89.000)</option>
                <option value="aesthetic">Aesthetic (Rp149.000)</option>
                <option value="sultan">Sultan (Rp229.000)</option>
              </select>
            </label>
          </div>

          <div className={s.twoCol}>
            <label style={labelStyle}>
              Order ID (opsional)
              <input className={s.searchInput} style={inputStyle} value={form.orderId} onChange={e => set('orderId', e.target.value)} placeholder="RHP-20250101-XXXXX" />
            </label>
            <label style={labelStyle}>
              Slug URL *
              <input
                className={s.searchInput}
                style={inputStyle}
                value={form.slug}
                onChange={e => set('slug', slugify(e.target.value))}
                placeholder="budi-dan-ani"
                required
              />
              <span style={{ fontSize: '0.72rem', color: '#475569' }}>/undangan/{form.template}/{form.slug || '...'}</span>
            </label>
          </div>
        </div>

        {/* ── Data Mempelai ── */}
        <div className={s.card} style={{ padding: 24, marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Data Mempelai</h2>

          <div className={s.twoCol}>
            <label style={labelStyle}>
              Nama Mempelai Pria *
              <input className={s.searchInput} style={inputStyle} value={form.groomName} onChange={e => set('groomName', e.target.value)} required />
            </label>
            <label style={labelStyle}>
              Nama Mempelai Wanita *
              <input className={s.searchInput} style={inputStyle} value={form.brideName} onChange={e => set('brideName', e.target.value)} required />
            </label>
          </div>

          <div className={s.twoCol}>
            <label style={labelStyle}>
              Nama Orang Tua Pria
              <input className={s.searchInput} style={inputStyle} value={form.groomParents} onChange={e => set('groomParents', e.target.value)} />
            </label>
            <label style={labelStyle}>
              Nama Orang Tua Wanita
              <input className={s.searchInput} style={inputStyle} value={form.brideParents} onChange={e => set('brideParents', e.target.value)} />
            </label>
          </div>
        </div>

        {/* ── Info Acara ── */}
        <div className={s.card} style={{ padding: 24, marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Info Acara</h2>

          <div className={s.twoCol}>
            <label style={labelStyle}>
              Tanggal Acara *
              <input type="date" className={s.searchInput} style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} required />
            </label>
            <label style={labelStyle}>
              Jam Acara *
              <input type="time" className={s.searchInput} style={inputStyle} value={form.time} onChange={e => set('time', e.target.value)} required />
            </label>
          </div>

          <label style={{ ...labelStyle, marginBottom: 12 }}>
            Nama Gedung / Tempat *
            <input className={s.searchInput} style={inputStyle} value={form.venue} onChange={e => set('venue', e.target.value)} required />
          </label>

          <label style={labelStyle}>
            Alamat Lengkap
            <input className={s.searchInput} style={inputStyle} value={form.venueAddress} onChange={e => set('venueAddress', e.target.value)} />
          </label>
        </div>

        {isAesthetic && (
          <div className={s.card} style={{ padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Fitur Aesthetic</h2>

            <label style={{ ...labelStyle, marginBottom: 12 }}>
              Link Google Maps (embed src)
              <input className={s.searchInput} style={inputStyle} value={form.mapsUrl} onChange={e => set('mapsUrl', e.target.value)} placeholder="https://maps.google.com/maps?..." />
            </label>

            <label style={{ ...labelStyle, marginBottom: 16 }}>
              Love Story
              <textarea
                className={s.searchInput}
                style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                value={form.loveStory}
                onChange={e => set('loveStory', e.target.value)}
              />
            </label>

            <div style={{ display: 'flex', gap: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <input type="checkbox" checked={form.rsvpEnabled} onChange={e => set('rsvpEnabled', e.target.checked)} />
                Aktifkan RSVP
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <input type="checkbox" checked={form.countdownEnabled} onChange={e => set('countdownEnabled', e.target.checked)} />
                Aktifkan Countdown
              </label>
            </div>
          </div>
        )}

        {isSultan && (
          <div className={s.card} style={{ padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Fitur Sultan</h2>

            <label style={{ ...labelStyle, marginBottom: 12 }}>
              URL Foto (satu per baris, maks 10)
              <textarea
                className={s.searchInput}
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.78rem' }}
                value={form.photos}
                onChange={e => set('photos', e.target.value)}
              />
            </label>

            <label style={{ ...labelStyle, marginBottom: 16 }}>
              URL Musik Latar
              <input className={s.searchInput} style={inputStyle} value={form.musicUrl} onChange={e => set('musicUrl', e.target.value)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.84rem', color: '#cbd5e1' }}>
              <input type="checkbox" checked={form.animationsEnabled} onChange={e => set('animationsEnabled', e.target.checked)} />
              Aktifkan Animasi Smooth
            </label>
          </div>
        )}

        <div className={s.card} style={{ padding: 20, marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.87rem', color: '#f1f5f9', fontWeight: 500 }}>
            <input type="checkbox" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} />
            Publish (link aktif)
          </label>
        </div>

        {error && <p style={{ color: '#f87171', fontSize: '0.84rem', marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className={s.btnPrimary} disabled={saving} style={{ padding: '10px 24px' }}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          {form.isPublished && (
            <a
              href={`/undangan/${form.template}/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s.btnGhost}
              style={{ padding: '10px 20px', color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              Lihat Undangan
            </a>
          )}
          <button type="button" className={s.btnGhost} onClick={() => router.push('/admin/undangan')} style={{ padding: '10px 20px' }}>
            Kembali
          </button>
        </div>
      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: '0.82rem',
  color: '#94a3b8',
  fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  flex: 'none',
}