import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, resetOrderForRetry } from '@/lib/orders'

export async function POST(_req: Request, { params }: { params: { order_id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const order = await getOrderById(params.order_id)
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
  if (order.userId !== session.user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (['paid', 'completed'].includes(order.status)) {
    return NextResponse.json({ error: 'Order sudah selesai' }, { status: 400 })
  }

  const ok = await resetOrderForRetry(params.order_id)
  if (!ok) return NextResponse.json({ error: 'Gagal reset order' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
