import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { updateOrderStatus, getOrderById, type OrderStatus } from '@/lib/orders'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body as {
      order_id: string
      status_code: string
      gross_amount: string
      signature_key: string
      transaction_status: string
      fraud_status?: string
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? ''
    const expected = crypto
      .createHash('sha512')
      .update(order_id + status_code + gross_amount + serverKey)
      .digest('hex')

    if (expected !== signature_key) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 })
    }

    // order_id from Midtrans is the midtransOrderId (e.g. RHP-20260517-XXXXX-bt-bca-abc123)
    // We need to find our actual order by matching the midtransOrderId prefix
    // The actual orderId is everything before the last payment suffix
    // Pattern: {orderId}-{method}-{ts} or {orderId}-{method}-{bank}-{ts}
    // Our orderId format: RHP-YYYYMMDD-XXXXX
    const orderIdMatch = order_id.match(/^(RHP-\d{8}-[A-Z0-9]{5})/)
    const actualOrderId = orderIdMatch?.[1] ?? order_id

    const order = await getOrderById(actualOrderId)
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    let newStatus: OrderStatus = 'pending'
    if (transaction_status === 'settlement') {
      newStatus = 'paid'
    } else if (transaction_status === 'capture' && fraud_status === 'accept') {
      newStatus = 'paid'
    } else if (transaction_status === 'pending') {
      newStatus = 'pending'
    } else if (['deny', 'expire', 'cancel'].includes(transaction_status)) {
      newStatus = 'cancelled'
    }

    await updateOrderStatus(actualOrderId, newStatus)

    return NextResponse.json({ message: 'OK' })
  } catch (err) {
    console.error('notification error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
