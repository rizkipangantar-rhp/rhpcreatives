import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, updateOrderStatus } from '@/lib/orders'
import { checkTransactionStatus } from '@/lib/payment'
import { getRequestByOrderId, updateRequest, pushStatusHistory } from '@/lib/custom-orders'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params
  const session = await getServerSession(authOptions)

  const order = await getOrderById(order_id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const isAdmin = !!session?.user?.isAdmin
  const isOwner = session?.user?.id === order.userId

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // For local dev: if order is still pending and has a midtransOrderId, sync status from Midtrans
  if (order.status === 'pending' && order.midtransOrderId) {
    try {
      const txStatus = await checkTransactionStatus(order.midtransOrderId)
      const s = txStatus.transaction_status
      const fraud = txStatus.fraud_status

      if (s === 'settlement' || (s === 'capture' && fraud === 'accept')) {
        await updateOrderStatus(order_id, 'paid')
        const customReq = await getRequestByOrderId(order_id)
        if (customReq && customReq.status !== 'paid') {
          await updateRequest(customReq.request_id, { status: 'paid' })
          await pushStatusHistory(customReq.request_id, 'paid', 'Pembayaran diterima')
        }
        const updated = await getOrderById(order_id)
        return NextResponse.json(updated)
      } else if (s === 'expire' || s === 'cancel' || s === 'deny') {
        await updateOrderStatus(order_id, 'cancelled')
        const customReq = await getRequestByOrderId(order_id)
        if (customReq && customReq.status === 'payment_pending') {
          await pushStatusHistory(customReq.request_id, 'payment_pending', 'Pembayaran gagal/dibatalkan')
        }
        const updated = await getOrderById(order_id)
        return NextResponse.json(updated)
      }
    } catch {
      // Midtrans check failed (e.g., no transaction yet) — return current local state
    }
  }

  return NextResponse.json(order)
}
