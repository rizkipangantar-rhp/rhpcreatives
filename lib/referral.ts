import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'

type ReferralUsage = {
  userId: string
  referralCode: string
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

export function recordReferralUsage(userId: string, referralCode: string, orderId: string): void {
  const data = read()
  data.usages.push({ userId, referralCode, orderId, usedAt: new Date().toISOString() })
  write(data)
}

export function getReferralStats(referralCode: string): { count: number; orders: string[] } {
  const usages = read().usages.filter(u => u.referralCode === referralCode)
  return { count: usages.length, orders: usages.map(u => u.orderId) }
}
