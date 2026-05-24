import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRequestById, updateRequest, pushStatusHistory } from '@/lib/custom-orders'
import { createOrder } from '@/lib/orders'
import { findClaimByVoucherCode, markClaimUsed, getPromoById } from '@/lib/promos'

export async function PUT(
  req: Request,
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

  // Voucher validation
  let body: { voucher_code?: string } = {}
  try { body = await req.json() } catch { /* no body */ }

  let voucherDiscount = 0
  let appliedVoucher: string | undefined = request.voucher_code ?? undefined

  if (body.voucher_code) {
    const code = body.voucher_code.trim().toUpperCase()
    const claim = await findClaimByVoucherCode(code)
    if (!claim || claim.status !== 'active') {
      return NextResponse.json({ error: 'Voucher tidak valid atau sudah dipakai.', voucher_error: true }, { status: 400 })
    }
    const promo = await getPromoById(claim.promo_id)
    if (promo) {
      if (promo.discount_type === 'percent') {
        voucherDiscount = Math.round(final_price * promo.discount_value / 100)
      } else if (promo.discount_type === 'nominal') {
        voucherDiscount = Math.min(promo.discount_value, final_price)
      }
    }
    appliedVoucher = code
  }

  const totalAfterVoucher = final_price - voucherDiscount

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
    discountAmount: (discount_amount ?? 0) + voucherDiscount,
    totalPrice: totalAfterVoucher,
    voucherCode: appliedVoucher,
    notes: request.service.description,
    status: 'pending',
  })

  // Mark voucher as used
  if (body.voucher_code) {
    await markClaimUsed(body.voucher_code.trim().toUpperCase(), order.orderId)
  }

  // Link the order to the request
  await updateRequest(request_id, {
    order_id: order.orderId,
    status: 'payment_pending',
  })
  await pushStatusHistory(request_id, 'payment_pending', 'Customer accepted the offer')

  return NextResponse.json({ order_id: order.orderId })
}
