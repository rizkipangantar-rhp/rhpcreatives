import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllUsers } from '@/lib/users'
import { getAllOrders } from '@/lib/orders'
import { dbGet } from '@/lib/store'
import type { ReferralUsage } from '@/lib/referral'

type ReferralData = { usages: ReferralUsage[] }

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [users, orders, referralData] = await Promise.all([
    getAllUsers(),
    getAllOrders(),
    dbGet<ReferralData>('rhp:referral', 'referral.json', { usages: [] }),
  ])

  const { usages } = referralData
  const usersMap = new Map(users.map(u => [u.id, u]))

  const enriched = usages.map((u) => {
    const invitee = usersMap.get(u.userId)
    const referrer = usersMap.get(u.referrerId)
    const order = orders.find(o => o.orderId === u.orderId)
    return {
      ...u,
      inviteeName: invitee?.name ?? u.userId,
      inviteeEmail: invitee?.email ?? '',
      referrerName: referrer?.name ?? u.referrerId,
      referrerEmail: referrer?.email ?? '',
      orderTotal: order?.totalPrice ?? 0,
      discountGiven: order?.discountAmount ?? 0,
    }
  })

  // Top referrers
  const referrerMap: Record<string, { name: string; email: string; count: number; rewardsEarned: number }> = {}
  for (const u of enriched) {
    if (!referrerMap[u.referrerId]) {
      referrerMap[u.referrerId] = { name: u.referrerName, email: u.referrerEmail, count: 0, rewardsEarned: 0 }
    }
    referrerMap[u.referrerId].count += 1
    referrerMap[u.referrerId].rewardsEarned += 1
  }
  const topReferrers = Object.entries(referrerMap)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.count - a.count)

  const totalDiscountGiven = enriched.reduce((s, u) => s + u.discountGiven, 0)

  return NextResponse.json({
    totalUsages: usages.length,
    totalDiscountGiven,
    usages: enriched,
    topReferrers,
  })
}
