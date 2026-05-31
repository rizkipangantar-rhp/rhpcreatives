import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Template Undangan Digital',
  description: 'Pilih template undangan digital untuk pernikahan, ulang tahun, khitanan, dan acara lainnya.',
}

const themes = [
  {
    slug: 'pernikahan-minimalis',
    label: 'Pernikahan Minimalis',
    desc: 'Elegan, bersih, dan penuh kesan. Latar gelap dengan aksen gold warm.',
    tags: ['Pernikahan', 'Minimalis', 'Dark'],
    available: true,
  },
  {
    slug: 'pernikahan-floral',
    label: 'Pernikahan Floral',
    desc: 'Lembut dan romantis dengan ornamen bunga pastel yang memukau.',
    tags: ['Pernikahan', 'Floral', 'Pastel'],
    available: false,
  },
  {
    slug: 'pernikahan-elegant-gold',
    label: 'Pernikahan Elegant Gold',
    desc: 'Mewah dengan dominasi gold metalik dan sentuhan glamor.',
    tags: ['Pernikahan', 'Elegant', 'Gold'],
    available: false,
  },
]

export default function UndanganPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a87c', marginBottom: 12 }}>
          RHP Creatives
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
          Template Undangan Digital
        </h1>
        <p style={{ color: '#64748b', maxWidth: 520 }}>
          Pilih tema undangan yang sesuai dengan karakter acara Anda. Semua template bisa dikustomisasi penuh oleh tim kami.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {themes.map(t => (
          <div
            key={t.slug}
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 24,
              background: 'rgba(255,255,255,0.02)',
              opacity: t.available ? 1 : 0.55,
              position: 'relative',
              transition: 'border-color 0.2s',
            }}
          >
            {!t.available && (
              <span style={{
                position: 'absolute', top: 16, right: 16,
                fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.07)', color: '#64748b',
                padding: '3px 10px', borderRadius: 999,
              }}>
                Segera
              </span>
            )}

            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {t.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '0.65rem', color: '#c9a87c',
                  background: 'rgba(201,168,124,0.1)', border: '1px solid rgba(201,168,124,0.2)',
                  borderRadius: 999, padding: '2px 8px',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>{t.label}</h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.7, marginBottom: 20 }}>{t.desc}</p>

            {t.available ? (
              <a
                href={`/undangan/${t.slug}/demo`}
                style={{
                  display: 'inline-block', padding: '8px 18px',
                  background: 'rgba(201,168,124,0.15)', border: '1px solid rgba(201,168,124,0.3)',
                  borderRadius: 10, color: '#c9a87c', fontSize: '0.82rem', fontWeight: 600,
                  textDecoration: 'none', transition: 'background 0.2s',
                }}
              >
                Lihat Preview
              </a>
            ) : (
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>Dalam pengembangan</span>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}