import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'early-bird.json')
export const QUOTA = 20

export type ClaimEntry = {
  userId: string
  name: string
  email: string
  wa: string
  service: string
  voucherCode: string
  claimedAt: string
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
    if (!fs.existsSync(DB_PATH)) return { claims: [], waitlist: [] }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as EarlyBirdData
  } catch {
    return { claims: [], waitlist: [] }
  }
}

function write(data: EarlyBirdData) {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `EBIRD-${suffix}`
}

export function getQuota() {
  const { claims } = read()
  return { total: QUOTA, used: claims.length, remaining: QUOTA - claims.length }
}

export function findClaim(userId: string): ClaimEntry | undefined {
  return read().claims.find(c => c.userId === userId)
}

export function addClaim(entry: Omit<ClaimEntry, 'voucherCode' | 'claimedAt'>): ClaimEntry {
  const data = read()
  if (data.claims.length >= QUOTA) throw new Error('quota_full')
  if (data.claims.find(c => c.userId === entry.userId)) throw new Error('already_claimed')
  const claim: ClaimEntry = { ...entry, voucherCode: generateCode(), claimedAt: new Date().toISOString() }
  data.claims.push(claim)
  write(data)
  return claim
}

export function findClaimByCode(code: string): ClaimEntry | undefined {
  return read().claims.find(c => c.voucherCode === code)
}

export function addWaitlist(email: string, wa: string): void {
  const data = read()
  if (!data.waitlist.find(w => w.email.toLowerCase() === email.toLowerCase())) {
    data.waitlist.push({ email, wa, addedAt: new Date().toISOString() })
    write(data)
  }
}
