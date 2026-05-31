import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#06060f',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 80,
        color: 'white',
      }}
    >
      RHPCreatives
    </div>,
    { width: 1200, height: 630 },
  )
}
