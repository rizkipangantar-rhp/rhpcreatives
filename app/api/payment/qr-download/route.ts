import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOST_SUFFIX = 'midtrans.com'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }

  const isMidtransHost = target.hostname === ALLOWED_HOST_SUFFIX || target.hostname.endsWith(`.${ALLOWED_HOST_SUFFIX}`)
  if (target.protocol !== 'https:' || !isMidtransHost) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 })
  }

  const upstream = await fetch(target.toString())
  if (!upstream.ok) {
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 502 })
  }

  const buffer = await upstream.arrayBuffer()
  const contentType = upstream.headers.get('content-type') ?? 'image/png'

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'attachment; filename="qris.png"',
      'Cache-Control': 'no-store',
    },
  })
}