import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByEmail, findUserByReferralCode, createUser } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const { name, email, password, referralCode, termsAccepted } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
    }

    if (!termsAccepted) {
      return NextResponse.json({ error: 'Kamu harus setujui syarat & ketentuan dulu ya bestie! 😊' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await findUserByEmail(normalizedEmail)
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 409 })
    }

    // Validate referral code before creating user
    let validatedReferredBy: string | undefined
    if (referralCode && typeof referralCode === 'string') {
      const normalized = referralCode.trim().toUpperCase()
      const referrer = await findUserByReferralCode(normalized)
      if (referrer) {
        validatedReferredBy = normalized
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      hashedPassword,
      referredBy: validatedReferredBy,
      termsAccepted: true,
    })

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
