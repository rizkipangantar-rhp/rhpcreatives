'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import s from '@/components/admin/admin.module.css'
import AdminLoading from '@/components/admin/AdminLoading'
import type { Promo } from '@/lib/promos'

const PRESET_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4']

type FormState = {
  name: string; description: string; prefix: string
  discount_type: 'percent' | 'nominal'; discount_value: string
  quota: string; start_date: string; end_date: string
  is_active: boolean; show_on_website: boolean; requires_claim: boolean
  announcement_text_id: string; announcement_text_en: string
  theme_color: string; priority: string
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

function promoToForm(p: Promo): FormState {
  return {
    name: p.name,
    description: p.description,
    prefix: p.prefix,
    discount_type: p.discount_type,
    discount_value: String(p.discount_value),
    quota: String(p.quota),
    start_date: p.start_date ? p.start_date.slice(0, 10) : '',
    end_date: p.end_date ? p.end_date.slice(0, 10) : '',
    is_active: p.is_active,
    show_on_website: p.show_on_website,
    requires_claim: p.requires_claim,
    announcement_text_id: p.announcement_text_id,
    announcement_text_en: p.announcement_text_en,
    theme_color: p.theme_color,
    priority: String(p.priority),
  }
}

export default function EditPromoPage() {
  const { promo_id } = useParams<{ promo_id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/promos/${promo_id}`)
      .then(r => r.json())
      .then(d => { if (d.promo) setForm(promoToForm(d.promo)) })
      .catch(() => {})
  }, [promo_id])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => prev ? { ...prev, [key]: value } : prev)
  }

  async function handleSave() {
    if (!form) return
    setError(''); setSaving(true)
    try {
      const res = await fetch(`/api/admin/promos/${promo_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          discount_value: parseFloat(form.discount_value) || 0,
          quota: parseInt(form.quota) || 0,
          priority: parseInt(form.priority) || 1,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
        }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) { setError(data.error ?? 'Gagal menyimpan'); setSaving(false); return }
      router.push(`/admin/promo/${promo_id}`)
    } catch {
      setError('Terjadi kesalahan'); setSaving(false)
    }
  }

  if (!form) return <AdminLoading />

  return (
    <div>
      <div className={s.pageHeader}>
        <Link href={`/admin/promo/${promo_id}`} style={{ fontSize: '0.82rem', color: '#60a5fa', textDecoration: 'none', marginBottom: 8, display: 'inline-block' }}>Kembali ke Detail</Link>
        <h1 className={s.pageTitle}>Edit Promo</h1>
        <p className={s.pageSub}>Perbarui informasi promo</p>
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
            <input style={inputStyle()} value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Prefix Voucher *</label>
            <input style={inputStyle()} value={form.prefix} onChange={e => set('prefix', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} maxLength={8} />
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>Format: {form.prefix || 'PREFIX'}-XXXXX</span>
          </div>

          <div style={{ ...fieldStyle(), gridColumn: '1 / -1' }}>
            <label style={labelStyle()}>Deskripsi</label>
            <textarea style={{ ...inputStyle(), resize: 'vertical', minHeight: 80 }} value={form.description} onChange={e => set('description', e.target.value)} />
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
            <input style={inputStyle()} type="number" min="0" value={form.discount_value} onChange={e => set('discount_value', e.target.value)} />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Kuota Total</label>
            <input style={inputStyle()} type="number" min="0" value={form.quota} onChange={e => set('quota', e.target.value)} />
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>0 = tidak terbatas</span>
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Prioritas</label>
            <input style={inputStyle()} type="number" min="1" value={form.priority} onChange={e => set('priority', e.target.value)} />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Tanggal Mulai</label>
            <input style={inputStyle()} type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Tanggal Berakhir</label>
            <input style={inputStyle()} type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Teks Bar (ID)</label>
            <input style={inputStyle()} value={form.announcement_text_id} onChange={e => set('announcement_text_id', e.target.value)} />
          </div>

          <div style={fieldStyle()}>
            <label style={labelStyle()}>Teks Bar (EN)</label>
            <input style={inputStyle()} value={form.announcement_text_en} onChange={e => set('announcement_text_en', e.target.value)} />
          </div>

          <div style={{ ...fieldStyle(), gridColumn: '1 / -1' }}>
            <label style={labelStyle()}>Warna Tema</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('theme_color', c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.theme_color === c ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer' }} />
              ))}
              <input type="color" value={form.theme_color} onChange={e => set('theme_color', e.target.value)} style={{ width: 40, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }} />
            </div>
          </div>

          <div style={{ ...fieldStyle(), gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {([
              { key: 'is_active', label: 'Aktif', desc: 'Promo dapat digunakan' },
              { key: 'show_on_website', label: 'Tampil di Website', desc: 'Muncul di bar dan halaman promo' },
              { key: 'requires_claim', label: 'Perlu Klaim', desc: 'User harus klaim manual' },
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
          <Link href={`/admin/promo/${promo_id}`} className={s.btnExport} style={{ textDecoration: 'none' }}>Batal</Link>
          <button className={s.btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  )
}
