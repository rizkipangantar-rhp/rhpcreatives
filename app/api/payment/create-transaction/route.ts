import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findPackageById, findServiceById } from '@/lib/packages'
import { createOrder } from '@/lib/orders'
import { findClaim, findClaimByCode, isCodeUsed, markCodeUsed } from '@/lib/early-bird'
import { findUserByReferralCode, findUserById, useReferralReward, getUserReferralCode } from '@/lib/users'
import { hasUserUsedReferral, recordReferralUsage } from '@/lib/referral'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { packageId, name, email, wa, notes, voucherCode, discountMode } = body as {
      packageId: string
      name: string
      email: string
      wa: string
      notes?: string
      voucherCode?: string
      // 'referrer_reward' = 15% own reward | 'invitee' = 10% referral | 'ebird' = 25% early bird (auto) | undefined/none = no discount
      discountMode?: 'referrer_reward' | 'invitee' | 'ebird' | 'none'
    }

    if (!packageId || !name || !email || !wa) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const pkg = findPackageById(packageId)
    if (!pkg) return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 400 })

    const svc = findServiceById(pkg.serviceId)
    if (!svc) return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 400 })

    const currentUser = await findUserById(session.user.id)
    if (!currentUser) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 400 })

    let discountAmount = 0
    let appliedVoucher: string | undefined
    let discountType: 'early_bird' | 'referral_invitee' | 'referral_referrer' | null = null
    let referralCodeUsed: string | undefined
    let referrerId: string | undefined

    // ── 1. Referrer uses their own accumulated reward (15%)
    if (discountMode === 'referrer_reward') {
      const consumed = await useReferralReward(session.user.id)
      if (consumed) {
        discountAmount = Math.round(pkg.price * 0.15)
        discountType = 'referral_referrer'
        appliedVoucher = getUserReferralCode(currentUser)
      }
    }

    // ── 2. Invitee uses referral code (10%, first order only)
    else if (discountMode === 'invitee' || (!discountMode && currentUser.referredBy && !await hasUserUsedReferral(session.user.id))) {
      const codeToUse = (discountMode === 'invitee' && voucherCode)
        ? voucherCode.trim().toUpperCase()
        : currentUser.referredBy ?? ''

      if (codeToUse) {
        const referrer = await findUserByReferralCode(codeToUse)
        if (referrer && referrer.id !== session.user.id && !await hasUserUsedReferral(session.user.id)) {
          discountAmount = Math.round(pkg.price * 0.10)
          discountType = 'referral_invitee'
          referralCodeUsed = codeToUse
          referrerId = referrer.id
          appliedVoucher = codeToUse
        }
      }
    }

    // ── 3. Auto Early Bird (user selected early bird option, no voucher code required)
    else if (discountMode === 'ebird') {
      const claim = await findClaim(session.user.id)
      if (claim && !claim.usedAt) {
        discountAmount = Math.round(pkg.price * 0.25)
        discountType = 'early_bird'
        appliedVoucher = claim.voucherCode
      }
    }

    // ── 4. Legacy: manual voucher code entered in field
    else if (voucherCode && discountMode !== 'none') {
      const normalized = voucherCode.trim().toUpperCase()

      if (normalized.startsWith('EBIRD-')) {
        const claim = await findClaimByCode(normalized)
        if (claim && !await isCodeUsed(normalized)) {
          discountAmount = Math.round(pkg.price * 0.25)
          discountType = 'early_bird'
          appliedVoucher = normalized
        }
      } else if (normalized.startsWith('RHP-')) {
        const referrer = await findUserByReferralCode(normalized)
        if (referrer && referrer.id !== session.user.id && !await hasUserUsedReferral(session.user.id)) {
          discountAmount = Math.round(pkg.price * 0.10)
          discountType = 'referral_invitee'
          referralCodeUsed = normalized
          referrerId = referrer.id
          appliedVoucher = normalized
        }
      }
    }

    const totalPrice = pkg.price - discountAmount

    const order = await createOrder({
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
      discountType,
      referralCodeUsed,
      referrerId,
      notes: notes || undefined,
      status: 'pending',
    })

    // Post-order side effects
    if (discountType === 'early_bird' && appliedVoucher) {
      await markCodeUsed(appliedVoucher, order.orderId)
    }
    if (discountType === 'referral_invitee' && referralCodeUsed) {
      // Records usage and issues a +1 reward to the referrer
      await recordReferralUsage(session.user.id, referralCodeUsed, order.orderId)
    }

    console.log('[create-transaction] Order created:', order.orderId, '| amount:', totalPrice, '| discountType:', discountType)

    return NextResponse.json({ orderId: order.orderId })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[create-transaction] FAILED:', message)
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 })
  }
}
