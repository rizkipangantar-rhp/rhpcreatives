import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findClaimByCode, isCodeUsed } from '@/lib/early-bird'
import { findUserByReferralCode, findUserById } from '@/lib/users'
import { hasUserUsedReferral } from '@/lib/referral'

export async function POST(req: Request) {
  try {
    const { code } = await req.json() as { code: string }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Kode tidak valid' })
    }

    const normalized = code.trim().toUpperCase()

    // Early Bird voucher
    if (normalized.startsWith('EBIRD-')) {
      if (normalized.length < 10) {
        return NextResponse.json({ valid: false, message: 'Format kode tidak valid' })
      }

      const claim = findClaimByCode(normalized)
      if (!claim) {
        return NextResponse.json({ valid: false, message: 'Kode voucher tidak ditemukan' })
      }

      if (isCodeUsed(normalized)) {
        return NextResponse.json({ valid: false, message: 'Kode Early Bird kamu udah kepake nih! Satu kode cuma bisa dipakai sekali ya bestie 😅' })
      }

      return NextResponse.json({
        valid: true,
        type: 'ebird',
        discount: 0.25,
        message: 'Voucher Early Bird berhasil! Diskon 25%',
      })
    }

    // Referral code (manual entry)
    if (normalized.startsWith('RHP-')) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ valid: false, message: 'Login dulu untuk pakai kode referral' })
      }

      const referrer = findUserByReferralCode(normalized)
      if (!referrer) {
        return NextResponse.json({ valid: false, message: 'Kode referral tidak ditemukan' })
      }

      if (referrer.id === session.user.id) {
        return NextResponse.json({ valid: false, message: 'Tidak bisa pakai kode referral sendiri' })
      }

      // Check if user is trying to use this as an invitee discount (first order only)
      const currentUser = findUserById(session.user.id)
      if (!currentUser) {
        return NextResponse.json({ valid: false, message: 'User tidak ditemukan' })
      }

      if (hasUserUsedReferral(session.user.id)) {
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
