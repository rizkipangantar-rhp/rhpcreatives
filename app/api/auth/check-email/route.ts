import { NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/users'

export async function POST(req: Request) {
  const { email } = await req.json() as { email?: string }
  if (!email) return NextResponse.json({ exists: false })
  const user = await findUserByEmail(email)
  return NextResponse.json({
    exists: !!user,
    provider: user?.provider ?? null,
  })
}
