import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'
import { generateReferralCode, generateRandomReferralCode } from '@/lib/referral-code'
export { generateReferralCode, generateRandomReferralCode } from '@/lib/referral-code'

const ADMIN_EMAIL = 'rhpcreativesid@gmail.com'

export type StoredUser = {
  id: string                          // "google_<googleId>" | "cred_<uuid>"
  provider: 'google' | 'credentials'
  name: string
  email: string
  image?: string | null
  hashedPassword?: string | null      // null for Google users
  createdAt: string
  lastLogin: string
  onboardingDone: boolean             // false until first-login modal completed
  isAdmin: boolean
  referralCode?: string               // stored random code; undefined = hash fallback
  referredBy?: string                 // referral code of who referred this user
  referralRewardsAvailable: number    // 15% rewards ready to use
  referralRewardsUsed: number
  suspended?: boolean
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

function uniqueReferralCode(users: StoredUser[]): string {
  let code = generateRandomReferralCode()
  while (users.some(u => u.referralCode === code)) {
    code = generateRandomReferralCode()
  }
  return code
}

// Returns the canonical referral code for a user (stored > hash fallback)
export function getUserReferralCode(user: StoredUser): string {
  return user.referralCode ?? generateReferralCode(user.email)
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

// Find by stored code first, then hash-based fallback for legacy users
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

// Create or update a Google OAuth user. Returns the user and whether it was newly created.
export function upsertGoogleUser(data: {
  id: string          // already prefixed: "google_<googleId>"
  name: string
  email: string
  image?: string | null
}): { user: StoredUser; isNew: boolean } {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === data.id)

  if (idx !== -1) {
    // Update mutable fields only; preserve referral data and onboardingDone
    users[idx].name = data.name || users[idx].name
    users[idx].email = data.email || users[idx].email
    users[idx].image = data.image ?? users[idx].image
    users[idx].lastLogin = new Date().toISOString()
    users[idx].isAdmin = users[idx].email.toLowerCase() === ADMIN_EMAIL
    writeUsers(users)
    return { user: users[idx], isNew: false }
  }

  const newUser: StoredUser = {
    id: data.id,
    provider: 'google',
    name: data.name,
    email: data.email,
    image: data.image ?? null,
    hashedPassword: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    onboardingDone: false,
    isAdmin: data.email.toLowerCase() === ADMIN_EMAIL,
    referralCode: uniqueReferralCode(users),
    referralRewardsAvailable: 0,
    referralRewardsUsed: 0,
  }
  users.push(newUser)
  writeUsers(users)
  return { user: newUser, isNew: true }
}

// Create a credentials user (called from /api/register)
export function createUser(data: {
  name: string
  email: string
  hashedPassword: string
  referredBy?: string
}): StoredUser {
  const users = readUsers()
  const newUser: StoredUser = {
    id: 'cred_' + crypto.randomUUID(),
    provider: 'credentials',
    name: data.name,
    email: data.email,
    image: null,
    hashedPassword: data.hashedPassword,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    onboardingDone: true,   // credentials users complete onboarding via register form
    isAdmin: data.email.toLowerCase() === ADMIN_EMAIL,
    referralCode: uniqueReferralCode(users),
    referredBy: data.referredBy,
    referralRewardsAvailable: 0,
    referralRewardsUsed: 0,
  }
  users.push(newUser)
  writeUsers(users)
  return newUser
}

export function completeOnboarding(userId: string, referredBy?: string): void {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) return
  users[idx].onboardingDone = true
  if (referredBy) users[idx].referredBy = referredBy
  writeUsers(users)
}

export function setUserReferredBy(userId: string, referralCode: string): void {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users[idx].referredBy = referralCode
    writeUsers(users)
  }
}

export function setUserSuspended(userId: string, suspended: boolean): void {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users[idx].suspended = suspended
    writeUsers(users)
  }
}

export function deleteUser(userId: string): boolean {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) return false
  users.splice(idx, 1)
  writeUsers(users)
  return true
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
