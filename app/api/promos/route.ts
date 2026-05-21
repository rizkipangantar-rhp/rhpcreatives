import { NextResponse } from 'next/server'
import { getActivePublicPromos, isPromoFull } from '@/lib/promos'

export async function GET() {
  try {
    const promos = await getActivePublicPromos()
    return NextResponse.json({
      promos: promos.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        discount_type: p.discount_type,
        discount_value: p.discount_value,
        quota: p.quota,
        claimed: p.claimed,
        remaining: p.quota === 0 ? null : Math.max(0, p.quota - p.claimed),
        is_full: isPromoFull(p),
        end_date: p.end_date,
        requires_claim: p.requires_claim,
        show_on_website: p.show_on_website,
        announcement_text_id: p.announcement_text_id,
        announcement_text_en: p.announcement_text_en,
        theme_color: p.theme_color,
        priority: p.priority,
      })),
    })
  } catch {
    return NextResponse.json({ promos: [] })
  }
}
