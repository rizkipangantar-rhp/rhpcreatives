/**
 * Backward-compat shim — all logic now lives in lib/promos.ts.
 * Keep this file so existing imports from API routes continue to compile.
 */
import {
  getEarlyBirdQuota,
  findEarlyBirdClaimByUser,
  findClaimByVoucherCode,
  markClaimUsed,
  addToWaitlist,
  claimEarlyBird,
  type PromoClaim,
} from '@/lib/promos'

export type ClaimEntry = {
  userId: string
  name: string
  email: string
  wa?: string
  service: string
  voucherCode: string
  claimedAt: string
  usedOrderId?: string
  usedAt?: string
}

export type WaitlistEntry = {
  email: string
  wa: string
  addedAt: string
}

export const QUOTA = 20
export const EXPIRY_MS = 0 // no per-claim expiry in the new system

function toClaimEntry(c: PromoClaim): ClaimEntry {
  return {
    userId: c.user_id,
    name: c.name,
    email: c.email,
    wa: c.whatsapp || undefined,
    service: c.service_interest,
    voucherCode: c.voucher_code,
    claimedAt: c.claimed_at,
    usedOrderId: c.order_id ?? undefined,
    usedAt: c.used_at ?? undefined,
  }
}

export function isClaimExpired(_claim: ClaimEntry): boolean {
  return false // per-claim expiry removed
}

export async function getQuota() {
  return getEarlyBirdQuota()
}

export async function findClaim(userId: string): Promise<ClaimEntry | undefined> {
  const c = await findEarlyBirdClaimByUser(userId)
  if (!c || c.status === 'used') return undefined
  return toClaimEntry(c)
}

export async function findRawClaim(userId: string): Promise<ClaimEntry | undefined> {
  const c = await findEarlyBirdClaimByUser(userId)
  return c ? toClaimEntry(c) : undefined
}

export async function addClaim(entry: Omit<ClaimEntry, 'voucherCode' | 'claimedAt'>): Promise<ClaimEntry> {
  const c = await claimEarlyBird(entry.userId, entry.email, entry.name, entry.wa ?? '', entry.service)
  return toClaimEntry(c)
}

export async function findClaimByCode(code: string): Promise<ClaimEntry | undefined> {
  const c = await findClaimByVoucherCode(code)
  if (!c || c.promo_id !== 'promo_early_bird') return undefined
  return toClaimEntry(c)
}

export async function isCodeUsed(code: string): Promise<boolean> {
  const c = await findClaimByVoucherCode(code)
  return c?.status === 'used'
}

export async function markCodeUsed(code: string, orderId: string): Promise<boolean> {
  return markClaimUsed(code, orderId)
}

export async function addWaitlist(email: string, wa: string): Promise<void> {
  return addToWaitlist('promo_early_bird', email, wa)
}
