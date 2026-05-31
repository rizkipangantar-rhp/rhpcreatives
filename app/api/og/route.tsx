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
        {/* purple blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: -130,
            right: -130,
            width: 540,
            height: 540,
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.18)',
            display: 'flex',
          }}
        />
        {/* pink blob bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -130,
            left: -130,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(236,72,153,0.13)',
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Brand name */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontSize: 104,
                fontWeight: 800,
                color: '#8b5cf6',
                letterSpacing: '-3px',
              }}
            >
              RHP
            </span>
            <span
              style={{
                fontSize: 78,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-2px',
              }}
            >
              Creatives
            </span>
          </div>

          {/* Gradient divider */}
          <div
            style={{
              width: 80,
              height: 4,
              background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
              borderRadius: '2px',
              display: 'flex',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: 34,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 400,
            }}
          >
            Jasa Digital & Desain Kreatif
          </div>

          {/* Service pills */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {['Undangan Online', 'Landing Page', 'Website', 'Desain Grafis'].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 22px',
                  borderRadius: '100px',
                  border: '1px solid rgba(139,92,246,0.4)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 22,
                  display: 'flex',
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
