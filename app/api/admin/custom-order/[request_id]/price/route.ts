import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRequestById, updateRequest, pushStatusHistory, type DiscountType } from '@/lib/custom-orders'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ request_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { request_id } = await params
  const request = await getRequestById(request_id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json() as {
    base_price: number
    discount_type: DiscountType
    discount_value: number
    estimated_days: number
    for_customer?: string
    internal?: string
  }

  const { base_price, discount_type, discount_value, estimated_days } = body
  if (!base_price || base_price <= 0) return NextResponse.json({ error: 'Invalid price' }, { status: 400 })

  let discount_amount = 0
  if (discount_type === 'percent' && discount_value > 0) {
    discount_amount = Math.round(base_price * discount_value / 100)
  } else if (discount_type === 'nominal' && discount_value > 0) {
    discount_amount = Math.min(discount_value, base_price)
  }
  const final_price = base_price - discount_amount

  // Offer expires 48 hours from now
  const offer_expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  await updateRequest(request_id, {
    pricing: {
      base_price,
      discount_type: discount_type || null,
      discount_value: discount_value || 0,
      discount_amount,
      final_price,
      estimated_days: estimated_days || null,
    },
    notes: {
      ...request.notes,
      for_customer: body.for_customer || undefined,
      internal: body.internal || undefined,
    },
    offer_expires_at,
    status: 'price_sent',
  })
  await pushStatusHistory(request_id, 'price_sent', 'Admin sent price offer')

  return NextResponse.json({ ok: true })
}
