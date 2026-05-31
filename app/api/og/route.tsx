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
          justifyContent: 'center',
          padding: '0 100px',
          background: 'linear-gradient(135deg, #0d0520 0%, #06060f 50%, #130614 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* purple blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -160,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.18)',
            display: 'flex',
          }}
        />
        {/* pink blob bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            left: -160,
            width: 550,
            height: 550,
            borderRadius: '50%',
            background: 'rgba(236,72,153,0.12)',
            display: 'flex',
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: '20px',
          }}
        >
          RHP Creatives
        </div>

        {/* Gradient line */}
        <div
          style={{
            display: 'flex',
            width: 80,
            height: 5,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            borderRadius: '3px',
            marginBottom: '28px',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '40px',
            letterSpacing: '-0.5px',
          }}
        >
          Jasa Digital & Desain Kreatif
        </div>

        {/* Service tags */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Undangan Online', 'Landing Page', 'Website', 'Desain Grafis'].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                padding: '10px 24px',
                borderRadius: '100px',
                border: '1px solid rgba(139,92,246,0.5)',
                color: 'rgba(255,255,255,0.65)',
                fontSize: 22,
              }}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
