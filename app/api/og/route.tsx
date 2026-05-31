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
          background: '#06060f',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 72px',
            flex: 1,
            zIndex: 1,
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <div style={{ display: 'flex', fontSize: 80, fontWeight: 800, color: '#ffffff', letterSpacing: '-2px' }}>
              RHP
            </div>
            <div style={{ display: 'flex', fontSize: 80, fontWeight: 800, color: '#a78bfa', letterSpacing: '-2px' }}>
              Creatives
            </div>
          </div>

          {/* Gradient divider */}
          <div
            style={{
              display: 'flex',
              width: 64,
              height: 4,
              background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
              borderRadius: '2px',
              marginBottom: '28px',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '36px',
              letterSpacing: '-0.3px',
            }}
          >
            Jasa Digital & Desain Kreatif
          </div>

          {/* Services */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
            {['Undangan Online', 'Landing Page', 'Website', 'Desain Grafis'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  }}
                />
                <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.7)' }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Domain badge */}
          <div
            style={{
              display: 'flex',
              padding: '8px 18px',
              borderRadius: '100px',
              border: '1px solid rgba(139,92,246,0.4)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 18,
              width: 'fit-content',
            }}
          >
            rhpcreatives.com
          </div>
        </div>

        {/* Right decorative */}
        <div
          style={{
            display: 'flex',
            width: '420px',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* outer glow */}
          <div
            style={{
              position: 'absolute',
              width: 480,
              height: 480,
              borderRadius: '50%',
              background: 'rgba(139,92,246,0.12)',
              display: 'flex',
            }}
          />
          {/* mid ring */}
          <div
            style={{
              position: 'absolute',
              width: 360,
              height: 360,
              borderRadius: '50%',
              border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex',
            }}
          />
          {/* inner circle */}
          <div
            style={{
              position: 'absolute',
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.55), rgba(236,72,153,0.45))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, color: 'white', letterSpacing: '-2px' }}>
              RHP
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div
          style={{
            position: 'absolute',
            left: 700,
            top: 60,
            bottom: 60,
            width: 1,
            background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.4), transparent)',
            display: 'flex',
          }}
        />

        {/* Bottom gradient bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
