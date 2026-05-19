import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { countWaitingReview } from '@/lib/custom-orders'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ count: 0 })
  return NextResponse.json({ count: countWaitingReview() })
}
