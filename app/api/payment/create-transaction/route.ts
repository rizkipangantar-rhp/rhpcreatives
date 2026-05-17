import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findPackageById, findServiceById } from '@/lib/packages'
import { createOrder } from '@/lib/orders'
import { createSnapTransaction } from '@/lib/payment'
import { findClaimByCode } from '@/lib/early-bird'

const ADMIN_WA = '6285179992598'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Debug: confirm env vars are readable at request time ──
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? ''
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''
  console.log('[create-transaction] Server Key exists:', !!serverKey.trim())
  console.log('[create-transaction] Server Key prefix:', serverKey.trim().substring(0, 10))
  console.log('[create-transaction] Client Key prefix:', clientKey.trim().substring(0, 10))
  console.log('[create-transaction] isProduction env:', process.env.MIDTRANS_IS_PRODUCTION)

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

    // Validate voucher
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

    // Create order record first
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

    // Create Midtrans Snap transaction
    const snapResult = await createSnapTransaction({
      orderId: order.orderId,
      grossAmount: totalPrice,
      customerName: name,
      customerEmail: email,
      customerPhone: wa,
      itemId: pkg.id,
      itemName: `${svc.nameId} - ${pkg.nameId}`,
      itemPrice: totalPrice,
    })

    console.log('[create-transaction] Snap token received for order:', order.orderId)

    const waMessage = encodeURIComponent(
      `🛒 ORDER BARU!\n\nOrder ID: ${order.orderId}\nLayanan: ${svc.nameId} - ${pkg.nameId}\nNama: ${name}\nEmail: ${email}\nWA: ${wa}\nTotal: Rp${totalPrice.toLocaleString('id-ID')}${appliedVoucher ? `\nVoucher: ${appliedVoucher}` : ''}${notes ? `\nCatatan: ${notes}` : ''}`
    )

    return NextResponse.json({
      orderId: order.orderId,
      snapToken: snapResult.token,
      adminWaUrl: `https://wa.me/${ADMIN_WA}?text=${waMessage}`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const midtransResponse = (err as { ApiResponse?: unknown })?.ApiResponse

    console.error('[create-transaction] FAILED:', {
      message,
      midtransResponse,
      serverKeyPresent: !!serverKey.trim(),
      serverKeyPrefix: serverKey.trim().substring(0, 10),
      isProduction: process.env.MIDTRANS_IS_PRODUCTION,
    })

    return NextResponse.json({
      error: 'Server error',
      detail: message,
      midtransResponse,
    }, { status: 500 })
  }
}
