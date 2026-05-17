import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { updateOrderStatus, getOrderById, type OrderStatus } from '@/lib/orders'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body as {
      order_id: string
      status_code: string
      gross_amount: string
      signature_key: string
      transaction_status: string
    }

    // Verify Midtrans signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? ''
    const expected = crypto
      .createHash('sha512')
      .update(order_id + status_code + gross_amount + serverKey)
      .digest('hex')

    if (expected !== signature_key) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 })
    }

    const order = getOrderById(order_id)
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    let newStatus: OrderStatus = 'pending'
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      newStatus = 'paid'
    } else if (transaction_status === 'pending') {
      newStatus = 'pending'
    } else if (['deny', 'expire', 'cancel'].includes(transaction_status)) {
      newStatus = 'cancelled'
    }

    updateOrderStatus(order_id, newStatus)

    return NextResponse.json({ message: 'OK' })
  } catch (err) {
    console.error('notification error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
