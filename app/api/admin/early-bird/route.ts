import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getQuota } from '@/lib/early-bird'
import { dbGet } from '@/lib/store'
import type { ClaimEntry, WaitlistEntry } from '@/lib/early-bird'

type EarlyBirdData = { claims: ClaimEntry[]; waitlist: WaitlistEntry[] }

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [quota, data] = await Promise.all([
    getQuota(),
    dbGet<EarlyBirdData>('rhp:early-bird', 'early-bird.json', { claims: [], waitlist: [] }),
  ])
  return NextResponse.json({ quota, claims: data.claims, waitlist: data.waitlist })
}
