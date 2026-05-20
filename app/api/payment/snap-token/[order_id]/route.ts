import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, updateOrderPaymentInfo } from '@/lib/orders'
import { createCCSnapToken } from '@/lib/payment'
import { findPackageById, findServiceById } from '@/lib/packages'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const order = await getOrderById(order_id)
    if (!order) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
    }
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (order.status === 'paid' || order.status === 'completed') {
      return NextResponse.json({ error: 'Order sudah dibayar' }, { status: 400 })
    }

    const pkg = findPackageById(order.packageId)
    const svc = findServiceById(order.serviceId)

    const ts = Date.now().toString(36).slice(-6)
    const midtransOrderId = `${order_id}-cc-${ts}`

    const result = await createCCSnapToken({
      orderId: midtransOrderId,
      grossAmount: order.totalPrice,
      customerName: order.name,
      customerEmail: order.email,
      customerPhone: order.wa,
      itemId: order.packageId,
      itemName: `${svc?.nameId ?? order.serviceId} - ${pkg?.nameId ?? order.packageId}`,
      itemPrice: order.totalPrice,
    })

    await updateOrderPaymentInfo(order_id, {
      midtransOrderId,
      paymentMethod: 'credit_card',
    })

    return NextResponse.json({ snapToken: result.token, midtransOrderId })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const midtransResponse = (err as { ApiResponse?: unknown })?.ApiResponse
    console.error('[snap-token] FAILED:', { message, midtransResponse })
    return NextResponse.json({ error: 'Server error', detail: message, midtransResponse }, { status: 500 })
  }
}
