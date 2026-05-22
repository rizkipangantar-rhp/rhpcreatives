import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findUserById, getUserReferralCode } from '@/lib/users'
import { getReferralStats } from '@/lib/referral'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await findUserById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const referralCode = getUserReferralCode(user)
  const stats = await getReferralStats(referralCode)

  const usages = await Promise.all(
    stats.usages.map(async (u) => {
      const invitee = await findUserById(u.userId)
      return { ...u, userName: invitee?.name ?? null }
    })
  )

  return NextResponse.json({
    referralCode,
    count: stats.count,
    usages,
    rewardsAvailable: user.referralRewardsAvailable ?? 0,
    rewardsUsed: user.referralRewardsUsed ?? 0,
  })
}
