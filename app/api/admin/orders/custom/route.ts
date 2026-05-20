import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createOrder } from '@/lib/orders'
import { findUserByEmail } from '@/lib/users'
import { SERVICES } from '@/lib/packages'

type Body = {
  name: string
  email: string
  wa: string
  serviceId: string
  packageId: string
  customServiceName?: string
  customPackageName?: string
  price: number
  notes?: string
  status: 'paid' | 'processing' | 'completed' | 'pending'
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const role = session.user.role
  if (role !== 'super_admin' && role !== 'admin' && role !== 'cs') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as Body
  const { name, email, wa, serviceId, packageId, price, notes, status } = body

  if (!name || !email || !wa || !serviceId || !packageId || !price) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  const svc = SERVICES.find(s => s.id === serviceId)
  const pkg = svc?.packages.find(p => p.id === packageId)

  const serviceNameId = body.customServiceName ?? svc?.nameId ?? serviceId
  const serviceNameEn = svc?.nameEn ?? serviceId
  const packageNameId = body.customPackageName ?? pkg?.nameId ?? packageId
  const packageNameEn = pkg?.nameEn ?? packageId

  const existingUser = await findUserByEmail(email)
  const userId = existingUser?.id ?? `custom_${Date.now()}`

  const order = await createOrder({
    userId,
    name,
    email,
    wa,
    serviceId,
    packageId,
    serviceNameId,
    serviceNameEn,
    packageNameId,
    packageNameEn,
    originalPrice: price,
    discountAmount: 0,
    totalPrice: price,
    notes,
    status,
  })

  return NextResponse.json({ order })
}
