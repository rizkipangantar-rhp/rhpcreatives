import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRequestById, updateRequest, pushStatusHistory } from '@/lib/custom-orders'
import { createOrder } from '@/lib/orders'

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ request_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { request_id } = await params
  const request = await getRequestById(request_id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (request.user_id !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (request.status !== 'price_sent') return NextResponse.json({ error: 'Cannot accept at this stage' }, { status: 400 })

  // Check offer expiry
  if (request.offer_expires_at && Date.now() > new Date(request.offer_expires_at).getTime()) {
    return NextResponse.json({ error: 'Penawaran sudah kadaluarsa' }, { status: 400 })
  }

  const { final_price, base_price, discount_amount } = request.pricing

  if (!final_price) return NextResponse.json({ error: 'Invalid pricing' }, { status: 400 })

  // Create a regular order for payment
  const order = await createOrder({
    userId: request.user_id,
    name: request.customer.name,
    email: request.customer.email,
    wa: request.customer.whatsapp,
    serviceId: 'custom',
    packageId: `custom_${request_id}`,
    serviceNameId: request.service.name,
    serviceNameEn: request.service.name,
    packageNameId: request.service.package,
    packageNameEn: request.service.package,
    originalPrice: base_price ?? final_price,
    discountAmount: discount_amount ?? 0,
    totalPrice: final_price,
    voucherCode: request.voucher_code ?? undefined,
    notes: request.service.description,
    status: 'pending',
  })

  // Link the order to the request
  await updateRequest(request_id, {
    order_id: order.orderId,
    status: 'payment_pending',
  })
  await pushStatusHistory(request_id, 'payment_pending', 'Customer accepted the offer')

  return NextResponse.json({ order_id: order.orderId })
}
