import { NextResponse } from 'next/server'
import { recordPageview } from '@/lib/analytics'

export async function POST(req: Request) {
  try {
    const { path } = await req.json() as { path?: string }
    if (typeof path === 'string' && path) {
      const ua = req.headers.get('user-agent') ?? ''
      await recordPageview(path, ua)
    }
  } catch {
    // Analytics failures are non-fatal
  }
  return NextResponse.json({ ok: true })
}
