import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateOrderStatus, type OrderStatus } from '@/lib/orders'

const ADMIN_EMAIL = 'rhpcreativesid@gmail.com'
const VALID_STATUSES: OrderStatus[] = ['pending', 'paid', 'processing', 'completed', 'cancelled']

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const body = await req.json() as { status: OrderStatus }
  const { status } = body

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
  }

  const updated = updateOrderStatus(order_id, status)

  if (!updated) {
    return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
