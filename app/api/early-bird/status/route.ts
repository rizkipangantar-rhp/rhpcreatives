import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findClaim, getQuota } from '@/lib/early-bird'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const quota = getQuota()
  const claim = findClaim(session.user.id) ?? null

  return NextResponse.json({
    quota,
    claim,
    userName: session.user.name ?? '',
    userEmail: session.user.email ?? '',
  })
}
