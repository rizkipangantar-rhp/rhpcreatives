import { dbGet, dbSet } from '@/lib/store'
import { generateReferralCode, generateRandomReferralCode } from '@/lib/referral-code'
export { generateReferralCode, generateRandomReferralCode } from '@/lib/referral-code'

const ADMIN_EMAIL = 'rhpcreativesid@gmail.com'

export type AdminRole = 'super_admin' | 'admin' | 'cs'

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
  role?: AdminRole                    // only set for admin accounts
  referralCode?: string               // stored random code; undefined = hash fallback
  referredBy?: string                 // referral code of who referred this user
  referralRewardsAvailable: number    // 15% rewards ready to use
  referralRewardsUsed: number
  suspended?: boolean
}

async function readUsers(): Promise<StoredUser[]> {
  return dbGet<StoredUser[]>('rhp:users', 'users.json', [])
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  return dbSet('rhp:users', 'users.json', users)
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

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await readUsers()
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

// Find by stored code first, then hash-based fallback for legacy users
export async function findUserByReferralCode(code: string): Promise<StoredUser | undefined> {
  const users = await readUsers()
  return (
    users.find(u => u.referralCode === code) ??
    users.find(u => !u.referralCode && generateReferralCode(u.email) === code)
  )
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const users = await readUsers()
  return users.find(u => u.id === id)
}

// Create or update a Google OAuth user. Returns the user and whether it was newly created.
export async function upsertGoogleUser(data: {
  id: string          // already prefixed: "google_<googleId>"
  name: string
  email: string
  image?: string | null
}): Promise<{ user: StoredUser; isNew: boolean }> {
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === data.id)

  if (idx !== -1) {
    // Update mutable fields only; preserve referral data and onboardingDone
    users[idx].name = data.name || users[idx].name
    users[idx].email = data.email || users[idx].email
    users[idx].image = data.image ?? users[idx].image
    users[idx].lastLogin = new Date().toISOString()
    users[idx].isAdmin = users[idx].email.toLowerCase() === ADMIN_EMAIL
    if (users[idx].isAdmin && !users[idx].role) users[idx].role = 'super_admin'
    // Returning user with onboardingDone: false means their data was lost — treat as done
    if (!users[idx].onboardingDone) users[idx].onboardingDone = true
    await writeUsers(users)
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
    role: data.email.toLowerCase() === ADMIN_EMAIL ? ('super_admin' as AdminRole) : undefined,
    referralCode: uniqueReferralCode(users),
    referralRewardsAvailable: 0,
    referralRewardsUsed: 0,
  }
  users.push(newUser)
  await writeUsers(users)
  return { user: newUser, isNew: true }
}

// Create a credentials user (called from /api/register)
export async function createUser(data: {
  name: string
  email: string
  hashedPassword: string
  referredBy?: string
}): Promise<StoredUser> {
  const users = await readUsers()
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
    role: data.email.toLowerCase() === ADMIN_EMAIL ? ('super_admin' as AdminRole) : undefined,
    referralCode: uniqueReferralCode(users),
    referredBy: data.referredBy,
    referralRewardsAvailable: 0,
    referralRewardsUsed: 0,
  }
  users.push(newUser)
  await writeUsers(users)
  return newUser
}

export async function completeOnboarding(userId: string, referredBy?: string): Promise<void> {
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) return
  users[idx].onboardingDone = true
  if (referredBy) users[idx].referredBy = referredBy
  await writeUsers(users)
}

export async function setUserReferredBy(userId: string, referralCode: string): Promise<void> {
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users[idx].referredBy = referralCode
    await writeUsers(users)
  }
}

export async function setUserSuspended(userId: string, suspended: boolean): Promise<void> {
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users[idx].suspended = suspended
    await writeUsers(users)
  }
}

export async function setUserRole(userId: string, role: AdminRole | null): Promise<void> {
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) return
  if (role === null) {
    users[idx].isAdmin = false
    delete users[idx].role
  } else {
    users[idx].isAdmin = true
    users[idx].role = role
  }
  await writeUsers(users)
}

export async function deleteUser(userId: string): Promise<boolean> {
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) return false
  users.splice(idx, 1)
  await writeUsers(users)
  return true
}

export async function addReferralReward(userId: string): Promise<void> {
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users[idx].referralRewardsAvailable = (users[idx].referralRewardsAvailable ?? 0) + 1
    await writeUsers(users)
  }
}

export async function useReferralReward(userId: string): Promise<boolean> {
  const users = await readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) return false
  const available = users[idx].referralRewardsAvailable ?? 0
  if (available <= 0) return false
  users[idx].referralRewardsAvailable = available - 1
  users[idx].referralRewardsUsed = (users[idx].referralRewardsUsed ?? 0) + 1
  await writeUsers(users)
  return true
}

// Internal helper — returns all users directly (for admin routes)
export async function getAllUsers(): Promise<StoredUser[]> {
  return readUsers()
}
