import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'
import { addReferralReward, findUserByReferralCode } from '@/lib/users'

export type ReferralUsage = {
  userId: string        // who used the code (invitee)
  referralCode: string  // the code that was used
  referrerId: string    // user ID of the code owner
  orderId: string
  usedAt: string
}

type ReferralData = {
  usages: ReferralUsage[]
}

const DB_PATH = () => getDataPath('referral.json')

function read(): ReferralData {
  try {
    const p = DB_PATH()
    if (!fs.existsSync(p)) return { usages: [] }
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as ReferralData
  } catch {
    return { usages: [] }
  }
}

function write(data: ReferralData) {
  const p = DB_PATH()
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
}

export function hasUserUsedReferral(userId: string): boolean {
  return read().usages.some(u => u.userId === userId)
}

// Records that userId used referralCode on orderId, and issues a reward to the code owner.
export function recordReferralUsage(userId: string, referralCode: string, orderId: string): void {
  const referrer = findUserByReferralCode(referralCode)
  if (!referrer) return
  const data = read()
  data.usages.push({
    userId,
    referralCode,
    referrerId: referrer.id,
    orderId,
    usedAt: new Date().toISOString(),
  })
  write(data)
  // Give the referrer a 15% discount reward
  addReferralReward(referrer.id)
}

export type ReferralStats = {
  count: number
  usages: ReferralUsage[]
}

export function getReferralStats(referralCode: string): ReferralStats {
  const usages = read().usages.filter(u => u.referralCode === referralCode)
  return { count: usages.length, usages }
}
