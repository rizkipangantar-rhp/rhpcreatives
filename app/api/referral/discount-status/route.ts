import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findUserById, getUserReferralCode } from '@/lib/users'
import { hasUserUsedReferral } from '@/lib/referral'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [user, isFirstOrder] = await Promise.all([
    findUserById(session.user.id),
    hasUserUsedReferral(session.user.id).then(used => !used),
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

  return NextResponse.json({ inviteeDiscount, referrerReward })
}
