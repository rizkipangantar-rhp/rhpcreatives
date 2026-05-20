import { dbGet, dbSet } from '@/lib/store'
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

async function read(): Promise<ReferralData> {
  return dbGet<ReferralData>('rhp:referral', 'referral.json', { usages: [] })
}

async function write(data: ReferralData): Promise<void> {
  return dbSet('rhp:referral', 'referral.json', data)
}

export async function hasUserUsedReferral(userId: string): Promise<boolean> {
  const data = await read()
  return data.usages.some(u => u.userId === userId)
}

// Records that userId used referralCode on orderId, and issues a reward to the code owner.
export async function recordReferralUsage(userId: string, referralCode: string, orderId: string): Promise<void> {
  const referrer = await findUserByReferralCode(referralCode)
  if (!referrer) return
  const data = await read()
  data.usages.push({
    userId,
    referralCode,
    referrerId: referrer.id,
    orderId,
    usedAt: new Date().toISOString(),
  })
  await write(data)
  // Give the referrer a 15% discount reward
  await addReferralReward(referrer.id)
}

export type ReferralStats = {
  count: number
  usages: ReferralUsage[]
}

export async function getReferralStats(referralCode: string): Promise<ReferralStats> {
  const data = await read()
  const usages = data.usages.filter(u => u.referralCode === referralCode)
  return { count: usages.length, usages }
}
