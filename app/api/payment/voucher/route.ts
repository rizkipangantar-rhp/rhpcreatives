import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findClaimByVoucherCode, getPromoById } from '@/lib/promos'
import { findUserByReferralCode, findUserById } from '@/lib/users'
import { hasUserUsedReferral } from '@/lib/referral'

export async function POST(req: Request) {
  try {
    const { code } = await req.json() as { code: string }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Kode tidak valid' })
    }

    const normalized = code.trim().toUpperCase()

    // Promo voucher (any prefix with format XXXX-XXXXX)
    const promoVoucherMatch = /^([A-Z]{2,10})-[A-Z0-9]{5}$/.exec(normalized)
    if (promoVoucherMatch) {
      const claim = await findClaimByVoucherCode(normalized)
      if (!claim) {
        return NextResponse.json({ valid: false, message: 'Kode voucher tidak ditemukan' })
      }
      if (claim.status === 'used') {
        return NextResponse.json({ valid: false, message: 'Kode voucher ini sudah dipakai. Satu kode hanya bisa dipakai sekali ya 😊' })
      }

      const promo = await getPromoById(claim.promo_id)
      if (!promo || !promo.is_active) {
        return NextResponse.json({ valid: false, message: 'Promo sudah tidak aktif' })
      }

      const discountDisplay = promo.discount_type === 'percent'
        ? `${promo.discount_value}%`
        : `Rp${promo.discount_value.toLocaleString('id-ID')}`

      return NextResponse.json({
        valid: true,
        type: 'promo',
        promo_id: promo.id,
        discount_type: promo.discount_type,
        discount: promo.discount_type === 'percent' ? promo.discount_value / 100 : promo.discount_value,
        message: `Voucher ${promo.name} berhasil! Diskon ${discountDisplay}`,
      })
    }

    // Referral code (manual entry)
    if (normalized.startsWith('RHP-')) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ valid: false, message: 'Login dulu untuk pakai kode referral' })
      }

      const referrer = await findUserByReferralCode(normalized)
      if (!referrer) {
        return NextResponse.json({ valid: false, message: 'Kode referral tidak ditemukan' })
      }

      if (referrer.id === session.user.id) {
        return NextResponse.json({ valid: false, message: 'Tidak bisa pakai kode referral sendiri' })
      }

      const currentUser = await findUserById(session.user.id)
      if (!currentUser) {
        return NextResponse.json({ valid: false, message: 'User tidak ditemukan' })
      }

      if (await hasUserUsedReferral(session.user.id)) {
        return NextResponse.json({ valid: false, message: 'Kamu udah pernah pakai kode referral sebelumnya ya! Kode referral cuma buat order pertama 😊' })
      }

      return NextResponse.json({
        valid: true,
        type: 'referral',
        discount: 0.10,
        message: 'Kode referral berhasil! Diskon 10%',
      })
    }

    return NextResponse.json({ valid: false, message: 'Format kode tidak valid' })
  } catch {
    return NextResponse.json({ valid: false, message: 'Terjadi kesalahan' })
  }
}
