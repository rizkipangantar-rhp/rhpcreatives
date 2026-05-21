import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPromoById, updatePromo, deletePromo, getClaimsByPromo } from '@/lib/promos'

export async function GET(
  _req: Request,
  { params }: { params: { promo_id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const promo = await getPromoById(params.promo_id)
  if (!promo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const claims = await getClaimsByPromo(params.promo_id)
  return NextResponse.json({ promo, claims })
}

export async function PUT(
  req: Request,
  { params }: { params: { promo_id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json() as Record<string, unknown>

    const updated = await updatePromo(params.promo_id, {
      name: typeof body.name === 'string' ? body.name.trim() : undefined,
      description: typeof body.description === 'string' ? body.description.trim() : undefined,
      prefix: typeof body.prefix === 'string' ? body.prefix.trim().toUpperCase() : undefined,
      discount_type: body.discount_type as 'percent' | 'nominal' | undefined,
      discount_value: body.discount_value != null ? Number(body.discount_value) : undefined,
      quota: body.quota != null ? Number(body.quota) : undefined,
      start_date: body.start_date !== undefined ? (body.start_date as string | null) : undefined,
      end_date: body.end_date !== undefined ? (body.end_date as string | null) : undefined,
      is_active: body.is_active != null ? Boolean(body.is_active) : undefined,
      show_on_website: body.show_on_website != null ? Boolean(body.show_on_website) : undefined,
      requires_claim: body.requires_claim != null ? Boolean(body.requires_claim) : undefined,
      announcement_text_id: typeof body.announcement_text_id === 'string' ? body.announcement_text_id.trim() : undefined,
      announcement_text_en: typeof body.announcement_text_en === 'string' ? body.announcement_text_en.trim() : undefined,
      theme_color: typeof body.theme_color === 'string' ? body.theme_color : undefined,
      priority: body.priority != null ? Number(body.priority) : undefined,
    })

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ promo: updated })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { promo_id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const ok = await deletePromo(params.promo_id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
