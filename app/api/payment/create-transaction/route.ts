import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findPackageById, findServiceById } from '@/lib/packages'
import { createOrder } from '@/lib/orders'
import { findClaimByCode } from '@/lib/early-bird'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { packageId, name, email, wa, notes, voucherCode } = body as {
      packageId: string
      name: string
      email: string
      wa: string
      notes?: string
      voucherCode?: string
    }

    if (!packageId || !name || !email || !wa) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const pkg = findPackageById(packageId)
    if (!pkg) {
      return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 400 })
    }

    const svc = findServiceById(pkg.serviceId)
    if (!svc) {
      return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 400 })
    }

    let discountAmount = 0
    let appliedVoucher: string | undefined

    if (voucherCode) {
      const claim = findClaimByCode(voucherCode.toUpperCase())
      if (claim) {
        discountAmount = Math.round(pkg.price * 0.25)
        appliedVoucher = voucherCode.toUpperCase()
      }
    }

    const totalPrice = pkg.price - discountAmount

    const order = createOrder({
      userId: session.user.id,
      name,
      email,
      wa,
      serviceId: pkg.serviceId,
      packageId: pkg.id,
      serviceNameId: svc.nameId,
      serviceNameEn: svc.nameEn,
      packageNameId: pkg.nameId,
      packageNameEn: pkg.nameEn,
      originalPrice: pkg.price,
      discountAmount,
      totalPrice,
      voucherCode: appliedVoucher,
      notes: notes || undefined,
      status: 'pending',
    })

    console.log('[create-transaction] Order created:', order.orderId, '| amount:', totalPrice)

    return NextResponse.json({ orderId: order.orderId })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[create-transaction] FAILED:', message)
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 })
  }
}
