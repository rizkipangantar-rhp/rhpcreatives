import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbSet } from '@/lib/store'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await dbSet('rhp:early-bird', 'early-bird.json', { claims: [], waitlist: [] })
  return NextResponse.json({ ok: true })
}
