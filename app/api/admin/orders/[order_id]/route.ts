import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, updateOrderStatus, addOrderStatusHistory, updateOrderAdminData, type OrderStatus } from '@/lib/orders'

const VALID_STATUSES: OrderStatus[] = ['pending', 'paid', 'processing', 'completed', 'cancelled']

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const order = getOrderById(order_id)
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as {
    status?: OrderStatus
    note?: string
    adminNotes?: string
    resultUrl?: string
  }

  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
    }
    if (body.note !== undefined) {
      addOrderStatusHistory(order_id, body.status, body.note ?? '')
    } else {
      updateOrderStatus(order_id, body.status)
    }
  }

  if (body.adminNotes !== undefined || body.resultUrl !== undefined) {
    updateOrderAdminData(order_id, { adminNotes: body.adminNotes, resultUrl: body.resultUrl })
  }

  return NextResponse.json({ ok: true })
}
