import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllPromos, createPromo, getAllClaims, isPromoExpired, isPromoFull } from '@/lib/promos'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const [promos, claims] = await Promise.all([getAllPromos(), getAllClaims()])

    const totalActive = promos.filter(p => p.is_active && !isPromoExpired(p)).length
    const totalEnded = promos.filter(p => !p.is_active || isPromoExpired(p)).length
    const totalClaims = claims.length
    const totalDiscount = claims
      .filter(c => c.status === 'used')
      .length

    return NextResponse.json({ promos, stats: { totalActive, totalEnded, totalClaims, totalDiscount } })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json() as {
      name: string; description: string; prefix: string
      discount_type: 'percent' | 'nominal'; discount_value: number
      quota: number; start_date?: string | null; end_date?: string | null
      is_active: boolean; show_on_website: boolean; requires_claim: boolean
      announcement_text_id: string; announcement_text_en: string
      theme_color: string; priority: number
    }

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Nama promo harus diisi' }, { status: 400 })
    }
    if (!body.prefix?.trim()) {
      return NextResponse.json({ error: 'Prefix voucher harus diisi' }, { status: 400 })
    }

    const promo = await createPromo({
      name: body.name.trim(),
      description: body.description?.trim() ?? '',
      prefix: body.prefix.trim().toUpperCase(),
      discount_type: body.discount_type ?? 'percent',
      discount_value: Number(body.discount_value) || 0,
      quota: Number(body.quota) || 0,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      is_active: body.is_active ?? true,
      show_on_website: body.show_on_website ?? true,
      requires_claim: body.requires_claim ?? true,
      announcement_text_id: body.announcement_text_id?.trim() ?? '',
      announcement_text_en: body.announcement_text_en?.trim() ?? '',
      theme_color: body.theme_color ?? '#8b5cf6',
      priority: Number(body.priority) || 1,
    })

    return NextResponse.json({ promo })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
