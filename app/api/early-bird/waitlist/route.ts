import { NextResponse } from 'next/server'
import { addWaitlist } from '@/lib/early-bird'

export async function POST(req: Request) {
  const { email, wa } = await req.json()
  if (!email?.trim() || !wa?.trim()) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  addWaitlist(email.trim(), wa.trim())
  return NextResponse.json({ ok: true })
}
