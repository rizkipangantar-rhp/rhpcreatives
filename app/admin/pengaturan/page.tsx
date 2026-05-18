'use client'
import { useEffect, useState } from 'react'
import s from '@/components/admin/admin.module.css'

type Settings = {
  earlyBirdQuota: number
  earlyBirdActive: boolean
  earlyBirdEndDate: string
  waNumber: string
  maintenanceMode: boolean
  newOrderWaNotif: boolean
}

export default function PengaturanPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setSettings(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev)
  }

  if (loading || !settings) return <div className={s.loading}><div className={s.spinner} /></div>

  const endDateLocal = settings.earlyBirdEndDate
    ? new Date(settings.earlyBirdEndDate).toISOString().slice(0, 16)
    : ''

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Pengaturan</h1>
        <p className={s.pageSub}>Konfigurasi sistem RHP Creatives</p>
      </div>

      {/* Early Bird */}
      <div className={s.card} style={{ padding: 24, marginBottom: 20 }}>
        <div className={s.cardTitle} style={{ marginBottom: 20 }}>Early Bird</div>

        <div className={s.twoCol} style={{ marginBottom: 0 }}>
          <div>
            <SettingField label="Kuota Early Bird" hint="Jumlah slot total yang tersedia">
              <input
                type="number"
                min={1}
                max={1000}
                className={s.searchInput}
                style={{ width: '100%' }}
                value={settings.earlyBirdQuota}
                onChange={e => set('earlyBirdQuota', parseInt(e.target.value) || 1)}
              />
            </SettingField>
          </div>
          <div>
            <SettingField label="Tanggal Berakhir" hint="Early bird otomatis nonaktif setelah tanggal ini">
              <input
                type="datetime-local"
                className={s.searchInput}
                style={{ width: '100%' }}
                value={endDateLocal}
                onChange={e => set('earlyBirdEndDate', new Date(e.target.value).toISOString())}
              />
            </SettingField>
          </div>
        </div>

        <SettingToggle
          label="Aktifkan Early Bird"
          hint="Aktifkan atau nonaktifkan program early bird secara manual"
          checked={settings.earlyBirdActive}
          onChange={v => set('earlyBirdActive', v)}
        />
      </div>

      {/* WhatsApp */}
      <div className={s.card} style={{ padding: 24, marginBottom: 20 }}>
        <div className={s.cardTitle} style={{ marginBottom: 20 }}>WhatsApp & Notifikasi</div>

        <SettingField label="Nomor WhatsApp Admin" hint="Format internasional tanpa +, contoh: 6285179992598">
          <input
            type="text"
            className={s.searchInput}
            style={{ width: '100%', maxWidth: 360 }}
            value={settings.waNumber}
            onChange={e => set('waNumber', e.target.value.replace(/\D/g, ''))}
            placeholder="6285179992598"
          />
        </SettingField>

        <SettingToggle
          label="Notifikasi WA Order Baru"
          hint="Kirim pesan WhatsApp ke admin setiap ada order baru masuk"
          checked={settings.newOrderWaNotif}
          onChange={v => set('newOrderWaNotif', v)}
        />
      </div>

      {/* Site */}
      <div className={s.card} style={{ padding: 24, marginBottom: 24 }}>
        <div className={s.cardTitle} style={{ marginBottom: 20 }}>Site</div>
        <SettingToggle
          label="Mode Maintenance"
          hint="Tampilkan halaman maintenance ke semua pengunjung (admin tetap bisa akses)"
          checked={settings.maintenanceMode}
          onChange={v => set('maintenanceMode', v)}
          danger
        />
      </div>

      {/* Save button */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className={s.btnPrimary} style={{ padding: '10px 28px', fontSize: '0.9rem' }} onClick={handleSave} disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
        {saved && <span style={{ color: '#34d399', fontSize: '0.84rem' }}>✓ Tersimpan</span>}
      </div>
    </div>
  )
}

function SettingField({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{label}</label>
      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 8 }}>{hint}</p>
      {children}
    </div>
  )
}

function SettingToggle({ label, hint, checked, onChange, danger }: {
  label: string; hint: string; checked: boolean; onChange: (v: boolean) => void; danger?: boolean
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: danger && checked ? '#f87171' : '#f1f5f9' }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{hint}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: checked ? (danger ? '#ef4444' : '#3b82f6') : 'rgba(255,255,255,0.1)',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
        role="switch"
        aria-checked={checked}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 22 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', display: 'block',
        }} />
      </button>
    </div>
  )
}
