import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPromoById, updatePromo } from '@/lib/promos'
import { dbGet, dbSet } from '@/lib/store'
import type { PromoClaim } from '@/lib/promos'

const CLAIMS_KEY = 'rhp:promo_claims'

export async function POST(
  _req: Request,
  { params }: { params: { promo_id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const promo = await getPromoById(params.promo_id)
  if (!promo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data = await dbGet<{ claims: PromoClaim[] }>(CLAIMS_KEY, 'promo-claims.json', { claims: [] })
  const remaining = (data.claims ?? []).filter(c => c.promo_id !== params.promo_id)
  await dbSet(CLAIMS_KEY, 'promo-claims.json', { claims: remaining })

  await updatePromo(params.promo_id, { claimed: 0, used: 0 })

  return NextResponse.json({ ok: true })
}
