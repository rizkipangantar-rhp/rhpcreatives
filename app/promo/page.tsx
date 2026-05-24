import PageHero from '@/components/PageHero'
import PromoContent from '@/components/PromoContent'
import { getActivePublicPromos, isPromoFull } from '@/lib/promos'

export default async function PromoPage() {
  let initialPromos: Parameters<typeof PromoContent>[0]['initialPromos'] = []
  try {
    const promos = await getActivePublicPromos()
    initialPromos = promos.map(p => ({
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
    }))
  } catch { /* fallback: PromoContent fetches client-side */ }

  return (
    <>
      <PageHero pageKey="promo" />
      <PromoContent initialPromos={initialPromos} />
    </>
  )
}
