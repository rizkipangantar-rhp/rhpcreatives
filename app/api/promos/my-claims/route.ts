import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getClaimsByUser, getAllPromos } from '@/lib/promos'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [claims, promos] = await Promise.all([
      getClaimsByUser(session.user.id),
      getAllPromos(),
    ])
    const promoMap = new Map(promos.map(p => [p.id, p]))

    const result = claims.map(c => ({
      ...c,
      promo_name: promoMap.get(c.promo_id)?.name ?? c.promo_id,
      discount_type: promoMap.get(c.promo_id)?.discount_type ?? 'percent',
      discount_value: promoMap.get(c.promo_id)?.discount_value ?? 0,
    }))

    return NextResponse.json({ claims: result })
  } catch {
    return NextResponse.json({ claims: [] })
  }
}
