import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByEmail, findUserByReferralCode, createUser, setUserReferredBy } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const { name, email, password, referralCode } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existing = findUserByEmail(normalizedEmail)
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = createUser({ name: name.trim(), email: normalizedEmail, hashedPassword })

    if (referralCode && typeof referralCode === 'string') {
      const normalized = referralCode.trim().toUpperCase()
      const referrer = findUserByReferralCode(normalized)
      if (referrer && referrer.id !== user.id) {
        setUserReferredBy(user.id, normalized)
      }
    }

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
