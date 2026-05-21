'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import s from '@/components/admin/admin.module.css'

type Settings = {
  waNumber: string
  maintenanceMode: boolean
  newOrderWaNotif: boolean
}

type AdminEntry = {
  id: string
  name: string
  email: string
  role: string
  lastLogin: string
}

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Administrator' },
  { value: 'cs', label: 'Customer Service' },
]

export default function PengaturanPage() {
  const { data: session } = useSession()
  const isSuperAdmin = session?.user?.role === 'super_admin'

  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [admins, setAdmins] = useState<AdminEntry[]>([])
  const [addEmail, setAddEmail] = useState('')
  const [addRole, setAddRole] = useState<string>('admin')
  const [adminMsg, setAdminMsg] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setSettings(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (isSuperAdmin) {
      fetch('/api/admin/admins')
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setAdmins(d) })
        .catch(() => {})
    }
  }, [isSuperAdmin])

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    setAdminMsg('')
    setAdminLoading(true)
    try {
      // Find user by email
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: addEmail }),
      })
      const checkData = await checkRes.json() as { exists: boolean }
      if (!checkData.exists) {
        setAdminMsg('User dengan email ini tidak ditemukan.')
        return
      }
      // Get all users to find userId
      const usersRes = await fetch('/api/admin/users')
      const usersData = await usersRes.json() as Array<{ id: string; email: string }>
      const user = Array.isArray(usersData) ? usersData.find((u) => u.email.toLowerCase() === addEmail.toLowerCase()) : undefined
      if (!user) { setAdminMsg('User tidak ditemukan di database.'); return }
      const res = await fetch('/api/admin/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: addRole }),
      })
      if (!res.ok) { setAdminMsg('Gagal menambahkan admin.'); return }
      setAdminMsg('Admin berhasil ditambahkan!')
      setAddEmail('')
      const updated = await fetch('/api/admin/admins').then(r => r.json())
      if (Array.isArray(updated)) setAdmins(updated)
    } catch {
      setAdminMsg('Terjadi kesalahan.')
    } finally {
      setAdminLoading(false)
    }
  }

  async function handleRoleChange(userId: string, role: string | null) {
    await fetch('/api/admin/admins', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    })
    const updated = await fetch('/api/admin/admins').then(r => r.json())
    if (Array.isArray(updated)) setAdmins(updated)
  }

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

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Pengaturan</h1>
        <p className={s.pageSub}>Konfigurasi sistem RHP Creatives</p>
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
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32 }}>
        <button className={s.btnPrimary} style={{ padding: '10px 28px', fontSize: '0.9rem' }} onClick={handleSave} disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
        {saved && <span style={{ color: '#34d399', fontSize: '0.84rem' }}>✓ Tersimpan</span>}
      </div>

      {/* Admin Management — super_admin only */}
      {isSuperAdmin && (
        <div className={s.card} style={{ padding: 24 }}>
          <div className={s.cardTitle} style={{ marginBottom: 20 }}>Manajemen Admin</div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 20 }}>
            Kelola akun admin. Super Admin: akses penuh · Admin: semua kecuali pengaturan · CS: order saja.
          </p>

          {/* Existing admins */}
          <div className={s.tableWrap} style={{ marginBottom: 24 }}>
            <table className={s.table}>
              <thead><tr>
                <th>Nama</th><th>Email</th><th>Role</th><th>Last Login</th><th>Aksi</th>
              </tr></thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id}>
                    <td className={s.bold}>{a.name}</td>
                    <td className={s.dim}>{a.email}</td>
                    <td>
                      <select
                        className={s.filterSelect}
                        value={a.role}
                        onChange={e => handleRoleChange(a.id, e.target.value)}
                        disabled={a.role === 'super_admin'}
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      >
                        {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </td>
                    <td className={s.dim}>{a.lastLogin ? new Date(a.lastLogin).toLocaleDateString('id-ID') : '—'}</td>
                    <td>
                      {a.role !== 'super_admin' && (
                        <button
                          className={s.btnGhost}
                          style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#f87171' }}
                          onClick={() => handleRoleChange(a.id, null)}
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && <tr><td colSpan={5} className={s.emptyState}>Belum ada admin</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Add admin form */}
          <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: 4 }}>Email User</label>
              <input
                className={s.searchInput}
                type="email"
                placeholder="email@contoh.com"
                value={addEmail}
                onChange={e => setAddEmail(e.target.value)}
                required
                style={{ width: 240 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: 4 }}>Role</label>
              <select className={s.filterSelect} value={addRole} onChange={e => setAddRole(e.target.value)}>
                {ROLE_OPTIONS.filter(r => r.value !== 'super_admin').map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className={s.btnPrimary} style={{ padding: '8px 20px', fontSize: '0.82rem' }} disabled={adminLoading}>
              {adminLoading ? '...' : 'Tambah Admin'}
            </button>
          </form>
          {adminMsg && <p style={{ fontSize: '0.8rem', marginTop: 10, color: adminMsg.includes('berhasil') ? '#34d399' : '#f87171' }}>{adminMsg}</p>}
        </div>
      )}
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
