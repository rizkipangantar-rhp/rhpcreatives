import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#06060f',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.2)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'rgba(236,72,153,0.15)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ display: 'flex', fontSize: 108, fontWeight: 700, color: '#ffffff', letterSpacing: '-3px' }}>
            RHP
          </div>
          <div style={{ display: 'flex', fontSize: 108, fontWeight: 700, color: '#a78bfa', letterSpacing: '-3px' }}>
            Creatives
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: 80,
            height: 4,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            borderRadius: '2px',
            marginTop: '24px',
          }}
        />

        <div style={{ display: 'flex', fontSize: 34, color: 'rgba(255,255,255,0.5)', marginTop: '24px' }}>
          Jasa Digital & Desain Kreatif
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {['Undangan Online', 'Landing Page', 'Website', 'Desain Grafis'].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                padding: '10px 24px',
                borderRadius: '100px',
                border: '1px solid rgba(139,92,246,0.45)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 22,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
