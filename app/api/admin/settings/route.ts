import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSettings, updateSettings } from '@/lib/settings'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json(getSettings())
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const data = await req.json()
  updateSettings(data)
  return NextResponse.json({ ok: true })
}
