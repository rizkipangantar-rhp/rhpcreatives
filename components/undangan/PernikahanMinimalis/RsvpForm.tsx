'use client'
import { useState } from 'react'

type Props = { invitationId: string; guestName?: string }

export default function RsvpForm({ invitationId, guestName }: Props) {
  const [name, setName] = useState(guestName ?? '')
  const [attendance, setAttendance] = useState<'hadir' | 'tidak_hadir' | ''>('')
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!attendance) return
    setStatus('loading')

    const res = await fetch('/api/invitations/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId, guestName: name, attendance, guestCount, message }),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{attendance === 'hadir' ? '🎉' : '💌'}</div>
        <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 6 }}>
          {attendance === 'hadir' ? 'Terima kasih! Sampai jumpa di hari bahagia kami.' : 'Terima kasih atas doanya!'}
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>RSVP Anda telah tercatat.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>Nama Anda</label>
        <input
          style={inputStyle}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Masukkan nama Anda"
          required
        />
      </div>

      <div>
        <label style={labelStyle}>Konfirmasi Kehadiran</label>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['hadir', 'tidak_hadir'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setAttendance(v)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 12, border: '1px solid',
                borderColor: attendance === v ? (v === 'hadir' ? '#34d399' : '#f87171') : 'rgba(255,255,255,0.12)',
                background: attendance === v ? (v === 'hadir' ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)') : 'transparent',
                color: attendance === v ? (v === 'hadir' ? '#34d399' : '#f87171') : '#94a3b8',
                cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, transition: 'all 0.2s',
              }}
            >
              {v === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
            </button>
          ))}
        </div>
      </div>

      {attendance === 'hadir' && (
        <div>
          <label style={labelStyle}>Jumlah Tamu</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={guestCount}
            onChange={e => setGuestCount(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} orang</option>)}
          </select>
        </div>
      )}

      <div>
        <label style={labelStyle}>Ucapan & Doa (opsional)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Tuliskan ucapan dan doa terbaik Anda..."
        />
      </div>

      {status === 'error' && (
        <p style={{ color: '#f87171', fontSize: '0.82rem' }}>Gagal mengirim, coba lagi.</p>
      )}

      <button
        type="submit"
        disabled={!attendance || !name.trim() || status === 'loading'}
        style={{
          padding: '12px 0', borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #c9a87c, #a67c52)',
          color: '#fff', fontWeight: 700, fontSize: '0.9rem',
          cursor: 'pointer', opacity: (!attendance || !name.trim()) ? 0.5 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {status === 'loading' ? 'Mengirim...' : 'Kirim RSVP'}
      </button>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 6,
  fontSize: '0.78rem', color: '#94a3b8',
  fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em',
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12, color: '#f1f5f9',
  fontSize: '0.87rem', padding: '10px 14px',
  outline: 'none',
}