import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, updateOrderPaymentInfo } from '@/lib/orders'
import {
  chargeBankTransfer,
  chargeQRIS,
  chargeGoPay,
  chargeShopeePay,
} from '@/lib/payment'
import { findPackageById, findServiceById } from '@/lib/packages'

type ChargeBody = {
  orderId: string
  method: 'bank_transfer' | 'qris' | 'gopay' | 'shopeepay'
  bank?: 'cimb' | 'bni' | 'bri' | 'mandiri' | 'permata'
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { orderId, method, bank } = (await req.json()) as ChargeBody

    if (!orderId || !method) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const order = await getOrderById(orderId)
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

    // Midtrans order_id max = 50 chars. Use short method codes + 6-char base36 timestamp.
    const methodCode: Record<string, string> = {
      bank_transfer: 'bt', qris: 'qr', gopay: 'gp', shopeepay: 'sp',
    }
    const ts = Date.now().toString(36).slice(-6)
    const midtransOrderId = `${orderId}-${methodCode[method] ?? method}${bank ? `-${bank}` : ''}-${ts}`

    console.log('[charge] midtransOrderId:', midtransOrderId, '(', midtransOrderId.length, 'chars)')

    const chargeBase = {
      midtransOrderId,
      grossAmount: order.totalPrice,
      customerName: order.name,
      customerEmail: order.email,
      customerPhone: order.wa,
      itemId: order.packageId,
      itemName: `${svc?.nameId ?? order.serviceId} - ${pkg?.nameId ?? order.packageId}`,
    }

    console.log('[charge] Creating', method, bank ?? '', 'for order', orderId, '→ midtrans id:', midtransOrderId)

    let responseData: Record<string, unknown> = {}

    if (method === 'bank_transfer') {
      if (!bank) return NextResponse.json({ error: 'Bank diperlukan' }, { status: 400 })
      const result = await chargeBankTransfer({ ...chargeBase, bank })

      let va: string | undefined
      let billerCode: string | undefined
      let billKey: string | undefined

      if (bank === 'permata') {
        va = result.permata_va_number
      } else if (bank === 'mandiri') {
        billerCode = result.biller_code
        billKey = result.bill_key
      } else {
        va = result.va_numbers?.[0]?.va_number
      }

      await updateOrderPaymentInfo(orderId, {
        midtransOrderId,
        paymentMethod: 'bank_transfer',
        paymentBank: bank,
        paymentVa: va,
        paymentBillerCode: billerCode,
        paymentBillKey: billKey,
        paymentExpiry: result.expiry_time,
      })

      responseData = { method, bank, va, billerCode, billKey, expiry: result.expiry_time, midtransOrderId }

    } else if (method === 'qris') {
      const result = await chargeQRIS(chargeBase)
      const qrAction = result.actions?.find(a => a.name === 'generate-qr-code')
      const qrUrl = qrAction?.url

      await updateOrderPaymentInfo(orderId, {
        midtransOrderId,
        paymentMethod: 'qris',
        paymentQrUrl: qrUrl,
        paymentExpiry: result.expiry_time,
      })

      responseData = { method, qrUrl, expiry: result.expiry_time, midtransOrderId }

    } else if (method === 'gopay') {
      const result = await chargeGoPay(chargeBase)
      const qrAction = result.actions?.find(a => a.name === 'generate-qr-code')
      const deepLinkAction = result.actions?.find(a => a.name === 'deeplink-redirect')

      await updateOrderPaymentInfo(orderId, {
        midtransOrderId,
        paymentMethod: 'gopay',
        paymentQrUrl: qrAction?.url,
        paymentDeepLink: deepLinkAction?.url,
        paymentExpiry: result.expiry_time,
      })

      responseData = {
        method,
        qrUrl: qrAction?.url,
        deepLink: deepLinkAction?.url,
        expiry: result.expiry_time,
        midtransOrderId,
      }

    } else if (method === 'shopeepay') {
      const result = await chargeShopeePay(chargeBase)
      const deepLinkAction = result.actions?.find(a => a.name === 'deeplink-redirect')
      const qrAction = result.actions?.find(a => a.name === 'generate-qr-code')

      await updateOrderPaymentInfo(orderId, {
        midtransOrderId,
        paymentMethod: 'shopeepay',
        paymentQrUrl: qrAction?.url,
        paymentDeepLink: deepLinkAction?.url,
        paymentExpiry: result.expiry_time,
      })

      responseData = {
        method,
        qrUrl: qrAction?.url,
        deepLink: deepLinkAction?.url,
        expiry: result.expiry_time,
        midtransOrderId,
      }
    }

    return NextResponse.json(responseData)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const midtransResponse = (err as { ApiResponse?: unknown })?.ApiResponse
    console.error('[charge] FAILED:', { message, midtransResponse })
    return NextResponse.json({ error: 'Server error', detail: message, midtransResponse }, { status: 500 })
  }
}
