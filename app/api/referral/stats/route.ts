import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateReferralCode } from '@/lib/users'
import { getReferralStats } from '@/lib/referral'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const referralCode = generateReferralCode(session.user.email)
  const stats = getReferralStats(referralCode)

  return NextResponse.json({
    referralCode,
    count: stats.count,
    orders: stats.orders,
  })
}
