import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export const runtime = 'nodejs'

const fontData = readFileSync(resolve(process.cwd(), 'public/fonts/SpaceGrotesk-Bold.woff2'))

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
          fontFamily: '"Space Grotesk"',
        }}
      >
        {/* purple blob top-right */}
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
        {/* pink blob bottom-left */}
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Brand name — RHP white, Creatives gradient (matches navbar) */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontSize: 108,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-3px',
                fontFamily: '"Space Grotesk"',
              }}
            >
              RHP
            </span>
            <span
              style={{
                fontSize: 108,
                fontWeight: 700,
                letterSpacing: '-3px',
                fontFamily: '"Space Grotesk"',
                background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                backgroundClip: 'text',
                color: 'transparent',
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
              letterSpacing: '-0.5px',
              fontFamily: '"Space Grotesk"',
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
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: '1px solid rgba(139,92,246,0.45)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 22,
                  display: 'flex',
                  background: 'rgba(139,92,246,0.06)',
                  fontFamily: '"Space Grotesk"',
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Space Grotesk',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  )
}
