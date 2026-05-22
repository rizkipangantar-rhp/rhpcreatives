'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import s from '@/components/admin/admin.module.css'

const PRESET_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4']

type FormState = {
  name: string; description: string; prefix: string
  discount_type: 'percent' | 'nominal'; discount_value: string
  quota: string; start_date: string; end_date: string
  is_active: boolean; show_on_website: boolean; requires_claim: boolean
  announcement_text_id: string; announcement_text_en: string
  theme_color: string; priority: string
}

const EMPTY: FormState = {
  name: '', description: '', prefix: '',
  discount_type: 'percent', discount_value: '',
  quota: '0', start_date: '', end_date: '',
  is_active: true, show_on_website: true, requires_claim: true,
  announcement_text_id: '', announcement_text_en: '',
  theme_color: '#8b5cf6', priority: '1',
}

function fieldStyle(): React.CSSProperties {
  return { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }
}

function labelStyle(): React.CSSProperties {
  return { fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }
}

function inputStyle(): React.CSSProperties {
  return {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#f1f5f9', fontSize: '0.88rem', padding: '9px 12px', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  }
}

export default function BuatPromoPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function autoPrefix() {
    if (!form.name || form.prefix) return
    const p = form.name.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6)
    if (p) set('prefix', p)
  }

  async function handleSubmit(active: boolean) {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          discount_value: parseFloat(form.discount_value) || 0,
          quota: parseInt(form.quota) || 0,
          priority: parseInt(form.priority) || 1,
          is_active: active,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
        }),
      })
      const data = await res.json() as { promo?: { id: string }; error?: string }
      if (!res.ok) { setError(data.error ?? 'Gagal menyimpan'); setSaving(false); return }
      router.push(`/admin/promo/${data.promo!.id}`)
    } catch {
      setError('Terjadi kesalahan'); setSaving(false)
    }
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <Link href="/admin/promo" style={{ fontSize: '0.82rem', color: '#60a5fa', textDecoration: 'none', marginBottom: 8, display: 'inline-block' }}>Kembali</Link>
        <h1 className={s.pageTitle}>Buat Promo Baru</h1>
        <p className={s.pageSub}>Isi detail promo di bawah ini</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', color: '#f87171', fontSize: '0.85rem', marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div className={s.card} style={{ padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Nama Promo *</label>
            <input style={inputStyle()} value={form.name} onChange={e => set('name', e.target.value)} onBlur={autoPrefix} placeholder="Contoh: Early Bird Launch" />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Prefix Voucher *</label>
            <input style={inputStyle()} value={form.prefix} onChange={e => set('prefix', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="EBIRD, SALE, ANNIV" maxLength={8} />
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>Format kode: {form.prefix || 'PREFIX'}-XXXXX</span>
          </div>

          <div style={{ ...fieldStyle(), gridColumn: '1 / -1' }}>
            <label style={labelStyle()}>Deskripsi</label>
            <textarea
              style={{ ...inputStyle(), resize: 'vertical', minHeight: 80 }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Deskripsi promo untuk ditampilkan ke customer"
            />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Tipe Diskon</label>
            <select style={inputStyle()} value={form.discount_type} onChange={e => set('discount_type', e.target.value as 'percent' | 'nominal')}>
              <option value="percent">Persentase (%)</option>
              <option value="nominal">Nominal (Rp)</option>
            </select>
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Nilai Diskon *</label>
            <input style={inputStyle()} type="number" min="0" value={form.discount_value} onChange={e => set('discount_value', e.target.value)} placeholder={form.discount_type === 'percent' ? '25' : '50000'} />
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>
              {form.discount_type === 'percent' ? 'Persen (0–100)' : 'Dalam Rupiah'}
            </span>
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Kuota Total</label>
            <input style={inputStyle()} type="number" min="0" value={form.quota} onChange={e => set('quota', e.target.value)} />
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>Isi 0 untuk tidak terbatas</span>
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Prioritas</label>
            <input style={inputStyle()} type="number" min="1" value={form.priority} onChange={e => set('priority', e.target.value)} />
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>Lebih tinggi = tampil duluan di bar</span>
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Tanggal Mulai (Opsional)</label>
            <input style={inputStyle()} type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Tanggal Berakhir (Opsional)</label>
            <input style={inputStyle()} type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>Kosong = tidak ada batas waktu</span>
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Teks Announcement Bar (ID)</label>
            <input style={inputStyle()} value={form.announcement_text_id} onChange={e => set('announcement_text_id', e.target.value)} placeholder="Diskon 25% — Klaim sekarang" />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Teks Announcement Bar (EN)</label>
            <input style={inputStyle()} value={form.announcement_text_en} onChange={e => set('announcement_text_en', e.target.value)} placeholder="25% off — Claim now" />
          </div>

          <div style={{ ...fieldStyle(), gridColumn: '1 / -1' }}>
            <label style={labelStyle()}>Warna Tema</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('theme_color', c)}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.theme_color === c ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer' }}
                />
              ))}
              <input type="color" value={form.theme_color} onChange={e => set('theme_color', e.target.value)} style={{ width: 40, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }} />
              <span style={{ fontSize: '0.78rem', color: '#475569' }}>{form.theme_color}</span>
            </div>
          </div>

          <div style={{ ...fieldStyle(), gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {([
              { key: 'show_on_website', label: 'Tampilkan di Website', desc: 'Muncul di bar, popup, dan halaman promo' },
              { key: 'requires_claim', label: 'Perlu Klaim Dulu', desc: 'User harus klaim secara manual untuk dapat voucher' },
            ] as const).map(({ key, label, desc }) => (
              <label key={key} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${form[key] ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
                <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)} style={{ marginTop: 2, accentColor: '#3b82f6', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f1f5f9' }}>{label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 2 }}>{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
          <Link href="/admin/promo" className={s.btnExport} style={{ textDecoration: 'none' }}>Batal</Link>
          <button className={s.btnExport} onClick={() => handleSubmit(false)} disabled={saving} style={{ color: '#94a3b8' }}>
            {saving ? 'Menyimpan...' : 'Simpan sebagai Draft'}
          </button>
          <button className={s.btnPrimary} onClick={() => handleSubmit(true)} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan & Aktifkan'}
          </button>
        </div>
      </div>
    </div>
  )
}
