import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

function OGImage() {
  return (
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
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
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
          background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(236,72,153,0.22) 0%, transparent 70%)',
          display: 'flex',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 108, fontWeight: 700, color: '#ffffff', letterSpacing: '-3px' }}>
            RHP
          </span>
          <span
            style={{
              fontSize: 108,
              fontWeight: 700,
              letterSpacing: '-3px',
              background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Creatives
          </span>
        </div>

        <div
          style={{
            width: 80,
            height: 4,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            borderRadius: '2px',
            display: 'flex',
          }}
        />

        <div style={{ fontSize: 34, color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '-0.5px' }}>
          Jasa Digital & Desain Kreatif
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          {['Undangan Online', 'Landing Page', 'Website', 'Desain Grafis'].map((s, i) => (
            <div
              key={i}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                border: '1px solid rgba(139,92,246,0.45)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 22,
                display: 'flex',
                background: 'rgba(139,92,246,0.06)',
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function GET(req: NextRequest) {
  let fontData: ArrayBuffer | null = null

  try {
    const origin = new URL(req.url).origin
    fontData = await fetch(`${origin}/fonts/SpaceGrotesk-Bold.woff2`).then(r => r.arrayBuffer())
  } catch {
    // font unavailable — renders with system font
  }

  return new ImageResponse(<OGImage />, {
    width: 1200,
    height: 630,
    ...(fontData ? { fonts: [{ name: 'Space Grotesk', data: fontData, weight: 700 as const, style: 'normal' as const }] } : {}),
  })
}
