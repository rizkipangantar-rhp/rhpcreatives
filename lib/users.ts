import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'

export type StoredUser = {
  id: string
  name: string
  email: string
  hashedPassword: string
  createdAt: string
  referredBy?: string
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

export function findUserByEmail(email: string): StoredUser | undefined {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function generateReferralCode(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i)
    hash |= 0
  }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  let n = Math.abs(hash)
  for (let i = 0; i < 5; i++) {
    code += chars[n % chars.length]
    n = Math.floor(n / chars.length)
  }
  return `RHP-${code}`
}

export function findUserByReferralCode(code: string): StoredUser | undefined {
  return readUsers().find(u => generateReferralCode(u.email) === code)
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

export function createUser(data: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
  const users = readUsers()
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  }
  users.push(newUser)
  writeUsers(users)
  return newUser
}
