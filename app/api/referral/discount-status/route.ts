import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findUserById, getUserReferralCode } from '@/lib/users'
import { hasUserUsedReferral } from '@/lib/referral'
import { getActiveClaimsForUser } from '@/lib/promos'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [user, isFirstOrder, promoDiscounts] = await Promise.all([
    findUserById(session.user.id),
    hasUserUsedReferral(session.user.id).then(used => !used),
    getActiveClaimsForUser(session.user.id),
  ])
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const inviteeDiscount = {
    available: !!(user.referredBy && isFirstOrder),
    code: user.referredBy ?? null,
    percent: 10,
  }

  const referrerReward = {
    available: (user.referralRewardsAvailable ?? 0) > 0,
    count: user.referralRewardsAvailable ?? 0,
    percent: 15,
    code: getUserReferralCode(user),
  }

  // Legacy earlyBird shape — backed by new promo system
  const ebClaim = promoDiscounts.find(c => c.promo_id === 'promo_early_bird')
  const earlyBird = {
    available: !!ebClaim,
    used: false,
    percent: ebClaim?.promo.discount_value ?? 25,
    voucher_code: ebClaim?.voucher_code,
  }

  // All active promo claims for this user
  const promoDiscountsFormatted = promoDiscounts.map(c => ({
    claim_id: c.claim_id,
    promo_id: c.promo_id,
    promo_name: c.promo.name,
    discount_type: c.promo.discount_type,
    discount_value: c.promo.discount_value,
    voucher_code: c.voucher_code,
    status: c.status,
  }))

  return NextResponse.json({ inviteeDiscount, referrerReward, earlyBird, promoDiscounts: promoDiscountsFormatted })
}
