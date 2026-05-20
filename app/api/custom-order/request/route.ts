import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createRequest, type ServiceCategory } from '@/lib/custom-orders'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    name: string
    whatsapp: string
    category: ServiceCategory
    serviceName: string
    packageName: string
    description: string
    reference?: string
    deadline?: string
    voucherCode?: string
  }

  const { name, whatsapp, category, serviceName, packageName, description } = body
  if (!name || !whatsapp || !category || !serviceName || !packageName || !description) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  const request = await createRequest({
    user_id: session.user.id,
    order_id: null,
    customer: {
      name,
      email: session.user.email,
      whatsapp,
    },
    service: {
      category,
      name: serviceName,
      package: packageName,
      description,
      reference: body.reference || undefined,
      deadline: body.deadline || undefined,
    },
    voucher_code: body.voucherCode || null,
    pricing: {
      base_price: null,
      discount_type: null,
      discount_value: 0,
      discount_amount: 0,
      final_price: null,
      estimated_days: null,
    },
    notes: {},
    status: 'waiting_review',
    offer_expires_at: null,
  })

  return NextResponse.json({ request_id: request.request_id })
}
