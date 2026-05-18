import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserReferralCode } from '@/lib/users'
import { readUsers } from '@/lib/users-internal'
import { getAllOrders } from '@/lib/orders'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = readUsers()
  const orders = getAllOrders()

  const result = users.map(u => {
    const userOrders = orders.filter(o => o.userId === u.id)
    const paidOrders = userOrders.filter(o => ['paid', 'processing', 'completed'].includes(o.status))
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      provider: u.provider,
      referralCode: getUserReferralCode(u),
      referredBy: u.referredBy,
      totalOrders: userOrders.length,
      totalSpent: paidOrders.reduce((s, o) => s + o.totalPrice, 0),
      rewardsAvailable: u.referralRewardsAvailable,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
      isAdmin: u.isAdmin,
      suspended: u.suspended ?? false,
    }
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json(result)
}
