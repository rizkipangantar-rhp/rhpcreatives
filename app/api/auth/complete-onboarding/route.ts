import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { completeOnboarding, findUserByReferralCode } from '@/lib/users'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { referralCode, termsAccepted } = await req.json() as { referralCode?: string; termsAccepted?: boolean }

  let referredBy: string | undefined
  if (referralCode && typeof referralCode === 'string') {
    const normalized = referralCode.trim().toUpperCase()
    if (normalized.startsWith('RHP-')) {
      const referrer = await findUserByReferralCode(normalized)
      if (referrer && referrer.id !== session.user.id) {
        referredBy = normalized
      }
    }
  }

  await completeOnboarding(session.user.id, referredBy, termsAccepted)
  return NextResponse.json({ ok: true })
}
