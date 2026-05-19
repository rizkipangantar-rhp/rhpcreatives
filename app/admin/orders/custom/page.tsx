'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import s from '@/components/admin/admin.module.css'
import { SERVICES, type ServiceId } from '@/lib/packages'

type Status = 'paid' | 'processing' | 'completed' | 'pending'

export default function CustomOrderPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', wa: '',
    serviceId: SERVICES[0].id,
    packageId: SERVICES[0].packages[0].id,
    price: SERVICES[0].packages[0].price,
    notes: '',
    status: 'paid' as Status,
    customPrice: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedSvc = SERVICES.find(s => s.id === form.serviceId) ?? SERVICES[0]
  const selectedPkg = selectedSvc.packages.find(p => p.id === form.packageId) ?? selectedSvc.packages[0]

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleServiceChange(serviceId: string) {
    const svc = SERVICES.find(s => s.id === serviceId) ?? SERVICES[0]
    const pkg = svc.packages[0]
    setForm(prev => ({
      ...prev,
      serviceId: serviceId as ServiceId,
      packageId: pkg.id,
      price: prev.customPrice ? prev.price : pkg.price,
    }))
  }

  function handlePackageChange(packageId: string) {
    const pkg = selectedSvc.packages.find(p => p.id === packageId) ?? selectedSvc.packages[0]
    setForm(prev => ({
      ...prev,
      packageId,
      price: prev.customPrice ? prev.price : pkg.price,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          wa: form.wa,
          serviceId: form.serviceId,
          packageId: form.packageId,
          price: form.price,
          notes: form.notes,
          status: form.status,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Gagal membuat order'); return }
      router.push(`/admin/orders/${data.order.orderId}`)
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Buat Custom Order</h1>
        <p className={s.pageSub}>Buat order manual untuk klien tanpa payment gateway</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 680 }}>
        {error && <div className={s.errorBanner} style={{ marginBottom: 16, padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}

        {/* Customer Info */}
        <div className={s.card} style={{ padding: 24, marginBottom: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 20 }}>Info Customer</div>
          <div className={s.twoCol}>
            <Field label="Nama Lengkap">
              <input className={s.searchInput} style={{ width: '100%' }} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama customer" required />
            </Field>
            <Field label="Email">
              <input className={s.searchInput} style={{ width: '100%' }} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@contoh.com" required />
            </Field>
          </div>
          <Field label="WhatsApp">
            <input className={s.searchInput} style={{ width: '100%', maxWidth: 280 }} value={form.wa} onChange={e => set('wa', e.target.value)} placeholder="628xxxx" required />
          </Field>
        </div>

        {/* Service */}
        <div className={s.card} style={{ padding: 24, marginBottom: 20 }}>
          <div className={s.cardTitle} style={{ marginBottom: 20 }}>Layanan & Paket</div>
          <div className={s.twoCol}>
            <Field label="Layanan">
              <select className={s.filterSelect} style={{ width: '100%' }} value={form.serviceId} onChange={e => handleServiceChange(e.target.value)}>
                {SERVICES.map(sv => <option key={sv.id} value={sv.id}>{sv.nameId}</option>)}
              </select>
            </Field>
            <Field label="Paket">
              <select className={s.filterSelect} style={{ width: '100%' }} value={form.packageId} onChange={e => handlePackageChange(e.target.value)}>
                {selectedSvc.packages.map(p => <option key={p.id} value={p.id}>{p.nameId}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Harga (Rp)">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                className={s.searchInput}
                style={{ width: 200 }}
                type="number"
                min={0}
                value={form.price}
                onChange={e => set('price', parseInt(e.target.value) || 0)}
                disabled={!form.customPrice}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#94a3b8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.customPrice}
                  onChange={e => {
                    set('customPrice', e.target.checked)
                    if (!e.target.checked) set('price', selectedPkg.price)
                  }}
                />
                Override harga
              </label>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>Harga paket: Rp{selectedPkg.price.toLocaleString('id-ID')}</p>
          </Field>
        </div>

        {/* Notes & Status */}
        <div className={s.card} style={{ padding: 24, marginBottom: 24 }}>
          <div className={s.cardTitle} style={{ marginBottom: 20 }}>Detail Order</div>
          <Field label="Catatan / Request Khusus">
            <textarea
              className={s.searchInput}
              style={{ width: '100%', minHeight: 80, resize: 'vertical' }}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Catatan untuk tim..."
            />
          </Field>
          <Field label="Status Awal">
            <select className={s.filterSelect} value={form.status} onChange={e => set('status', e.target.value as Status)}>
              <option value="paid">Dibayar (Paid)</option>
              <option value="processing">Sedang Diproses (Processing)</option>
              <option value="pending">Menunggu Pembayaran (Pending)</option>
              <option value="completed">Selesai (Completed)</option>
            </select>
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className={s.btnPrimary} style={{ padding: '10px 28px' }} disabled={loading}>
            {loading ? 'Membuat Order...' : 'Buat Order'}
          </button>
          <button type="button" className={s.btnGhost} onClick={() => router.push('/admin/orders')} disabled={loading}>
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}
