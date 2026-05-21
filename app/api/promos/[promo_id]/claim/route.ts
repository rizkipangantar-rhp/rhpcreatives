import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { claimPromo, getPromoById, isPromoAvailable } from '@/lib/promos'
import { normalizeWa } from '@/lib/wa'

export async function POST(
  req: Request,
  { params }: { params: { promo_id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json() as { name?: string; whatsapp?: string; service_interest?: string }
    const { name, whatsapp, service_interest } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nama harus diisi' }, { status: 400 })
    }

    const promo = await getPromoById(params.promo_id)
    if (!promo) {
      return NextResponse.json({ error: 'Promo tidak ditemukan' }, { status: 404 })
    }
    if (!isPromoAvailable(promo)) {
      return NextResponse.json({ error: 'promo_unavailable' }, { status: 409 })
    }

    const claim = await claimPromo(
      params.promo_id,
      session.user.id,
      session.user.email ?? '',
      name.trim(),
      normalizeWa(whatsapp ?? ''),
      service_interest?.trim() ?? ''
    )

    return NextResponse.json({ claim })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg === 'already_claimed') {
      return NextResponse.json({ error: 'already_claimed' }, { status: 409 })
    }
    if (msg === 'promo_unavailable') {
      return NextResponse.json({ error: 'promo_unavailable' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
