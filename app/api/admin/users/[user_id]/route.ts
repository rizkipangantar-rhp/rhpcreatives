import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findUserById, setUserSuspended, getUserReferralCode, deleteUser } from '@/lib/users'
import { getOrdersByUser } from '@/lib/orders'
import { getReferralStats } from '@/lib/referral'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { user_id } = await params
  const user = await findUserById(user_id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const orders = await getOrdersByUser(user_id)
  const paidOrders = orders.filter(o => ['paid', 'processing', 'completed'].includes(o.status))
  const referralCode = getUserReferralCode(user)
  const stats = await getReferralStats(referralCode)

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    image: user.image,
    referralCode,
    referredBy: user.referredBy,
    rewardsAvailable: user.referralRewardsAvailable,
    rewardsUsed: user.referralRewardsUsed,
    isAdmin: user.isAdmin,
    suspended: user.suspended ?? false,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    totalOrders: orders.length,
    totalSpent: paidOrders.reduce((s, o) => s + o.totalPrice, 0),
    orders,
    referralStats: stats,
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { user_id } = await params
  const { suspended } = await req.json() as { suspended: boolean }
  await setUserSuspended(user_id, suspended)
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { user_id } = await params
  const user = await findUserById(user_id)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (user.isAdmin) return NextResponse.json({ error: 'Tidak bisa hapus akun admin' }, { status: 400 })

  await deleteUser(user_id)
  return NextResponse.json({ ok: true })
}
