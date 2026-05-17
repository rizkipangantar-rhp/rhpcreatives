import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById } from '@/lib/orders'

const ADMIN_EMAIL = 'rhpcreativesid@gmail.com'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params
  const session = await getServerSession(authOptions)

  const order = getOrderById(order_id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Allow order owner or admin
  const isAdmin = session?.user?.email === ADMIN_EMAIL
  const isOwner = session?.user?.id === order.userId

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(order)
}
