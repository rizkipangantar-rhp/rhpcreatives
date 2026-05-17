import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findRawClaim, isClaimExpired, getQuota } from '@/lib/early-bird'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const quota = getQuota()
  const rawClaim = findRawClaim(session.user.id) ?? null
  const claimExpired = rawClaim ? isClaimExpired(rawClaim) : false
  const claim = rawClaim && !claimExpired ? rawClaim : null

  return NextResponse.json({
    quota,
    claim,
    claimExpired,
    userName: session.user.name ?? '',
    userEmail: session.user.email ?? '',
  })
}
