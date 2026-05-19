'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Session } from 'next-auth'
import { useLanguage } from '@/context/LanguageContext'
import styles from './custom.module.css'

const ADMIN_WA = '6285179992598'
const CATEGORIES = ['Layanan Digital', 'Layanan Desain', 'Lainnya'] as const

type Step = 'form' | 'confirm'

function buildWaMessage(data: {
  requestId: string
  name: string
  email: string
  wa: string
  serviceName: string
  packageName: string
  description: string
  deadline?: string
}) {
  return encodeURIComponent(
    `📋 CUSTOM ORDER REQUEST BARU!\n` +
    `Request ID: ${data.requestId}\n` +
    `Dari: ${data.name} (${data.email})\n` +
    `WA: ${data.wa}\n` +
    `Layanan: ${data.serviceName} - ${data.packageName}\n` +
    `Deskripsi: ${data.description.slice(0, 200)}${data.description.length > 200 ? '...' : ''}\n` +
    (data.deadline ? `Deadline: ${data.deadline}\n` : '') +
    `Cek dashboard admin untuk input harga.`
  )
}

export default function CustomRequestForm({ session }: { session: Session | null }) {
  const { lang } = useLanguage()

  const [step, setStep] = useState<Step>('form')
  const [requestId, setRequestId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: session?.user?.name ?? '',
    whatsapp: '',
    category: 'Layanan Digital' as typeof CATEGORIES[number],
    serviceName: '',
    packageName: '',
    description: '',
    reference: '',
    deadline: '',
    voucherCode: '',
  })

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/custom-order/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          whatsapp: form.whatsapp,
          category: form.category,
          serviceName: form.serviceName,
          packageName: form.packageName,
          description: form.description,
          reference: form.reference || undefined,
          deadline: form.deadline || undefined,
          voucherCode: form.voucherCode || undefined,
        }),
      })
      const data = await res.json() as { request_id?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Gagal mengirim request. Coba lagi.')
        return
      }
      setRequestId(data.request_id!)
      setStep('confirm')

      // Open WA notification to admin
      const waMsg = buildWaMessage({
        requestId: data.request_id!,
        name: form.name,
        email: session?.user?.email ?? '',
        wa: form.whatsapp,
        serviceName: form.serviceName,
        packageName: form.packageName,
        description: form.description,
        deadline: form.deadline,
      })
      setTimeout(() => {
        window.open(`https://wa.me/${ADMIN_WA}?text=${waMsg}`, '_blank')
      }, 800)
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <main className={styles.page}>
        <div className={styles.blob1} /><div className={styles.blob2} />
        <div className={styles.container}>
          <div className={styles.loginPrompt}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
            <h1 className={styles.loginTitle}>
              {lang === 'id' ? 'Login dulu, ya!' : 'Please log in first'}
            </h1>
            <p className={styles.loginSub}>
              {lang === 'id'
                ? 'Kamu harus login untuk mengajukan custom order.'
                : 'You need to be logged in to submit a custom order request.'}
            </p>
            <Link href="/login?callbackUrl=/order/custom" className={styles.loginBtn}>
              {lang === 'id' ? 'Masuk Sekarang →' : 'Sign In Now →'}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (step === 'confirm') {
    return (
      <main className={styles.page}>
        <div className={styles.blob1} /><div className={styles.blob2} />
        <div className={styles.container}>
          <div className={styles.confirmCard}>
            <span className={styles.confirmIcon}>🎉</span>
            <h1 className={styles.confirmTitle}>
              {lang === 'id' ? 'Request udah masuk!' : 'Request submitted!'}
            </h1>
            <p className={styles.confirmSub}>
              {lang === 'id'
                ? 'Tim kami akan review dan kasih harga dalam 1×24 jam. Pantau status di dashboard profil kamu ya!'
                : "Our team will review and send you a quote within 24 hours. Track your request status in your profile dashboard!"}
            </p>
            <div className={styles.requestIdBox}>
              <span className={styles.requestIdLabel}>Request ID</span>
              <span className={styles.requestId}>{requestId}</span>
            </div>
            <div className={styles.waNotifHint} style={{ textAlign: 'left', marginBottom: 28 }}>
              <span>📱</span>
              <span>
                {lang === 'id'
                  ? 'Notifikasi WA sudah dikirim ke admin kami. Kalau popup terblokir, silahkan buka chat WA admin secara manual.'
                  : 'WA notification sent to our admin. If the popup was blocked, please open the admin WA chat manually.'}
              </span>
            </div>
            <div className={styles.confirmActions}>
              <Link href="/dashboard/profil?tab=custom" className={styles.profileBtn}>
                {lang === 'id' ? 'Pantau Status →' : 'Track Status →'}
              </Link>
              <Link href="/" className={styles.homeBtn}>
                {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.blob1} /><div className={styles.blob2} />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/order" className={styles.backLink}>← {lang === 'id' ? 'Kembali' : 'Back'}</Link>
          <div className={styles.badge}>Custom Order</div>
          <h1 className={styles.title}>
            {lang === 'id' ? 'Request Layanan Custom' : 'Custom Service Request'}
          </h1>
          <p className={styles.sub}>
            {lang === 'id'
              ? 'Ceritain kebutuhanmu, tim kami akan review dan kirim penawaran harga dalam 1×24 jam!'
              : "Tell us what you need and we'll review it and send you a price quote within 24 hours!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', color: '#f87171', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {/* Customer Info */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>
              {lang === 'id' ? '👤 Info Kamu' : '👤 Your Info'}
            </p>
            <div className={styles.fieldGroup}>
              <div>
                <label className={styles.label}>{lang === 'id' ? 'Nama Lengkap' : 'Full Name'}<span className={styles.required}>*</span></label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder={lang === 'id' ? 'Nama kamu' : 'Your name'}
                  required
                />
              </div>
              <div>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  value={session.user?.email ?? ''}
                  disabled
                  readOnly
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{lang === 'id' ? 'Nomor WhatsApp' : 'WhatsApp Number'}<span className={styles.required}>*</span></label>
              <input
                className={styles.input}
                value={form.whatsapp}
                onChange={e => set('whatsapp', e.target.value.replace(/\D/g, ''))}
                placeholder="628xxxx"
                required
              />
              <span className={styles.hint}>{lang === 'id' ? 'Format internasional tanpa +, contoh: 62812xxxx' : 'International format without +, e.g. 62812xxxx'}</span>
            </div>
          </div>

          {/* Service Info */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>
              {lang === 'id' ? '🎯 Detail Layanan' : '🎯 Service Details'}
            </p>
            <div className={styles.field}>
              <label className={styles.label}>{lang === 'id' ? 'Kategori Layanan' : 'Service Category'}<span className={styles.required}>*</span></label>
              <select
                className={styles.select}
                value={form.category}
                onChange={e => set('category', e.target.value as typeof CATEGORIES[number])}
                required
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label}>{lang === 'id' ? 'Nama Layanan' : 'Service Name'}<span className={styles.required}>*</span></label>
                <input
                  className={styles.input}
                  value={form.serviceName}
                  onChange={e => set('serviceName', e.target.value)}
                  placeholder={lang === 'id' ? 'Misal: Video Reels Instagram' : 'e.g. Instagram Reels Video'}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{lang === 'id' ? 'Nama Paket / Spesifikasi' : 'Package / Spec'}<span className={styles.required}>*</span></label>
                <input
                  className={styles.input}
                  value={form.packageName}
                  onChange={e => set('packageName', e.target.value)}
                  placeholder={lang === 'id' ? 'Misal: 30 detik, Full Edit' : 'e.g. 30 sec, Full Edit'}
                  required
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{lang === 'id' ? 'Deskripsi Kebutuhan' : 'Requirements Description'}<span className={styles.required}>*</span></label>
              <textarea
                className={styles.textarea}
                rows={5}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder={lang === 'id'
                  ? 'Ceritain detail kebutuhanmu: tujuan, target audience, gaya yang diinginkan, dll...'
                  : 'Describe your needs in detail: goals, target audience, preferred style, etc...'}
                maxLength={2000}
                required
              />
              <span className={styles.charCount}>{form.description.length}/2000</span>
            </div>
          </div>

          {/* Optional */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>
              {lang === 'id' ? '✨ Info Tambahan (Opsional)' : '✨ Additional Info (Optional)'}
            </p>
            <div className={styles.field}>
              <label className={styles.label}>{lang === 'id' ? 'Referensi' : 'References'}</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={form.reference}
                onChange={e => set('reference', e.target.value)}
                placeholder={lang === 'id'
                  ? 'Link atau deskripsi contoh yang kamu suka...'
                  : 'Links or descriptions of examples you like...'}
                maxLength={500}
              />
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label}>{lang === 'id' ? 'Deadline yang Diharapkan' : 'Expected Deadline'}</label>
                <input
                  className={styles.input}
                  type="date"
                  value={form.deadline}
                  onChange={e => set('deadline', e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{lang === 'id' ? 'Kode Voucher (Opsional)' : 'Voucher Code (Optional)'}</label>
                <input
                  className={styles.input}
                  value={form.voucherCode}
                  onChange={e => set('voucherCode', e.target.value.toUpperCase())}
                  placeholder={lang === 'id' ? 'Early Bird / Referral' : 'Early Bird / Referral'}
                />
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading
              ? (lang === 'id' ? 'Mengirim Request...' : 'Submitting...')
              : (lang === 'id' ? 'Kirim Request →' : 'Submit Request →')}
          </button>
        </form>
      </div>
    </main>
  )
}
