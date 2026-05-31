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
          background: '#06060f',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* purple→pink blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 750,
            height: 750,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0.3) 20%, rgba(236,72,153,0.2) 40%, rgba(236,72,153,0.07) 60%, transparent 75%)',
            display: 'flex',
          }}
        />
        {/* pink→purple blob bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.45) 0%, rgba(236,72,153,0.25) 20%, rgba(139,92,246,0.15) 40%, rgba(139,92,246,0.05) 60%, transparent 75%)',
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
            fontWeight: 700,
            color: '#ffffff',
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
                color: '#ffffff',
                fontSize: 22,
                fontWeight: 600,
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
