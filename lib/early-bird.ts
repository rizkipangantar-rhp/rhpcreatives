import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'

const DB_PATH = () => getDataPath('early-bird.json')
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

function read(): EarlyBirdData {
  try {
    const p = DB_PATH()
    if (!fs.existsSync(p)) return { claims: [], waitlist: [] }
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as EarlyBirdData
  } catch {
    return { claims: [], waitlist: [] }
  }
}

function write(data: EarlyBirdData) {
  const p = DB_PATH()
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
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

export function getQuota() {
  const { claims } = read()
  // Only non-expired claims occupy a slot (used claims always count)
  const activeCount = claims.filter(c => !isClaimExpired(c)).length
  return { total: QUOTA, used: activeCount, remaining: QUOTA - activeCount }
}

/** Returns the claim only if it is active (not expired or already used). */
export function findClaim(userId: string): ClaimEntry | undefined {
  const claim = read().claims.find(c => c.userId === userId)
  if (!claim || isClaimExpired(claim)) return undefined
  return claim
}

/** Returns the raw claim regardless of expiry status — for checking expiry state. */
export function findRawClaim(userId: string): ClaimEntry | undefined {
  return read().claims.find(c => c.userId === userId)
}

export function addClaim(entry: Omit<ClaimEntry, 'voucherCode' | 'claimedAt'>): ClaimEntry {
  const data = read()
  const existingIdx = data.claims.findIndex(c => c.userId === entry.userId)
  if (existingIdx !== -1) {
    if (isClaimExpired(data.claims[existingIdx])) {
      data.claims.splice(existingIdx, 1) // remove expired claim — allow re-claim
    } else {
      throw new Error('already_claimed')
    }
  }
  const activeCount = data.claims.filter(c => !isClaimExpired(c)).length
  if (activeCount >= QUOTA) throw new Error('quota_full')
  const claim: ClaimEntry = { ...entry, voucherCode: generateCode(), claimedAt: new Date().toISOString() }
  data.claims.push(claim)
  write(data)
  return claim
}

export function findClaimByCode(code: string): ClaimEntry | undefined {
  return read().claims.find(c => c.voucherCode === code)
}

export function isCodeUsed(code: string): boolean {
  const claim = findClaimByCode(code)
  return !!claim?.usedAt
}

export function markCodeUsed(code: string, orderId: string): boolean {
  const data = read()
  const idx = data.claims.findIndex(c => c.voucherCode === code)
  if (idx === -1) return false
  data.claims[idx].usedOrderId = orderId
  data.claims[idx].usedAt = new Date().toISOString()
  write(data)
  return true
}

export function addWaitlist(email: string, wa: string): void {
  const data = read()
  if (!data.waitlist.find(w => w.email.toLowerCase() === email.toLowerCase())) {
    data.waitlist.push({ email, wa, addedAt: new Date().toISOString() })
    write(data)
  }
}
