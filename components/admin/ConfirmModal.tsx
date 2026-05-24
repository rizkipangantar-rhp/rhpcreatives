'use client'

type Props = {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ title, message, confirmLabel = 'Ya, Lanjutkan', danger = true, onConfirm, onCancel }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#1a1f2e', border: `1px solid ${danger ? 'rgba(239,68,68,0.25)' : 'rgba(139,92,246,0.25)'}`, borderRadius: 16, padding: '2rem 1.75rem', maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{danger ? '⚠️' : '❓'}</div>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', color: '#f1f5f9' }}>{title}</div>
        <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>{message}</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: 'none', background: danger ? 'rgba(239,68,68,0.85)' : 'rgba(139,92,246,0.85)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
