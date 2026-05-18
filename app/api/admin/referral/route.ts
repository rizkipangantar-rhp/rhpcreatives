import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readUsers } from '@/lib/users-internal'
import { getAllOrders } from '@/lib/orders'
import fs from 'fs'
import { getDataPath } from '@/lib/data-path'

function readReferralData() {
  try {
    const p = getDataPath('referral.json')
    if (!fs.existsSync(p)) return { usages: [] }
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch { return { usages: [] } }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = readUsers()
  const orders = getAllOrders()
  const { usages } = readReferralData()

  const usersMap = new Map(users.map(u => [u.id, u]))

  const enriched = usages.map((u: { userId: string; referralCode: string; referrerId: string; orderId: string; usedAt: string }) => {
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

  const totalDiscountGiven = enriched.reduce((s: number, u: { discountGiven: number }) => s + u.discountGiven, 0)

  return NextResponse.json({
    totalUsages: usages.length,
    totalDiscountGiven,
    usages: enriched,
    topReferrers,
  })
}
