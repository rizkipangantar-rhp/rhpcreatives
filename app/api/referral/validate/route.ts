import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findUserByReferralCode } from '@/lib/users'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')?.trim().toUpperCase() ?? ''

  if (!code.startsWith('RHP-') || code.length < 6) {
    return NextResponse.json({ valid: false })
  }

  const referrer = findUserByReferralCode(code)
  const valid = !!referrer && referrer.id !== session?.user?.id
  return NextResponse.json({ valid })
}
