import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findPackageById, findServiceById, GUEST_ADDONS, EARLY_BIRD_ELIGIBLE } from '@/lib/packages'
import { createOrder } from '@/lib/orders'
import { findClaim, findClaimByCode, isCodeUsed, markCodeUsed } from '@/lib/early-bird'
import { findClaimByVoucherCode, markClaimUsed, getPromoById } from '@/lib/promos'
import { findUserByReferralCode, findUserById, useReferralReward, getUserReferralCode } from '@/lib/users'
import { hasUserUsedReferral, recordReferralUsage } from '@/lib/referral'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { packageId, name, email, wa, notes, voucherCode, discountMode, addonId } = body as {
      packageId: string
      name: string
      email: string
      wa: string
      notes?: string
      voucherCode?: string
      discountMode?: 'referrer_reward' | 'invitee' | 'ebird' | 'promo' | 'none'
      addonId?: string
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
    let discountType: 'early_bird' | 'referral_invitee' | 'referral_referrer' | 'promo' | null = null
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

    // ── 3. Auto Early Bird (legacy mode — looks up early bird claim for user)
    else if (discountMode === 'ebird') {
      if (!EARLY_BIRD_ELIGIBLE.has(packageId)) {
        return NextResponse.json({ error: 'Diskon Early Bird gak berlaku untuk paket ini ya. Pilih paket Aesthetic atau Sultan biar bisa dapat diskon!' }, { status: 400 })
      }
      const claim = await findClaim(session.user.id)
      if (claim && !claim.usedAt) {
        discountAmount = Math.round(pkg.price * 0.25)
        discountType = 'early_bird'
        appliedVoucher = claim.voucherCode
      }
    }

    // ── 4. Generic promo voucher (new system)
    else if (discountMode === 'promo' && voucherCode) {
      const normalized = voucherCode.trim().toUpperCase()
      const claim = await findClaimByVoucherCode(normalized)
      if (claim && claim.status === 'active') {
        const promo = await getPromoById(claim.promo_id)
        if (promo && promo.is_active) {
          const amt = promo.discount_type === 'percent'
            ? Math.round(pkg.price * (promo.discount_value / 100))
            : Math.min(promo.discount_value, pkg.price)
          discountAmount = amt
          discountType = claim.promo_id === 'promo_early_bird' ? 'early_bird' : 'promo'
          appliedVoucher = normalized
        }
      }
    }

    // ── 5. Legacy: manual voucher code entered in field
    else if (voucherCode && discountMode !== 'none') {
      const normalized = voucherCode.trim().toUpperCase()

      if (normalized.startsWith('EBIRD-') || /^[A-Z]{2,10}-[A-Z0-9]{5}$/.test(normalized)) {
        const claim = await findClaimByVoucherCode(normalized)
        if (claim && claim.status === 'active') {
          const promo = await getPromoById(claim.promo_id)
          if (promo && promo.is_active) {
            const amt = promo.discount_type === 'percent'
              ? Math.round(pkg.price * (promo.discount_value / 100))
              : Math.min(promo.discount_value, pkg.price)
            discountAmount = amt
            discountType = claim.promo_id === 'promo_early_bird' ? 'early_bird' : 'promo'
            appliedVoucher = normalized
          }
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

    const addon = addonId ? GUEST_ADDONS.find(a => a.id === addonId) : undefined
    const addonPrice = addon?.price ?? 0
    const totalPrice = Math.max(0, pkg.price + addonPrice - discountAmount)

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
      addonId: addon?.id,
      addonPrice: addonPrice || undefined,
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
    if ((discountType === 'early_bird' || discountType === 'promo') && appliedVoucher) {
      await markClaimUsed(appliedVoucher, order.orderId)
    }
    if (discountType === 'referral_invitee' && referralCodeUsed) {
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
