import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRequestById, updateRequest, pushStatusHistory } from '@/lib/custom-orders'
import { createOrder } from '@/lib/orders'
import { findClaim, markCodeUsed } from '@/lib/early-bird'
import { findUserById, useReferralReward, getUserReferralCode, findUserByReferralCode } from '@/lib/users'
import { hasUserUsedReferral, recordReferralUsage } from '@/lib/referral'

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

  if (request.offer_expires_at && Date.now() > new Date(request.offer_expires_at).getTime()) {
    return NextResponse.json({ error: 'Penawaran sudah kadaluarsa' }, { status: 400 })
  }

  const { final_price, base_price, discount_amount } = request.pricing
  if (!final_price) return NextResponse.json({ error: 'Invalid pricing' }, { status: 400 })

  let body: { discount_mode?: string } = {}
  try { body = await req.json() } catch { /* no body */ }

  const discountMode = body.discount_mode ?? 'none'
  const currentUser = await findUserById(session.user.id)

  let extraDiscount = 0
  let appliedVoucher: string | undefined = request.voucher_code ?? undefined
  let discountType: 'early_bird' | 'referral_invitee' | 'referral_referrer' | null = null
  let referralCodeUsed: string | undefined
  let referrerId: string | undefined
  let ebirdCode: string | undefined

  if (discountMode === 'early_bird') {
    const claim = await findClaim(session.user.id)
    if (claim && !claim.usedAt) {
      extraDiscount = Math.round(final_price * 0.25)
      discountType = 'early_bird'
      appliedVoucher = claim.voucherCode
      ebirdCode = claim.voucherCode
    }
  } else if (discountMode === 'referrer_reward' && currentUser) {
    const consumed = await useReferralReward(session.user.id)
    if (consumed) {
      extraDiscount = Math.round(final_price * 0.15)
      discountType = 'referral_referrer'
      appliedVoucher = getUserReferralCode(currentUser)
    }
  } else if (discountMode === 'invitee' && currentUser?.referredBy) {
    const referrer = await findUserByReferralCode(currentUser.referredBy)
    if (referrer && !await hasUserUsedReferral(session.user.id)) {
      extraDiscount = Math.round(final_price * 0.10)
      discountType = 'referral_invitee'
      referralCodeUsed = currentUser.referredBy
      referrerId = referrer.id
      appliedVoucher = currentUser.referredBy
    }
  }

  const totalFinal = final_price - extraDiscount

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
    discountAmount: (discount_amount ?? 0) + extraDiscount,
    totalPrice: totalFinal,
    voucherCode: appliedVoucher,
    discountType: discountType ?? undefined,
    referralCodeUsed,
    referrerId,
    notes: request.service.description,
    status: 'pending',
  })

  // Post-order side effects
  if (ebirdCode) await markCodeUsed(ebirdCode, order.orderId)
  if (discountMode === 'invitee' && referralCodeUsed) {
    await recordReferralUsage(session.user.id, referralCodeUsed, order.orderId)
  }

  await updateRequest(request_id, { order_id: order.orderId, status: 'payment_pending' })
  await pushStatusHistory(request_id, 'payment_pending', 'Customer accepted the offer')

  return NextResponse.json({ order_id: order.orderId })
}
