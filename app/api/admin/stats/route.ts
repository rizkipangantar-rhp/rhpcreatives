import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllOrders } from '@/lib/orders'
import { readUsers } from '@/lib/users-internal'
import { getQuota } from '@/lib/early-bird'
import { getReferralStats } from '@/lib/referral'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const orders = getAllOrders()
  const users = readUsers()
  const quota = getQuota()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const paidOrders = orders.filter(o => ['paid', 'processing', 'completed'].includes(o.status))
  const monthOrders = orders.filter(o => new Date(o.createdAt) >= startOfMonth)
  const monthPaid = monthOrders.filter(o => ['paid', 'processing', 'completed'].includes(o.status))
  const monthUsers = users.filter(u => new Date(u.createdAt) >= startOfMonth)

  // Last 30 days revenue per day
  const days: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days[d.toISOString().slice(0, 10)] = 0
  }
  for (const o of paidOrders) {
    const day = o.createdAt.slice(0, 10)
    if (day in days) days[day] = (days[day] ?? 0) + o.totalPrice
  }

  // Orders by service
  const byService: Record<string, number> = {}
  for (const o of orders) {
    byService[o.serviceId] = (byService[o.serviceId] ?? 0) + 1
  }

  // Status distribution
  const byStatus: Record<string, number> = {}
  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1
  }

  const activeReferralCodes = users.filter(u => u.referralCode).length

  return NextResponse.json({
    totalOrders: orders.length,
    totalRevenue: paidOrders.reduce((s, o) => s + o.totalPrice, 0),
    monthOrders: monthOrders.length,
    monthRevenue: monthPaid.reduce((s, o) => s + o.totalPrice, 0),
    totalUsers: users.length,
    monthUsers: monthUsers.length,
    ebSlotsLeft: quota.remaining,
    ebTotal: quota.total,
    activeReferralCodes,
    revenueByDay: Object.entries(days).map(([date, revenue]) => ({ date, revenue })),
    ordersByService: byService,
    ordersByStatus: byStatus,
    recentOrders: orders.slice(0, 5),
    recentUsers: users.slice(-5).reverse(),
  })
}
