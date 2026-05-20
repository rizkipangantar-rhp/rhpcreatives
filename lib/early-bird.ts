import { dbGet, dbSet } from '@/lib/store'

export const QUOTA = 20
export const EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

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

type EarlyBirdData = {
  claims: ClaimEntry[]
  waitlist: WaitlistEntry[]
}

async function read(): Promise<EarlyBirdData> {
  return dbGet<EarlyBirdData>('rhp:early-bird', 'early-bird.json', { claims: [], waitlist: [] })
}

async function write(data: EarlyBirdData): Promise<void> {
  return dbSet('rhp:early-bird', 'early-bird.json', data)
}

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `EBIRD-${suffix}`
}

export function isClaimExpired(claim: ClaimEntry): boolean {
  if (claim.usedAt) return false // used vouchers never expire
  return Date.now() - new Date(claim.claimedAt).getTime() > EXPIRY_MS
}

export async function getQuota(): Promise<{ total: number; used: number; remaining: number }> {
  const { claims } = await read()
  // Only non-expired claims occupy a slot (used claims always count)
  const activeCount = claims.filter(c => !isClaimExpired(c)).length
  return { total: QUOTA, used: activeCount, remaining: QUOTA - activeCount }
}

/** Returns the claim only if it is active (not expired or already used). */
export async function findClaim(userId: string): Promise<ClaimEntry | undefined> {
  const data = await read()
  const claim = data.claims.find(c => c.userId === userId)
  if (!claim || isClaimExpired(claim)) return undefined
  return claim
}

/** Returns the raw claim regardless of expiry status — for checking expiry state. */
export async function findRawClaim(userId: string): Promise<ClaimEntry | undefined> {
  const data = await read()
  return data.claims.find(c => c.userId === userId)
}

export async function addClaim(entry: Omit<ClaimEntry, 'voucherCode' | 'claimedAt'>): Promise<ClaimEntry> {
  const data = await read()

  // Check by userId (primary key)
  const existingByUser = data.claims.findIndex(c => c.userId === entry.userId)
  if (existingByUser !== -1) {
    if (isClaimExpired(data.claims[existingByUser])) {
      data.claims.splice(existingByUser, 1)
    } else {
      throw new Error('already_claimed')
    }
  }

  // Check by email to block multi-account abuse
  const existingByEmail = data.claims.find(
    c => c.email.toLowerCase() === entry.email.toLowerCase() && !isClaimExpired(c)
  )
  if (existingByEmail) throw new Error('already_claimed')

  const activeCount = data.claims.filter(c => !isClaimExpired(c)).length
  if (activeCount >= QUOTA) throw new Error('quota_full')
  const claim: ClaimEntry = { ...entry, voucherCode: generateCode(), claimedAt: new Date().toISOString() }
  data.claims.push(claim)
  await write(data)
  return claim
}

export async function findClaimByCode(code: string): Promise<ClaimEntry | undefined> {
  const data = await read()
  return data.claims.find(c => c.voucherCode === code)
}

export async function isCodeUsed(code: string): Promise<boolean> {
  const claim = await findClaimByCode(code)
  return !!claim?.usedAt
}

export async function markCodeUsed(code: string, orderId: string): Promise<boolean> {
  const data = await read()
  const idx = data.claims.findIndex(c => c.voucherCode === code)
  if (idx === -1) return false
  data.claims[idx].usedOrderId = orderId
  data.claims[idx].usedAt = new Date().toISOString()
  await write(data)
  return true
}

export async function addWaitlist(email: string, wa: string): Promise<void> {
  const data = await read()
  if (!data.waitlist.find(w => w.email.toLowerCase() === email.toLowerCase())) {
    data.waitlist.push({ email, wa, addedAt: new Date().toISOString() })
    await write(data)
  }
}
