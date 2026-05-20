import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findUserById, getUserReferralCode } from '@/lib/users'
import { hasUserUsedReferral } from '@/lib/referral'
import { findRawClaim, isClaimExpired } from '@/lib/early-bird'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [user, isFirstOrder, rawClaim] = await Promise.all([
    findUserById(session.user.id),
    hasUserUsedReferral(session.user.id).then(used => !used),
    findRawClaim(session.user.id),
  ])
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Invitee discount: 10% off first order if they were referred
  const inviteeDiscount = {
    available: !!(user.referredBy && isFirstOrder),
    code: user.referredBy ?? null,
    percent: 10,
  }

  // Referrer reward: 15% off for each time their code was used
  const referrerReward = {
    available: (user.referralRewardsAvailable ?? 0) > 0,
    count: user.referralRewardsAvailable ?? 0,
    percent: 15,
    code: getUserReferralCode(user),
  }

  // Early bird: 25% off if user has an active (non-expired, not yet used) claim
  const earlyBird = {
    available: !!(rawClaim && !isClaimExpired(rawClaim) && !rawClaim.usedAt),
    used: !!(rawClaim?.usedAt),
    percent: 25,
  }

  return NextResponse.json({ inviteeDiscount, referrerReward, earlyBird })
}
