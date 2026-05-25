import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, updateOrderStatus, addOrderStatusHistory, updateOrderAdminData, type OrderStatus } from '@/lib/orders'
import { getRequestByOrderId, pushStatusHistory } from '@/lib/custom-orders'

const VALID_STATUSES: OrderStatus[] = ['pending', 'paid', 'processing', 'completed', 'cancelled']

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const order = await getOrderById(order_id)
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
      await addOrderStatusHistory(order_id, body.status, body.note ?? '')
    } else {
      await updateOrderStatus(order_id, body.status)
    }

    // Sync linked custom order status on processing/completed
    if (body.status === 'processing' || body.status === 'completed') {
      const customReq = await getRequestByOrderId(order_id)
      if (customReq) {
        const terminal = ['done', 'rejected_by_admin', 'rejected_by_customer']
        if (body.status === 'completed' && !terminal.includes(customReq.status)) {
          await pushStatusHistory(customReq.request_id, 'done', 'Auto: order selesai')
        } else if (body.status === 'processing' && customReq.status === 'paid') {
          await pushStatusHistory(customReq.request_id, 'in_progress', 'Auto: proses pengerjaan dimulai')
        }
      }
    }
  }

  if (body.adminNotes !== undefined || body.resultUrl !== undefined) {
    await updateOrderAdminData(order_id, { adminNotes: body.adminNotes, resultUrl: body.resultUrl })
  }

  return NextResponse.json({ ok: true })
}
