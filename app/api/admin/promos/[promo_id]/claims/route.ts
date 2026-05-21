import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getClaimsByPromo, getPromoById } from '@/lib/promos'

export async function GET(
  _req: Request,
  { params }: { params: { promo_id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [promo, claims] = await Promise.all([
    getPromoById(params.promo_id),
    getClaimsByPromo(params.promo_id),
  ])

  if (!promo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ promo, claims })
}
