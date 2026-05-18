import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'
import { generateReferralCode, generateRandomReferralCode } from '@/lib/referral-code'
export { generateReferralCode, generateRandomReferralCode } from '@/lib/referral-code'

export type StoredUser = {
  id: string
  name: string
  email: string
  hashedPassword: string
  createdAt: string
  referredBy?: string           // referral code of who referred this user
  referralCode?: string         // this user's own referral code (stored; null = use hash fallback)
  referralRewardsAvailable?: number  // # of 15% discount rewards ready to use
  referralRewardsUsed?: number       // # of rewards already consumed
}

const DB_PATH = () => getDataPath('users.json')

function readUsers(): StoredUser[] {
  try {
    const p = DB_PATH()
    if (!fs.existsSync(p)) return []
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as StoredUser[]
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]): void {
  const p = DB_PATH()
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(p, JSON.stringify(users, null, 2), 'utf-8')
}

// Returns the canonical referral code for a user (stored random > hash fallback)
export function getUserReferralCode(user: StoredUser): string {
  return user.referralCode ?? generateReferralCode(user.email)
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

// Find by stored code first (new users), fall back to hash-based (old users)
export function findUserByReferralCode(code: string): StoredUser | undefined {
  const users = readUsers()
  return (
    users.find(u => u.referralCode === code) ??
    users.find(u => !u.referralCode && generateReferralCode(u.email) === code)
  )
}

export function findUserById(id: string): StoredUser | undefined {
  return readUsers().find(u => u.id === id)
}

export function setUserReferredBy(userId: string, referralCode: string): void {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users[idx].referredBy = referralCode
    writeUsers(users)
  }
}

export function addReferralReward(userId: string): void {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users[idx].referralRewardsAvailable = (users[idx].referralRewardsAvailable ?? 0) + 1
    writeUsers(users)
  }
}

export function useReferralReward(userId: string): boolean {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) return false
  const available = users[idx].referralRewardsAvailable ?? 0
  if (available <= 0) return false
  users[idx].referralRewardsAvailable = available - 1
  users[idx].referralRewardsUsed = (users[idx].referralRewardsUsed ?? 0) + 1
  writeUsers(users)
  return true
}

export function createUser(data: Omit<StoredUser, 'id' | 'createdAt' | 'referralCode'>): StoredUser {
  const users = readUsers()
  // Ensure the generated code is unique
  let code = generateRandomReferralCode()
  while (users.some(u => u.referralCode === code)) {
    code = generateRandomReferralCode()
  }
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    referralCode: code,
    referralRewardsAvailable: 0,
    referralRewardsUsed: 0,
    ...data,
  }
  users.push(newUser)
  writeUsers(users)
  return newUser
}
