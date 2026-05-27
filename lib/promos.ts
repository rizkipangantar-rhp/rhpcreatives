import { dbGet, dbSet } from '@/lib/store'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DiscountType = 'percent' | 'nominal'
export type ClaimStatus = 'active' | 'used' | 'expired'

export interface Promo {
  id: string
  name: string
  description: string
  prefix: string
  discount_type: DiscountType
  discount_value: number
  quota: number         // 0 = unlimited
  claimed: number       // total claims ever
  used: number          // claims applied to orders
  start_date: string | null
  end_date: string | null
  is_active: boolean
  show_on_website: boolean
  requires_claim: boolean
  announcement_text_id: string
  announcement_text_en: string
  theme_color: string
  priority: number      // higher = shown first in bar/popup
  created_at: string
  waitlist: WaitlistEntry[]
}

export interface PromoClaim {
  claim_id: string
  promo_id: string
  user_id: string
  email: string
  name: string
  whatsapp: string
  service_interest: string
  voucher_code: string
  status: ClaimStatus
  order_id: string | null
  claimed_at: string
  used_at: string | null
  expires_at: string | null
}

export interface WaitlistEntry {
  email: string
  whatsapp: string
  added_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CLAIM_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

// ─── Redis keys ───────────────────────────────────────────────────────────────

const PROMOS_KEY = 'rhp:promos'
const CLAIMS_KEY = 'rhp:promo_claims'

// ─── Storage helpers ──────────────────────────────────────────────────────────

async function readPromos(): Promise<Promo[]> {
  const d = await dbGet<{ promos: Promo[] }>(PROMOS_KEY, 'promos.json', { promos: [] })
  return d.promos ?? []
}

async function writePromos(promos: Promo[]): Promise<void> {
  await dbSet(PROMOS_KEY, 'promos.json', { promos })
}

async function readClaims(): Promise<PromoClaim[]> {
  const d = await dbGet<{ claims: PromoClaim[] }>(CLAIMS_KEY, 'promo-claims.json', { claims: [] })
  return d.claims ?? []
}

async function writeClaims(claims: PromoClaim[]): Promise<void> {
  await dbSet(CLAIMS_KEY, 'promo-claims.json', { claims })
}

// ─── Migration from early-bird ────────────────────────────────────────────────

type OldEarlyBirdData = {
  claims: Array<{
    userId: string; name: string; email: string; wa?: string
    service: string; voucherCode: string; claimedAt: string
    usedOrderId?: string; usedAt?: string
  }>
  waitlist: Array<{ email: string; wa: string; addedAt: string }>
}

async function runMigrationIfNeeded(): Promise<void> {
  const promos = await readPromos()
  if (promos.length > 0) return

  const old = await dbGet<OldEarlyBirdData>('rhp:early-bird', 'early-bird.json', { claims: [], waitlist: [] })

  const EXPIRY_MS = 24 * 60 * 60 * 1000
  function wasExpired(c: OldEarlyBirdData['claims'][0]): boolean {
    if (c.usedAt) return false
    return Date.now() - new Date(c.claimedAt).getTime() > EXPIRY_MS
  }
  const activeOld = old.claims.filter(c => !wasExpired(c))

  const earlyBird: Promo = {
    id: 'promo_early_bird',
    name: 'Early Bird Launch',
    description: 'Diskon 25% buat semua layanan, tapi cuma 20 slot doang bestie. Yang duluan gerak, yang duluan cuan — no cap!',
    prefix: 'EBIRD',
    discount_type: 'percent',
    discount_value: 25,
    quota: 20,
    claimed: activeOld.length,
    used: old.claims.filter(c => c.usedAt).length,
    start_date: null,
    end_date: null,
    is_active: true,
    show_on_website: true,
    requires_claim: true,
    announcement_text_id: 'Early Bird 25% OFF — Cuma 20 slot, gasken sekarang bestie!',
    announcement_text_en: 'Early Bird 25% OFF — Only 20 slots left, claim now bestie!',
    theme_color: '#8b5cf6',
    priority: 10,
    created_at: new Date().toISOString(),
    waitlist: old.waitlist.map(w => ({ email: w.email, whatsapp: w.wa, added_at: w.addedAt })),
  }

  const claims: PromoClaim[] = activeOld.map((c, i) => ({
    claim_id: `migrated_${i}_${Date.now()}`,
    promo_id: 'promo_early_bird',
    user_id: c.userId,
    email: c.email,
    name: c.name,
    whatsapp: c.wa ?? '',
    service_interest: c.service,
    voucher_code: c.voucherCode,
    status: c.usedAt ? 'used' : 'active',
    order_id: c.usedOrderId ?? null,
    claimed_at: c.claimedAt,
    used_at: c.usedAt ?? null,
    expires_at: null, // migrated claims don't have expiry
  }))

  await writePromos([earlyBird])
  await writeClaims(claims)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId(): string {
  return `promo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function generateCode(prefix: string, existingCodes: string[]): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  let attempts = 0
  do {
    let suffix = ''
    for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
    code = `${prefix}-${suffix}`
    attempts++
  } while (existingCodes.includes(code) && attempts < 100)
  return code
}

export function isClaimExpired(claim: PromoClaim): boolean {
  if (!claim.expires_at) return false
  return new Date(claim.expires_at) < new Date()
}

export function isPromoExpired(promo: Promo): boolean {
  if (!promo.end_date) return false
  return new Date(promo.end_date) < new Date()
}

export function isPromoFull(promo: Promo): boolean {
  if (promo.quota === 0) return false
  return promo.claimed >= promo.quota
}

export function isPromoAvailable(promo: Promo): boolean {
  return promo.is_active && !isPromoExpired(promo) && !isPromoFull(promo)
}

// ─── Expiry ───────────────────────────────────────────────────────────────────

/**
 * Finds all active claims past their expires_at, marks them 'expired',
 * and restores each slot to the promo's claimed count.
 * Call this before quota checks or claim lookups to keep data fresh.
 */
export async function expireStaleClaimsForPromo(promoId?: string): Promise<number> {
  const [claims, promos] = await Promise.all([readClaims(), readPromos()])
  const now = new Date()

  const toExpire = claims.filter(
    c => c.status === 'active' &&
         c.expires_at !== null &&
         new Date(c.expires_at!) < now &&
         (promoId ? c.promo_id === promoId : true)
  )

  if (toExpire.length === 0) return 0

  // Count expired per promo for quota restoration
  const expiredByPromo = new Map<string, number>()
  for (const c of toExpire) {
    expiredByPromo.set(c.promo_id, (expiredByPromo.get(c.promo_id) ?? 0) + 1)
  }

  const expireIds = new Set(toExpire.map(c => c.claim_id))
  const updatedClaims = claims.map(c =>
    expireIds.has(c.claim_id) ? { ...c, status: 'expired' as ClaimStatus } : c
  )

  const updatedPromos = promos.map(p => {
    const count = expiredByPromo.get(p.id) ?? 0
    if (count === 0) return p
    return { ...p, claimed: Math.max(0, (p.claimed ?? 0) - count) }
  })

  await Promise.all([writeClaims(updatedClaims), writePromos(updatedPromos)])
  return toExpire.length
}

// ─── Promo CRUD ───────────────────────────────────────────────────────────────

export async function getAllPromos(): Promise<Promo[]> {
  await runMigrationIfNeeded()
  return readPromos()
}

export async function getActivePublicPromos(): Promise<Promo[]> {
  const promos = await getAllPromos()
  return promos
    .filter(p => p.is_active && p.show_on_website && !isPromoExpired(p))
    .sort((a, b) => b.priority - a.priority)
}

export async function getPromoById(id: string): Promise<Promo | null> {
  const promos = await getAllPromos()
  return promos.find(p => p.id === id) ?? null
}

export async function createPromo(data: Omit<Promo, 'id' | 'claimed' | 'used' | 'created_at' | 'waitlist'>): Promise<Promo> {
  await runMigrationIfNeeded()
  const promos = await readPromos()
  const promo: Promo = {
    ...data,
    id: genId(),
    claimed: 0,
    used: 0,
    created_at: new Date().toISOString(),
    waitlist: [],
  }
  promos.push(promo)
  await writePromos(promos)
  return promo
}

export async function updatePromo(id: string, data: Partial<Omit<Promo, 'id' | 'created_at'>>): Promise<Promo | null> {
  const promos = await getAllPromos()
  const idx = promos.findIndex(p => p.id === id)
  if (idx === -1) return null
  // Only apply fields that are explicitly defined — undefined values must not overwrite existing data
  const patch = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) as typeof data
  promos[idx] = { ...promos[idx], ...patch }
  await writePromos(promos)
  return promos[idx]
}

export async function deletePromo(id: string): Promise<boolean> {
  const promos = await getAllPromos()
  const filtered = promos.filter(p => p.id !== id)
  if (filtered.length === promos.length) return false
  await writePromos(filtered)
  return true
}

// ─── Claims ───────────────────────────────────────────────────────────────────

export async function getClaimsByPromo(promoId: string): Promise<PromoClaim[]> {
  await runMigrationIfNeeded()
  const claims = await readClaims()
  return claims.filter(c => c.promo_id === promoId)
}

export async function getAllClaims(): Promise<PromoClaim[]> {
  await runMigrationIfNeeded()
  return readClaims()
}

export async function getClaimsByUser(userId: string): Promise<PromoClaim[]> {
  await runMigrationIfNeeded()
  const claims = await readClaims()
  return claims.filter(c => c.user_id === userId)
}

export async function getActiveClaimsForUser(userId: string): Promise<Array<PromoClaim & { promo: Promo }>> {
  const [claims, promos] = await Promise.all([getClaimsByUser(userId), getAllPromos()])
  const promoMap = new Map(promos.map(p => [p.id, p]))
  return claims
    .filter(c => c.status === 'active' && !isClaimExpired(c))
    .map(c => {
      const promo = promoMap.get(c.promo_id)
      if (!promo || !promo.is_active || isPromoExpired(promo)) return null
      return { ...c, promo }
    })
    .filter((x): x is PromoClaim & { promo: Promo } => x !== null)
}

export async function claimPromo(
  promoId: string,
  userId: string,
  email: string,
  name: string,
  whatsapp: string,
  serviceInterest: string
): Promise<PromoClaim> {
  const [promos, claims] = await Promise.all([getAllPromos(), readClaims()])

  const promo = promos.find(p => p.id === promoId)
  if (!promo) throw new Error('promo_not_found')
  if (!isPromoAvailable(promo)) throw new Error('promo_unavailable')

  // Check by userId — skip if expired (allows re-claim after expiry)
  const existingByUser = claims.find(
    c => c.promo_id === promoId && c.user_id === userId && c.status !== 'expired' && !isClaimExpired(c)
  )
  if (existingByUser) throw new Error('already_claimed')

  // Check by email (prevent multi-account abuse) — skip if expired
  const existingByEmail = claims.find(
    c => c.promo_id === promoId &&
         c.email.toLowerCase() === email.toLowerCase() &&
         c.status === 'active' &&
         !isClaimExpired(c)
  )
  if (existingByEmail) throw new Error('already_claimed')

  const existingCodes = claims.map(c => c.voucher_code)
  const now = new Date()
  const claim: PromoClaim = {
    claim_id: `claim_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    promo_id: promoId,
    user_id: userId,
    email,
    name,
    whatsapp,
    service_interest: serviceInterest,
    voucher_code: generateCode(promo.prefix, existingCodes),
    status: 'active',
    order_id: null,
    claimed_at: now.toISOString(),
    used_at: null,
    expires_at: new Date(now.getTime() + CLAIM_EXPIRY_MS).toISOString(),
  }

  claims.push(claim)
  await writeClaims(claims)

  // Increment claimed count on promo
  const promoIdx = promos.findIndex(p => p.id === promoId)
  if (promoIdx !== -1) {
    promos[promoIdx].claimed = (promos[promoIdx].claimed ?? 0) + 1
    await writePromos(promos)
  }

  return claim
}

export async function findClaimByVoucherCode(code: string): Promise<PromoClaim | null> {
  await runMigrationIfNeeded()
  const claims = await readClaims()
  return claims.find(c => c.voucher_code === code) ?? null
}

export async function markClaimUsed(voucherCode: string, orderId: string): Promise<boolean> {
  const [promos, claims] = await Promise.all([getAllPromos(), readClaims()])
  const idx = claims.findIndex(c => c.voucher_code === voucherCode)
  if (idx === -1) return false
  claims[idx].status = 'used'
  claims[idx].order_id = orderId
  claims[idx].used_at = new Date().toISOString()
  await writeClaims(claims)

  // Increment used count on promo
  const promoId = claims[idx].promo_id
  const promoIdx = promos.findIndex(p => p.id === promoId)
  if (promoIdx !== -1) {
    promos[promoIdx].used = (promos[promoIdx].used ?? 0) + 1
    await writePromos(promos)
  }

  return true
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export async function addToWaitlist(promoId: string, email: string, whatsapp: string): Promise<void> {
  const promos = await getAllPromos()
  const idx = promos.findIndex(p => p.id === promoId)
  if (idx === -1) return
  const wl = promos[idx].waitlist ?? []
  if (!wl.find(w => w.email.toLowerCase() === email.toLowerCase())) {
    wl.push({ email, whatsapp, added_at: new Date().toISOString() })
    promos[idx].waitlist = wl
    await writePromos(promos)
  }
}

// ─── Early-bird compat helpers (used by legacy routes) ───────────────────────

export async function getEarlyBirdQuota(): Promise<{ total: number; used: number; remaining: number }> {
  await runMigrationIfNeeded()
  const promo = await getPromoById('promo_early_bird')
  if (!promo) return { total: 20, used: 0, remaining: 20 }
  const remaining = promo.quota === 0 ? 999 : Math.max(0, promo.quota - promo.claimed)
  return { total: promo.quota, used: promo.claimed, remaining }
}

export async function findEarlyBirdClaimByUser(userId: string): Promise<PromoClaim | null> {
  await runMigrationIfNeeded()
  const claims = await readClaims()
  return claims.find(c => c.promo_id === 'promo_early_bird' && c.user_id === userId) ?? null
}

export async function claimEarlyBird(
  userId: string, email: string, name: string, wa: string, service: string
): Promise<PromoClaim> {
  return claimPromo('promo_early_bird', userId, email, name, wa, service)
}
